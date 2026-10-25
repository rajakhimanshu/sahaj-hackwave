import type { Metadata } from "next";
import LegalPage, { LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Terms of use for Sahaj — document education for families, not legal, medical, or financial advice.",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="TERMS OF USE"
      title="Use Sahaj as a document companion."
      lead="Sahaj helps families understand bills, notices, and forms. It is not a lawyer, doctor, accountant, or government office."
    >
      <LegalSection title="Accepted use">
        <p>
          Use Sahaj to understand everyday paperwork you are allowed to view.
          Do not upload documents belonging to others without permission, and do
          not use Sahaj to harass, defraud, or impersonate anyone.
        </p>
      </LegalSection>
      <LegalSection title="Not professional advice">
        <p>
          Summaries, checklists, scam scores, and rights/escalation guides are
          educational. For disputes, court notices, medical decisions, tax
          filings, or large financial exposure, consult the issuing authority or
          a qualified professional.
        </p>
      </LegalSection>
      <LegalSection title="Accuracy">
        <p>
          Gemini can misread unclear photos. Always verify amounts, dates, and
          account numbers against the original paper or official portal before
          paying or signing.
        </p>
      </LegalSection>
      <LegalSection title="Availability">
        <p>
          This Hack Wave prototype may be unavailable, rate-limited, or retired
          after the event. Features can change without notice.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
