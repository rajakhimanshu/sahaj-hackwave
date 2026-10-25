import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Sahaj — Hack Wave family document intelligence with Gemini, privacy-first vault, and multilingual briefs.",
};

const features = [
  ["Document understanding", "Gemini reads bills, notices, IDs, and legal papers differently — not one generic template."],
  ["Multilingual summary", "English, Hindi, Marathi, Tamil, Bengali, Gujarati, Elder, ELI5."],
  ["Voice read-aloud", "Listen to the summary in the selected language — built for elders."],
  ["Family WhatsApp share", "Message, copy, or PNG share card — ID docs share checklist only."],
  ["Document chatbot", "Ask grounded questions; refuse invented facts."],
  ["Legal / civic guide", "Obligations, options, escalation — clearly not legal advice."],
  ["Local vault + account", "Browser-local storage. No cloud dossier for the hackathon build."],
  ["PDF brief export", "Share a clean family report."],
  ["Ads / earn model", "Transparent sponsored tips — we do not sell vault contents."],
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--paper)]">
      <SiteHeader />
      <main>
        <section className="border-b border-[var(--night)]">
          <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.1fr_0.9fr]">
            <div className="border-[var(--night)] px-5 py-14 sm:px-10 lg:border-r lg:px-14 lg:py-20">
              <p className="reveal-up text-xs font-semibold text-[var(--accent)]">
                ABOUT · HACK WAVE
              </p>
              <h1 className="reveal-up mt-4 max-w-[14ch] font-display text-5xl leading-[1.02] text-[var(--night)] sm:text-6xl">
                Built for Indian families drowning in paperwork.
              </h1>
              <p className="reveal-up mt-6 max-w-xl text-base leading-7 text-[var(--ink-soft)]">
                Sahaj is our Hack Wave platform: photograph a household or civic
                document, get a category-specific brief, talk to a grounded
                chatbot, listen in your language, and keep the vault on-device.
              </p>
              <div className="reveal-up mt-8 flex flex-wrap gap-3">
                <Link
                  href="/app"
                  className="focus-ring bg-[var(--night)] px-5 py-3 text-sm font-semibold text-white"
                >
                  Open workspace ↗
                </Link>
                <Link
                  href="/features"
                  className="focus-ring border border-[var(--night)] px-5 py-3 text-sm font-semibold"
                >
                  All features
                </Link>
              </div>
            </div>
            <div className="bg-[var(--night)] px-5 py-14 text-white sm:px-10 lg:px-14 lg:py-20">
              <p className="text-xs font-semibold text-[var(--glow)]">ABOUT THE BUILD</p>
              <h2 className="mt-4 font-display text-3xl leading-tight">
                Family · Civic · Education · FinTech hygiene
              </h2>
              <ul className="mt-8 space-y-4 text-sm leading-6 text-white/70">
                <li>Powered by Google Gemini multimodal</li>
                <li>Frontend on Vercel · API on AWS</li>
                <li>DPDP-minded: local vault, optional local PIN profile</li>
                <li>Document education — not a substitute for a lawyer</li>
              </ul>
              <Link
                href="/security"
                className="mt-10 inline-block border-b border-[var(--glow)] pb-1 text-sm font-semibold text-[var(--glow)]"
              >
                Security &amp; DPDP →
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl border-x border-[var(--night)]">
          <div className="border-b border-[var(--night)] px-5 py-10 sm:px-10 lg:px-14">
            <p className="text-xs font-semibold text-[var(--accent)]">WHAT WE HIGHLIGHT</p>
            <h2 className="mt-3 font-display text-4xl text-[var(--night)]">
              Features judges can touch in one demo.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4">
            {features.map(([title, copy], i) => (
              <article
                key={title}
                className={`min-h-44 border-b border-[var(--line)] p-6 sm:p-8 ${
                  i % 2 === 0 ? "sm:border-r" : ""
                } ${i % 4 !== 3 ? "lg:border-r" : "lg:border-r-0"}`}
              >
                <p className="font-display text-xl text-[var(--accent)]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 font-display text-2xl text-[var(--night)]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--slate)]">{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[var(--accent)] text-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-14 sm:px-10 lg:flex-row lg:items-end lg:justify-between lg:px-14">
            <h2 className="max-w-2xl font-display text-4xl leading-tight sm:text-5xl">
              Ready for the judge walkthrough.
            </h2>
            <Link
              href="/app?demo=1"
              className="focus-ring shrink-0 bg-white px-6 py-3 text-sm font-bold text-[var(--night)]"
            >
              Launch demo brief ↗
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
