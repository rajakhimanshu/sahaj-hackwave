import type { DocumentAnalysis } from "./types";

export const DEMO_ANALYSIS: DocumentAnalysis = {
  documentType: "Electricity bill",
  category: "utility_bill",
  title: "BESCOM electricity bill — March",
  summarySimple:
    "This is the March electricity bill for your home. The total amount due is ₹2,840 and it should be paid by 28 March to avoid a late fee or possible service interruption.",
  summaryHindi:
    "यह आपके घर का मार्च महीने का बिजली बिल है। कुल ₹2,840 का भुगतान 28 मार्च तक करें, ताकि लेट फीस या बिजली कटने का जोखिम न हो।",
  summaryElder:
    "This paper is the electricity bill for the home. The electricity company is asking for ₹2,840. Please ask a trusted family member to pay it through the official BESCOM website or app before 28 March, and keep the receipt.",
  eli5:
    "The electricity company supplied power to the house and now sent a bill for ₹2,840. Paying before 28 March means there will be no extra late charge.",
  parties: ["BESCOM", "Residential consumer"],
  amounts: [
    { label: "Total amount due", value: "₹2,840", note: "Payable by 28 March" },
    { label: "Late payment surcharge", value: "₹85", note: "Applies after due date" },
  ],
  importantDates: [
    { label: "Bill issued", date: "12 March", urgency: "low" },
    { label: "Payment due", date: "28 March", urgency: "high" },
  ],
  actionChecklist: [
    {
      step: "Confirm the consumer number matches your meter",
      priority: "high",
      doneHint: "Number matches the previous bill",
    },
    {
      step: "Pay ₹2,840 through the official BESCOM app or website",
      deadline: "28 March",
      priority: "high",
      doneHint: "Payment confirmation appears",
    },
    {
      step: "Download and save the payment receipt",
      priority: "medium",
      doneHint: "Receipt is in the family vault",
    },
  ],
  documentsNeeded: ["Previous bill for consumer-number verification"],
  riskFlags: [
    {
      level: "info",
      message: "The document resembles a normal utility bill. Always pay through the official BESCOM channel.",
    },
  ],
  scamScore: 12,
  consumerTips: [
    "Match the consumer ID with your previous bill before paying.",
    "Do not pay through a link received from an unknown WhatsApp number.",
    "Keep the digital receipt until the next bill shows the payment.",
  ],
  familyWhoShouldKnow: ["Person who manages household bills", "Account holder"],
  keyQuotes: ["Net amount payable: ₹2,840", "Due date: 28/03"],
  glossary: [
    {
      term: "RR Number",
      meaning: "The unique number BESCOM uses to identify your electricity connection.",
    },
    {
      term: "Surcharge",
      meaning: "An extra charge added when the bill is paid late.",
    },
  ],
  confidence: 0.94,
  whatHappensIfIgnored:
    "A late fee may be added. If the bill remains unpaid, the electricity connection can eventually be disconnected.",
};
