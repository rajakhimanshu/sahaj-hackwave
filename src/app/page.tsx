import type { ReactNode } from "react";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import ProductMock from "@/components/landing/ProductMock";

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-[var(--paper)]">
      {/* Full-bleed hero plane */}
      <div className="relative overflow-hidden bg-[var(--night)] text-white">
        <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden />
        <div className="hero-paper pointer-events-none absolute inset-x-0 bottom-0 h-[42%] opacity-[0.07]" aria-hidden />

        <SiteHeader />

        <section className="relative mx-auto max-w-6xl px-5 pb-10 pt-16 sm:px-8 sm:pt-20 lg:pt-24">
          <p className="animate-rise font-display text-5xl tracking-tight text-white sm:text-6xl lg:text-7xl">
            Sahaj
          </p>
          <h1 className="animate-rise-delay mt-5 max-w-[18ch] font-display text-[2.35rem] leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
            The document platform your family actually understands
          </h1>
          <p className="animate-rise-delay-2 mt-5 max-w-lg text-base leading-relaxed text-white/65 sm:text-lg">
            Upload a bill, school notice, or government letter. Gemini turns it into meaning,
            risk, Hindi, and a clear plan — in seconds.
          </p>
          <div className="animate-rise-delay-2 mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/app"
              className="inline-flex h-12 items-center rounded-full bg-[var(--glow)] px-7 text-[15px] font-semibold text-[var(--night)] transition hover:brightness-105"
            >
              Enter workspace
            </Link>
            <Link
              href="/#product"
              className="inline-flex h-12 items-center rounded-full border border-white/20 px-7 text-[15px] font-medium text-white/90 hover:bg-white/5"
            >
              See the product
            </Link>
          </div>
          <p className="mt-6 text-xs text-white/40">
            Powered by Google Gemini · Civic · Family · Education
          </p>
        </section>

        <div className="relative mx-auto max-w-6xl px-3 sm:px-6 lg:px-8">
          <div className="animate-rise-delay-2 origin-bottom">
            <ProductMock />
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <section className="border-b border-[var(--line)] bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5 text-xs text-[var(--slate)] sm:px-8 sm:text-sm">
          <span>Multimodal Gemini vision</span>
          <span className="hidden h-3 w-px bg-[var(--line)] sm:block" />
          <span>Bilingual briefs (EN + हिंदी)</span>
          <span className="hidden h-3 w-px bg-[var(--line)] sm:block" />
          <span>Scam & pressure scoring</span>
          <span className="hidden h-3 w-px bg-[var(--line)] sm:block" />
          <span>Private device vault</span>
        </div>
      </section>

      {/* Product narrative */}
      <section id="product" className="scroll-mt-24 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <p className="text-sm font-medium text-[var(--accent)]">The platform</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl leading-tight text-[var(--night)] sm:text-5xl">
            Built like a product. Explains like a person.
          </h2>

          <div className="mt-16 space-y-20">
            <FeatureRow
              eyebrow="01 — Capture"
              title="Any paper that lands on the kitchen table"
              body="Photo from your phone, PDF from email, or a scan. Sahaj accepts the messy, folded, half-lit documents real families deal with."
              visual={<DocStackVisual />}
            />
            <FeatureRow
              reverse
              eyebrow="02 — Understand"
              title="One brief. Four ways to read it."
              body="Simple English, हिंदी, Elder mode, and ELI5. Same document — explained for whoever is sitting next to you."
              visual={<ModesVisual />}
            />
            <FeatureRow
              eyebrow="03 — Act"
              title="Checklist, risk, and who should know"
              body="Deadlines, scam pressure score, consumer tips, and a family ping list — then save it to the vault or download a brief."
              visual={<ActionVisual />}
            />
          </div>
        </div>
      </section>

      {/* How */}
      <section id="how" className="scroll-mt-24 border-y border-[var(--line)] bg-[#eef3f8] py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="font-display text-3xl text-[var(--night)] sm:text-4xl">How Sahaj works</h2>
          <p className="mt-3 max-w-xl text-[var(--slate)]">
            Three moments from upload to action — no chatbot rabbit hole.
          </p>
          <ol className="mt-12 grid gap-0 md:grid-cols-3">
            {[
              {
                n: "1",
                t: "Drop the document",
                d: "Workspace opens a calm upload stage. Camera on mobile. Drag-and-drop on desktop.",
              },
              {
                n: "2",
                t: "Gemini reads it",
                d: "Vision model extracts amounts, dates, parties, quotes — then writes a structured brief.",
              },
              {
                n: "3",
                t: "You decide together",
                d: "Ask Sahaj grounded questions, tick the checklist, save to the family vault.",
              },
            ].map((step, i) => (
              <li
                key={step.n}
                className={`bg-white p-7 md:p-8 ${i < 2 ? "md:border-r md:border-[var(--line)]" : ""} border-b border-[var(--line)] md:border-b-0`}
              >
                <span className="font-display text-4xl text-[var(--accent)]">{step.n}</span>
                <h3 className="mt-4 text-lg font-semibold text-[var(--night)]">{step.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--slate)]">{step.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Families */}
      <section id="families" className="scroll-mt-24 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="max-w-xl font-display text-3xl text-[var(--night)] sm:text-4xl">
            Made for the documents Indian households get every week
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Utility bills", "Electricity, water, gas — amounts & due dates made obvious."],
              ["School notices", "Fees, meetings, circulars parents actually finish reading."],
              ["Insurance & loans", "Premiums, EMI letters, what happens if you ignore them."],
              ["Govt & civic forms", "Plain language on letters that usually feel impossible."],
            ].map(([title, body]) => (
              <article
                key={title}
                className="group relative overflow-hidden rounded-2xl bg-[var(--night)] p-6 text-white"
              >
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--accent)]/30 blur-2xl transition group-hover:bg-[var(--glow)]/40" />
                <h3 className="relative font-display text-xl">{title}</h3>
                <p className="relative mt-3 text-sm leading-relaxed text-white/65">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-[var(--line)]">
        <div className="absolute inset-0 bg-[var(--night)]" />
        <div className="hero-glow pointer-events-none absolute inset-0 opacity-80" />
        <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl text-white sm:text-5xl">
              Open Sahaj. Drop the next letter in.
            </h2>
            <p className="mt-4 text-white/60">
              Free workspace. No install. Works on phone and laptop.
            </p>
            <Link
              href="/app"
              className="mt-8 inline-flex h-12 items-center rounded-full bg-white px-8 text-[15px] font-semibold text-[var(--night)] hover:bg-[var(--glow)]"
            >
              Launch platform
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--line)] bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-3 sm:px-8">
          <div>
            <p className="font-display text-2xl text-[var(--night)]">Sahaj</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--slate)]">
              Document intelligence for Indian families — powered by Google Gemini.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--night)]">Product</p>
            <ul className="mt-3 space-y-2 text-sm text-[var(--slate)]">
              <li><Link href="/app" className="hover:text-[var(--ink)]">Workspace</Link></li>
              <li><Link href="/app/vault" className="hover:text-[var(--ink)]">Family vault</Link></li>
              <li><Link href="/#how" className="hover:text-[var(--ink)]">How it works</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--night)]">Hack Wave</p>
            <p className="mt-3 text-sm text-[var(--slate)]">
              Themes: Civic · Family · Education
              <br />
              Best use of Google Gemini API
            </p>
          </div>
        </div>
        <div className="border-t border-[var(--line)] py-5 text-center text-xs text-[var(--slate)]">
          © {new Date().getFullYear()} Sahaj · Built for Hack Wave
        </div>
      </footer>
    </div>
  );
}

