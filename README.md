# Sahaj

**Document intelligence for Indian families** — bills, school notices, insurance, loans, and government forms explained in plain English & Hindi.

Hack Wave · Themes: **Civic · Family · Education · FinTech hygiene** · Powered by **Google Gemini** (multimodal)

## Live

| Surface | URL |
|---|---|
| Production | https://sahaj-hackwave.vercel.app |
| Demo brief | https://sahaj-hackwave.vercel.app/app?demo=1 |
| Features map | https://sahaj-hackwave.vercel.app/features |
| About | https://sahaj-hackwave.vercel.app/about |
| GitHub | https://github.com/rajakhimanshu/sahaj-hackwave |

## Platform routes

| Surface | Path |
|---|---|
| Marketing | `/` |
| Workspace | `/app` |
| Family vault | `/app/vault` |
| Local account | `/app/account` |
| Features | `/features` |
| Earn model | `/earn` |
| Privacy / Security / Terms | `/privacy` `/security` `/terms` |

### Capabilities (judge demo)

- Gemini vision analysis → category-specific brief  
- Multilingual summary: English · Hindi · Marathi · Tamil · Bengali · Gujarati · Elder · ELI5  
- **Voice read-aloud** on the selected summary  
- **WhatsApp family share** (message / copy / PNG card; ID docs = checklist only)  
- **Bill compare** month-vs-month vs vault (demo baseline on sample electricity bill)  
- Category desks (bill ≠ ID ≠ legal ≠ school)  
- Scam / pressure score + action checklist  
- Grounded **Ask Sahaj** chatbot (no invented amounts)  
- Rights & escalation guide (document education — not legal advice)  
- Device vault + optional local PIN profile  
- PDF / TXT export · print  
- Transparent ads / earn model (does not sell vault contents)

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

Hack Wave split deploy uses a named container on EC2 (`sahaj-hackwave`) behind a Cloudflare quick tunnel; Kapsee services on the same host are left untouched.

## Vercel frontend + AWS API

1. Deploy the Docker image on AWS (EC2) with `GEMINI_API_KEY`.
2. Deploy the repository on Vercel.
3. Set `AWS_API_ORIGIN=https://your-aws-api-domain` on Vercel.
4. Vercel proxies `/api/*` server-side to AWS; the browser keeps a same-origin URL.

Without `AWS_API_ORIGIN`, local development and single-host deployments use the
built-in Next.js route handlers.

## Stack

Next.js · TypeScript · Tailwind · Google Gemini · Docker · Vercel · AWS EC2
