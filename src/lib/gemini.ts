import { GoogleGenerativeAI } from "@google/generative-ai";
import { normalizeAnalysis } from "./category-focus";
import type { AskResponse, DocumentAnalysis } from "./types";

const MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";
const FALLBACK_MODELS = [
  "gemini-3.6-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
];

function getClient() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY is missing. Add it to .env.local");
  }
  return new GoogleGenerativeAI(key);
}

function extractJson<T>(text: string): T {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("Gemini did not return JSON");
  }
  return JSON.parse(cleaned.slice(start, end + 1)) as T;
}

async function generateWithFallback(
  content: Parameters<ReturnType<GoogleGenerativeAI["getGenerativeModel"]>["generateContent"]>[0],
  temperature: number,
  timeouts = { primary: 25_000, fallback: 10_000 }
) {
  const genAI = getClient();
  const models = [...new Set([MODEL, ...FALLBACK_MODELS])];
  let lastError: unknown;

  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel(
        {
          model: modelName,
          generationConfig: {
            temperature,
            responseMimeType: "application/json",
          },
        },
        { timeout: modelName === MODEL ? timeouts.primary : timeouts.fallback }
      );
      const result = await model.generateContent(content);
      return result.response.text();
    } catch (error) {
      lastError = error;
      const message = error instanceof Error ? error.message : "";
      const retryable =
        message.includes("503") ||
        message.includes("429") ||
        message.includes("404") ||
        message.toLowerCase().includes("high demand") ||
        message.toLowerCase().includes("timed out") ||
        message.toLowerCase().includes("aborted");
      if (!retryable) break;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Gemini is temporarily unavailable");
}

const ANALYZE_PROMPT = `You are Sahaj — a production-grade document intelligence system for Indian families.
You ONLY treat everyday household / civic paperwork as primary: utility bills, school notices, insurance, loans, tax, property, medical papers, government forms and official notices.

Analyze carefully. Extract only what is visible. Never invent amounts or dates.

If the upload is a selfie, meme, random photo, chat screenshot, food, landscape, product packaging, blank page, or anything that is NOT household/civic paperwork:
- set isEverydayDocument=false
- set documentKind="not_a_document"
- set category="not_a_document"
- set confidence <= 0.35
- set scamScore=0 unless it is phishing bait
- leave amounts/importantDates empty unless printed on a real notice
- put a clear rejectionHint
- still return honest summaries explaining what the image appears to be

categoryFocus MUST change by category — do not reuse the same panel titles for every document:
- utility_bill: payment desk (amount due, due date, consumer ID checks)
- school_notice: parent desk (deadline, fee, what child needs)
- insurance: policy/claim desk
- loan_finance: EMI / recovery caution desk
- government: civic form desk
- medical: care paperwork desk
- tax: compliance desk
- property: property caution desk
- not_a_document: rejection desk

Return ONLY valid JSON with this exact shape:
{
  "documentType": "specific type e.g. Electricity bill / CBSE circular / Selfie photo",
  "category": "utility_bill|school_notice|insurance|loan_finance|government|medical|tax|property|other|not_a_document",
  "documentKind": "everyday_paperwork|not_a_document|unclear",
  "isEverydayDocument": true,
  "rejectionHint": "only when not everyday paperwork",
  "title": "short human title",
  "summarySimple": "2-4 sentences plain English",
  "summaryHindi": "same in simple Hindi Devanagari",
  "summaryElder": "very slow, respectful explanation for a grandparent, English",
  "eli5": "one short paragraph as if explaining to a curious 10-year-old",
  "parties": ["issuer", "recipient if visible"],
  "amounts": [{"label":"","value":"₹…","note":"optional context"}],
  "importantDates": [{"label":"","date":"as written","urgency":"low|medium|high"}],
  "actionChecklist": [{"step":"clear next action","deadline":"optional","priority":"low|medium|high","doneHint":"how they know it's done"}],
  "documentsNeeded": ["papers they may need"],
  "riskFlags": [{"level":"info|warning|danger","message":""}],
  "scamScore": 0,
  "consumerTips": ["India-relevant tips for THIS category only"],
  "familyWhoShouldKnow": ["who in a typical family should see this"],
  "keyQuotes": ["short exact phrases copied from the document if readable"],
  "glossary": [{"term":"jargon from doc","meaning":"plain meaning"}],
  "confidence": 0.0,
  "whatHappensIfIgnored": "practical consequence if they do nothing",
  "categoryFocus": {
    "headline": "category-specific desk title",
    "metrics": [{"label":"","value":"","hint":"optional"}],
    "panels": [{"title":"category-specific panel","items":["..."]}],
    "primaryAction": "one main next step for this category"
  },
  "legalGuidance": {
    "isLegalOrOfficial": false,
    "documentNature": "plain description of document nature",
    "obligations": ["actions explicitly required; empty if none"],
    "rightsOrOptions": ["options explicitly stated; do not invent rights"],
    "escalationSteps": ["safe practical escalation"],
    "officialHelp": ["authority or professional category; never fabricate phone numbers/URLs unless printed"],
    "urgencyReason": "why this is or is not time-sensitive"
  }
}

scamScore: 0-100. Higher if pressure tactics, unusual payment asks, spoofed logos, typos, urgency without official channel.
For legalGuidance: document education, not legal advice. Never invent legal rights or remedies.`;

export async function analyzeDocument(
  base64: string,
  mimeType: string
): Promise<DocumentAnalysis> {
  const text = await generateWithFallback([
    { text: ANALYZE_PROMPT },
    { inlineData: { data: base64, mimeType } },
  ], 0.15, { primary: 55_000, fallback: 25_000 });

  return normalizeAnalysis(extractJson<DocumentAnalysis>(text));
}

export async function askAboutDocument(
  analysis: DocumentAnalysis,
  question: string
): Promise<AskResponse> {
  const prompt = `You are Sahaj, a careful document copilot for Indian families.
Answer ONLY from the analysis JSON. If unknown, say you cannot confirm from this document.
Suggest 2 short follow-up questions the user might ask next.

Analysis:
${JSON.stringify(analysis, null, 2)}

Question: ${question}

Return ONLY JSON:
{
  "answer": "plain English, concrete",
  "answerHindi": "simple Hindi",
  "citations": ["fields used"],
  "followUps": ["q1","q2"]
}`;

  const text = await generateWithFallback(prompt, 0.25);
  return {
    ...extractJson<AskResponse>(text),
    mode: "gemini",
  };
}
