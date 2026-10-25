import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "About",
  description:
    "Sahaj is a Hack Wave platform that turns Indian household paperwork into bilingual family briefs with Gemini.",
};

export default function AboutPage() {
  return (
    <LegalPage
      eyebrow="ABOUT SAHAJ"
      title="A platform for paperwork that reaches the whole family."
      lead="Sahaj sits at the intersection of Family, Civic, Education, and everyday FinTech hygiene — powered by Google Gemini vision."
    >
      <LegalSection title="What Sahaj does">
        <p>
          Photograph a bill, school notice, insurance paper, loan letter, tax
          notice, or government form. Sahaj returns a bilingual brief, category
          desk, scam check, action plan, grounded questions, and an on-device
          vault export.
        </p>
      </LegalSection>
      <LegalSection title="Why category desks matter">
        <p>
          A utility bill needs a payment desk. A school notice needs a parent
          desk. A random selfie is not a form. Sahaj classifies the upload and
          shows category-shaped guidance instead of one generic template.
        </p>
      </LegalSection>
      <LegalSection title="Hack Wave themes">
        <ul className="list-disc space-y-2 pl-5">
          <li>Family — shared understanding across generations</li>
          <li>Civic — notices, forms, escalation literacy</li>
          <li>Education — plain language + ELI5 + Hindi</li>
          <li>FinTech hygiene — bills, loans, insurance scam caution</li>
        </ul>
      </LegalSection>
      <LegalSection title="Try it">
        <p>
          <Link href="/app" className="underline underline-offset-2">
            Open workspace
          </Link>
          {" · "}
          <Link href="/app?demo=1" className="underline underline-offset-2">
            Judge demo
          </Link>
          {" · "}
          <Link href="/security" className="underline underline-offset-2">
            Security &amp; DPDP
          </Link>
        </p>
      </LegalSection>
    </LegalPage>
  );
}
