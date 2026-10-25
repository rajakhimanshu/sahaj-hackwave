export default function ProductMock() {
  return (
    <div className="product-mock relative w-full overflow-hidden rounded-t-[1.25rem] border border-[var(--line)] border-b-0 bg-[#0b1524] shadow-[0_-24px_80px_rgba(7,17,31,0.35)]">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-[11px] text-white/45">sahaj.app / workspace</span>
      </div>

      <div className="grid gap-0 lg:grid-cols-[220px_1fr]">
        <aside className="hidden border-r border-white/10 bg-white/[0.03] p-4 lg:block">
          <p className="text-[10px] font-medium tracking-wide text-white/40">Workspace</p>
          <ul className="mt-3 space-y-1 text-[12px] text-white/70">
            {["New brief", "Family vault", "Ask Sahaj", "Export"].map((item, i) => (
              <li
                key={item}
                className={`rounded-lg px-3 py-2 ${i === 0 ? "bg-white/10 text-white" : "hover:bg-white/5"}`}
              >
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <p className="text-[10px] text-white/40">Attention</p>
            <p className="mt-1 font-display text-2xl text-[#9fd6d0]">2</p>
            <p className="text-[11px] text-white/50">deadlines this week</p>
          </div>
        </aside>

        <div className="bg-[#f4f7fa] p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium text-[var(--accent)]">utility bill</p>
              <h3 className="font-display text-xl text-[var(--night)] sm:text-2xl">
                BESCOM electricity bill — March
              </h3>
              <p className="mt-1 text-[12px] text-[var(--slate)]">94% confidence · Hindi + Elder ready</p>
            </div>
            <div className="flex gap-2">
              <span className="rounded-full bg-[#07111f] px-3 py-1 text-[11px] text-white">Scam 12/100</span>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] text-amber-900">Pay by 28 Mar</span>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              ["Amount due", "₹2,840"],
              ["Last date", "28 Mar"],
              ["Who should know", "Parent paying bills"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-[var(--line)] bg-white px-3 py-3">
                <p className="text-[10px] text-[var(--slate)]">{k}</p>
                <p className="mt-1 text-sm font-semibold text-[var(--night)]">{v}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <div className="rounded-xl border border-[var(--line)] bg-white p-4">
              <p className="text-[11px] font-medium text-[var(--slate)]">Meaning</p>
              <p className="mt-2 text-[13px] leading-relaxed text-[var(--ink)]">
                This is your power bill for March. Pay ₹2,840 before the 28th to avoid late fee.
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-[var(--ink-soft)]">
                यह मार्च का बिजली बिल है। 28 तारीख से पहले ₹2,840 जमा करें।
              </p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-white p-4">
              <p className="text-[11px] font-medium text-[var(--slate)]">Do this</p>
              <ol className="mt-2 space-y-2 text-[13px] text-[var(--ink)]">
                <li className="flex gap-2"><span className="text-[var(--accent)]">1</span> Open BESCOM / UPI and pay ₹2,840</li>
                <li className="flex gap-2"><span className="text-[var(--accent)]">2</span> Save receipt to vault</li>
                <li className="flex gap-2"><span className="text-[var(--accent)]">3</span> Tell household the due date</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
