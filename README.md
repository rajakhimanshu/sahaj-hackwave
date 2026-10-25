# Sahaj

**Paperwork, made sahaj.**

Document intelligence for Indian families — photograph a bill, school notice, insurance letter, loan paper, ID, or government form, and get a clear, multilingual family brief instead of fine print panic.

> Hack Wave · Themes: **Civic · Family · Education · FinTech hygiene**  
> Powered by **Google Gemini** multimodal · Built as a real product, not a chat toy.

---

## Live product

| Surface | URL |
|---|---|
| **Production** | https://sahaj-hackwave.vercel.app |
| **Judge demo brief** | https://sahaj-hackwave.vercel.app/app?demo=1 |
| Features map | https://sahaj-hackwave.vercel.app/features |
| About | https://sahaj-hackwave.vercel.app/about |
| Earn / revenue model | https://sahaj-hackwave.vercel.app/earn |
| Security & DPDP | https://sahaj-hackwave.vercel.app/security |
| GitHub | https://github.com/rajakhimanshu/sahaj-hackwave |

**60-second demo path:** open the judge demo → tap हिंदी → **Listen** → try WhatsApp share → check **Bill compare** → ask the chatbot “What is the amount due?” → **Save to vault**.

---

## The problem

Important paperwork in Indian homes still lives in one person’s head:

- Electricity / water bills with due dates buried in tables  
- School fee circulars that arrive the night before  
- Insurance, loan, and tax letters that feel “legal”  
- ID / KYC copies that get forwarded carelessly on WhatsApp  

Families need **clarity, next steps, and a shared memory** — without uploading their whole life to a cloud dossier.

---

## The product

Sahaj turns a photo or PDF into a **category-specific family brief**:

1. **Understand** — Gemini Vision reads the document  
2. **Explain** — plain language in the language your family actually uses  
3. **Act** — checklist, amounts, dates, scam pressure score  
4. **Share safely** — WhatsApp card / PNG / PDF (ID papers share checklist only)  
5. **Remember** — device-local vault + optional local PIN profile  

Sahaj provides **document education**, not legal advice. High-risk matters are pointed to official channels or qualified help.

---

## Who it’s for

| Persona | What Sahaj does for them |
|---|---|
| Household bill payer | Amount, due date, official pay path, month-vs-month compare |
| Parent | School notice → parent action plan + dates |
| Elder / low-literacy user | Elder mode + **voice read-aloud** |
| Family helper abroad / in another city | WhatsApp share card without forwarding raw ID photos |
| Civic / help-desk volunteer | Obligations, options, escalation, official help |

---

## Features (live)

### Document intelligence
- Multimodal Gemini analysis of images + PDFs (upload limit **8 MB**)  
- **Category desks** — bill ≠ school ≠ ID/KYC ≠ legal ≠ medical ≠ tax (different panels, not one template)  
- Structured brief: title, confidence, scam/pressure score, amounts, dates, glossary, quotes  
- Rejection path for random / non-document uploads (not treated as bills)

### Multilingual + accessibility
- Summaries: **English · हिंदी · मराठी · தமிழ் · বাংলা · ગુજરાતી · Elder · ELI5**  
- **Voice read-aloud** follows the selected language tab (browser SpeechSynthesis)  
- Large, calm UI for elders — listen instead of squinting at fine print

### Family share & compare
- **WhatsApp family share** — one-tap message, copy text, or download a **PNG share card**  
- ID / KYC path shares a **privacy checklist only** (never encourage forwarding full ID photos)  
- **Bill compare** — month-vs-month against vault history (demo baseline on the sample BESCOM bill)

### Grounded chatbot
- Multi-turn **Ask Sahaj** chat grounded in *this* brief  
- Refuses invented amounts / deadlines  
- Follow-up chips for common family questions  
- Fallback grounded answers when the model is overloaded

### Legal / civic layer
- Obligations · options · escalation · official help  
- Clear labeling: **education, not legal advice**  
- Trust pages: Privacy · Security (DPDP-minded) · Terms

### Vault, account, export
- **Device-local vault** (browser storage — no hackathon cloud dossier)  
- Optional **local PIN family profile** + guest mode  
- **PDF + TXT** family brief export · print  

### Revenue (transparent)
- Sponsored literacy / official pay tips fund the free core  
- We **do not sell vault document contents** for ads  
- See `/earn` for the full model (CSR, Family Plus, B2B desk license)

---

## Platform map

| Route | Purpose |
|---|---|
| `/` | Marketing landing — brand hero + full capability map |
| `/app` | Workspace — upload / camera / analyze |
| `/app?demo=1` | Instant judge demo (BESCOM electricity bill) |
| `/app/vault` | On-device family vault |
| `/app/account` | Local family profile (optional PIN) |
| `/features` | Feature map with LIVE tags |
| `/about` | Story + highlight grid |
| `/earn` | Revenue model |
| `/privacy` `/security` `/terms` | Trust & DPDP stance |

---

## Technical depth

### Architecture

```
Browser (Vercel frontend)
   │  same-origin /api/*
   ▼
Next.js rewrite (AWS_API_ORIGIN)
   │
   ▼
AWS EC2 Docker · Sahaj container
   │
   ▼
Google Gemini (multimodal) + model fallbacks
```

