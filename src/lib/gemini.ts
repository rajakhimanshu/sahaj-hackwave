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
  "whatHappensIfIgnored": "practical consequence if they do nothing"
}

scamScore: 0-100. Higher if pressure tactics, unusual payment asks, spoofed logos, typos, urgency without official channel.
If image is not a document, still return JSON with low confidence and explain in summaries.`;

export async function analyzeDocument(
  base64: string,
  mimeType: string
): Promise<DocumentAnalysis> {
  const genAI = getClient();
  const model = genAI.getGenerativeModel({
    model: MODEL,
    generationConfig: {
      temperature: 0.15,
      responseMimeType: "application/json",
    },
  });

  const result = await model.generateContent([
    { text: ANALYZE_PROMPT },
    { inlineData: { data: base64, mimeType } },
  ]);

  return extractJson<DocumentAnalysis>(result.response.text());
}

export async function askAboutDocument(
  analysis: DocumentAnalysis,
  question: string
): Promise<AskResponse> {
  const genAI = getClient();
  const model = genAI.getGenerativeModel({
    model: MODEL,
    generationConfig: {
      temperature: 0.25,
      responseMimeType: "application/json",
    },
  });

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

  const result = await model.generateContent(prompt);
  return extractJson<AskResponse>(result.response.text());
}
