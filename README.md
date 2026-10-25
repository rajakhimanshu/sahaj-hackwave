# Sahaj

**Document intelligence for Indian families** — bills, school notices, insurance, loans, and government forms explained in plain English & Hindi.

Hack Wave · Themes: **Civic · Family · Education** · Powered by **Google Gemini** (multimodal)

## Platform

| Surface | URL |
|---|---|
| Marketing site | `/` |
| Workspace | `/app` |
| Family vault | `/app/vault` |

### Capabilities

- Gemini vision analysis → structured brief  
- Bilingual summary + **Elder** + **ELI5** modes  
- Scam / pressure score  
- Action checklist with priorities  
- Glossary, key quotes, consumer tips  
- Family “who should know”  
- Rights & escalation guide for legal/civic documents (not legal advice)
- Grounded **Ask Sahaj** with follow-ups  
- Device vault, download brief, print  

## Local setup

```bash
cp .env.example .env.local
# GEMINI_API_KEY=...
npm install
npm run dev
```

Open http://localhost:3000

## AWS deploy (EC2 + Docker)

```bash
docker compose up -d --build
```

Set `GEMINI_API_KEY` in the environment / `.env` on the instance.

## Vercel frontend + AWS API

The same build supports a split deployment without browser CORS:

1. Deploy the Docker image on AWS (EC2/App Runner) with `GEMINI_API_KEY`.
2. Deploy the repository on Vercel.
3. Set `AWS_API_ORIGIN=https://your-aws-api-domain` on Vercel.
4. Vercel proxies `/api/*` server-side to AWS; the browser keeps a same-origin URL.

Without `AWS_API_ORIGIN`, local development and single-host deployments use the
built-in Next.js route handlers.

## Stack

Next.js · TypeScript · Tailwind · Google Gemini · Docker  