- **Frontend:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind 4  
- **Intelligence:** `@google/generative-ai` multimodal prompts → strict JSON brief  
- **Split deploy:** Vercel UI + AWS API (Gemini key stays on server)  
- **Proxy:** `AWS_API_ORIGIN` rewrites `/api/*` server-side — **no browser CORS**  
- **Container:** multi-stage Docker `standalone` Next.js image  
- **Isolation:** Sahaj runs beside Kapsee on the same host without touching Kapsee services  

### Reliability & safety engineering
- Model primary + fallbacks (Gemini 3.x family) for overloaded / retired IDs  
- Upload validation (type + size) and humanized API errors  
- Grounded chat fallback when Gemini is unavailable  
- Category-specific UI schemas (`categoryFocus`) so desks stay honest  
- ID-safe share text builder (no dumping full KYC payloads into WhatsApp)  
- Client-only vault / profile (`localStorage`) for DPDP-minded demo posture  

### Key modules

| Area | Location |
|---|---|
| Gemini analyze + ask | `src/lib/gemini.ts` |
| Category desks | `src/lib/category-focus.ts` |
| Grounded chat fallback | `src/lib/grounded-fallback.ts` |
| Voice | `src/lib/speech.ts` · `ReadAloud.tsx` |
| WhatsApp / PNG share | `src/lib/share-card.ts` · `ShareFamilyCard.tsx` |
| Bill compare | `src/lib/bill-compare.ts` · `BillCompare.tsx` |
| Vault / local profile | `src/lib/vault.ts` · `src/lib/local-profile.ts` |
| PDF export | `src/lib/export-report.ts` (jsPDF) |
| API routes | `src/app/api/analyze` · `src/app/api/ask` |

### Stack

Next.js · TypeScript · Tailwind · Google Gemini · jsPDF · Docker · Vercel · AWS EC2 · Cloudflare tunnel (API exposure)

---

## Privacy & trust (DPDP-minded)

- Vault + optional PIN profile stay **in the browser** for this hackathon build  
- Document bytes go to Gemini **only to build the requested brief**  
- Sponsored slots do not require selling document contents  
- Security page states the stance clearly for judges and families  
- Disclaimer everywhere it matters: **not a lawyer, not a court, not legal advice**

---

## Local development

```bash
cp .env.example .env.local
# GEMINI_API_KEY=your_key_from_https://aistudio.google.com/apikey

npm install
npm run dev
```

Open http://localhost:3000

```bash
npm run lint
npm run build
```

### Environment

| Variable | Where | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | Local + AWS | Required for analyze / ask |
| `GEMINI_MODEL` | Optional | Override default model |
| `AWS_API_ORIGIN` | Vercel only | Proxy `/api/*` to AWS (build-time for rewrites) |

---

## Deploy

### AWS (API / full Docker)

```bash
# on the instance, with GEMINI_API_KEY in .env
docker compose up -d --build
# or named container workflow used in Hack Wave (isolated from Kapsee)
```

### Vercel (frontend) + AWS API

1. Run Sahaj container on EC2 with `GEMINI_API_KEY`  
2. Expose a stable HTTPS origin (tunnel / domain)  
3. Deploy this repo on Vercel  
4. Set **build + runtime** `AWS_API_ORIGIN=https://your-aws-api`  
5. Browser keeps same-origin `/api/*`; Vercel proxies to AWS  

Without `AWS_API_ORIGIN`, a single-host deploy uses Next.js route handlers directly.

---

## Judge walkthrough (recommended)

1. **Landing** — brand hero + “Everything in the demo” capability map  
2. **Try the live demo** — BESCOM March bill  
3. **Bill compare** — month-vs-month delta  
4. **Family share** — WhatsApp / PNG  
5. **Voice** — Hindi tab → Listen  
6. **Chatbot** — grounded amount / due-date question  
7. **Vault** — save, reopen from `/app/vault`  
8. **Earn + Security** — revenue honesty + DPDP stance  
9. **Real upload** — one household photo (optional wow moment)

---

## What’s next (roadmap)

Near-term product depth:

- **Stable custom domain** for the AWS API (replace quick tunnel)  
- **Multi-device encrypted vault sync** (family devices, still user-owned keys)  
- **Deeper bill compare** — units, fixed charges, tariff line diffs  
- **School / loan / tax desks v2** — issuer-aware playbooks  
- **Offline-first PWA** for low-connectivity homes  
- **Regional voice packs** — higher-quality TTS for Indic languages  
- **NGO / RWA desk mode** — community counter licenses  
- **CSR partner portal** — sponsored literacy without data sale  
- **Audit log** for shared family profiles (who opened which brief)  
- **Human escalation handoff** — “call this official number” deep links  

Principles that don’t change:

- Free core for families  
- No selling vault contents  
- Document education ≠ legal advice  
- Category-honest UI (a bill is not an ID)

---

## Hack Wave fit

| Theme | How Sahaj maps |
|---|---|
| **Family** | Shared briefs, elder voice, WhatsApp-safe share |
| **Civic** | Notices, obligations, escalation, official help |
| **Education** | School desks + literacy-first language modes |
| **FinTech hygiene** | Bill compare, scam score, official-pay tips |

Built to feel like a **shippable consumer product**: landing, trust pages, workspace, vault, account, revenue story, and a deployable AWS + Vercel split.

---

## License / note

Hack Wave competition build. Gemini API usage is subject to Google’s terms.  
Sahaj explains documents — it does not replace a lawyer, utility office, or school admin.
