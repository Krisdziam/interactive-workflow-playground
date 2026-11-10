# API contract

## Endpoint

```http
POST /api/execute
Content-Type: application/json
```

The endpoint is same-origin and public. It is protected by schema validation, a per-session workflow limit, a platform/IP limit, timeout handling, and server-to-server authorization to n8n.

## Request

```json
{
  "name": "Oleksandr",
  "company": "Tech Company",
  "topic": "ai_automation",
  "locale": "en",
  "session_id": "8f4f4a5f-4160-4dcb-a789-74e5e6699694",
  "run_id": "850d5734-6db5-41cc-972b-19949b6640ab"
}
```

### Validation

| Field | Required | Rules |
|---|---:|---|
| `name` | yes | String; trim; 2–60 characters; Unicode allowed; no control characters |
| `company` | no | String; trim; 0–80 characters; no control characters |
| `topic` | yes | `ai_automation`, `api_integrations`, or `workflow_optimization` |
| `locale` | yes | `en` or `uk`; invalid locale falls back to `en` only if the schema policy explicitly permits it |
| `session_id` | yes | UUID v4 shape |
| `run_id` | yes | UUID v4 shape |

Use a strict request schema. Unknown fields should be rejected or stripped consistently; rejection is preferred during development because it catches contract drift.

## Success and partial-success response

```json
{
  "schema_version": "1.1",
  "run_id": "850d5734-6db5-41cc-972b-19949b6640ab",
  "session_id": "8f4f4a5f-4160-4dcb-a789-74e5e6699694",
  "overall_status": "partial_success",
  "locale": "en",
  "topic": "ai_automation",
  "attempt": 2,
  "attempt_status": "available",
  "result": {
    "text": "Generated or fallback response",
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
      "code": "SHEETS_FINALIZE_FAILED"
    }
  ],
  "idempotent_replay": false
}
```

## Type model

```ts
type Locale = "en" | "uk";
type Topic =
  | "ai_automation"
  | "api_integrations"
  | "workflow_optimization";

type OverallStatus = "success" | "partial_success" | "failed";
type AttemptStatus = "available" | "unavailable";
type Stage =
  | "webhook"
  | "session_lookup"
  | "ai"
  | "telegram"
  | "sheets"
  | "workflow";
type StageStatus =
  | "waiting"
  | "processing"
  | "success"
  | "fallback"
  | "error"
  | "skipped";
```

`attempt` is an integer from 1 to 4 when available and `null` otherwise.

## Events

Each event is server-created:

```ts
interface WorkflowEvent {
  stage: Stage;
  status: StageStatus;
  started_at: string;
  completed_at: string | null;
  duration_ms: number | null;
  message_key: string;
}
```

Rules:

- timestamps use ISO 8601 UTC;
- events are returned in chronological order;
- `message_key` is localized in the browser;
- no event contains arbitrary HTML, a secret, provider stack trace, or chat ID;
- replay uses these events and never invents a successful stage.

## Error envelope

```json
{
  "schema_version": "1.1",
  "overall_status": "failed",
  "code": "SESSION_LIMIT_REACHED",
  "message_key": "errors.sessionLimitReached",
  "details": {
    "attempts_used": 4,
    "limit": 4
  }
}
```

`details` must contain only safe structured values.

## HTTP and stable error codes

| HTTP | Code | Retry behavior |
|---:|---|---|
| 200 | `SUCCESS` | No retry needed |
| 200 | `PARTIAL_SUCCESS` | User may start a new intentional run |
| 400 | `VALIDATION_ERROR` | Fix input; do not reuse automatically |
| 409 | `RUN_ALREADY_PROCESSING` | Wait briefly, then retry with the same `run_id` |
| 409 | `RUN_STATE_UNKNOWN` | Do not repeat side effects automatically; offer a new intentional run |
| 429 | `SESSION_LIMIT_REACHED` | Do not retry in the same session |
| 429 | `RATE_LIMITED` | Retry only after the reported window |
| 502 | `WORKFLOW_UNAVAILABLE` | Manual retry; use the same `run_id` if the outcome is uncertain |
| 504 | `WORKFLOW_TIMEOUT` | Manual retry with the same `run_id` |

## Idempotency

1. Browser generates one `run_id` per intentional click.
2. n8n reads existing rows before side effects.
3. A new run appends a `processing` row that claims `run_id` and attempt.
4. A duplicate completed `run_id` returns reconstructed data and sets `idempotent_replay: true`.
5. A duplicate active `run_id` returns `RUN_ALREADY_PROCESSING`.
6. A stale processing row older than two minutes returns `RUN_STATE_UNKNOWN`.
7. Automatic POST retries are forbidden.

## Timing

- n8n supplies `processing_time_ms`.
- The Next.js Route Handler measures and overwrites `total_time_ms`.
- Browser replay time never modifies either value.

## Security response rules

Never return:

- `N8N_API_SECRET`;
- provider API keys;
- Telegram bot token;
- Telegram `chat.id`;
- Google credential data;
- raw provider bodies;
- stack traces;
- full internal n8n execution metadata.

