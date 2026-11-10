# Interactive Workflow Playground

Interactive Workflow Playground is a bilingual CV portfolio experience for Kristian. A recruiter enters a name, optionally adds a company, chooses a topic, and watches a verified replay of a workflow built around n8n, an LLM, Google Sheets, and Telegram.

## Current status

**Phase 1 complete: the mock-first Next.js experience works locally and as a public static preview without production credentials or external writes.**

The repository now contains the approved planning package plus a strict TypeScript, Tailwind CSS, and Next.js implementation of the complete frontend flow. The Next.js gateway and real integrations remain intentionally out of scope until Phase 2 and later phases are authorized.

Public mock preview: [krisdziam.github.io/interactive-workflow-playground](https://krisdziam.github.io/interactive-workflow-playground/)

The GitHub Pages preview runs deterministic browser-side mock scenarios. It does not call n8n, an LLM, Google Sheets, Telegram, or any production service.

## Start here

Read documents in this order:

1. [Project instructions](AGENTS.md)
2. [Technical specification](docs/TECHNICAL_SPEC.md)
3. [Accepted decisions](docs/DECISIONS.md)
4. [Architecture](docs/ARCHITECTURE.md)
5. [API contract](docs/API_CONTRACT.md)
6. [Bilingual copy](docs/COPY.md)
7. [Design direction](docs/DESIGN_DIRECTION.md)
8. [Implementation plan](docs/IMPLEMENTATION_PLAN.md)
9. [n8n workflow instructions](n8n/README.md)
10. [Assets and access checklist](assets/README.md)

## Agreed MVP

- Separate Next.js application.
- `/playground` as the primary experience.
- English and Ukrainian UI.
- Three topics: AI Automation, API Integrations, Workflow Optimization.
- Landing-first progressive experience: dominant CTA, neutral pending transition, verified replay, and avatar-led result.
- Verified execution replay after the server response.
- Four runs per browser session.
- Google Sheets for attempts, idempotency records, and audit history.
- OpenRouter / Gemini for the Digital Twin response.
- Real Telegram Bot notification.
- Partial-success handling and deterministic AI fallback.
- Vercel deployment after implementation and verification.

GitHub Pages is used only for the Phase 1 static mock preview. The contract-complete application with server-side integrations will still require Vercel or another compatible Next.js runtime.

## Local development

Requirements: Node.js 20.9 or newer and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000/playground](http://localhost:3000/playground). The root route redirects to `/playground` in the local/server build.

On GitHub Pages, the repository base URL renders the same experience directly so the temporary preview works without a server-side redirect.

Useful verification commands:

```bash
npm run typecheck
npm test
npm run lint
npm run build
```

The production build uses webpack explicitly because the local sandbox does not permit Turbopack's internal port binding.

## Mock behavior

The default deterministic sequence demonstrates the honest partial-success states without external services:

| Attempt | Mock outcome |
|---:|---|
| 1 | Full success |
| 2 | AI fallback; Telegram and Sheets succeed |
| 3 | Telegram failure; AI and Sheets succeed |
| 4 | Sheets finalization failure; AI and Telegram succeed |
| 5 | Blocked before execution |

The same browser tab keeps its `session_id`, attempt ledger, and any uncertain pending `run_id` in `sessionStorage`. Locale is shared through `localStorage`. A timeout retry reuses its pending `run_id`.

Focused QA scenarios are available through `/playground?scenario=<value>`:

- `success`
- `ai-fallback`
- `telegram-error`
- `sheets-error`
- `attempt-unavailable`
- `timeout-once`
- `unavailable-once`
- `processing-once`
- `state-unknown`

Append `&motion=reduce` to exercise the immediate replay summary used for reduced-motion QA. The real `prefers-reduced-motion` browser preference is also respected.

## Project structure

```text
interactive-workflow-playground/
├── AGENTS.md
├── README.md
├── .env.example
├── .github/workflows/deploy-pages.yml
├── app/
│   ├── playground/page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/playground/
├── lib/
│   ├── i18n/
│   ├── mock/
│   ├── replay/
│   ├── session/
│   ├── state/
│   └── validation/
├── types/workflow.ts
├── docs/
├── n8n/
│   └── README.md
└── tests/
```

`app/api/execute/route.ts` and `n8n/workflow.json` are intentionally absent in Phase 1.

## Secrets

Do not place real secrets in this repository. Use `.env.local`, Vercel environment variables, and n8n credentials. Never commit Telegram chat IDs, tokens, OpenRouter keys, Google credentials, or the shared n8n webhook secret.

## Next authorized phase

Phase 2 — implement the contract-complete `POST /api/execute` gateway against a mocked n8n endpoint. The static GitHub Pages mock preview is authorized; do not connect production credentials, create other external resources, build the n8n workflow, or perform the production deployment without the separately gated authorization described in `docs/IMPLEMENTATION_PLAN.md`.

