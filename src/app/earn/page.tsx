import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Earning & revenue model",
  description:
    "How Sahaj stays free for families with transparent ads, sponsored literacy, and optional family plans — without selling vault data.",
};

export default function EarnPage() {
  return (
    <LegalPage
      eyebrow="EARNING MODEL · REVENUE"
      title="Free for families. Funded in the open."
      lead="Sahaj’s revenue model is designed for Hack Wave judges and real Indian households: keep core document help free, never sell vault contents, and earn through transparent ads + sponsorships."
    >
      <LegalSection title="Do we save user data for ads?">
        <p>
          <strong className="text-[var(--night)]">No.</strong> The Family Vault
          and local profile stay in the browser. Sponsored slots do not require
          uploading your bill contents to an ad network. Gemini sees a document
          only to build the brief you requested.
        </p>
      </LegalSection>

      <LegalSection title="Revenue streams">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            [
              "01 · Sponsored tips",
              "Family-safe ad slots on workspace / landing (electricity literacy, official pay apps, NGO campaigns).",
            ],
            [
              "02 · CSR / civic partners",
              "State utilities, banks, or NGOs sponsor bilingual explainers for bills and notices.",
            ],
            [
              "03 · Family Plus (optional)",
              "Local unlock for extra PDF packs / multi-device sync later — core analyze stays free.",
            ],
            [
              "04 · B2B desk license",
              "RWAs, schools, and help-desks license Sahaj briefs for community counters.",
            ],
          ].map(([title, copy]) => (
            <article
              key={title}
              className="border border-[var(--night)] bg-[var(--panel)] p-4"
            >
              <h3 className="text-sm font-semibold text-[var(--night)]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">{copy}</p>
            </article>
          ))}
        </div>
      </LegalSection>

      <LegalSection title="Demo revenue desk (illustrative)">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["Free families helped", "12.4k"],
            ["Sponsored tip CTR", "2.1%"],
            ["Projected monthly", "₹48k"],
          ].map(([label, value]) => (
            <div key={label} className="border border-[var(--night)] bg-[var(--glow)]/30 p-4">
              <p className="text-xs text-[var(--slate)]">{label}</p>
              <p className="mt-1 font-display text-3xl text-[var(--night)]">{value}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-[var(--slate)]">
          Figures are product-demo placeholders for pitching the model — not live billing.
        </p>
      </LegalSection>

      <LegalSection title="What we will not monetize">
        <ul className="list-disc space-y-2 pl-5">
          <li>Selling raw document images or vault JSON</li>
          <li>Targeting ads from Aadhaar / medical contents</li>
          <li>Dark-pattern “pay to unlock due date”</li>
        </ul>
      </LegalSection>

      <p>
        <Link href="/app" className="underline underline-offset-2">
          Open workspace
        </Link>
        {" · "}
        <Link href="/security" className="underline underline-offset-2">
          Security &amp; DPDP
        </Link>
      </p>
    </LegalPage>
  );
}
