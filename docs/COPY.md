# Bilingual product copy

This file is the canonical copy reference for the MVP. UI dictionaries should preserve these meanings and use stable keys. Copy may be refined with approval, but implementation must not invent unsupported claims about Kristian.

## Page introduction

| Key | English | Українська |
|---|---|---|
| `page.eyebrow` | INTERACTIVE CV EXPERIENCE | ІНТЕРАКТИВНЕ CV |
| `page.title` | Run the workflow. See the skills in action. | Запустіть workflow. Побачте навички в дії. |
| `page.description` | Enter a few details and run a real automation built with n8n, AI, Google Sheets, and Telegram. | Введіть кілька даних і запустіть реальну автоматизацію на базі n8n, AI, Google Sheets і Telegram. |
| `page.duration` | About 30–60 seconds | Приблизно 30–60 секунд |

## Form

| Key | English | Українська |
|---|---|---|
| `form.name.label` | Your name | Ваше ім’я |
| `form.name.placeholder` | Alex | Олександр |
| `form.company.label` | Company (optional) | Компанія (необов’язково) |
| `form.company.placeholder` | Tech Company | Tech Company |
| `form.topic.label` | What would you like to explore? | Що хочете протестувати? |
| `form.submit` | Execute Workflow ⚡ | Запустити workflow ⚡ |
| `form.submitting` | Executing… | Виконується… |
| `form.limitButton` | Run limit reached | Ліміт запусків вичерпано |
| `form.privacy` | Your input is used to run and log this demo workflow. Please do not enter sensitive information. | Введені дані використовуються для запуску та журналювання демо. Не вводьте конфіденційну інформацію. |

## Topics

| Enum | English | Українська |
|---|---|---|
| `ai_automation` | AI Automation | AI-автоматизація |
| `api_integrations` | API Integrations | API-інтеграції |
| `workflow_optimization` | Workflow Optimization | Оптимізація workflow |

### Topic sentences for Digital Twin

| Enum | English | Українська |
|---|---|---|
| `ai_automation` | This scenario shows how AI can become a controlled step in an automation instead of just an impressive button. | Цей сценарій показує, як AI стає керованим етапом автоматизації, а не просто ефектною кнопкою. |
| `api_integrations` | This scenario shows how webhooks and APIs move data reliably between different services. | Цей сценарій показує, як webhooks та API надійно передають дані між різними сервісами. |
| `workflow_optimization` | This scenario shows how a workflow can remove manual steps and save time. | Цей сценарій показує, як workflow прибирає ручні кроки та зберігає час. |

## Workflow section

| Key | English | Українська |
|---|---|---|
| `workflow.title` | Workflow Execution | Виконання workflow |
| `workflow.replayNote` | Verified replay of the completed server-side execution. | Підтверджений replay завершеного виконання на сервері. |
| `workflow.webhook` | Webhook Received | Webhook отримано |
| `workflow.sessionLookup` | Session Lookup | Перевірка сесії |
| `workflow.ai` | AI Processing | Обробка AI |
| `workflow.telegram` | Telegram Notification | Telegram-сповіщення |
| `workflow.sheets` | Google Sheets Logging | Запис у Google Sheets |
| `workflow.completed` | Workflow Completed | Workflow завершено |

## Status labels

| Status | English | Українська |
|---|---|---|
| `waiting` | WAITING | ОЧІКУВАННЯ |
| `processing` | PROCESSING | ВИКОНУЄТЬСЯ |
| `success` | SUCCESS | УСПІШНО |
| `fallback` | FALLBACK | РЕЗЕРВНИЙ СЦЕНАРІЙ |
| `error` | ERROR | ПОМИЛКА |
| `skipped` | SKIPPED | ПРОПУЩЕНО |

## Digital Twin card

| Key | English | Українська |
|---|---|---|
| `twin.name` | Kristian’s Digital Twin | Цифровий двійник Kristian |
| `twin.online` | AI DIGITAL TWIN • ONLINE | AI DIGITAL TWIN • ONLINE |
| `twin.attempt` | Attempt {{attempt}} | Спроба {{attempt}} |
| `twin.attemptUnavailable` | Attempt unavailable | Спроба недоступна |
| `twin.processingTime` | AI + Telegram | AI + Telegram |
| `twin.totalTime` | Total server time | Загальний час сервера |

## Telegram proof

| Key | English | Українська |
|---|---|---|
| `telegram.title` | REAL-TIME TELEGRAM ALERT | TELEGRAM-СПОВІЩЕННЯ В РЕАЛЬНОМУ ЧАСІ |
| `telegram.accepted` | ACCEPTED BY TELEGRAM API | ПРИЙНЯТО TELEGRAM API |
| `telegram.failed` | DELIVERY FAILED | НЕ ВІДПРАВЛЕНО |
| `telegram.route` | Telegram Bot → Kristian | Telegram Bot → Kristian |
| `telegram.messageId` | Message ID | ID повідомлення |
| `telegram.status` | Status | Статус |

## Four-run limit

### English

**Title:** `⚡ Looks like you really enjoyed that button 😄`  
**Body:** `You’ve already run the workflow 4 times. QA is complete — now it might be time to message Kristian.`  
**Button:** `Contact Kristian`

### Українська

**Заголовок:** `⚡ Схоже, вам дуже сподобалась ця кнопка 😄`  
**Текст:** `Ви вже запустили workflow 4 рази. QA завершено — тепер саме час написати Kristian.`  
**Кнопка:** `Написати Kristian`

## Errors

