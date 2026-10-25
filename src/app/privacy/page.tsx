import type { Metadata } from "next";
import LegalPage, { LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How Sahaj handles document uploads, Gemini processing, and the on-device family vault under a privacy-first model.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="PRIVACY NOTICE"
      title="Your papers stay close to you."
      lead="Sahaj is built for Indian families who need clarity without creating a permanent cloud dossier of household documents."
    >
      <LegalSection title="What we process">
        <p>
          When you upload a photo or PDF, the file is sent to Sahaj&apos;s API
          so Google Gemini can read it and return a structured brief. The brief
          can include summaries, amounts, dates, risks, and grounded answers.
        </p>
      </LegalSection>
      <LegalSection title="What stays on your device">
        <p>
          The Family Vault uses this browser&apos;s local storage. Saved briefs
          are not synced to a Sahaj account database because Sahaj does not
          require account sign-in for the hackathon prototype.
        </p>
      </LegalSection>
      <LegalSection title="What we do not do">
        <ul className="list-disc space-y-2 pl-5">
          <li>No advertising profiles from your documents</li>
          <li>No sale of personal data</li>
          <li>No public gallery of uploaded family papers</li>
          <li>No request for Aadhaar / PAN as a login requirement</li>
        </ul>
      </LegalSection>
      <LegalSection title="Third-party processing">
        <p>
          Document understanding uses Google Gemini. Uploads are processed to
          produce the brief you see. Do not upload documents you are not
          allowed to share with an AI processor.
        </p>
      </LegalSection>
      <LegalSection title="Your choices">
        <p>
          Clear the vault from the vault page. Clear browser site data to remove
          local briefs. Prefer demo mode if you only want to evaluate the product
          without uploading personal papers.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
