# Project instructions

These instructions apply to the entire `interactive-workflow-playground` project.

## Mission

Build a polished interactive CV portfolio demo that lets a recruiter run a real automation and see verified results from n8n, an LLM, Google Sheets, and Telegram.

The product must demonstrate Kristian's ability to combine technologies into a reliable user-facing workflow. It must not become a generic portfolio template or a decorative fake console.

## Current project state

The repository currently contains planning and implementation instructions only. No application scaffold, dependencies, credentials, or production integrations have been created.

Do not initialize Next.js, install packages, create external resources, publish, or deploy until the user explicitly starts the implementation phase.

## Required reading order

Before changing application code, read these files completely:

1. `docs/TECHNICAL_SPEC.md` — source of truth for the MVP.
2. `docs/DECISIONS.md` — accepted decisions and tradeoffs.
3. `docs/ARCHITECTURE.md` — system boundaries and data flow.
4. `docs/API_CONTRACT.md` — public request, response, and error contracts.
5. `docs/COPY.md` — bilingual UI and Digital Twin copy.
6. `docs/DESIGN_DIRECTION.md` — approved approximate UX, visual hierarchy, and presentation states.
7. `docs/IMPLEMENTATION_PLAN.md` — ordered implementation checkpoints.
8. `n8n/README.md` — workflow and Google Sheets requirements.

If two documents conflict, `docs/TECHNICAL_SPEC.md` wins. Record any approved change in both the specification and `docs/DECISIONS.md`.

## Non-negotiable MVP decisions

- The product is a separate Next.js application with reusable components.
- The primary route is `/playground`.
- Use TypeScript strict mode.
- Support English and Ukrainian; English is the default.
- Topics are limited to `ai_automation`, `api_integrations`, and `workflow_optimization`.
- Show a verified replay after the backend finishes. Do not implement or imply live streaming in the MVP.
- Google Sheets is the only MVP state/audit store for attempts and `run_id` records.
- Allow four executed runs per `session_id`; reject the fifth run.
- Keep `processing_time_ms` and `total_time_ms` as separate measurements.
- LLM and Telegram work should run in parallel after the attempt is determined and claimed.
- A `processing` row must claim `run_id` before LLM and Telegram side effects; the same row is finalized afterward.
- Preserve partial success. One failed integration must not hide successful integrations.
- Telegram success means accepted by the Telegram API, never read by Kristian.
- Do not expose Telegram `chat.id`, raw provider errors, credentials, or secret headers to the browser.
- Respect reduced-motion preferences and keyboard accessibility.
- Do not use `dangerouslySetInnerHTML` for LLM output.
- The 1.5-second target is an optimization goal, not a fabricated SLA.

## Scope discipline

Do not add authentication, a recruiter account, WebSockets, SSE, Redis, another database, analytics dashboards, external company research, or unrelated portfolio sections without explicit approval.

Do not silently replace Google Sheets with a different store. Its concurrency limitations are accepted for the MVP and must remain documented.

Do not change the four-run limit, supported locales, topics, or response schema without updating the specification and receiving approval.

## Implementation workflow

When implementation is authorized:

1. Confirm the current phase in `docs/IMPLEMENTATION_PLAN.md`.
2. Inspect the existing working tree and preserve user changes.
3. Build mock-first: UI and response handling must work without production credentials.
4. Define shared TypeScript types before wiring the real API.
5. Add the Next.js gateway and its tests.
6. Build and export the n8n workflow only after the contract is stable.
7. Connect real services last.
8. Verify happy path, partial failures, attempt 1–4, blocked attempt 5, timeout, duplicate `run_id`, EN/UA, mobile, and reduced motion.
9. Do not deploy or create external accounts/resources unless explicitly requested.

## Code quality

- Prefer small, typed modules and explicit state transitions.
- Keep localization strings outside React components.
- Validate all API input with a shared schema.
- Treat browser-generated IDs as untrusted correlation values.
- Use stable error codes; keep provider-specific messages server-side.
- Keep replay timing separate from measured backend timing.
- Generate UI states from the response contract rather than ad hoc booleans.
- Never fabricate a successful node state.
- Store secrets only in environment variables or n8n credentials.
- Keep the n8n export free of credentials and personal identifiers.

## Verification gates

Before calling a phase complete:

- Type checking passes.
- Relevant automated tests pass.
- The changed flow has been exercised through the user-visible UI where possible.
- EN and UA dictionaries contain the same keys.
- Mobile and keyboard behavior have been checked.
- No secret or Telegram chat ID appears in client output, committed files, or workflow exports.
- Documentation reflects any approved contract or architecture change.

## Required handoff

At the end of each implementation phase, report:

- what was completed;
- which verification ran;
- known limitations;
- any credentials, assets, or decisions required from the user;
- the exact next phase.

