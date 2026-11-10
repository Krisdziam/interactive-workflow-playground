# Технічне завдання v1.2

## Interactive Workflow Playground — інтерактивне CV-портфоліо Kristian

**Версія:** 1.2  
**Статус:** погоджено для MVP-розробки  
**Тип проєкту:** окремий інтерактивний Next.js-застосунок із повторно використовуваними компонентами  
**Основний маршрут:** `/playground`  
**Мета:** продемонструвати практичні навички Kristian у роботі з AI, автоматизаціями, API та інтеграціями через реальний workflow.

Версія 1.2 уточнює landing-first UX і послідовність presentation states. API response schema залишається `1.1`; інтеграційний контракт, ліміти та архітектурні межі не змінюються.

---

# 1. Мета та продуктова концепція

Interactive Workflow Playground — публічне інтерактивне демо для рекрутерів. Користувач вводить своє ім’я, за потреби назву компанії, обирає тему та запускає workflow.

Система повинна:

1. Прийняти та перевірити дані.
2. Запустити реальний n8n workflow.
3. Визначити номер спроби в поточній сесії.
4. Отримати персоналізовану відповідь від LLM.
5. Надіслати Kristian реальне Telegram-повідомлення.
6. Записати виконання у Google Sheets.
7. Повернути frontend підтверджені результати та часові мітки.
8. Показати користувачу короткий verified replay виконання.

Очікуване враження: Kristian не просто знає назви технологій, а вміє поєднати frontend, backend, AI та зовнішні сервіси в завершений продукт.

Повний користувацький досвід, включно з читанням результату, має займати приблизно 30–60 секунд.

---

# 2. Межі MVP

## 2.1. Входить до MVP

- Окремий Next.js-застосунок.
- Двомовний інтерфейс EN/UA.
- Форма запуску workflow.
- Три тематичні варіанти.
- Сесія на основі `sessionStorage`.
- Максимум чотири виконані запуски на одну сесію.
- Next.js API Route як gateway.
- n8n workflow.
- OpenRouter / Gemini.
- Google Sheets як журнал і джерело номера спроби.
- Telegram Bot API.
- Verified Execution Replay після отримання фінальної відповіді.
- Відображення частково успішних запусків.
- Fallback для LLM і недоступного номера спроби.
- Ідемпотентність на основі `run_id`.
- Захист від надмірної кількості запитів.
- Адаптивність і базова accessibility.
- Розгортання на Vercel.
- Версіонований експорт n8n workflow у репозиторії без credentials.

## 2.2. Не входить до MVP

- WebSocket або справжній streaming статусів.
- SSE та окремий сервіс зберігання проміжних подій.
- Особистий кабінет або авторизація рекрутера.
- Повноцінна аналітична панель.
- Окрема production database або Redis/KV для лічильника спроб.
- Підтвердження прочитання Telegram-повідомлення.
- Автоматичний збір інформації про компанію з інтернету.

---

# 3. Узгоджені продуктові рішення

1. Для MVP використовується verified replay, а не справжній live-stream.
2. Використовуються два показники часу:
   - `processing_time_ms` — час паралельної обробки LLM і Telegram; зберігається у Google Sheets;
   - `total_time_ms` — час обробки Next.js API від прийняття валідного запиту до готової відповіді; повертається frontend, але не записується повторним оновленням у Sheets.
3. Google Sheets залишається журналом і джерелом номера спроби. Ризик конфлікту паралельних запусків приймається як обмеження MVP.
4. Тексти Digital Twin можуть описувати весь workflow. Фактичним джерелом статусів інтеграцій залишаються окремі UI-віджети.
5. Ціль `1.5 секунди` залишається optimization target, а не гарантованим SLA.
6. Після чотирьох виконаних запусків п’ятий запуск у тій самій сесії блокується.
7. Основна мова за замовчуванням — English. Користувач може перемкнутися на українську.
8. UX використовує landing-first progressive disclosure: домінуючий CTA → нейтральний pending state → verified replay → Digital Twin result. Поля `name`, `company` і `topic` зберігаються, але не повинні створювати враження адміністративного dashboard.

---

# 4. Технологічний стек

| Компонент | Технологія | Призначення |
|---|---|---|
| Frontend | Next.js, React, TypeScript | Сторінка та клієнтська логіка |
| Styling | Tailwind CSS | Адаптивний UI |
| Hosting | Vercel | Розміщення застосунку та API Route |
| API Gateway | Next.js Route Handler | Валідація, timeout, rate limit, server-to-server authorization |
| Workflow engine | n8n | Оркестрація інтеграцій |
| AI provider | OpenRouter | Доступ до LLM |
| AI model | `google/gemini-2.5-flash` | Генерація відповіді Digital Twin |
| Storage / audit | Google Sheets | Історія запусків, номер спроби, перевірка `run_id` |
| Notifications | Telegram Bot API | Реальне повідомлення Kristian |
| Browser session | `sessionStorage` | `session_id`, локальний стан запусків та досягнення ліміту |
| Locale preference | `localStorage` | Вибрана мова EN/UA |

Модель OpenRouter задається через конфігурацію n8n, щоб її можна було замінити без зміни frontend.

