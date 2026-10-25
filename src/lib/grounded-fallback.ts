import type { AskResponse, DocumentAnalysis } from "./types";

export function buildGroundedFallback(
  analysis: DocumentAnalysis,
  question: string
): AskResponse {
  const q = question.toLowerCase();
  const citations: string[] = [];
  let answer = analysis.summarySimple;
  let answerHindi = analysis.summaryHindi;

  if (/(wrong|dispute|complain|complaint|option|escalat)/.test(q)) {
    const options = analysis.legalGuidance?.rightsOrOptions || [];
    const escalation = analysis.legalGuidance?.escalationSteps || [];
    const help = analysis.legalGuidance?.officialHelp || [];
    answer = [
      options.length ? `Your stated options are: ${options.join(" ")}` : "",
      escalation.length ? `Suggested escalation: ${escalation.join(" ")}` : "",
      help.length ? `Official help: ${help.join("; ")}.` : "",
    ]
      .filter(Boolean)
      .join(" ");
    answerHindi =
      "दस्तावेज़ में दिए विकल्प और आधिकारिक शिकायत प्रक्रिया ऊपर दिखाई गई है। पहले जारीकर्ता के आधिकारिक चैनल से संपर्क करें और शिकायत का रिकॉर्ड रखें।";
    citations.push(
      "legalGuidance.rightsOrOptions",
      "legalGuidance.escalationSteps",
      "legalGuidance.officialHelp"
    );
  } else if (/(when|date|deadline|due|last date)/.test(q)) {
    answer = analysis.importantDates?.length
      ? analysis.importantDates
          .map((item) => `${item.label}: ${item.date}`)
          .join(". ")
      : "No date is confirmed in this brief.";
    answerHindi = analysis.importantDates?.length
      ? `महत्वपूर्ण तारीख: ${analysis.importantDates
          .map((item) => `${item.label} — ${item.date}`)
          .join(", ")}`
      : "इस दस्तावेज़ में कोई तारीख स्पष्ट नहीं है।";
    citations.push("importantDates");
  } else if (/(amount|money|pay|cost|fee|how much)/.test(q)) {
    answer = analysis.amounts?.length
      ? analysis.amounts
          .map((item) => `${item.label}: ${item.value}`)
          .join(". ")
      : "No amount is confirmed in this brief.";
    answerHindi = analysis.amounts?.length
      ? `दस्तावेज़ में राशि: ${analysis.amounts
          .map((item) => `${item.label} — ${item.value}`)
          .join(", ")}`
      : "इस दस्तावेज़ में कोई राशि स्पष्ट नहीं है।";
    citations.push("amounts");
  } else if (/(ignore|happen|consequence|late|miss)/.test(q)) {
    answer =
      analysis.whatHappensIfIgnored ||
      "The brief does not confirm a consequence.";
    answerHindi = analysis.summaryHindi;
    citations.push("whatHappensIfIgnored");
  } else if (/(who|issuer|issued|party|from)/.test(q)) {
    answer = analysis.parties?.length
      ? `The parties identified are ${analysis.parties.join(" and ")}.`
      : "The issuer is not confirmed in this brief.";
    answerHindi = analysis.parties?.length
      ? `पहचाने गए पक्ष: ${analysis.parties.join(", ")}।`
      : "जारीकर्ता की पुष्टि नहीं हुई है।";
    citations.push("parties");
  } else {
    citations.push("summarySimple", "summaryHindi");
  }

  return {
    answer,
    answerHindi,
    citations,
    followUps: [
      "What is the most urgent next step?",
      "Who should I contact if something looks wrong?",
    ],
    mode: "grounded-fallback",
  };
}
