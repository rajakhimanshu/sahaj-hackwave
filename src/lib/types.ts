export type Urgency = "low" | "medium" | "high";
export type RiskLevel = "info" | "warning" | "danger";
export type Priority = "low" | "medium" | "high";

export type DocumentCategory =
  | "utility_bill"
  | "school_notice"
  | "insurance"
  | "loan_finance"
  | "government"
  | "medical"
  | "tax"
  | "property"
  | "other";

export type DocumentAnalysis = {
  documentType: string;
  category: DocumentCategory;
  title: string;
  summarySimple: string;
  summaryHindi: string;
  summaryElder: string;
  eli5: string;
  parties: string[];
  amounts: { label: string; value: string; note?: string }[];
  importantDates: { label: string; date: string; urgency: Urgency }[];
  actionChecklist: {
    step: string;
    deadline?: string;
    priority: Priority;
    doneHint?: string;
  }[];
  documentsNeeded: string[];
  riskFlags: { level: RiskLevel; message: string }[];
  scamScore: number;
  consumerTips: string[];
  familyWhoShouldKnow: string[];
  keyQuotes: string[];
  glossary: { term: string; meaning: string }[];
  confidence: number;
  whatHappensIfIgnored: string;
  legalGuidance?: {
    isLegalOrOfficial: boolean;
    documentNature: string;
    obligations: string[];
    rightsOrOptions: string[];
    escalationSteps: string[];
    officialHelp: string[];
    urgencyReason: string;
  };
};

export type AskResponse = {
  answer: string;
  answerHindi: string;
  citations: string[];
  followUps: string[];
  mode?: "gemini" | "grounded-fallback";
};

export type VaultItem = {
  id: string;
  createdAt: string;
  fileName: string;
  previewDataUrl?: string;
  analysis: DocumentAnalysis;
  tags: string[];
};