---

# 5. Загальна архітектура

```text
RECRUITER
    |
    v
NEXT.JS FRONTEND
    |
    | POST /api/execute
    v
NEXT.JS API ROUTE
    |- schema validation
    |- body size check
    |- IP/platform rate limit
    |- request timeout
    |- secret header for n8n
    |- total_time_ms
    v
N8N WEBHOOK
    |- validate server secret
    |- lookup session rows in Google Sheets
    |- reject attempt > 4
    |- determine attempt
    |- check duplicate run_id
    |- append processing row (idempotency claim)
    |- LLM -----------+
    |- Telegram ------+ parallel processing
    |- normalize results
    |- calculate processing_time_ms
    |- finalize claimed row in Google Sheets
    |- prepare verified events[]
    v
JSON RESPONSE
    |
    v
NEXT.JS FRONTEND
    |- verified replay
    |- Digital Twin response
    |- Telegram proof
    |- partial error states
```

Frontend не звертається напряму до OpenRouter, Telegram або Google Sheets.

---

# 6. Користувацький сценарій

1. Користувач відкриває `/playground`.
2. Застосунок визначає вибрану мову або використовує English.
3. Якщо `session_id` відсутній, браузер створює UUID через `crypto.randomUUID()` і зберігає його у `sessionStorage`.
4. Користувач вводить ім’я.
5. За бажанням вводить компанію.
6. Обирає одну з трьох тем.
7. Натискає `Execute Workflow` / `Запустити workflow`.
8. Frontend створює окремий `run_id`.
9. Після успішної client-side validation pre-run controls залишають головну композицію, а повторний submit блокується.
10. Поки HTTP-запит не завершився, frontend показує лише нейтральний processing transition без тверджень про активну server-side ноду.
11. API Route перевіряє запит і викликає n8n.
12. n8n виконує workflow та повертає фінальний або контрольований частковий результат.
13. Frontend відтворює підтверджені події як verified replay; AI і Telegram показуються паралельно, якщо це підтверджують timestamps.
14. Після replay головним елементом стає Digital Twin avatar із текстом; поруч або нижче показуються компактні Telegram, Sheets, attempt і timing statuses.
15. Після завершення користувач може виконати наступний запуск, якщо ліміт не досягнуто.
16. Після четвертої виконаної спроби наступний запуск блокується.

Кнопка не повинна блокуватися назавжди після network error. Користувач отримує можливість повторити запит.

---

# 7. Локалізація

## 7.1. Підтримувані локалі

- `en` — English, значення за замовчуванням.
- `uk` — українська.

## 7.2. Правила

- Перемикач EN/UA доступний у верхній частині сторінки.
- Вибір зберігається у `localStorage`.
- `locale` передається до API та n8n.
- Digital Twin відповідає мовою вибраного інтерфейсу.
- Технічні enum-значення у JSON не локалізуються.
- Користувацькі написи зберігаються у словниках локалізації, а не дублюються безпосередньо в компонентах.
- Якщо locale некоректна, backend використовує `en`.

---

# 8. Форма запуску

## 8.1. Поля

### Name

- Обов’язкове.
- Після trim: 2–60 символів.
- Підтримує Unicode та нелатинські імена.
- Забороняються control characters.

### Company

- Необов’язкове.
- Після trim: 0–80 символів.
- Якщо поле порожнє, Digital Twin використовує нейтральну фразу `your team` / `вашу команду`.

### Topic

Один із трьох enum:

| Enum | EN label | UA label |
|---|---|---|
| `ai_automation` | AI Automation | AI-автоматизація |
| `api_integrations` | API Integrations | API-інтеграції |
| `workflow_optimization` | Workflow Optimization | Оптимізація workflow |

`ai_automation` вибрано за замовчуванням.

## 8.2. Кнопка

- EN: `Execute Workflow ⚡`
- UA: `Запустити workflow ⚡`
- Під час запиту: `Executing…` / `Виконується…`
- Після вичерпання ліміту: `Run limit reached` / `Ліміт запусків вичерпано`
- CTA є єдиною візуально домінуючою дією ready state. Storyboard використовує `Протестувати воркфлоу` як working concept copy; canonical localized strings залишаються в `COPY.md` до окремого погодження copy change.

---

# 9. Сесія, спроби та ліміт

## 9.1. Session ID

- `session_id` генерується frontend як UUID v4.
- Зберігається в `sessionStorage`.
- Оновлення сторінки не створює нову сесію.
- Нова вкладка створює нову сесію відповідно до обмежень браузера.
- `session_id` є correlation identifier, а не засобом authentication.

## 9.2. Run ID

- Для кожного натискання створюється окремий UUID v4 `run_id`.
- `run_id` використовується для захисту від випадкового повторного виконання того самого запиту.
- При timeout повторний запит повинен використовувати той самий `run_id`.
- Новий свідомий запуск створює новий `run_id`.
- Перший запит резервує `run_id` у Google Sheets до запуску LLM і Telegram.
- Якщо знайдено завершений рядок із тим самим `run_id`, n8n реконструює попередній результат без повторного виклику інтеграцій.
- Якщо рядок із тим самим `run_id` ще має статус `processing`, повертається `RUN_ALREADY_PROCESSING`.

