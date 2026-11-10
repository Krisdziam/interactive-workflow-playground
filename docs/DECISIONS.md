# Accepted decisions

This log records decisions approved before implementation. Update it whenever the user approves a material change.

| ID | Decision | Rationale and accepted tradeoff |
|---|---|---|
| ADR-001 | Build a separate Next.js application with reusable components. | Keeps the demo independently deployable while allowing later embedding in a larger portfolio. |
| ADR-002 | Use `/playground` as the primary route. | Gives the experience a stable URL and clean product boundary. |
| ADR-003 | Use verified replay, not live streaming, in the MVP. | A single synchronous response is simpler and still proves real execution. Replay must use server-confirmed events and must not fabricate success. |
| ADR-004 | Support EN and UA; English is the default. | Serves international and Ukrainian recruiters without maintaining separate applications. |
| ADR-005 | Offer exactly three topics. | `ai_automation`, `api_integrations`, and `workflow_optimization` provide useful personalization without slowing the flow. |
| ADR-006 | Keep Google Sheets as the only MVP state and audit store. | Avoids another infrastructure dependency. Non-atomic attempt counting under simultaneous requests is an accepted MVP limitation. |
| ADR-007 | Allow four executed runs per `session_id`. | Lets the recruiter see every attempt scenario while limiting cost and Telegram noise. The fifth run is blocked with a humorous banner. |
| ADR-008 | Use a server-generated workflow result with `run_id` idempotency. | Prevents accidental duplicate LLM and Telegram side effects when a timed-out request is retried. A Sheets `processing` row claims the run before integrations execute. |
| ADR-009 | Keep two timing metrics. | `processing_time_ms` measures parallel LLM + Telegram work and is stored in Sheets. `total_time_ms` measures the Next.js gateway request and is returned to the browser, but is not saved through another Sheet update. |
| ADR-010 | Keep the 1.5-second target as an optimization goal. | External APIs and cold starts make it unsuitable as a guaranteed SLA. The product always shows real measured time. |
| ADR-011 | Keep the approved Digital Twin narrative even when it generally mentions the complete workflow. | The user accepted this copy nuance. Individual UI widgets remain the authoritative source of actual integration status. |
| ADR-012 | Preserve partial success. | A Telegram, Sheets, or AI failure must not hide useful output from another successful integration. |
| ADR-013 | Use a generic scenario when Sheets cannot determine the attempt. | AI and Telegram continue; the UI shows `Attempt unavailable` and `partial_success`. |
| ADR-014 | Use platform/IP protection in addition to the session limit. | A new tab creates a new session, so a second layer is required to reduce abuse. Initial target: 20 requests per IP per hour, configurable. |
| ADR-015 | Do not implement the application until explicitly authorized. | The planning package must be reviewed first. The current project root contains documentation only. |
| ADR-016 | Use a landing-first, single-focus experience with progressive disclosure while retaining the approved personalization inputs. | The ready state emphasizes one dominant workflow CTA; after submit, the pre-run controls yield to a verified workflow replay; the final state emphasizes the Digital Twin avatar and text. The UI must show a neutral pending transition while the request is unresolved and must not imply live node telemetry. The approximate direction is documented in `DESIGN_DIRECTION.md`. |

## Change procedure

For any proposed change to a decision above:

1. Explain the user-visible impact and technical tradeoff.
2. Obtain approval.
3. Update `TECHNICAL_SPEC.md`, this file, and any affected contract or copy document.
4. Update tests when implementation exists.

