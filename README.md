# Sahaj

**Understand any Indian document in seconds** — bills, school notices, insurance letters, loan papers, government forms.

Hack Wave project · Themes: **Civic + Family + Education** · Powered by **Google Gemini** (multimodal)

## What it does

1. Upload a document photo or PDF  
2. Gemini Vision extracts meaning, amounts, dates, risks  
3. Explains in **plain English + Hindi**  
4. Gives an **action checklist**  
5. **Ask Sahaj** — grounded Q&A on that document only  

## Local setup

```bash
cp .env.example .env.local
# paste GEMINI_API_KEY into .env.local
npm install
npm run dev
```

Open http://localhost:3000

## AWS deploy (EC2 + Docker)

1. Launch Ubuntu EC2 in `ap-south-1` (t3.small+), open ports **22** and **80**  
2. SSH in, install Docker + Compose  
3. Clone repo, create `.env` with `GEMINI_API_KEY`  
4. Run:

```bash
docker compose up -d --build
```

App is live at `http://<EC2-PUBLIC-IP>`

## Stack

- Next.js · TypeScript · Tailwind  
- Google Gemini API (`@google/generative-ai`)  
- Docker on AWS EC2  