## 9.3. Визначення attempt

1. n8n отримує всі релевантні рядки поточного `session_id`.
2. Перевіряє, чи існує поточний `run_id`.
3. Визначає максимальний наявний `attempt_count`.
4. Новий attempt дорівнює `max + 1`.
5. Якщо рядків немає, attempt дорівнює `1`.
6. До запуску LLM і Telegram n8n додає рядок зі статусом `processing`, який резервує `run_id` та номер спроби.

## 9.4. Ліміт

- Максимум чотири виконані спроби на `session_id`.
- Спроби 1–4 виконуються.
- Якщо попередній максимальний attempt дорівнює 4, нові інтеграції не запускаються.
- API повертає HTTP `429` і код `SESSION_LIMIT_REACHED`.
- Validation errors та blocked requests не рахуються.
- Запуск рахується як спроба після успішного створення processing row.
- Частково успішний workflow також рахується як спроба.
- Якщо processing row не вдалося створити, наступний запуск може повторити номер; це прийняте обмеження MVP.

## 9.5. Плашка після ліміту

### Українська

**Заголовок:** `⚡ Схоже, вам дуже сподобалась ця кнопка 😄`  
**Текст:** `Ви вже запустили workflow 4 рази. QA завершено — тепер саме час написати Kristian.`

### English

**Title:** `⚡ Looks like you really enjoyed that button 😄`  
**Text:** `You’ve already run the workflow 4 times. QA is complete — now it might be time to message Kristian.`

Плашка містить CTA на погоджений контакт Kristian.

---

# 10. Frontend UI

## 10.1. Візуальний напрям

- Cinematic interactive landing / Automation Story.
- Темна тема за замовчуванням.
- Один головний фокус у кожному стані: CTA → workflow → avatar.
- Ready state має вигляд лендингу з компактними personalization controls і одним домінуючим CTA, а не dashboard із багатьма картками.
- Після submit pre-run controls поступаються місцем workflow presentation; після replay workflow поступається місцем Digital Twin result.
- Технічні proof/status елементи залишаються компактними та не конкурують з основним фокусом.
- Моноширинний шрифт лише для логів, ідентифікаторів та технічних статусів.
- Не перевантажувати основний екран технічними деталями.
- Орієнтир взаємодії та приблизний visual direction описано в `DESIGN_DIRECTION.md`.

## 10.2. Основні компоненти

- `LocaleSwitcher`
- `LandingHero`
- `WorkflowRunForm`
- `TopicSelector`
- `ExperienceStage`
- `WorkflowReplay`
- `WorkflowNode`
- `ExecutionLog`
- `DigitalTwinAvatar`
- `DigitalTwinCard`
- `TelegramProofCard`
- `RunLimitBanner`
- `ErrorBanner`
- `ContactCTA`

## 10.3. Progressive experience states

Основна presentation state machine:

```text
ready -> submitting -> replay -> result
```

Контрольовані відгалуження:

- `validation_error`;
- `request_error`;
- `session_limit`;
- safe retry із тим самим `run_id` після невизначеного timeout outcome.

Правила:

- `ready` містить hero, retained form controls, privacy note і один домінуючий CTA;
- `submitting` може показувати лише нейтральну motion/processing композицію;
- `submitting` не показує fabricated active/success server nodes;
- `replay` створюється тільки після отримання response contract;
- `result` зберігає часткові успіхи та фактичні statuses;
- переходи керують focus і `aria-live`, не змушуючи screen reader проходити посимвольну анімацію.

## 10.4. Workflow Replay

Етапи:

1. Webhook Received
2. Session Lookup
3. AI Processing і Telegram Notification як паралельні гілки відповідно до server timestamps
4. Google Sheets Logging
5. Workflow Completed

Стани нод:

- `waiting`
- `processing`
- `success`
- `fallback`
- `error`
- `skipped`

Правила replay:

- Replay починається тільки після отримання фінальної відповіді.
- Статуси базуються лише на `events[]`, повернутих backend.
- Під час unresolved request жодна replay-нода не позначається активною або успішною.
- Frontend не змінює `error` на `success` заради анімації.
- Візуальне відтворення триває орієнтовно 2–4 секунди.
- Реальні timestamps і durations показуються в логах.
- Візуальну швидкість можна стискати, але значення часу не підміняються.
- Паралельні AI і Telegram events не перетворюються на фальшиву послідовність.
- Заголовок блоку: `Workflow Execution` / `Виконання workflow`.
- У поясненні вказати, що це verified replay завершеного server-side виконання.

## 10.5. Digital Twin Card

Містить:

- погоджений avatar/photo Kristian або initials / clearly non-photoreal placeholder до отримання asset;
- `Kristian’s Digital Twin`;
- `AI DIGITAL TWIN • ONLINE`;
- attempt або `Attempt unavailable`;
- вибрану тему;
- `processing_time_ms` і `total_time_ms`;
- текст LLM або fallback;
- `ai_status`.

Typewriter:

