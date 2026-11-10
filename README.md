# Interactive Workflow Playground

Interactive Workflow Playground is a planned bilingual CV portfolio experience for Kristian. A recruiter will enter a name, optionally add a company, choose a topic, and run a real workflow that uses n8n, an LLM, Google Sheets, and Telegram.

## Current status

**Planning package and approximate UX direction complete. Application implementation has not started.**

This folder is the future project root. It contains the approved MVP specification, architecture, API contract, bilingual copy, landing-first design direction, implementation plan, n8n instructions, and project-level agent instructions.

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

## Expected project structure after implementation

```text
interactive-workflow-playground/
├── AGENTS.md
├── README.md
├── .env.example
├── app/
│   ├── api/execute/route.ts
│   ├── playground/page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
├── lib/
├── types/
├── public/
├── docs/
├── n8n/
│   ├── README.md
│   └── workflow.json
└── tests/
```

## Secrets

Do not place real secrets in this repository. Use `.env.local`, Vercel environment variables, and n8n credentials. Never commit Telegram chat IDs, tokens, OpenRouter keys, Google credentials, or the shared n8n webhook secret.

## Next action

Implementation starts only after explicit approval. The first authorized phase should be a mock-first Next.js scaffold and bilingual UI, without production credentials or external writes.

