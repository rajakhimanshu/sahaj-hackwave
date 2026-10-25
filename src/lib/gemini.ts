import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AskResponse, DocumentAnalysis } from "./types";

const MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

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

const ANALYZE_PROMPT = `You are Sahaj — an assistant that helps Indian families understand everyday documents
(bills, school notices, insurance letters, loan papers, subsidy forms, government notices).

Analyze the uploaded document image/PDF page carefully.

Return ONLY valid JSON with this exact shape:
{
  "documentType": "string",
  "title": "string",
  "summarySimple": "2-4 sentences in plain English a 12-year-old can understand",
  "summaryHindi": "same meaning in simple Hindi (Devanagari)",
  "parties": ["who is involved"],
  "amounts": [{"label":"string","value":"string with currency if any"}],
  "importantDates": [{"label":"string","date":"string","urgency":"low|medium|high"}],
  "actionChecklist": [{"step":"clear action","deadline":"optional","priority":"low|medium|high"}],
  "documentsNeeded": ["any papers user may need"],
  "riskFlags": [{"level":"info|warning|danger","message":"scam/risk/missed deadline notes"}],
  "confidence": 0.0
}

Rules:
- If text is unclear, lower confidence and say so in summary.
- Prefer action checklist over long prose.
- Flag urgency for payment/reply deadlines.
- Never invent amounts or dates not visible in the document.
- If not a document, still return JSON explaining that.`;

export async function analyzeDocument(
  base64: string,
  mimeType: string
): Promise<DocumentAnalysis> {
  const genAI = getClient();
  const model = genAI.getGenerativeModel({
    model: MODEL,
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json",
    },
  });

  const result = await model.generateContent([
    { text: ANALYZE_PROMPT },
    {
      inlineData: {
        data: base64,
        mimeType,
      },
    },
  ]);

  const text = result.response.text();
  return extractJson<DocumentAnalysis>(text);
}

export async function askAboutDocument(
  analysis: DocumentAnalysis,
  question: string
): Promise<AskResponse> {
  const genAI = getClient();
  const model = genAI.getGenerativeModel({
    model: MODEL,
    generationConfig: {
      temperature: 0.3,
      responseMimeType: "application/json",
    },
  });

  const prompt = `You are Sahaj. Answer ONLY using the document analysis JSON below.
If the answer is not in the analysis, say you cannot confirm from this document.

Document analysis:
${JSON.stringify(analysis, null, 2)}

User question: ${question}

Return ONLY JSON:
{
  "answer": "plain English",
  "answerHindi": "simple Hindi",
  "citations": ["which fields from the analysis you used"]
}`;

  const result = await model.generateContent(prompt);
  return extractJson<AskResponse>(result.response.text());
}