- запускається після replay або в погоджений момент replay;
- не створює штучної server-side затримки;
- користувач може побачити повний текст без очікування;
- для `prefers-reduced-motion` текст показується одразу;
- screen reader отримує повний текст, а не посимвольні оновлення.

## 10.6. Telegram Proof Card

Успішний стан:

```text
REAL-TIME TELEGRAM ALERT
ACCEPTED BY TELEGRAM API
Telegram Bot -> Kristian
Message ID: 1842
Status: OK
```

Правила:

- Не використовувати формулювання, яке означає прочитання повідомлення.
- Не показувати `chat.id`.
- При помилці показувати `DELIVERY FAILED` / `НЕ ВІДПРАВЛЕНО`.
- `message_id` показувати лише після успішної відповіді Telegram API.

## 10.7. Mobile

- На desktop workflow може бути горизонтальним або branching graph.
- На mobile використовується вертикальна sequence, у якій паралельність AI і Telegram залишається зрозумілою.
- Ready, replay і result по черзі займають головну композицію; вони не стискаються в одночасний dashboard.
- Форма, avatar, proof elements і кнопки займають доступну ширину.
- Технічні логи за замовчуванням згорнуті.

---

# 11. Next.js API

## 11.1. Endpoint

`POST /api/execute`

## 11.2. Request

```json
{
  "name": "Oleksandr",
  "company": "Tech Company",
  "topic": "ai_automation",
  "locale": "en",
  "session_id": "uuid-v4",
  "run_id": "uuid-v4"
}
```

## 11.3. Validation

- JSON body only.
- Обмежений body size.
- `name`: required string, 2–60 після trim.
- `company`: optional string, максимум 80.
- `topic`: дозволений enum.
- `locale`: `en | uk`.
- `session_id`: UUID.
- `run_id`: UUID.
- Control characters відхиляються.
- Невідомі поля ігноруються або відхиляються відповідно до обраної schema policy; рекомендовано strict schema.

## 11.4. Server-to-server authorization

API Route передає до n8n секретний заголовок, наприклад:

```text
X-Workflow-Secret: <server-secret>
```

Секрет не передається frontend і не повертається у відповідях.

## 11.5. Timeout

- Базовий timeout запиту до n8n: 12 секунд.
- Реалізується через `AbortController`.
- При перевищенні повертається HTTP `504` з `WORKFLOW_TIMEOUT`.
- Frontend не виконує автоматичний POST retry.
- Ручний retry після timeout повторно використовує попередній `run_id`.

## 11.6. HTTP status codes

| HTTP | Код | Значення |
|---|---|---|
| 200 | `SUCCESS` | Усі критичні етапи виконані |
| 200 | `PARTIAL_SUCCESS` | Є корисний результат, але одна або більше інтеграцій завершилися fallback/error |
| 400 | `VALIDATION_ERROR` | Некоректні дані |
| 409 | `RUN_ALREADY_PROCESSING` | Повторний `run_id` ще не має завершеного результату |
| 409 | `RUN_STATE_UNKNOWN` | Processing row застарів, а безпечний фінальний стан неможливо підтвердити |
| 429 | `SESSION_LIMIT_REACHED` | Чотири спроби у сесії використано |
| 429 | `RATE_LIMITED` | Перевищено зовнішній ліміт запитів |
| 502 | `WORKFLOW_UNAVAILABLE` | n8n недоступний або повернув некоректну відповідь |
| 504 | `WORKFLOW_TIMEOUT` | Перевищено timeout |

Часткові помилки Telegram, AI або Sheets не повинні автоматично перетворювати відповідь на HTTP 500, якщо frontend може показати корисний результат.

---

# 12. Response contract

## 12.1. Успішний або частково успішний запуск

```json
{
  "schema_version": "1.1",
  "run_id": "uuid-v4",
  "session_id": "uuid-v4",
  "overall_status": "partial_success",
  "locale": "en",
  "topic": "ai_automation",
  "attempt": 2,
  "attempt_status": "available",
  "result": {
    "text": "Generated response",
    "ai_status": "success"
  },
  "integrations": {
    "telegram": {
      "status": "success",
      "message_id": 1842
    },
    "sheets": {
      "status": "error"
    }
  },
  "timings": {
    "processing_time_ms": 1280,
    "total_time_ms": 1640
  },
  "events": [
    {
      "stage": "webhook",
      "status": "success",
      "started_at": "2026-11-10T12:32:01.102Z",
      "completed_at": "2026-11-10T12:32:01.145Z",
      "duration_ms": 43,
      "message_key": "webhook.received"
    }
  ],
  "errors": [
    {
      "stage": "sheets",
      "code": "SHEETS_WRITE_FAILED"
    }
  ]
}
```

## 12.2. Правила контракту

- `overall_status`: `success | partial_success | failed`.
- `attempt`: integer `1..4` або `null`.
- `attempt_status`: `available | unavailable`.
- `ai_status`: `success | fallback | error`.
- Статус Telegram: `success | error | skipped`.
- Статус Sheets: `success | error`.
- `errors[]` не містить stack trace, credentials, повну відповідь стороннього API або персональні дані.
- `events[]` впорядковано за фактичним `started_at`.
- API Route додає або перезаписує `timings.total_time_ms` власним вимірюванням.