function FeatureRow({
  eyebrow,
  title,
  body,
  visual,
  reverse,
}: {
  eyebrow: string;
  title: string;
  body: string;
  visual: ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${reverse ? "" : ""}`}>
      <div className={reverse ? "lg:order-2" : ""}>
        <p className="text-sm font-medium text-[var(--accent)]">{eyebrow}</p>
        <h3 className="mt-3 font-display text-2xl leading-snug text-[var(--night)] sm:text-3xl">{title}</h3>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--slate)]">{body}</p>
      </div>
      <div className={reverse ? "lg:order-1" : ""}>{visual}</div>
    </div>
  );
}

function DocStackVisual() {
  return (
    <div className="relative h-64 overflow-hidden rounded-2xl bg-[var(--mist)] p-6">
      <div className="absolute left-8 top-10 w-[70%] rotate-[-4deg] rounded-lg border border-[var(--line)] bg-white p-4 shadow-lg">
        <div className="h-2 w-1/3 rounded bg-[var(--line)]" />
        <div className="mt-3 h-2 w-2/3 rounded bg-[var(--mist)]" />
        <div className="mt-2 h-2 w-1/2 rounded bg-[var(--mist)]" />
      </div>
      <div className="absolute bottom-8 right-6 w-[72%] rotate-[3deg] rounded-lg border border-[var(--line)] bg-white p-4 shadow-xl">
        <p className="text-[10px] text-[var(--accent)]">Detected</p>
        <p className="mt-1 text-sm font-semibold text-[var(--night)]">School fee notice</p>
        <p className="mt-2 text-[11px] text-[var(--slate)]">Due · Parent–teacher meeting · Hindi ready</p>
      </div>
    </div>
  );
}

function ModesVisual() {
  return (
    <div className="grid h-64 grid-cols-2 gap-2 rounded-2xl bg-[var(--night)] p-4">
      {[
        ["Simple", "Pay before the 28th."],
        ["हिंदी", "28 तारीख से पहले भुगतान करें।"],
        ["Elder", "This letter is about your bill…"],
        ["ELI5", "Like a shop asking for money…"],
      ].map(([t, b]) => (
        <div key={t} className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
          <p className="text-[11px] font-medium text-[var(--glow)]">{t}</p>
          <p className="mt-2 text-[12px] leading-snug text-white/75">{b}</p>
        </div>
      ))}
    </div>
  );
}

function ActionVisual() {
  return (
    <div className="flex h-64 flex-col justify-center gap-3 rounded-2xl border border-[var(--line)] bg-white p-6">
      {["Pay ₹2,840 via UPI", "Save receipt to vault", "Tell Dad — due Friday"].map((item, i) => (
        <div key={item} className="flex items-center gap-3 rounded-xl bg-[var(--mist)] px-4 py-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)] text-[11px] font-bold text-white">
            {i + 1}
          </span>
          <span className="text-sm font-medium text-[var(--night)]">{item}</span>
        </div>
      ))}
    </div>
  );
}
