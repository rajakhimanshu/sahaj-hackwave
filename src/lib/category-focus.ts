import type {
  CategoryFocus,
  CategoryMetric,
  DocumentAnalysis,
  DocumentCategory,
} from "./types";

const LABELS: Record<DocumentCategory, string> = {
  utility_bill: "Utility bill desk",
  school_notice: "School notice desk",
  insurance: "Insurance desk",
  loan_finance: "Loan & finance desk",
  government: "Government form desk",
  legal_notice: "Legal notice desk",
  id_kyc: "ID & KYC privacy desk",
  medical: "Medical desk",
  tax: "Tax desk",
  property: "Property desk",
  other: "General paperwork desk",
  not_a_document: "Not everyday paperwork",
};

export function categoryLabel(category: DocumentCategory) {
  return LABELS[category] || LABELS.other;
}

export function buildFallbackCategoryFocus(
  analysis: Pick<
    DocumentAnalysis,
    | "category"
    | "documentType"
    | "title"
    | "amounts"
    | "importantDates"
    | "actionChecklist"
    | "documentsNeeded"
    | "parties"
    | "consumerTips"
    | "familyWhoShouldKnow"
    | "isEverydayDocument"
    | "rejectionHint"
  >
): CategoryFocus {
  if (!analysis.isEverydayDocument || analysis.category === "not_a_document") {
    return {
      headline: "This upload is not treated as family paperwork",
      metrics: [
        { label: "Status", value: "Not a bill / notice / form" },
        { label: "Action", value: "Re-upload everyday paperwork" },
      ],
      panels: [
        {
          title: "What Sahaj accepts",
          items: [
            "Utility bills, school notices, insurance, loans",
            "Government forms, tax, property, medical papers",
            "Clear photos or PDFs of the document itself",
          ],
        },
        {
          title: "Why this was flagged",
          items: [
            analysis.rejectionHint ||
              "The image looks like a random photo, meme, screenshot, or non-paperwork file.",
          ],
        },
      ],
      primaryAction: "Upload a clear photo of a real household document",
    };
  }

  switch (analysis.category) {
    case "utility_bill":
      return {
        headline: "Bill payment desk",
        metrics: pickMetrics(analysis, [
          ["Amount due", firstAmount(analysis)],
          ["Due date", firstDate(analysis)],
          ["Issuer", analysis.parties[0] || "Utility"],
        ]),
        panels: [
          {
            title: "Before you pay",
            items: [
              "Match consumer / RR / account number with last bill",
              "Use only the official app or website",
              "Save the receipt after payment",
            ],
          },
          {
            title: "Papers to keep",
            items: analysis.documentsNeeded.length
              ? analysis.documentsNeeded
              : ["Previous bill", "Payment receipt"],
          },
        ],
        primaryAction: firstAction(analysis) || "Pay through the official channel",
      };
    case "school_notice":
      return {
        headline: "School & parent desk",
        metrics: pickMetrics(analysis, [
          ["Deadline", firstDate(analysis)],
          ["Fee / amount", firstAmount(analysis) || "See notice"],
          ["School", analysis.parties[0] || "School"],
        ]),
        panels: [
          {
            title: "Parent actions",
            items: analysis.actionChecklist.map((a) => a.step).slice(0, 4),
          },
          {
            title: "What to carry / attach",
            items: analysis.documentsNeeded.length
              ? analysis.documentsNeeded
              : ["Signed acknowledgment", "Fee receipt if asked"],
          },
        ],
        primaryAction: firstAction(analysis) || "Note the deadline and tell the parent who handles school",
      };
    case "insurance":
      return {
        headline: "Policy & claim desk",
        metrics: pickMetrics(analysis, [
          ["Premium / amount", firstAmount(analysis)],
          ["Key date", firstDate(analysis)],
          ["Insurer", analysis.parties[0] || "Insurer"],
        ]),
        panels: [
          {
            title: "Policy checks",
            items: [
              "Confirm policy number and insured name",
              "Note renewal or claim deadline",
              "Do not share OTP with anyone claiming to be the insurer",
            ],
          },
          {
            title: "Family tip",
            items: analysis.consumerTips.slice(0, 3),
          },
        ],
        primaryAction: firstAction(analysis) || "Verify through the insurer’s official channel",
      };
    case "loan_finance":
      return {
        headline: "Loan & EMI desk",
        metrics: pickMetrics(analysis, [
          ["Amount / EMI", firstAmount(analysis)],
          ["Due / notice date", firstDate(analysis)],
          ["Lender", analysis.parties[0] || "Lender"],
        ]),
        panels: [
          {
            title: "Money safety",
            items: [
              "Never pay recovery agents in cash without a receipt",
              "Confirm the lender name against your loan papers",
              "Escalate harassment to the bank grievance cell / RBI CMS if needed",
            ],
          },
          {
            title: "Next paperwork",
            items: analysis.documentsNeeded.length
              ? analysis.documentsNeeded
              : ["Loan agreement", "Payment history"],
          },
        ],
        primaryAction: firstAction(analysis) || "Verify the demand with the lender first",
      };
    case "government":
      return {
        headline: "Government & civic desk",
        metrics: pickMetrics(analysis, [
          ["Form / notice", analysis.documentType || analysis.title],
          ["Authority", analysis.parties[0] || "Government body"],
          ["Deadline", firstDate(analysis) || "None stated"],
        ]),
        panels: [
          {
            title: "Citizen checklist",
            items: analysis.actionChecklist.map((a) => a.step).slice(0, 4),
          },
          {
            title: "Documents usually needed",
            items: analysis.documentsNeeded.length
              ? analysis.documentsNeeded
              : ["ID proof", "Address proof"],
          },
        ],
        primaryAction: firstAction(analysis) || "Use only the official portal or centre",
      };
    case "medical":
      return {
        headline: "Medical papers desk",
        metrics: pickMetrics(analysis, [
          ["Patient / clinic", analysis.parties[0] || "Clinic"],
          ["Amount", firstAmount(analysis) || "See paper"],
          ["Date", firstDate(analysis) || "See paper"],
        ]),
        panels: [
          {
            title: "Health paperwork",
            items: [
              "Keep prescriptions and reports together",
              "Check medicine names with a pharmacist if unclear",
              "Do not share sensitive health photos on public chats",
            ],
          },
          {
            title: "Family who should know",
            items: analysis.familyWhoShouldKnow.length
              ? analysis.familyWhoShouldKnow
              : ["Primary caregiver"],
          },
        ],
        primaryAction: firstAction(analysis) || "Share with the family member managing care",
      };
    case "tax":
      return {
        headline: "Tax & compliance desk",
        metrics: pickMetrics(analysis, [
          ["Amount", firstAmount(analysis)],
          ["Due date", firstDate(analysis)],
          ["Authority", analysis.parties[0] || "Tax office"],
        ]),
        panels: [
          {
            title: "Tax hygiene",
            items: [
              "Verify PAN / assessment year on the notice",
              "Pay only through official portals",
              "Keep challan / acknowledgment PDFs",
            ],
          },
          {
            title: "Ask a professional when",
            items: [
              "Penalty language is unclear",
              "Large disputed amounts appear",
              "You receive a scrutiny or hearing notice",
            ],
          },
        ],
        primaryAction: firstAction(analysis) || "Confirm the notice on the official tax portal",
      };
    case "property":
      return {
        headline: "Property & rent desk",
        metrics: pickMetrics(analysis, [
          ["Amount", firstAmount(analysis)],
          ["Key date", firstDate(analysis)],
          ["Parties", analysis.parties.slice(0, 2).join(" · ") || "See document"],
        ]),
        panels: [
          {
            title: "Property caution",
            items: [
              "Do not sign under pressure",
              "Match survey / plot / flat identifiers carefully",
              "Consult a lawyer for sale deeds, eviction, or court stamps",
            ],
          },
          {
            title: "Papers to gather",
            items: analysis.documentsNeeded.length
              ? analysis.documentsNeeded
              : ["Prior agreement", "ID proofs"],
          },
        ],
        primaryAction:
          firstAction(analysis) ||
          "Verify with a trusted family member before acting",
      };
    case "legal_notice":
      return {
        headline: "Legal notice desk",
        metrics: pickMetrics(analysis, [
          ["Nature", analysis.documentType || analysis.title],
          ["Issuer", analysis.parties[0] || "See notice"],
          ["Deadline", firstDate(analysis) || "Check notice"],
        ]),
        panels: [
          {
            title: "Read carefully before reacting",
            items: [
              "This is document education — not legal advice",
              "Note any reply / appearance deadline printed on the paper",
              "Keep the original envelope, stamp, and all pages",
            ],
          },
          {
            title: "Safe next steps",
            items: analysis.actionChecklist.length
              ? analysis.actionChecklist.map((a) => a.step).slice(0, 4)
              : [
                  "Verify the sender through an official channel",
                  "Consult a qualified lawyer for court / eviction language",
                  "Do not pay unknown agents in cash under pressure",
                ],
          },
        ],
        primaryAction:
          firstAction(analysis) ||
          "Verify the issuer, then consult a qualified professional if needed",
      };
    case "id_kyc":
      return {
        headline: "ID & KYC privacy desk",
        metrics: pickMetrics(analysis, [
          ["ID type", analysis.documentType || "Identity document"],
          ["Issuer", analysis.parties[0] || "Government / authority"],
          ["Sensitivity", "High — personal data"],
        ]),
        panels: [
          {
            title: "Privacy first",
            items: [
              "Do not post full ID photos on WhatsApp groups or social media",
              "Mask Aadhaar / sensitive numbers when sharing copies",
              "Sahaj does not treat ID cards like bills — no fake payment asks",
            ],
          },
          {
            title: "Typical uses",
            items: analysis.actionChecklist.length
              ? analysis.actionChecklist.map((a) => a.step).slice(0, 4)
              : [
                  "Use only for official KYC / enrolment when required",
                  "Update details only through official portals or centres",
                  "Store physical IDs safely at home",
                ],
          },
        ],
        primaryAction:
          firstAction(analysis) ||
          "Use official channels only; protect this ID from unnecessary sharing",
      };
    default:
      return {
        headline: "General paperwork desk",
        metrics: pickMetrics(analysis, [
          ["Type", analysis.title],
          ["Amount", firstAmount(analysis) || "—"],
          ["Date", firstDate(analysis) || "—"],
        ]),
        panels: [
          {
            title: "Suggested next steps",
            items: analysis.actionChecklist.map((a) => a.step).slice(0, 4),
          },
          {
            title: "Tips",
            items: analysis.consumerTips.slice(0, 3),
          },
        ],
        primaryAction: firstAction(analysis),
      };
  }
}