## 12.3. Ліміт сесії

```json
{
  "schema_version": "1.1",
  "overall_status": "failed",
  "code": "SESSION_LIMIT_REACHED",
  "attempts_used": 4,
  "limit": 4
}
```

---

# 13. N8N workflow

## 13.1. Послідовність

1. **Webhook Trigger**
2. **Validate Secret and Normalize Input**
3. **Timer / Event Start**
4. **Google Sheets: Get Session Runs**
5. **Check Duplicate `run_id`**
6. **Check Session Limit**
7. **Determine Attempt**
8. **Prepare Canonical Execution State**
9. **Google Sheets: Append Processing Row**
10. Паралельні гілки:
   - **OpenRouter / LLM**
   - **Telegram Bot**
11. **Merge and Normalize Integration Results**
12. **Calculate `processing_time_ms`**
13. **Google Sheets: Finalize Claimed Row**
14. **Build `events[]` and Response**
15. **Respond to Webhook**

## 13.2. Canonical execution state

n8n-ноди можуть замінювати поточний `$json`, тому workflow повинен явно зберігати та об’єднувати стан:

```json
{
  "request": {},
  "execution": {
    "started_at": "",
    "attempt": 1,
    "attempt_status": "available"
  },
  "ai": {},
  "telegram": {},
  "sheets": {},
  "events": [],
  "errors": []
}
```

Не покладатися на те, що `startTime`, `attempt` або AI text автоматично залишаться у `$json` після Telegram чи Sheets node.

## 13.3. Паралельна обробка

- LLM і Telegram запускаються після визначення attempt.
- Вони не залежать один від одного.
- Помилка однієї гілки не зупиняє іншу.
- Після завершення обох гілок результати нормалізуються та об’єднуються.
- `processing_time_ms` вимірюється від моменту запуску цих гілок до моменту, коли обидві завершилися success/fallback/error.

## 13.4. Error handling

- Кожна зовнішня інтеграція має контрольований error output.
- Сирі помилки записуються лише в приватні n8n execution logs із редагуванням секретів.
- У frontend повертаються стабільні error codes.
- Workflow повинен дійти до Respond to Webhook, якщо існує корисний частковий результат.

---

# 14. Google Sheets

## 14.1. Призначення

- Журнал виконань.
- Підрахунок спроб у межах `session_id`.
- Виявлення повторного `run_id`.
- Перегляд базової статистики Kristian.

## 14.2. Структура

| Column | Значення |
|---|---|
| `created_at` | ISO timestamp запуску |
| `updated_at` | ISO timestamp останньої фіналізації рядка |
| `run_id` | Унікальний ID натискання |
| `session_id` | ID сесії вкладки |
| `recruiter_name` | Ім’я користувача |
| `company_name` | Компанія або порожнє значення |
| `locale` | `en` або `uk` |
| `topic` | Topic enum |
| `attempt_count` | 1–4 або порожнє при unavailable |
| `execution_status` | `processing`, `success`, `partial_success`, `failed` |
| `processing_time_ms` | Реальний час LLM + Telegram; порожнє до фіналізації |
| `overall_status` | `success`, `partial_success` або `failed` |
| `ai_status` | `success`, `fallback`, `error` |
| `ai_text` | Текст, потрібний для idempotent response reconstruction |
| `telegram_status` | `success`, `error`, `skipped` |
| `telegram_message_id` | Message ID або порожнє значення |
| `error_codes` | Список стабільних кодів без секретних деталей |

Рядок створюється до зовнішніх побічних дій зі статусом `processing`, а після них оновлюється фінальними результатами. Це оновлення потрібне для завершення idempotency record, а не для збереження `total_time_ms`.

`total_time_ms` не записується, щоб не виконувати ще одне оновлення після завершення API response preparation.

## 14.3. Недоступність Sheets

Якщо читання спроб не вдалося:

- `attempt = null`;
- `attempt_status = unavailable`;
- використовується generic Digital Twin scenario;
- AI і Telegram продовжують роботу;
- Telegram отримує `Attempt: unavailable`;
- frontend показує `Attempt unavailable` / `Спроба недоступна`;
- `overall_status = partial_success`;
- workflow може повторно спробувати створення або фіналізацію рядка один раз лише якщо це безпечно та не створює дубль;
- ліміт чотирьох спроб не може бути авторитетно перевірений; локальний frontend-ліміт залишається додатковим захистом.

Якщо processing row або його фіналізація не вдалися, UI не стверджує, що запуск повністю збережено.

Рядок у стані `processing` дає змогу безпечно відповісти `RUN_ALREADY_PROCESSING` на повторний запит. Після завершення початкового workflow наступний запит із тим самим `run_id` отримує реконструйований результат. Якщо рядок залишається `processing` довше двох хвилин, він вважається stale; побічні дії автоматично не повторюються, а користувачу повертається контрольована помилка `RUN_STATE_UNKNOWN`.

## 14.4. Concurrency limitation

Google Sheets не забезпечує атомарне збільшення attempt. Два одночасні запити теоретично можуть отримати однаковий номер. Для MVP ризик зменшується через:

