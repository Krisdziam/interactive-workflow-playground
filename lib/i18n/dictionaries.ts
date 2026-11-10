export const en = {
  "brand.name": "KRISTIAN",
  "brand.context": "INTERACTIVE CV",
  "locale.label": "Choose language",
  "page.eyebrow": "INTERACTIVE CV EXPERIENCE",
  "page.title": "Run the workflow. See the skills in action.",
  "page.description":
    "Enter a few details and run a real automation built with n8n, AI, Google Sheets, and Telegram.",
  "page.duration": "About 30–60 seconds",
  "page.stackLabel": "Workflow stack",
  "mock.badge": "PHASE 1 · LOCAL MOCK",
  "mock.notice":
    "This preview uses deterministic local responses. No external service is contacted.",
  "mock.qaMode": "QA scenario: {{scenario}}",
  "form.name.label": "Your name",
  "form.name.placeholder": "Alex",
  "form.company.label": "Company (optional)",
  "form.company.placeholder": "Tech Company",
  "form.topic.label": "What would you like to explore?",
  "form.submit": "Execute Workflow ⚡",
  "form.submitting": "Executing…",
  "form.limitButton": "Run limit reached",
  "form.privacy":
    "Your input is used to run and log this demo workflow. Please do not enter sensitive information.",
  "form.runsAvailable": "{{count}} of 4 demo runs available",
  "form.oneRunAvailable": "1 of 4 demo runs available",
  "form.required": "Required",
  "topic.ai_automation": "AI Automation",
  "topic.api_integrations": "API Integrations",
  "topic.workflow_optimization": "Workflow Optimization",
  "topic.ai_automation.hint": "Controlled AI with a visible fallback path",
  "topic.api_integrations.hint": "Webhooks, APIs, and normalized outcomes",
  "topic.workflow_optimization.hint": "Parallel work with fewer manual steps",
  "topic.ai_automation.sentence":
    "This scenario shows how AI can become a controlled step in an automation instead of just an impressive button.",
  "topic.api_integrations.sentence":
    "This scenario shows how webhooks and APIs move data reliably between different services.",
  "topic.workflow_optimization.sentence":
    "This scenario shows how a workflow can remove manual steps and save time.",
  "validation.nameMin": "Enter at least 2 characters.",
  "validation.nameMax": "Keep the name within 60 characters.",
  "validation.companyMax": "Keep the company within 80 characters.",
  "validation.controlCharacters": "Remove unsupported control characters.",
  "validation.topic": "Choose one of the available topics.",
  "validation.uuidV4": "A valid correlation ID is required.",
  "submitting.eyebrow": "REQUEST ACCEPTED",
  "submitting.title": "The workflow is processing…",
  "submitting.description":
    "Waiting for the completed server response before showing any node state.",
  "submitting.integrity":
    "No live node telemetry is implied. The next view will replay verified events only.",
  "workflow.title": "Workflow Execution",
  "workflow.replayNote":
    "Verified replay of the completed server-side execution.",
  "workflow.skipReplay": "Skip replay",
  "workflow.replayComplete": "Verified replay complete",
  "workflow.parallel": "Parallel branch",
  "workflow.webhook": "Webhook Received",
  "workflow.sessionLookup": "Session Lookup",
  "workflow.ai": "AI Processing",
  "workflow.telegram": "Telegram Notification",
  "workflow.sheets": "Google Sheets Logging",
  "workflow.completed": "Workflow Completed",
  "status.waiting": "WAITING",
  "status.processing": "REPLAYING",
  "status.success": "SUCCESS",
  "status.fallback": "FALLBACK",
  "status.error": "ERROR",
  "status.skipped": "SKIPPED",
  "twin.name": "Kristian’s Digital Twin",
  "twin.online": "AI DIGITAL TWIN • ONLINE",
  "twin.attempt": "Attempt {{attempt}}",
  "twin.attemptUnavailable": "Attempt unavailable",
  "twin.processingTime": "AI + Telegram",
  "twin.totalTime": "Total server time",
  "twin.avatarLabel": "Neutral initials placeholder for Kristian",
  "twin.mockResponse": "Deterministic mock response",
  "result.success": "All mock integrations returned a verified success.",
  "result.partial":
    "The useful result is preserved while failed or fallback integrations remain visible.",
  "result.newRun": "Run another test",
  "result.details": "Verified details",
  "result.runId": "Run ID",
  "result.integrationIssues": "Integration notes",
  "telegram.title": "REAL-TIME TELEGRAM ALERT",
  "telegram.accepted": "ACCEPTED BY TELEGRAM API",
  "telegram.failed": "DELIVERY FAILED",
  "telegram.skipped": "NOT ATTEMPTED",
  "telegram.route": "Telegram Bot → Kristian",
  "telegram.messageId": "Message ID",
  "telegram.status": "Status",
  "telegram.acceptanceNote":
    "API acceptance does not mean the message was read.",
  "sheets.title": "GOOGLE SHEETS AUDIT",
  "sheets.saved": "RUN RECORDED",
  "sheets.failed": "LOGGING FAILED",
  "sheets.status": "Status",
  "limit.title": "⚡ Looks like you really enjoyed that button 😄",
  "limit.body":
    "You’ve already run the workflow 4 times. QA is complete — now it might be time to message Kristian.",
  "limit.button": "Contact Kristian",
  "limit.contactPending": "Contact link pending approval",
  "error.title": "The run needs your attention",
  "error.VALIDATION_ERROR": "Check the highlighted fields and try again.",
  "error.WORKFLOW_TIMEOUT":
    "The workflow is taking longer than expected. You can safely check the same run again.",
  "error.WORKFLOW_UNAVAILABLE":
    "The workflow is temporarily unavailable. Please try again.",
  "error.RUN_ALREADY_PROCESSING":
    "This run is still processing. Give it a moment and check again.",
  "error.RUN_STATE_UNKNOWN":
    "The previous run could not be verified safely. Start a new run if you want to continue.",
  "error.RATE_LIMITED":
    "That was a lot of workflow energy. Please come back a little later.",
  "error.SESSION_LIMIT_REACHED":
    "This browser session has used all four demo runs.",
  "error.SHEETS_READ_FAILED":
    "Attempt unavailable. The rest of the workflow can still continue.",
  "error.SHEETS_FINALIZE_FAILED":
    "The result is available, but the audit row could not be finalized.",
  "error.AI_FALLBACK_USED":
    "The AI provider path used the deterministic fallback response.",
  "error.TELEGRAM_SEND_FAILED":
    "Telegram did not accept the notification; the AI result is still available.",
  "action.retrySame": "Check the same run",
  "action.newRun": "Start a new run",
  "action.backToForm": "Back to the form",
  "event.webhook.received": "Request accepted by the workflow",
  "event.session.lookup": "Session and attempt resolved",
  "event.session.unavailable": "Attempt lookup unavailable",
  "event.ai.generated": "Digital Twin response generated",
  "event.ai.fallback": "Deterministic AI fallback used",
  "event.telegram.accepted": "Notification accepted by Telegram API",
  "event.telegram.failed": "Telegram notification failed",
  "event.sheets.saved": "Audit row finalized",
  "event.sheets.failed": "Audit row was not finalized",
  "event.workflow.completed": "All stages completed",
  "event.workflow.partial": "Workflow completed with integration issues",
  "response.attempt1":
    "{{name}}, hello! Kristian’s Digital Twin here.\n\nI promise there will be no “I’m a virtual assistant, how can I help?” routine.\n\nWhile AI still hasn’t learned to make coffee {{company_context}}, we gave it a simpler job: save you time and show the technology in action.\n\n{{topic_sentence}}\n\nYour request brought together n8n, an LLM, Google Sheets, and Telegram. No algorithms were harmed during this test 😄\n\nThanks for running it — over to the real Kristian!",
  "response.attempt2":
    "{{name}}, back again? It looks like this workflow caught your attention 😄\n\nKristian’s Digital Twin is still online. Shall we give n8n another resilience check {{company_context}}?\n\nAttempt 2 has been recorded, Google Sheets has another entry, and Telegram has something new to tell Kristian.\n\n{{topic_sentence}}\n\nThanks for the test drive. The real Kristian is ready to talk.",
  "response.attempt3":
    "{{name}}, this is already the third run!\n\nI’m starting to suspect you simply enjoy watching workflow nodes light up 😄\n\nKristian’s Digital Twin is still at its post. The third attempt has been recorded, the LLM generated a response, and the automation is still moving.\n\n{{topic_sentence}}\n\nIf this was a resilience test, things are looking good. The real Kristian sends his regards 😉",
  "response.attempt4":
    "{{name}}, I’m officially calling this the test drive of the year! 🎉\n\nAttempt 4. The n8n workflow keeps working, the AI model keeps generating responses, Google Sheets keeps the history, and Telegram makes sure Kristian notices your visit.\n\n{{topic_sentence}}\n\nIt looks like the automation has passed its technical QA. I’ll hand things over to the real Kristian before the Telegram bot asks for a day off.",
  "response.generic":
    "{{name}}, Kristian’s Digital Twin here.\n\nThe attempt counter is temporarily unavailable, but the rest of the workflow is still doing its job.\n\n{{topic_sentence}}\n\nThanks for testing the automation. The individual status cards below show which integrations were confirmed.",
  "company.named": "for {{company}}",
  "company.neutral": "for your team",
  "footer.contract": "Response contract v1.1",
  "footer.privacy": "No credentials or external writes in mock mode",
} as const;

