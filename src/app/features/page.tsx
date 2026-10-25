import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Sahaj feature map — voice read-aloud, multilingual briefs, category desks, chatbot, vault, PDF, and revenue model.",
};

const rows = [
  {
    tag: "LIVE",
    title: "Voice read-aloud",
    detail:
      "Tap Listen on any summary. Follows English / Hindi / Marathi / Tamil / Bengali / Gujarati / Elder.",
    href: "/app?demo=1",
    cta: "Try on demo",
  },
  {
    tag: "LIVE",
    title: "Category desks",
    detail:
      "Bill, school, ID/KYC, legal notice, tax, medical — each gets its own panels, not one template.",
    href: "/app",
    cta: "Upload a doc",
  },
  {
    tag: "LIVE",
    title: "Document chatbot",
    detail:
      "Multi-turn grounded chat. Random prompts stay tied to the brief — no invented amounts.",
    href: "/app?demo=1",
    cta: "Open chat",
  },
  {
    tag: "LIVE",
    title: "Legal / civic help",
    detail:
      "Obligations, options, escalation, official help — labeled as education, not legal advice.",
    href: "/security",
    cta: "Read stance",
  },
  {
    tag: "LIVE",
    title: "Family vault + local account",
    detail:
      "Save briefs on-device. Optional 4-digit local PIN profile. Guest mode still works.",
    href: "/app/account",
    cta: "Account",
  },
  {
    tag: "LIVE",
    title: "PDF + TXT export",
    detail: "Download a family-ready brief for sharing offline.",
    href: "/app?demo=1",
    cta: "Export demo",
  },
  {
    tag: "LIVE",
    title: "Ads / earning model",
    detail:
      "Transparent sponsored tips fund free core. We do not sell vault document contents.",
    href: "/earn",
    cta: "Revenue model",
  },
  {
    tag: "NEXT",
    title: "Family share card & bill compare",
    detail:
      "Coming next in this build cycle — WhatsApp-ready share image and month-vs-month bill compare.",
    href: "/about",
    cta: "About roadmap",
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[var(--paper)]">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 py-14 sm:px-10 lg:px-14">
        <p className="text-xs font-semibold text-[var(--accent)]">FEATURE MAP</p>
        <h1 className="mt-3 font-display text-5xl text-[var(--night)]">
          Everything Sahaj highlights in the demo.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--ink-soft)]">
          Built so judges can see each capability clearly — not buried in a
          single chat box.
        </p>

        <div className="mt-12 space-y-4">
          {rows.map((row) => (
            <article
              key={row.title}
              className="grid gap-4 border border-[var(--night)] bg-[var(--panel)] p-5 sm:grid-cols-[6rem_1fr_auto] sm:items-center sm:p-6"
            >
              <span
                className={`w-fit px-2 py-1 text-[10px] font-bold ${
                  row.tag === "LIVE"
                    ? "bg-[var(--ok)] text-white"
                    : "bg-[var(--mist)] text-[var(--slate)]"
                }`}
              >
                {row.tag}
              </span>
              <div>
                <h2 className="font-display text-2xl text-[var(--night)]">
                  {row.title}
                </h2>
                <p className="mt-1 text-sm leading-6 text-[var(--slate)]">
                  {row.detail}
                </p>
              </div>
              <Link
                href={row.href}
                className="focus-ring border border-[var(--night)] px-4 py-2 text-center text-xs font-semibold sm:justify-self-end"
              >
                {row.cta} →
              </Link>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