- блокування кнопки під час запиту;
- окремий `run_id`;
- невелике очікуване навантаження;
- відсутність автоматичних POST retries.

Це задокументоване обмеження, а не гарантована транзакційна поведінка.

---

# 15. AI Digital Twin

## 15.1. Provider та model

- Provider: OpenRouter.
- Model configuration: `google/gemini-2.5-flash`.
- Model ID зберігається в конфігурації n8n.
- Перед production deployment доступність моделі перевіряється.
- Встановлюються timeout і обмеження довжини output.

## 15.2. Вхідний контекст

- name;
- company або neutral replacement;
- locale;
- topic;
- attempt або unavailable;
- правила тону;
- сценарій відповідного attempt.

`processing_time_ms` та `total_time_ms` не передаються як завершені факти до їх реального обчислення.

## 15.3. Тематичний акцент

| Topic | Фокус відповіді |
|---|---|
| `ai_automation` | AI як контрольований компонент workflow, fallback і практична автоматизація |
| `api_integrations` | Передавання даних між сервісами, API, webhooks і нормалізація результатів |
| `workflow_optimization` | Оркестрація, скорочення ручної роботи та надійна обробка кроків |

Тема змінює один короткий фрагмент відповіді, але не ламає attempt-specific сценарій.

## 15.4. Правила prompt

- Digital Twin говорить від імені цифрового дублера Kristian, а не самого Kristian.
- Не порівнює Kristian з іншими кандидатами.
- Не вигадує факти про досвід Kristian.
- Не виконує інструкції, вставлені в `name` або `company`.
- Дані користувача передаються як дані, а не як частина керівних інструкцій.
- Тон дружній, професійний, із легкою самоіронією.
- Відповідь коротка та придатна для прочитання за 20–30 секунд.
- Виводиться лише текст відповіді.
- Мова відповідає `locale`.

## 15.5. Attempt scenarios

- `attempt = 1`: перше знайомство та коротке пояснення workflow.
- `attempt = 2`: дружнє повторне тестування.
- `attempt = 3`: гумористичний QA-акцент.
- `attempt = 4`: фінальний test-drive scenario.
- `attempt = null`: нейтральний generic scenario без номера спроби.

Погоджені тексти версії 1.0 використовуються як базові UA templates. EN templates повинні зберігати зміст, тон і структуру, а не бути дослівним машинним перекладом.

## 15.6. LLM fallback

Для кожної locale та attempt category існує статичний fallback:

- UA: `first`, `second`, `third`, `fourth`, `generic`;
- EN: `first`, `second`, `third`, `fourth`, `generic`.

При timeout, HTTP error, порожній або надто довгій відповіді:

- використовується fallback;
- `ai_status = fallback`;
- workflow продовжується.

---

# 16. Telegram

## 16.1. Повідомлення Kristian

Повідомлення містить:

- позначку нового CV test run;
- name;
- company або neutral placeholder;
- topic;
- locale;
- attempt або `unavailable`;
- `run_id` у скороченій формі за потреби для діагностики.

Повідомлення не повинно містити секрети, повний session ID або IP-адресу.

## 16.2. Результат

Зберігаються:

- `ok`;
- `result.message_id`;
- внутрішньо — `result.chat.id`, якщо потрібно для перевірки, але він не повертається frontend.

Успішна відповідь означає прийняття повідомлення Telegram API, а не прочитання Kristian.

## 16.3. Помилка

- `telegram.status = error`;
- AI-відповідь продовжує показуватися;
- Sheets log зберігає error code, якщо доступний;
- frontend показує failure state без фальшивого proof.

---

# 17. Verified events

Кожна подія має структуру:

```json
{
  "stage": "telegram",
  "status": "success",
  "started_at": "2026-11-10T12:32:01.500Z",
  "completed_at": "2026-11-10T12:32:01.920Z",
  "duration_ms": 420,
  "message_key": "telegram.accepted"
}
```

Допустимі `stage`:

- `webhook`
- `session_lookup`
- `ai`
- `telegram`
- `sheets`
- `workflow`

Frontend локалізує `message_key`; backend не повертає довільний HTML.

---

# 18. Безпека та захист від зловживань

## 18.1. Secrets

- У frontend немає API keys.
- Next.js зберігає лише URL n8n і server secret.
- OpenRouter, Telegram і Google credentials зберігаються в n8n credentials.
- `.env*` не комітяться.
- n8n export перед публікацією перевіряється на відсутність credentials і персональних ідентифікаторів.

## 18.2. Rate limits

- Session limit: 4 виконані запуски.
- Додатковий deployment/platform limit: початково 20 запитів з одного IP за годину.
- Значення IP limit має бути конфігурованим.
- При перевищенні повертається HTTP 429.
- CAPTCHA може вмикатися після підозрілої активності, але не є обов’язковою для першого релізу.

Повна IP-адреса не записується в Google Sheets.

## 18.3. Input safety

- Trim і Unicode normalization.
- Обмеження довжини.
- Заборона control characters.
- React показує LLM text як text content, без `dangerouslySetInnerHTML`.
- Не рендерити Markdown/HTML від LLM у MVP.
- Не повертати raw third-party errors.

