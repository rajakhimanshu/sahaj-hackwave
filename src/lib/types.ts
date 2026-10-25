export type DocumentAnalysis = {
  documentType: string;
  title: string;
  summarySimple: string;
  summaryHindi: string;
  parties: string[];
  amounts: { label: string; value: string }[];
  importantDates: { label: string; date: string; urgency: "low" | "medium" | "high" }[];
  actionChecklist: { step: string; deadline?: string; priority: "low" | "medium" | "high" }[];
  documentsNeeded: string[];
  riskFlags: { level: "info" | "warning" | "danger"; message: string }[];
  confidence: number;
};

export type AskResponse = {
  answer: string;
  answerHindi: string;
  citations: string[];
};
