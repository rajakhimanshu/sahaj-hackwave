import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

const documentTypes = [
  ["01", "Bills", "Electricity, water, gas and phone"],
  ["02", "School", "Circulars, fees and permissions"],
  ["03", "Money", "Loans, insurance and tax"],
  ["04", "Civic", "Notices, forms and certificates"],
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[var(--paper)]">
      <SiteHeader />

      <main>
        <section className="relative border-b border-[var(--night)]">
          <div className="paper-grain pointer-events-none absolute inset-0 opacity-[0.16]" />
          <div className="relative mx-auto grid min-h-[44rem] max-w-7xl lg:grid-cols-[1.04fr_0.96fr]">
            <div className="flex flex-col justify-between border-[var(--night)] px-5 py-12 sm:px-10 sm:py-16 lg:border-r lg:px-14 lg:py-20">
              <div>
                <div className="reveal-up flex items-center gap-3 text-xs font-semibold text-[var(--accent)]">
                  <span className="pulse-dot h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                  FAMILY DOCUMENT INTELLIGENCE
                </div>
                <h1 className="reveal-up mt-10 max-w-[11ch] font-display text-[3.6rem] leading-[0.96] tracking-[-0.045em] text-[var(--night)] sm:text-[5.4rem] lg:text-[6.4rem]">
                  Paperwork,
                  <br />
                  made <span className="text-[var(--accent)]">sahaj.</span>
                </h1>
                <p className="reveal-up mt-8 max-w-xl text-base leading-7 text-[var(--ink-soft)] sm:text-lg">
                  Photograph any bill, notice, policy, or form. Sahaj reads the
                  fine print and gives your family a plain-language brief,
                  Hindi explanation, risk check, and exact next steps.
                </p>
              </div>

              <div className="reveal-up mt-12 flex flex-wrap items-center gap-4">
                <Link
                  href="/app"
                  className="focus-ring inline-flex min-h-12 items-center bg-[var(--night)] px-6 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                >
                  Understand a document
                  <span aria-hidden className="ml-4 text-lg">↗</span>
                </Link>
                <Link
                  href="/app?demo=1"
                  className="focus-ring inline-flex min-h-12 items-center border border-[var(--night)] px-6 text-sm font-semibold text-[var(--night)] hover:bg-[var(--panel)]"
                >
                  Try the live demo
                </Link>
                <p className="w-full text-xs text-[var(--slate)]">
                  No sign-up · Device vault · DPDP-minded · Gemini multimodal
                </p>
              </div>
            </div>

            <DocumentDesk />
          </div>
        </section>

        <section className="border-b border-[var(--night)] bg-[var(--glow)]">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-5 py-4 text-sm font-semibold text-[var(--night)] sm:flex-row sm:px-10 lg:px-14">
            <span>One photograph → one category-specific family brief</span>
            <span>Gemini Vision · Grounded Q&A · Private device vault</span>
          </div>
        </section>

        <section className="border-b border-[var(--night)] bg-[var(--night)] text-white">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:grid-cols-3 sm:px-10 lg:px-14">
            {[
              ["Voice + languages", "Listen to briefs in English, Hindi, Marathi and more."],
              ["Category desks", "Bills, IDs, and legal notices each get their own guidance shape."],
              ["Local vault · free core", "On-device storage. Transparent ads fund the free tier."],
            ].map(([title, copy]) => (
              <article key={title} className="border-l-2 border-[var(--glow)] pl-4">
                <h3 className="text-sm font-semibold text-[var(--glow)]">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-white/65">{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="product" className="mx-auto max-w-7xl border-x border-[var(--night)]">
          <div className="grid border-b border-[var(--night)] lg:grid-cols-[0.7fr_1.3fr]">
            <div className="border-[var(--night)] p-8 sm:p-12 lg:border-r">
              <p className="text-xs font-semibold text-[var(--accent)]">
                THE PROBLEM
              </p>
              <h2 className="mt-6 font-display text-4xl leading-tight text-[var(--night)] sm:text-5xl">
                Important information should not live in one person&apos;s head.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2">
              {documentTypes.map(([number, title, detail], index) => (
                <article
                  key={title}
                  className={`min-h-52 p-8 sm:p-10 ${
                    index % 2 === 0 ? "sm:border-r" : ""
                  } ${index < 2 ? "border-b" : ""} border-[var(--line)]`}
                >
                  <span className="font-display text-xl text-[var(--accent)]">
                    {number}
                  </span>
                  <h3 className="mt-8 font-display text-3xl text-[var(--night)]">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--slate)]">{detail}</p>
                </article>
              ))}
            </div>
          </div>

          <div
            id="how"
            className="grid border-b border-[var(--night)] lg:grid-cols-[1.25fr_0.75fr]"
          >
            <div className="ruled-paper min-h-[34rem] border-[var(--night)] px-7 py-12 sm:px-16 lg:border-r">
              <p className="ml-10 text-xs font-semibold text-[var(--accent)]">
                A REAL SAHAJ BRIEF
              </p>
              <div className="ml-10 mt-9 max-w-xl">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-[var(--slate)]">
                      BESCOM electricity bill
                    </p>
                    <h3 className="mt-1 font-display text-3xl text-[var(--night)]">
                      Pay ₹2,840 by 28 March
                    </h3>
                  </div>
                  <span className="stamp px-4 py-2 text-xs font-bold text-[var(--ok)]">
                    LOW RISK
                  </span>
                </div>

                <p className="mt-8 text-base leading-8 text-[var(--ink)]">
                  This is your March electricity bill. Pay the amount before
                  28 March to avoid a late fee or service interruption.
                </p>
                <p className="mt-3 text-base leading-8 text-[var(--ink-soft)]">
                  यह मार्च का बिजली बिल है। लेट फीस से बचने के लिए 28 मार्च से
                  पहले ₹2,840 जमा करें।
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {[
                    ["Amount", "₹2,840"],
                    ["Due", "28 Mar"],
                    ["Confidence", "94%"],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-[var(--paper)] px-4 py-3">
                      <p className="text-[11px] text-[var(--slate)]">{label}</p>
                      <p className="mt-1 font-semibold text-[var(--night)]">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[var(--night)] p-8 text-white sm:p-12">
              <p className="text-xs font-semibold text-[var(--glow)]">
                DO THIS NEXT
              </p>
              <ol className="mt-10 space-y-8">
                {[
                  ["01", "Verify the consumer number"],
                  ["02", "Pay through the official app"],
                  ["03", "Save the receipt to your vault"],
                ].map(([n, text]) => (
                  <li key={n} className="flex gap-5 border-b border-white/15 pb-6">
                    <span className="font-display text-2xl text-[var(--glow)]">
                      {n}
                    </span>
                    <span className="pt-1 text-sm leading-6 text-white/85">
                      {text}
                    </span>
                  </li>
                ))}
              </ol>
              <Link
                href="/app?demo=1"
                className="mt-10 inline-flex border-b border-[var(--glow)] pb-1 text-sm font-semibold text-[var(--glow)]"
              >
                Explore the complete demo ↗
              </Link>
            </div>
          </div>

          <section id="families" className="grid lg:grid-cols-3">
            <div className="border-b border-[var(--night)] p-8 sm:p-12 lg:border-b-0 lg:border-r">
              <p className="text-xs font-semibold text-[var(--accent)]">
                BUILT FOR HOME
              </p>
              <h2 className="mt-5 font-display text-4xl leading-tight text-[var(--night)]">
                Everyone gets the version they need.
              </h2>
            </div>
            {[
              [
                "Four reading modes",
                "Simple English, हिंदी, Elder mode, and ELI5 — without changing the facts.",
              ],
              [
                "One shared memory",
                "Save briefs to the family vault, revisit deadlines, and download a clean report.",
              ],
            ].map(([title, copy]) => (
              <article
                key={title}
                className="border-b border-[var(--line)] p-8 sm:p-12 lg:border-b-0 lg:border-r last:border-r-0"
              >
                <div className="mb-14 h-10 w-10 border border-[var(--night)] bg-[var(--glow)]" />
                <h3 className="font-display text-3xl text-[var(--night)]">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-[var(--slate)]">{copy}</p>
              </article>
            ))}
          </section>

          <section className="grid border-t border-[var(--night)] lg:grid-cols-[0.85fr_1.15fr]">
            <div className="bg-[var(--glow)] p-8 sm:p-12">
              <div className="stamp inline-block px-4 py-2 text-xs font-bold text-[var(--night)]">
                NEW · CIVIC GUIDE
              </div>
              <h2 className="mt-8 font-display text-4xl leading-tight text-[var(--night)]">
                Legal-looking does not have to mean impossible.
              </h2>
            </div>
            <div className="bg-[var(--panel)] p-8 sm:p-12">
              <p className="max-w-2xl text-base leading-8 text-[var(--ink-soft)]">
                Sahaj separates what a notice explicitly requires from general
                guidance. It surfaces obligations, stated options, urgency,
                escalation steps, and the right official or professional help
                to seek.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  ["01", "What it asks"],
                  ["02", "Your stated options"],
                  ["03", "Where to escalate"],
                ].map(([number, label]) => (
                  <div key={number} className="border-t border-[var(--night)] pt-3">
                    <span className="text-xs text-[var(--accent)]">{number}</span>
                    <p className="mt-2 text-sm font-semibold text-[var(--night)]">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-xs leading-5 text-[var(--slate)]">
                Sahaj provides document education, not legal advice. High-risk
                matters are escalated to an official authority or qualified
                professional.
              </p>
            </div>
          </section>
        </section>

        <section className="bg-[var(--accent)] text-white">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-10 px-5 py-16 sm:px-10 sm:py-20 lg:flex-row lg:items-end lg:px-14">
            <h2 className="max-w-3xl font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl">
              The next confusing letter becomes a clear family decision.
            </h2>
            <Link
              href="/app"
              className="focus-ring shrink-0 bg-white px-7 py-4 text-sm font-bold text-[var(--night)]"
            >
              Open Sahaj ↗
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function DocumentDesk() {
  return (
    <div className="relative flex min-h-[38rem] items-center justify-center overflow-hidden bg-[var(--mist)] px-5 py-16 sm:px-12 lg:min-h-full">
      <div className="paper-grain pointer-events-none absolute inset-0 opacity-[0.2]" />
      <div className="float-slow absolute left-8 top-8 font-display text-8xl text-[var(--night)]/[0.05]">
        परिवार
      </div>
      <div
        aria-hidden
        className="ink-orbit pointer-events-none absolute -right-10 top-16 h-40 w-40 rounded-full border border-[var(--night)]/15"
      />
      <div
        aria-hidden
        className="ink-orbit-delay pointer-events-none absolute bottom-16 left-6 h-24 w-24 rounded-full border border-[var(--accent)]/25"
      />
      <div className="hero-folder folder-shadow relative w-full max-w-md border border-[var(--night)] bg-[#d8a94b] p-3 pt-12">
        <div className="absolute -top-8 left-0 h-9 w-44 border border-b-0 border-[var(--night)] bg-[#d8a94b]" />
        <div className="hero-sheet ruled-paper relative min-h-[28rem] overflow-hidden border border-[var(--night)] px-8 py-10 sm:px-12">
          <div
            aria-hidden
            className="document-scan pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]"
          />
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold text-[var(--accent)]">
                SAHAJ / SCHOOL DESK
              </p>
              <h2 className="mt-4 font-display text-3xl leading-tight text-[var(--night)]">
                School fee
                <br />
                notice
              </h2>
            </div>
            <span className="hero-stamp stamp px-3 py-2 text-[10px] font-bold text-[var(--ok)]">
              VERIFIED
            </span>
          </div>
          <dl className="mt-10 space-y-5 text-sm">
            <div className="flex justify-between border-b border-[var(--line)] pb-3">
              <dt className="text-[var(--slate)]">Amount</dt>
              <dd className="font-bold text-[var(--night)]">₹12,500</dd>
            </div>
            <div className="flex justify-between border-b border-[var(--line)] pb-3">
              <dt className="text-[var(--slate)]">Last date</dt>
              <dd className="font-bold text-[var(--accent)]">Monday, 9:00 AM</dd>
            </div>
            <div className="flex justify-between border-b border-[var(--line)] pb-3">
              <dt className="text-[var(--slate)]">Parent action</dt>
              <dd className="font-bold text-[var(--night)]">3 steps</dd>
            </div>
          </dl>
          <p className="mt-8 border-l-4 border-[var(--glow)] pl-4 text-sm leading-6 text-[var(--ink-soft)]">
            “Pay the term fee before Monday. Keep the online receipt for school
            records.”
          </p>
        </div>
      </div>
      <div className="hero-tag float-tag absolute bottom-7 right-7 rotate-3 border border-[var(--night)] bg-[var(--accent)] px-4 py-3 text-xs font-bold text-white">
        EN + हिंदी
      </div>
      <div className="hero-tag absolute left-6 top-24 -rotate-6 border border-[var(--night)] bg-[var(--panel)] px-3 py-2 text-[10px] font-bold text-[var(--night)]">
        DPDP-MINDED
      </div>
    </div>
  );
}