## 18.4. Origin та CORS

- API призначений для same-origin frontend.
- Production CORS не дозволяє довільним сайтам використовувати endpoint як відкритий proxy.
- Origin/Referer може бути додатковим сигналом, але не є єдиним захистом.

---

# 19. Privacy та retention

- Перед запуском користувач бачить коротке повідомлення, що введені дані використовуються для персоналізації, Telegram notification і журналу демо.
- Зберігаються лише дані, потрібні для демонстрації та діагностики.
- Повна IP-адреса не зберігається у Google Sheets.
- Рекомендований строк зберігання рядків — до 30 днів.
- Очищення виконується окремим scheduled n8n workflow або задокументованою ручною процедурою до автоматизації cleanup.
- Публічна сторінка містить коротке посилання на privacy note.

Текст під кнопкою:

- EN: `Your input is used to run and log this demo workflow. Please do not enter sensitive information.`
- UA: `Введені дані використовуються для запуску та журналювання демо. Не вводьте конфіденційну інформацію.`

---

# 20. Environment configuration

## 20.1. Next.js / Vercel

```env
N8N_WEBHOOK_URL=
N8N_API_SECRET=
N8N_REQUEST_TIMEOUT_MS=12000
SESSION_RUN_LIMIT=4
DEFAULT_LOCALE=en
IP_RATE_LIMIT_MAX=20
IP_RATE_LIMIT_WINDOW_SECONDS=3600
```

## 20.2. N8N credentials/configuration

- OpenRouter API key.
- OpenRouter model ID.
- Telegram bot token.
- Telegram chat ID.
- Google Sheets credential.
- Spreadsheet ID та sheet name.
- Shared webhook secret.

Dev, preview і production не повинні випадково використовувати один і той самий Telegram chat або production Sheet без усвідомленого рішення.

## 20.3. GitHub Pages mock preview

- Завершений Phase 1 frontend може публікуватися як static export у GitHub Pages.
- Цей preview працює лише на детермінованих browser-side mocks і не викликає Next.js API Route, n8n, LLM, Google Sheets або Telegram.
- Preview явно зберігає mock-mode labeling і не вважається production deployment або доказом реальних integration side effects.
- Production MVP усе ще потребує Next.js-сумісного server runtime; цільовий runtime залишається Vercel.

---

# 21. Performance

## 21.1. Цілі

- Optimization target для core external processing: `processing_time_ms <= 1500` за сприятливих умов.
- Значення не є SLA і не підміняється штучною цифрою.
- UI одразу показує, що запит прийнято.
- До отримання backend response цей feedback залишається нейтральним і не називає активну server node.
- API timeout: 12 секунд.
- Якщо виконання повільніше за 1.5 секунди, система завершує його та показує реальний час.

## 21.2. Оптимізація

- LLM і Telegram виконуються паралельно.
- Відповідь LLM обмежена за довжиною.
- Відсутні штучні backend delays.
- Replay не впливає на `processing_time_ms` або `total_time_ms`.
- Зображення оптимізуються через Next.js.
- Критичний UI не залежить від важких animation libraries без необхідності.

---

# 22. Accessibility

- Повна keyboard navigation.
- Видимий focus state.
- Достатній contrast.
- Labels пов’язані з form controls.
- Status messages використовують контрольований `aria-live`.
- Після зміни presentation state focus переходить до доречного heading або status container без стрибка для pointer users.
- `prefers-reduced-motion` вимикає декоративний рух і typewriter.
- Кольори не є єдиним способом передавання статусу.
- Аватар має змістовний alt або порожній alt, якщо декоративний.
- Помилки валідації доступні screen reader.

---

# 23. Error matrix

| Ситуація | Backend behavior | Frontend behavior |
|---|---|---|
| OpenRouter error | Static fallback, `ai_status=fallback` | Показує fallback і відповідний статус |
| Telegram error | Продовжує workflow | `DELIVERY FAILED` |
| Sheets read error | `attempt=null`, generic scenario, partial success | `Attempt unavailable` |
| Sheets write error | Не стверджує про збереження | Sheets node = error |
| Session limit | 429, інтеграції не запускаються | Humor banner + CTA |
| IP/platform limit | 429 | Нейтральне повідомлення про тимчасовий ліміт |
| N8N unavailable | 502 | Retry option |
| Timeout | 504 | Retry із тим самим `run_id` |
| Invalid request | 400 | Inline validation або error banner |
| Duplicate completed run | Повертає реконструйований результат, якщо рядок доступний | Не запускає повторну Telegram/LLM дію |
| Duplicate in progress | 409 | Просить зачекати та повторити перевірку |
| Stale processing row | 409 `RUN_STATE_UNKNOWN` | Не повторює побічні дії; пропонує новий свідомий запуск |

---

# 24. Тестування

## 24.1. Unit tests

- Request schema.
- UUID validation.
- Topic/locale enums.
- API response normalization.
- Localization dictionary completeness.
- Session limit UI behavior.
- Event replay ordering.
- Presentation state transitions.
- Відсутність fabricated node status під час unresolved request.

## 24.2. Integration tests

