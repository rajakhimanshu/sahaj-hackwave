import { categoryLabel } from "@/lib/category-focus";
import type { DocumentAnalysis } from "@/lib/types";

export default function CategoryDesk({ analysis }: { analysis: DocumentAnalysis }) {
  const focus = analysis.categoryFocus;
  const everyday = analysis.isEverydayDocument;

  return (
    <section
      className={`category-desk overflow-hidden border border-[var(--night)] ${
        everyday ? "bg-[var(--panel)]" : "bg-[#2a1714] text-white"
      }`}
    >
      <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
        <div
          className={`border-b border-[var(--night)] p-6 sm:p-8 lg:border-b-0 lg:border-r ${
            everyday ? "" : "border-white/20"
          }`}
        >
          <p
            className={`text-xs font-semibold ${
              everyday ? "text-[var(--accent)]" : "text-[var(--glow)]"
            }`}
          >
            {categoryLabel(analysis.category).toUpperCase()}
          </p>
          <h3
            className={`mt-3 font-display text-3xl leading-tight ${
              everyday ? "text-[var(--night)]" : "text-white"
            }`}
          >
            {focus.headline}
          </h3>
          {focus.primaryAction && (
            <p
              className={`mt-4 border-l-4 pl-4 text-sm leading-6 ${
                everyday
                  ? "border-[var(--glow)] text-[var(--ink-soft)]"
                  : "border-[var(--glow)] text-white/75"
              }`}
            >
              {focus.primaryAction}
            </p>
          )}
          {!everyday && analysis.rejectionHint && (
            <p className="mt-5 rounded-xl bg-white/10 px-4 py-3 text-sm text-white/85">
              {analysis.rejectionHint}
            </p>
          )}
        </div>

        <div className="grid sm:grid-cols-3">
          {focus.metrics.map((metric) => (
            <div
              key={metric.label}
              className={`border-b p-5 sm:border-b-0 sm:border-r sm:last:border-r-0 ${
                everyday ? "border-[var(--line)]" : "border-white/15"
              }`}
            >
              <p
                className={`text-[11px] ${
                  everyday ? "text-[var(--slate)]" : "text-white/55"
                }`}
              >
                {metric.label}
              </p>
              <p
                className={`mt-2 font-display text-2xl ${
                  everyday ? "text-[var(--night)]" : "text-[var(--glow)]"
                }`}
              >
                {metric.value}
              </p>
              {metric.hint && (
                <p
                  className={`mt-1 text-xs ${
                    everyday ? "text-[var(--slate)]" : "text-white/45"
                  }`}
                >
                  {metric.hint}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div
        className={`grid border-t sm:grid-cols-2 ${
          everyday ? "border-[var(--night)]" : "border-white/20"
        }`}
      >
        {focus.panels.map((panel) => (
          <div
            key={panel.title}
            className={`border-b p-6 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 sm:p-8 ${
              everyday ? "border-[var(--line)]" : "border-white/15"
            }`}
          >
            <h4
              className={`text-sm font-semibold ${
                everyday ? "text-[var(--night)]" : "text-[var(--glow)]"
              }`}
            >
              {panel.title}
            </h4>
            <ul
              className={`mt-3 list-disc space-y-2 pl-4 text-sm leading-6 ${
                everyday ? "text-[var(--ink-soft)]" : "text-white/75"
              }`}
            >
              {panel.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