function firstAmount(
  analysis: Pick<DocumentAnalysis, "amounts">
) {
  return analysis.amounts[0]?.value;
}

function firstDate(
  analysis: Pick<DocumentAnalysis, "importantDates">
) {
  return analysis.importantDates[0]?.date;
}

function firstAction(
  analysis: Pick<DocumentAnalysis, "actionChecklist">
) {
  return analysis.actionChecklist[0]?.step;
}

function pickMetrics(
  _analysis: unknown,
  rows: [string, string | undefined][]
): CategoryMetric[] {
  return rows
    .filter(([, value]) => Boolean(value))
    .map(([label, value]) => ({ label, value: value as string }));
}

export function normalizeAnalysis(raw: DocumentAnalysis): DocumentAnalysis {
  const isEveryday =
    typeof raw.isEverydayDocument === "boolean"
      ? raw.isEverydayDocument
      : raw.category !== "not_a_document" && raw.documentKind !== "not_a_document";

  const documentKind =
    raw.documentKind ||
    (isEveryday ? "everyday_paperwork" : "not_a_document");

  const category =
    !isEveryday || documentKind === "not_a_document"
      ? "not_a_document"
      : raw.category || "other";

  const base: DocumentAnalysis = {
    ...raw,
    category,
    documentKind,
    isEverydayDocument: isEveryday && category !== "not_a_document",
    summarySimple: raw.summarySimple || "",
    summaryHindi: raw.summaryHindi || "",
    summaryMarathi: raw.summaryMarathi || raw.summaryHindi || "",
    summaryTamil: raw.summaryTamil || raw.summarySimple || "",
    summaryBengali: raw.summaryBengali || raw.summarySimple || "",
    summaryGujarati: raw.summaryGujarati || raw.summarySimple || "",
    summaryElder: raw.summaryElder || raw.summarySimple || "",
    eli5: raw.eli5 || raw.summarySimple || "",
    amounts: Array.isArray(raw.amounts) ? raw.amounts : [],
    importantDates: Array.isArray(raw.importantDates) ? raw.importantDates : [],
    actionChecklist: Array.isArray(raw.actionChecklist) ? raw.actionChecklist : [],
    documentsNeeded: Array.isArray(raw.documentsNeeded) ? raw.documentsNeeded : [],
    riskFlags: Array.isArray(raw.riskFlags) ? raw.riskFlags : [],
    consumerTips: Array.isArray(raw.consumerTips) ? raw.consumerTips : [],
    familyWhoShouldKnow: Array.isArray(raw.familyWhoShouldKnow)
      ? raw.familyWhoShouldKnow
      : [],
    keyQuotes: Array.isArray(raw.keyQuotes) ? raw.keyQuotes : [],
    glossary: Array.isArray(raw.glossary) ? raw.glossary : [],
    parties: Array.isArray(raw.parties) ? raw.parties : [],
    scamScore: typeof raw.scamScore === "number" ? raw.scamScore : 0,
    confidence: typeof raw.confidence === "number" ? raw.confidence : 0.5,
    categoryFocus:
      raw.categoryFocus?.panels?.length && raw.categoryFocus?.metrics
        ? raw.categoryFocus
        : buildFallbackCategoryFocus({
            ...raw,
            category,
            isEverydayDocument: isEveryday && category !== "not_a_document",
            amounts: Array.isArray(raw.amounts) ? raw.amounts : [],
            importantDates: Array.isArray(raw.importantDates)
              ? raw.importantDates
              : [],
            actionChecklist: Array.isArray(raw.actionChecklist)
              ? raw.actionChecklist
              : [],
            documentsNeeded: Array.isArray(raw.documentsNeeded)
              ? raw.documentsNeeded
              : [],
            parties: Array.isArray(raw.parties) ? raw.parties : [],
            consumerTips: Array.isArray(raw.consumerTips) ? raw.consumerTips : [],
            familyWhoShouldKnow: Array.isArray(raw.familyWhoShouldKnow)
              ? raw.familyWhoShouldKnow
              : [],
          }),
  };

  return base;
}