export type TranslationKey = keyof typeof en;
export type Dictionary = Record<TranslationKey, string>;

export const uk = {
  "brand.name": "KRISTIAN",
  "brand.context": "ІНТЕРАКТИВНЕ CV",
  "locale.label": "Оберіть мову",
  "page.eyebrow": "ІНТЕРАКТИВНЕ CV",
  "page.title": "Запустіть workflow. Побачте навички в дії.",
  "page.description":
    "Введіть кілька даних і запустіть реальну автоматизацію на базі n8n, AI, Google Sheets і Telegram.",
  "page.duration": "Приблизно 30–60 секунд",
  "page.stackLabel": "Стек workflow",
  "mock.badge": "PHASE 1 · ЛОКАЛЬНИЙ MOCK",
  "mock.notice":
    "Цей preview використовує детерміновані локальні відповіді. Зовнішні сервіси не викликаються.",
  "mock.qaMode": "QA-сценарій: {{scenario}}",
  "form.name.label": "Ваше ім’я",
  "form.name.placeholder": "Олександр",
  "form.company.label": "Компанія (необов’язково)",
  "form.company.placeholder": "Tech Company",
  "form.topic.label": "Що хочете протестувати?",
  "form.submit": "Запустити workflow ⚡",
  "form.submitting": "Виконується…",
  "form.limitButton": "Ліміт запусків вичерпано",
  "form.privacy":
    "Введені дані використовуються для запуску та журналювання демо. Не вводьте конфіденційну інформацію.",
  "form.runsAvailable": "Доступно {{count}} із 4 демо-запусків",
  "form.oneRunAvailable": "Доступний 1 із 4 демо-запусків",
  "form.required": "Обов’язково",
  "topic.ai_automation": "AI-автоматизація",
  "topic.api_integrations": "API-інтеграції",
  "topic.workflow_optimization": "Оптимізація workflow",
  "topic.ai_automation.hint": "Керований AI із прозорим fallback",
  "topic.api_integrations.hint": "Webhooks, API та нормалізовані результати",
  "topic.workflow_optimization.hint":
    "Паралельна робота без зайвих ручних кроків",
  "topic.ai_automation.sentence":
    "Цей сценарій показує, як AI стає керованим етапом автоматизації, а не просто ефектною кнопкою.",
  "topic.api_integrations.sentence":
    "Цей сценарій показує, як webhooks та API надійно передають дані між різними сервісами.",
  "topic.workflow_optimization.sentence":
    "Цей сценарій показує, як workflow прибирає ручні кроки та зберігає час.",
  "validation.nameMin": "Введіть щонайменше 2 символи.",
  "validation.nameMax": "Ім’я має містити не більше 60 символів.",
  "validation.companyMax": "Назва компанії має містити не більше 80 символів.",
  "validation.controlCharacters": "Видаліть непідтримувані службові символи.",
  "validation.topic": "Оберіть одну з доступних тем.",
  "validation.uuidV4": "Потрібен коректний correlation ID.",
  "submitting.eyebrow": "ЗАПИТ ПРИЙНЯТО",
  "submitting.title": "Workflow виконується…",
  "submitting.description":
    "Очікуємо завершену відповідь сервера, перш ніж показувати стан будь-якої ноди.",
  "submitting.integrity":
    "Це не live-телеметрія нод. Наступний екран відтворить лише підтверджені події.",
  "workflow.title": "Виконання workflow",
  "workflow.replayNote":
    "Підтверджений replay завершеного виконання на сервері.",
  "workflow.skipReplay": "Пропустити replay",
  "workflow.replayComplete": "Підтверджений replay завершено",
  "workflow.parallel": "Паралельна гілка",
  "workflow.webhook": "Webhook отримано",
  "workflow.sessionLookup": "Перевірка сесії",
  "workflow.ai": "Обробка AI",
  "workflow.telegram": "Telegram-сповіщення",
  "workflow.sheets": "Запис у Google Sheets",
  "workflow.completed": "Workflow завершено",
  "status.waiting": "ОЧІКУВАННЯ",
  "status.processing": "REPLAY",
  "status.success": "УСПІШНО",
  "status.fallback": "РЕЗЕРВНИЙ СЦЕНАРІЙ",
  "status.error": "ПОМИЛКА",
  "status.skipped": "ПРОПУЩЕНО",
  "twin.name": "Цифровий двійник Kristian",
  "twin.online": "AI DIGITAL TWIN • ONLINE",
  "twin.attempt": "Спроба {{attempt}}",
  "twin.attemptUnavailable": "Спроба недоступна",
  "twin.processingTime": "AI + Telegram",
  "twin.totalTime": "Загальний час сервера",
  "twin.avatarLabel": "Нейтральний initials-placeholder для Kristian",
  "twin.mockResponse": "Детермінована mock-відповідь",
  "result.success": "Усі mock-інтеграції повернули підтверджений успіх.",
  "result.partial":
    "Корисний результат збережено, а помилки та fallback інтеграцій залишаються видимими.",
  "result.newRun": "Запустити ще один тест",
  "result.details": "Підтверджені деталі",
  "result.runId": "Run ID",
  "result.integrationIssues": "Нотатки інтеграцій",
  "telegram.title": "TELEGRAM-СПОВІЩЕННЯ В РЕАЛЬНОМУ ЧАСІ",
  "telegram.accepted": "ПРИЙНЯТО TELEGRAM API",
  "telegram.failed": "НЕ ВІДПРАВЛЕНО",
  "telegram.skipped": "НЕ ЗАПУСКАЛОСЯ",
  "telegram.route": "Telegram Bot → Kristian",
  "telegram.messageId": "ID повідомлення",
  "telegram.status": "Статус",
  "telegram.acceptanceNote":
    "Прийняття API не означає, що повідомлення прочитано.",
  "sheets.title": "АУДИТ GOOGLE SHEETS",
  "sheets.saved": "ЗАПУСК ЗАПИСАНО",
  "sheets.failed": "ПОМИЛКА ЖУРНАЛЮВАННЯ",
  "sheets.status": "Статус",
  "limit.title": "⚡ Схоже, вам дуже сподобалась ця кнопка 😄",
  "limit.body":
    "Ви вже запустили workflow 4 рази. QA завершено — тепер саме час написати Kristian.",
  "limit.button": "Написати Kristian",
  "limit.contactPending": "Контактне посилання очікує погодження",
  "error.title": "Запуск потребує вашої уваги",
  "error.VALIDATION_ERROR": "Перевірте виділені поля та спробуйте ще раз.",
  "error.WORKFLOW_TIMEOUT":
    "Workflow виконується довше, ніж очікувалося. Можна безпечно перевірити цей самий запуск ще раз.",
  "error.WORKFLOW_UNAVAILABLE":
    "Workflow тимчасово недоступний. Спробуйте ще раз.",
  "error.RUN_ALREADY_PROCESSING":
    "Цей запуск ще виконується. Зачекайте трохи та перевірте знову.",
  "error.RUN_STATE_UNKNOWN":
    "Не вдалося безпечно підтвердити стан попереднього запуску. Для продовження створіть новий запуск.",
  "error.RATE_LIMITED":
    "Це було багато workflow-енергії. Поверніться трохи пізніше.",
  "error.SESSION_LIMIT_REACHED":
    "Ця браузерна сесія використала всі чотири демо-запуски.",
  "error.SHEETS_READ_FAILED":
    "Спроба недоступна. Решта workflow все одно може продовжитися.",
  "error.SHEETS_FINALIZE_FAILED":
    "Результат доступний, але не вдалося фіналізувати рядок аудиту.",
  "error.AI_FALLBACK_USED":
    "Для AI використано детерміновану резервну відповідь.",
  "error.TELEGRAM_SEND_FAILED":
    "Telegram не прийняв сповіщення; AI-результат усе одно доступний.",
  "action.retrySame": "Перевірити цей самий запуск",
  "action.newRun": "Створити новий запуск",
  "action.backToForm": "Повернутися до форми",
  "event.webhook.received": "Workflow прийняв запит",
  "event.session.lookup": "Сесію та спробу визначено",
  "event.session.unavailable": "Лічильник спроб недоступний",
  "event.ai.generated": "Відповідь Digital Twin згенеровано",
  "event.ai.fallback": "Використано детермінований AI fallback",
  "event.telegram.accepted": "Telegram API прийняв сповіщення",
  "event.telegram.failed": "Не вдалося надіслати Telegram-сповіщення",
  "event.sheets.saved": "Рядок аудиту фіналізовано",
  "event.sheets.failed": "Рядок аудиту не фіналізовано",
  "event.workflow.completed": "Усі етапи завершено",
  "event.workflow.partial": "Workflow завершено з проблемами інтеграцій",
  "response.attempt1":
    "{{name}}, вітаю! На зв’язку цифровий двійник Kristian.\n\nОбіцяю, жодної банальщини в стилі «Я віртуальний помічник, чим допомогти?».\n\nПоки AI ще не навчився варити каву {{company_context}}, ми довірили йому простішу задачу — зекономити вам час і показати технології в дії.\n\n{{topic_sentence}}\n\nВаш запит об’єднав n8n, LLM, Google Sheets і Telegram. Жоден алгоритм під час цього тесту не постраждав 😄\n\nДякую за запуск і передаю слово справжньому Kristian!",
  "response.attempt2":
    "{{name}}, знову ви? Здається, наш workflow вам сподобався! 😄\n\nЦифровий двійник Kristian на місці. Перевіряємо стійкість n8n {{company_context}}?\n\nСпроба №2 зафіксована. Google Sheets отримав новий запис, а Telegram знову має що повідомити Kristian.\n\n{{topic_sentence}}\n\nДякую за тест-драйв! Справжній Kristian уже готовий поспілкуватися.",
  "response.attempt3":
    "{{name}}, це вже третій запуск!\n\nЯ починаю підозрювати, що вам просто подобається дивитися, як підсвічуються ноди workflow 😄\n\nЦифровий двійник Kristian все ще на посту. Третя спроба зафіксована, LLM згенерувала відповідь, а автоматизація продовжує працювати.\n\n{{topic_sentence}}\n\nЯкщо ви перевіряли стійкість системи — поки що все добре! Справжній Kristian передає вам вітання 😉",
  "response.attempt4":
    "{{name}}, офіційно оголошую: це тест-драйв року! 🎉\n\nСпроба №4. Наш n8n workflow продовжує працювати, AI-модель генерує відповіді, Google Sheets зберігає історію, а Telegram не дає Kristian забути про ваш візит.\n\n{{topic_sentence}}\n\nЗдається, технічний QA-тест автоматизації пройдено. Передаю естафету справжньому Kristian, поки Telegram-бот не попросив вихідний!",
  "response.generic":
    "{{name}}, на зв’язку цифровий двійник Kristian.\n\nЛічильник спроб тимчасово недоступний, але решта workflow продовжує роботу.\n\n{{topic_sentence}}\n\nДякую за тест автоматизації. Окремі статуси нижче покажуть, які інтеграції вдалося підтвердити.",
  "company.named": "для {{company}}",
  "company.neutral": "для вашої команди",
  "footer.contract": "Контракт відповіді v1.1",
  "footer.privacy": "У mock-режимі немає credentials або зовнішніх записів",
} satisfies Dictionary;

export const dictionaries = { en, uk } as const;
