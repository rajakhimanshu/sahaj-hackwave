import { GoogleGenerativeAI } from "@google/generative-ai";
import { normalizeAnalysis } from "./category-focus";
import { isRetryableModelError } from "./errors";
import type { AskResponse, ChatTurn, DocumentAnalysis } from "./types";

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
  content: Parameters<
    ReturnType<GoogleGenerativeAI["getGenerativeModel"]>["generateContent"]
  >[0],
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
      if (!isRetryableModelError(message)) break;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Gemini is temporarily unavailable");
}

const ANALYZE_PROMPT = `You are Sahaj — a production document intelligence system for Indian families.
You help with document understanding, summaries, and civic/legal literacy education (NOT legal advice).

CRITICAL: Output MUST be category-specific. An ID card must NEVER look like a bill brief. A court/legal notice must NEVER look like a utility payment desk.

Categories (pick exactly one):
utility_bill | school_notice | insurance | loan_finance | government | legal_notice | id_kyc | medical | tax | property | other | not_a_document

Category rules:
- utility_bill: amounts due, due dates, consumer/RR numbers, payment channels
- school_notice: parent actions, fees, deadlines, what child needs
- insurance: policy/claim language, premium, insurer
- loan_finance: EMI, recovery caution, lender verification
- government: forms/certificates/enrolment (non-ID blank forms)
- legal_notice: lawyer letters, court/police notices, eviction, demand notices with legal tone — emphasize escalation + "not legal advice"
- id_kyc: Aadhaar/PAN/Voter/Passport/Driving licence cards or photocopies — privacy desk; NEVER invent payment amounts; warn about sharing; do not treat as a bill
- medical: prescriptions/reports
- tax: notices/challans
- property: rent/sale/lease papers
- not_a_document: selfies, memes, food, random photos, chat screenshots

If not everyday paperwork:
- isEverydayDocument=false, documentKind="not_a_document", category="not_a_document"
- confidence <= 0.35, empty amounts/dates unless literally printed on a notice

categoryFocus MUST differ by category (different headline + panels). Never reuse bill panels for ID or legal notices.

Provide summaries in:
English (summarySimple), Hindi (summaryHindi), Marathi (summaryMarathi), Tamil (summaryTamil), Bengali (summaryBengali), Gujarati (summaryGujarati), Elder English (summaryElder), ELI5 (eli5).

Extract only what is visible. Never invent amounts, IDs, or dates.

Return ONLY valid JSON:
{
  "documentType": "specific visible type",
  "category": "utility_bill|school_notice|insurance|loan_finance|government|legal_notice|id_kyc|medical|tax|property|other|not_a_document",
  "documentKind": "everyday_paperwork|not_a_document|unclear",
  "isEverydayDocument": true,
  "rejectionHint": "only when not everyday paperwork",
  "title": "short human title",
  "summarySimple": "2-4 sentences English",
  "summaryHindi": "simple Hindi Devanagari",
  "summaryMarathi": "simple Marathi Devanagari",
  "summaryTamil": "simple Tamil",
  "summaryBengali": "simple Bengali",
  "summaryGujarati": "simple Gujarati",
  "summaryElder": "slow respectful English for elders",
  "eli5": "simple explanation for a child",
  "parties": ["issuer", "recipient if visible"],
  "amounts": [{"label":"","value":"₹…","note":"optional"}],
  "importantDates": [{"label":"","date":"as written","urgency":"low|medium|high"}],
  "actionChecklist": [{"step":"","deadline":"optional","priority":"low|medium|high","doneHint":""}],
  "documentsNeeded": [],
  "riskFlags": [{"level":"info|warning|danger","message":""}],
  "scamScore": 0,
  "consumerTips": ["category-specific tips only"],
  "familyWhoShouldKnow": [],
  "keyQuotes": [],
  "glossary": [{"term":"","meaning":""}],
  "confidence": 0.0,
  "whatHappensIfIgnored": "",
  "categoryFocus": {
    "headline": "desk title for THIS category",
    "metrics": [{"label":"","value":"","hint":"optional"}],
    "panels": [{"title":"","items":[""]}],
    "primaryAction": ""
  },
  "legalGuidance": {
    "isLegalOrOfficial": false,
    "documentNature": "",
    "obligations": [],
    "rightsOrOptions": [],
    "escalationSteps": [],
    "officialHelp": [],
    "urgencyReason": ""
  }
}

For id_kyc: leave amounts empty unless a fee is printed; focus privacy, verification, official update channels.
For legal_notice: prioritize obligations/options/escalation; never invent remedies.
scamScore 0-100 for pressure tactics / fake payment asks.`;

export async function analyzeDocument(
  base64: string,
  mimeType: string
): Promise<DocumentAnalysis> {
  const text = await generateWithFallback(
    [{ text: ANALYZE_PROMPT }, { inlineData: { data: base64, mimeType } }],
    0.15,
    { primary: 55_000, fallback: 25_000 }
  );

  return normalizeAnalysis(extractJson<DocumentAnalysis>(text));
}

export async function askAboutDocument(
  analysis: DocumentAnalysis,
  question: string,
  history: ChatTurn[] = []
): Promise<AskResponse> {
  const prompt = `You are Sahaj chatbot — a careful document understanding copilot for Indian families.
Answer ONLY from the analysis JSON and prior chat turns. If unknown, say you cannot confirm from this document.
Match the answer style to the document category (ID privacy vs bill payment vs legal notice).
Never invent amounts, legal rights, or ID numbers.
Suggest 2 short follow-ups.

Analysis:
${JSON.stringify(analysis, null, 2)}

Recent chat:
${JSON.stringify(history.slice(-6), null, 2)}

Question: ${question}

Return ONLY JSON:
{
  "answer": "plain English, concrete",
  "answerHindi": "simple Hindi",
  "answerMarathi": "simple Marathi",
  "citations": ["fields used"],
  "followUps": ["q1","q2"]
}`;

  const text = await generateWithFallback(prompt, 0.25);
  return {
    ...extractJson<AskResponse>(text),
    mode: "gemini",
  };
}
