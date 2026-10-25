import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

export default function MarketingPage() {
  return (
    <div className="sahaj-mesh min-h-screen">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 sahaj-grid opacity-40" />
        <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
          <p className="animate-rise text-sm font-medium text-[var(--accent)]">Sahaj</p>
          <h1 className="animate-rise-delay mt-4 max-w-3xl font-display text-5xl leading-[1.05] tracking-tight text-[var(--night)] sm:text-6xl lg:text-7xl">
            Documents your family can finally understand
          </h1>
          <p className="animate-rise-delay-2 mt-6 max-w-xl text-lg leading-relaxed text-[var(--slate)]">
            Bills, school notices, insurance letters, loan papers, government forms —
            Gemini reads them and turns confusion into a clear plan.
          </p>
          <div className="animate-rise-delay-2 mt-10 flex flex-wrap gap-3">
            <Link
              href="/app"
              className="inline-flex h-12 items-center rounded-2xl bg-[var(--night)] px-7 text-base font-semibold text-white shadow-lg shadow-[var(--night)]/15 transition hover:bg-[var(--ink)]"
            >
              Start free workspace
            </Link>
            <Link
              href="/#how"
              className="inline-flex h-12 items-center rounded-2xl border border-[var(--line)] bg-white/70 px-7 text-base font-medium text-[var(--ink)] backdrop-blur hover:bg-white"
            >
              See how it works
            </Link>
          </div>
        </div>

        <div className="relative mx-auto max-w-6xl px-5 pb-24 sm:px-8">
          <div className="overflow-hidden rounded-[1.75rem] border border-[var(--line)] bg-[var(--night)] p-1 shadow-2xl shadow-[var(--night)]/20">
            <div className="rounded-[1.5rem] bg-gradient-to-br from-[#0d1b2a] via-[#102536] to-[#0a5252] px-6 py-10 sm:px-12 sm:py-14">
              <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                <div>
                  <p className="text-sm text-[var(--glow)]">Live platform preview</p>
                  <p className="mt-3 font-display text-3xl text-white sm:text-4xl">
                    Upload once. Get meaning, risk, Hindi, and next steps.
                  </p>
                </div>
                <ul className="space-y-3 text-sm text-white/80">
                  <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">Multimodal Gemini vision + grounded Q&A</li>
                  <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">Scam score · elder mode · family alerts</li>
                  <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">Private vault saved on your device</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="border-t border-[var(--line)] bg-white/50 py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="font-display text-3xl text-[var(--night)] sm:text-4xl">Three steps. No jargon left behind.</h2>
          <p className="mt-3 max-w-2xl text-[var(--slate)]">Built for parents, first-time form fillers, and anyone who gets a letter they don’t understand.</p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { t: "Capture", d: "Photo, PDF, or scan. Camera works on phone." },
              { t: "Understand", d: "Gemini extracts amounts, dates, risks, and plain bilingual meaning." },
              { t: "Act", d: "Checklist, who in the family should know, and a downloadable brief." },
            ].map((s) => (
              <div key={s.t} className="border-l-2 border-[var(--accent)] pl-5">
                <h3 className="font-display text-2xl text-[var(--night)]">{s.t}</h3>
                <p className="mt-2 text-[var(--slate)]">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="border-t border-[var(--line)] py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="font-display text-3xl text-[var(--night)] sm:text-4xl">A platform, not a chatbot demo</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Scam & pressure check", "Flags urgent payment asks, odd channels, and spoof risk."],
              ["Elder & ELI5 modes", "Two more ways to explain the same document — gentle and simple."],
              ["Family who-should-know", "Surfaces who needs to see the letter before a deadline."],
              ["Grounded Ask Sahaj", "Answers only from your document analysis — with citations."],
              ["Device vault", "History stays in your browser. Export a text brief anytime."],
              ["Civic + family impact", "Built for real Indian paperwork, not generic summarization."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6">
                <h3 className="font-semibold text-[var(--night)]">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--slate)]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--line)] bg-[var(--night)] py-20 text-white">
        <div className="mx-auto max-w-6xl px-5 text-center sm:px-8">
          <h2 className="font-display text-3xl sm:text-4xl">Ready when the next letter arrives</h2>
          <p className="mx-auto mt-4 max-w-lg text-white/70">
            Open the workspace, drop a document, and walk through the brief with your family.
          </p>
          <Link
            href="/app"
            className="mt-8 inline-flex h-12 items-center rounded-2xl bg-[var(--glow)] px-8 font-semibold text-[var(--night)] hover:brightness-105"
          >
            Open Sahaj workspace
          </Link>
        </div>
      </section>

      <footer className="border-t border-[var(--line)] bg-[var(--paper)] py-8 text-center text-xs text-[var(--slate)]">
        Sahaj · Hack Wave · Civic · Family · Education · Google Gemini multimodal
      </footer>
    </div>
  );
}
