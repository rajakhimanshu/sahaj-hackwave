export type Urgency = "low" | "medium" | "high";
export type RiskLevel = "info" | "warning" | "danger";
export type Priority = "low" | "medium" | "high";

export type DocumentCategory =
  | "utility_bill"
  | "school_notice"
  | "insurance"
  | "loan_finance"
  | "government"
  | "legal_notice"
  | "id_kyc"
  | "medical"
  | "tax"
  | "property"
  | "other"
  | "not_a_document";

export type DocumentKind =
  | "everyday_paperwork"
  | "not_a_document"
  | "unclear";

export type ReadingMode =
  | "simple"
  | "hindi"
  | "marathi"
  | "tamil"
  | "bengali"
  | "gujarati"
  | "elder"
  | "eli5";

export type CategoryMetric = {
  label: string;
  value: string;
  hint?: string;
};

export type CategoryPanel = {
  title: string;
  items: string[];
};

/** Category-shaped payload so UI does not reuse the same panels for every doc. */
export type CategoryFocus = {
  headline: string;
  metrics: CategoryMetric[];
  panels: CategoryPanel[];
  primaryAction?: string;
};

export type DocumentAnalysis = {
  documentType: string;
  category: DocumentCategory;
  documentKind: DocumentKind;
  isEverydayDocument: boolean;
  rejectionHint?: string;
  title: string;
  summarySimple: string;
  summaryHindi: string;
  summaryMarathi: string;
  summaryTamil: string;
  summaryBengali: string;
  summaryGujarati: string;
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
  categoryFocus: CategoryFocus;
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

export type ChatTurn = {
  role: "user" | "assistant";
  text: string;
};

export type AskResponse = {
  answer: string;
  answerHindi: string;
  answerMarathi?: string;
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
