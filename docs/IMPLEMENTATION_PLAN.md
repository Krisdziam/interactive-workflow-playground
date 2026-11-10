# Implementation plan

The implementation is intentionally split into gated phases. Do not begin a later phase until the previous phase has a verified outcome.

## Current state

- [x] Product analysis complete.
- [x] MVP decisions approved.
- [x] Technical specification v1.2 prepared.
- [x] Project folder and implementation instructions prepared.
- [x] Approximate UX and visual direction approved.
- [ ] Application scaffold authorized.

No framework, dependencies, source code, external accounts, or deployments exist in this folder yet.

## Phase 0 — prerequisites

### Inputs

- Approved documents in `docs/`.
- Approved interaction direction in `docs/DESIGN_DIRECTION.md`.
- Answers or placeholders from `assets/README.md`.

### Work

- Confirm whether the repository should be public or private.
- Confirm the final repository name.
- Confirm Kristian’s professional positioning and contact CTA.
- Confirm or provide an avatar/photo later.
- Confirm that real integrations will use development or production resources.

### Exit criteria

- No unresolved choice blocks the initial UI scaffold.
- Missing visual assets have an explicitly approved placeholder strategy.

## Phase 1 — mock-first Next.js scaffold

### Work

- Initialize Next.js with TypeScript strict mode and Tailwind CSS.
- Add `/playground`; make `/` redirect or link to it.
- Add EN/UA dictionaries from `COPY.md`.
- Add shared request/response/event types from `API_CONTRACT.md`.
- Add a mock response provider; do not require real credentials.
- Implement an explicit `ready -> submitting -> replay -> result` state model, plus validation, request-error, and session-limit states.
- Build a landing-first ready state with compact name/company/topic controls and one visually dominant CTA.
- Remove the pre-run controls from the main composition after submit and show only a neutral pending transition while the request is unresolved.
- Build the verified node replay from response events; preserve the parallel AI and Telegram branch.
- Build the avatar-led Digital Twin result with compact Telegram and Sheets proof, errors, limit banner, and contact CTA.
- Implement `session_id`, `run_id`, locale persistence, reduced motion, and mobile timeline.

### Verification

- Type check.
- Unit tests for schemas, dictionaries, session helpers, and replay ordering.
- Browser QA for EN, UA, desktop, mobile, keyboard, and reduced motion.
- Verify that unresolved requests never display a fabricated active or successful server node.
- Verify the ready, submitting, replay, result, retry, error, and session-limit transitions.
- Mock attempt 1–4 and blocked attempt 5.
- Mock all partial failure states.

### Exit criteria

- The complete user experience works against deterministic local mocks.
- No production credentials or external writes are needed.

## Phase 2 — Next.js API gateway

### Work

- Add `POST /api/execute`.
- Add strict request validation.
- Add body-size handling, timeout, safe error mapping, and total timing.
- Add the n8n secret header server-side.
- Add deployment/platform rate-limit integration or documented configuration.
- Preserve `run_id` on uncertain retry.

### Verification

- Unit tests for every status code in `API_CONTRACT.md`.
- Integration tests with a mocked n8n endpoint.
- Verify secrets cannot appear in client bundles or responses.

### Exit criteria

- Gateway behavior is contract-complete without requiring the real workflow.

## Phase 3 — n8n workflow

### Work

- Create development Sheet with the documented schema.
- Create webhook and verify the shared secret.
- Implement session lookup, duplicate detection, limit enforcement, attempt assignment, and processing-row claim.
- Implement OpenRouter and deterministic fallback.
- Implement Telegram notification.
- Run AI and Telegram branches in parallel.
- Finalize the claimed row and return verified events.
- Export a sanitized `n8n/workflow.json`.

### Verification

- Happy path.
- Attempts 1–4.
- Attempt 5 blocked before AI/Telegram.
- Duplicate completed `run_id`.
- Duplicate active `run_id`.
- Stale processing row.
- AI fallback.
- Telegram failure.
- Sheets read and finalization failures.
- No credentials in export.

### Exit criteria

- The workflow satisfies `n8n/README.md` and the API contract.

## Phase 4 — integration

### Work

- Connect the gateway to the development webhook.
- Replace mock mode with real mode behind configuration.
- Confirm localized prompts and UI output.
- Confirm real timestamps and both timing metrics.
- Verify idempotent retry after timeout simulation.

### Exit criteria

- Full real workflow works in EN and UA.
- Partial failures remain honest and usable.

## Phase 5 — production readiness

### Work

- Complete content and assets.
- Configure Vercel environment variables.
- Configure production n8n webhook and credentials.
- Configure rate limiting.
- Add retention cleanup or a documented manual cleanup procedure.
- Run responsive, accessibility, security, and performance QA.
- Review n8n and Git history for secrets.

### Exit criteria

- Every acceptance criterion in `TECHNICAL_SPEC.md` passes.
- Production resources are isolated from development where required.
- README includes verified local development commands.

## Phase 6 — deployment

Deployment requires explicit user authorization.

### Work

- Create or connect the GitHub repository.
- Deploy to Vercel.
- Run a production smoke test.
- Record the public URL and deployment configuration.

### Exit criteria

- Public URL works.
- Real Telegram proof and Sheet logging are confirmed.
- No secret is exposed.

