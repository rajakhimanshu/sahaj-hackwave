import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AskResponse, DocumentAnalysis } from "./types";

const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";
const FALLBACK_MODELS = ["gemini-2.5-flash", "gemini-3.8-flash"];

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
You read everyday documents: utility bills, school notices, insurance, loans, tax, property, medical, government forms.

Analyze the uploaded document carefully. Extract only what is visible. Never invent amounts or dates.

Return ONLY valid JSON with this exact shape:
{
  "documentType": "specific type e.g. Electricity bill / CBSE circular",
  "category": "utility_bill|school_notice|insurance|loan_finance|government|medical|tax|property|other",
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
  "consumerTips": ["India-relevant consumer/citizen tips for this doc type"],
  "familyWhoShouldKnow": ["who in a typical family should see this"],
  "keyQuotes": ["short exact phrases copied from the document if readable"],
  "glossary": [{"term":"jargon from doc","meaning":"plain meaning"}],
  "confidence": 0.0,
  "whatHappensIfIgnored": "practical consequence if they do nothing",
  "legalGuidance": {
    "isLegalOrOfficial": false,
    "documentNature": "plain description of whether this is a contract, demand, notice, policy, form, court/government communication, or ordinary document",
    "obligations": ["actions the document explicitly requires; empty if none"],
    "rightsOrOptions": ["options explicitly stated in the document; do not invent legal rights"],
    "escalationSteps": ["safe practical escalation, e.g. verify issuer, contact official grievance channel, consult a qualified professional"],
    "officialHelp": ["official authority or professional category to contact; never fabricate phone numbers or URLs"],
    "urgencyReason": "why this is or is not time-sensitive"
  }
}

scamScore: 0-100. Higher if pressure tactics, unusual payment asks, spoofed logos, typos, urgency without official channel.
For legalGuidance:
- This is document education, not legal advice.
- Distinguish text visible in the document from general practical guidance.
- Never claim a legal right, deadline, penalty, or remedy unless visible in the document.
- Recommend a qualified lawyer or official authority for court notices, eviction, arrest, large financial exposure, or unclear legal consequences.
If image is not a document, still return JSON with low confidence and explain in summaries.`;

export async function analyzeDocument(
  base64: string,
  mimeType: string
): Promise<DocumentAnalysis> {
  const text = await generateWithFallback([
    { text: ANALYZE_PROMPT },
    { inlineData: { data: base64, mimeType } },
  ], 0.15, { primary: 30_000, fallback: 12_000 });

  return extractJson<DocumentAnalysis>(text);
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