| Code | English | Українська |
|---|---|---|
| `VALIDATION_ERROR` | Check the highlighted fields and try again. | Перевірте виділені поля та спробуйте ще раз. |
| `WORKFLOW_TIMEOUT` | The workflow is taking longer than expected. You can safely check the same run again. | Workflow виконується довше, ніж очікувалося. Можна безпечно перевірити цей самий запуск ще раз. |
| `WORKFLOW_UNAVAILABLE` | The workflow is temporarily unavailable. Please try again. | Workflow тимчасово недоступний. Спробуйте ще раз. |
| `RUN_ALREADY_PROCESSING` | This run is still processing. Give it a moment and check again. | Цей запуск ще виконується. Зачекайте трохи та перевірте знову. |
| `RUN_STATE_UNKNOWN` | The previous run could not be verified safely. Start a new run if you want to continue. | Не вдалося безпечно підтвердити стан попереднього запуску. Для продовження створіть новий запуск. |
| `RATE_LIMITED` | That was a lot of workflow energy. Please come back a little later. | Це було багато workflow-енергії. Поверніться трохи пізніше. |
| `SHEETS_READ_FAILED` | Attempt unavailable. The rest of the workflow can still continue. | Спроба недоступна. Решта workflow все одно може продовжитися. |

## Canonical fallback responses

Placeholders:

- `{{name}}`
- `{{company_context}}`: `for Acme` / `для Acme`; without a company: `for your team` / `для вашої команди`
- `{{attempt}}`
- `{{topic_sentence}}`

The LLM may produce a concise variation with the same intent. These texts are the deterministic fallback and the tone reference.

### Attempt 1 — English

```text
{{name}}, hello! Kristian’s Digital Twin here.

I promise there will be no “I’m a virtual assistant, how can I help?” routine.

While AI still hasn’t learned to make coffee {{company_context}}, we gave it a simpler job: save you time and show the technology in action.

{{topic_sentence}}

Your request brought together n8n, an LLM, Google Sheets, and Telegram. No algorithms were harmed during this test 😄

Thanks for running it — over to the real Kristian!
```

### Спроба 1 — Українська

```text
{{name}}, вітаю! На зв’язку цифровий двійник Kristian.

Обіцяю, жодної банальщини в стилі «Я віртуальний помічник, чим допомогти?».

Поки AI ще не навчився варити каву {{company_context}}, ми довірили йому простішу задачу — зекономити вам час і показати технології в дії.

{{topic_sentence}}

Ваш запит об’єднав n8n, LLM, Google Sheets і Telegram. Жоден алгоритм під час цього тесту не постраждав 😄

Дякую за запуск і передаю слово справжньому Kristian!
```

### Attempt 2 — English

```text
{{name}}, back again? It looks like this workflow caught your attention 😄

Kristian’s Digital Twin is still online. Shall we give n8n another resilience check {{company_context}}?

Attempt 2 has been recorded, Google Sheets has another entry, and Telegram has something new to tell Kristian.

{{topic_sentence}}

Thanks for the test drive. The real Kristian is ready to talk.
```

### Спроба 2 — Українська

```text
{{name}}, знову ви? Здається, наш workflow вам сподобався! 😄

Цифровий двійник Kristian на місці. Перевіряємо стійкість n8n {{company_context}}?

Спроба №2 зафіксована. Google Sheets отримав новий запис, а Telegram знову має що повідомити Kristian.

{{topic_sentence}}

Дякую за тест-драйв! Справжній Kristian уже готовий поспілкуватися.
```

### Attempt 3 — English

```text
{{name}}, this is already the third run!

I’m starting to suspect you simply enjoy watching workflow nodes light up 😄

Kristian’s Digital Twin is still at its post. The third attempt has been recorded, the LLM generated a response, and the automation is still moving.

{{topic_sentence}}

If this was a resilience test, things are looking good. The real Kristian sends his regards 😉
```

### Спроба 3 — Українська

```text
{{name}}, це вже третій запуск!

Я починаю підозрювати, що вам просто подобається дивитися, як підсвічуються ноди workflow 😄

Цифровий двійник Kristian все ще на посту. Третя спроба зафіксована, LLM згенерувала відповідь, а автоматизація продовжує працювати.

{{topic_sentence}}

Якщо ви перевіряли стійкість системи — поки що все добре! Справжній Kristian передає вам вітання 😉
```

### Attempt 4 — English

```text
{{name}}, I’m officially calling this the test drive of the year! 🎉

Attempt 4. The n8n workflow keeps working, the AI model keeps generating responses, Google Sheets keeps the history, and Telegram makes sure Kristian notices your visit.

{{topic_sentence}}

It looks like the automation has passed its technical QA. I’ll hand things over to the real Kristian before the Telegram bot asks for a day off.
```

### Спроба 4 — Українська

```text
{{name}}, офіційно оголошую: це тест-драйв року! 🎉

Спроба №4. Наш n8n workflow продовжує працювати, AI-модель генерує відповіді, Google Sheets зберігає історію, а Telegram не дає Kristian забути про ваш візит.

{{topic_sentence}}

Здається, технічний QA-тест автоматизації пройдено. Передаю естафету справжньому Kristian, поки Telegram-бот не попросив вихідний!
```

### Generic — English

```text
{{name}}, Kristian’s Digital Twin here.

The attempt counter is temporarily unavailable, but the rest of the workflow is still doing its job.

{{topic_sentence}}

Thanks for testing the automation. The individual status cards below show which integrations were confirmed.
```

### Generic — Українська

```text
{{name}}, на зв’язку цифровий двійник Kristian.

Лічильник спроб тимчасово недоступний, але решта workflow продовжує роботу.

{{topic_sentence}}

Дякую за тест автоматизації. Окремі статуси нижче покажуть, які інтеграції вдалося підтвердити.
```

