import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Security & DPDP",
  description:
    "Sahaj security posture and Digital Personal Data Protection Act aligned practices for a family document product.",
};

export default function SecurityPage() {
  return (
    <LegalPage
      eyebrow="SECURITY · DPDP ALIGNED"
      title="Safety first. Account dashboard later."
      lead="For Hack Wave we chose a privacy-preserving product shape: no forced login, device-local vault, and clear limits on what AI should do with family paperwork."
    >
      <LegalSection title="Do you need a user dashboard?">
        <p>
          <strong className="text-[var(--night)]">Not yet — and that is intentional.</strong>{" "}
          A login dashboard usually means storing documents or profiles on a
          server. Under India&apos;s Digital Personal Data Protection Act, 2023
          (DPDP), that creates more personal-data obligations. Sahaj instead
          keeps the Family Vault on-device and processes uploads only to create
          a brief.
        </p>
        <p>
          A future production dashboard can add shared family access, audit
          logs, and consent controls — after proper authentication, encryption,
          retention, and Data Principal rights tooling are ready.
        </p>
      </LegalSection>
      <LegalSection title="DPDP-minded design choices">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-[var(--night)]">Purpose limitation:</strong>{" "}
            documents are processed to explain paperwork, not for ads.
          </li>
          <li>
            <strong className="text-[var(--night)]">Data minimisation:</strong>{" "}
            no account is required to try the product.
          </li>
          <li>
            <strong className="text-[var(--night)]">Local storage:</strong>{" "}
            vault briefs stay in the browser unless you export them.
          </li>
          <li>
            <strong className="text-[var(--night)]">Transparency:</strong>{" "}
            Privacy and Terms pages explain Gemini processing and limits.
          </li>
          <li>
            <strong className="text-[var(--night)]">User control:</strong>{" "}
            delete vault items; clear browser data to wipe local briefs.
          </li>
        </ul>
      </LegalSection>
      <LegalSection title="Safety features in the product">
        <ul className="list-disc space-y-2 pl-5">
          <li>Scam-risk scoring for pressure tactics and fake payment asks</li>
          <li>Category desks so random photos are not treated like bills</li>
          <li>Grounded Q&amp;A that refuses invented ownership / facts</li>
          <li>Legal/civic guide with an explicit “not legal advice” disclaimer</li>
          <li>File-type and size limits on uploads</li>
        </ul>
      </LegalSection>
      <LegalSection title="What you should still do">
        <p>
          Blur or cover unrelated sensitive numbers when possible. Prefer the{" "}
          <Link href="/app?demo=1" className="underline underline-offset-2">
            live demo
          </Link>{" "}
          for public demos. Never share OTPs. Verify payments on official portals
          only.
        </p>
      </LegalSection>
      <LegalSection title="Related pages">
        <p>
          <Link href="/privacy" className="underline underline-offset-2">
            Privacy
          </Link>
          {" · "}
          <Link href="/terms" className="underline underline-offset-2">
            Terms
          </Link>
          {" · "}
          <Link href="/about" className="underline underline-offset-2">
            About
          </Link>
        </p>
      </LegalSection>
    </LegalPage>
  );
}