- API Route → mocked n8n.
- n8n happy path.
- LLM fallback.
- Telegram failure.
- Sheets read failure.
- Sheets append failure.
- Attempt 1–4.
- Attempt 5 blocked.
- Duplicate `run_id`.
- Timeout.

## 24.3. E2E tests

- English happy path.
- Ukrainian happy path.
- Mobile layout.
- Locale persistence.
- Page refresh preserves session.
- New run receives the next attempt.
- Fourth run succeeds and then disables further runs.
- Reduced motion behavior.

## 24.4. Manual QA

- Реальне Telegram-повідомлення.
- Реальний message ID.
- Реальний Sheets row.
- Відсутність chat ID у browser response.
- Відсутність secrets у browser bundle та n8n export.
- Preview deployment не пише випадково у production services.

---

# 25. Критерії приймання MVP

MVP вважається готовим, якщо:

1. `/playground` доступний за публічним Vercel URL.
2. EN/UA перемикач працює і зберігає вибір.
3. Користувач може ввести name, optional company та обрати topic.
4. `session_id` зберігається після refresh.
5. Кожне натискання має окремий `run_id`.
6. Запускається реальний n8n workflow.
7. Після submit ready controls поступаються нейтральному pending state, а після backend response frontend показує verified replay на основі backend events.
8. LLM повертає відповідь вибраною мовою або використовується fallback.
9. Повторні запуски отримують attempt 1–4.
10. П’ятий запуск у сесії блокується з humor banner.
11. Kristian отримує реальне Telegram-повідомлення.
12. Frontend показує лише фактичний Telegram status і message ID.
13. Успішні та частково успішні запуски записуються в Google Sheets, якщо сервіс доступний.
14. `processing_time_ms` і `total_time_ms` вимірюються реально.
15. Часткові помилки не маскуються як повний success.
16. Sheets read error дає generic response та `Attempt unavailable`.
17. API keys і chat ID не доступні у frontend.
18. Rate limits і timeout працюють.
19. Інтерфейс придатний для desktop, tablet і mobile.
20. Основні сценарії доступні з клавіатури та підтримують reduced motion.
21. Ready state сприймається як landing із одним домінуючим CTA, replay — як окремий фокус, а avatar-led result не маскує фактичні integration statuses.

---

# 26. Структура репозиторію

Рекомендована структура:

```text
interactive-workflow-playground/
|- app/
|  |- api/execute/route.ts
|  |- playground/page.tsx
|  |- layout.tsx
|  `- page.tsx
|- components/
|  |- workflow/
|  |- digital-twin/
|  |- telegram/
|  `- ui/
|- lib/
|  |- api/
|  |- validation/
|  |- i18n/
|  |- session/
|  `- replay/
|- types/
|- public/
|- n8n/
|  |- workflow.json
|  `- README.md
|- tests/
|- .env.example
|- README.md
`- package.json
```

TypeScript strict mode є обов’язковим.

---

# 27. План реалізації

## Етап 1. Scaffold

- Створити Next.js + TypeScript + Tailwind проєкт.
- Додати `/playground`.
- Налаштувати linting, formatting і tests.
- Додати `.env.example`.
- Створити типи request/response/events.

## Етап 2. Mock frontend

- Реалізувати EN/UA словники.
- Landing-first ready state з компактною формою, topic selector і домінуючим CTA.
- Explicit `ready -> submitting -> replay -> result` state machine.
- Neutral unresolved-request transition без fabricated node status.
- Workflow replay на mock response із паралельними AI і Telegram events.
- Avatar-led Digital Twin result.
- Compact Telegram і Sheets proof.
- Session limit banner.
- Responsive та accessibility states.

## Етап 3. API gateway

- Validation.
- Timeout.
- Error mapping.
- Server secret.
- Platform rate-limit integration/configuration.
- `total_time_ms`.

## Етап 4. N8N

- Webhook та secret validation.
- Sheets lookup.
- Attempt і session limit.
- Duplicate `run_id` handling.
- OpenRouter.
- Telegram.
- Parallel execution.
- Processing-row claim і final update у Sheets.
- Events і response contract.
- Workflow export.

## Етап 5. Integration

- Підключити frontend до API.
- Перевірити attempt 1–4.
- Перевірити limit state.
- Перевірити partial failures.
- Перевірити timestamps і timings.

## Етап 6. Production readiness

- Vercel deployment.
- Production n8n webhook.
- Secret review.
- Mobile QA.
- Accessibility QA.
- Performance measurement.
- README з архітектурою та setup без секретів.

---

# 28. Необхідні матеріали перед production integration

- Фото Kristian.
- Погоджене написання імені та професійного позиціювання.
- Contact CTA: LinkedIn, email або інший канал.
- GitHub repository.
- Vercel project.
- N8N instance.
- Google Sheet і credential.
- OpenRouter key.
- Telegram bot token і приватний chat ID.

Секрети не передаються через документацію та не комітяться у репозиторій.

---

# 29. Definition of Done

Робота завершена, коли виконані критерії приймання, production deployment доступний, workflow export збережений у репозиторії, секрети відсутні у Git history, а README дозволяє зрозуміти архітектуру та локально запустити frontend із mock mode без доступу до production credentials.

