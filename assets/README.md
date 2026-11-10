# Assets and access checklist

Do not place credentials in this folder. This file records what will be needed before real integration and production release.

## Brand and content

| Item | Status | Notes |
|---|---|---|
| Display name | Pending confirmation | Current working name: `Kristian` |
| Professional positioning | Pending | One concise line for the hero and metadata |
| Avatar/photo | Pending | Prefer a square source image with permission to publish |
| Contact CTA label | Pending | Example: `Contact Kristian` |
| Contact CTA URL | Pending | LinkedIn, email link, or another approved channel |
| GitHub profile/repository link | Pending | Optional but useful for portfolio proof |
| Page metadata description | Pending | Can be derived after positioning is approved |
| UX storyboard | Concept approved | `design-direction-storyboard-v1.png`; reference only, not a production screenshot or final avatar asset |

If implementation starts before the photo is available, use a neutral initials-based placeholder. Do not generate a realistic portrait of Kristian without a supplied reference and explicit request.

## Accounts and infrastructure

| Service | Required item | Store it in |
|---|---|---|
| GitHub | Repository access | GitHub account/connector, never a committed token |
| Vercel | Project access | Vercel project settings |
| n8n | Instance and production webhook | n8n environment |
| OpenRouter | API key | n8n credentials |
| OpenRouter | Model ID | n8n configuration |
| Telegram | Bot token | n8n credentials |
| Telegram | Private chat ID | n8n credentials only |
| Google Sheets | Spreadsheet | Private Google Drive file |
| Google Sheets | Service/OAuth credential | n8n credentials |
| Next.js | n8n URL and shared secret | Vercel server environment variables |

## Environment separation

Before using real services, decide whether development and production use separate:

- Google Sheets documents;
- Telegram destinations;
- n8n workflows/webhooks;
- Vercel environment variables.

Recommended minimum:

- development Sheet separate from production;
- development Telegram chat or visibly prefixed development messages;
- distinct n8n webhook URLs;
- separate preview and production environment values in Vercel.

## Safe handoff

The user should configure secrets directly in the relevant service or environment. Documentation and chat handoffs should reference variable names, not secret values.

