"use client";

import { useState } from "react";
import type { AskResponse, DocumentAnalysis } from "@/lib/types";
import {
  downloadReport,
  downloadReportPdf,
  printReport,
} from "@/lib/export-report";
import { categoryLabel } from "@/lib/category-focus";
import CategoryDesk from "./CategoryDesk";

type Mode = "simple" | "hindi" | "elder" | "eli5";

export default function AnalysisView({
  analysis,
  fileName,
  preview,
  onSaved,
}: {
  analysis: DocumentAnalysis;
  fileName: string;
  preview: string | null;
  onSaved: () => void;
}) {
  const [mode, setMode] = useState<Mode>("simple");
  const [question, setQuestion] = useState("");
  const [askResult, setAskResult] = useState<AskResponse | null>(null);
  const [asking, setAsking] = useState(false);
  const [askError, setAskError] = useState<string | null>(null);
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const summary =
    mode === "hindi"
      ? analysis.summaryHindi
      : mode === "elder"
        ? analysis.summaryElder
        : mode === "eli5"
          ? analysis.eli5
          : analysis.summarySimple;

  async function ask(q?: string) {
    const text = (q ?? question).trim();
    if (!text) return;
    setAsking(true);
    setAskError(null);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis, question: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ask failed");
      setAskResult(data.answer);
      setQuestion(text);
    } catch (e) {
      setAskError(e instanceof Error ? e.message : "Ask failed");
    } finally {
      setAsking(false);
    }
  }

  const scam = analysis.scamScore ?? 0;
  const everyday = analysis.isEverydayDocument !== false && analysis.category !== "not_a_document";

  return (
    <div className="space-y-6 print:space-y-4">
      <div className="folder-shadow reveal-up flex flex-col gap-4 border border-[var(--night)] bg-[var(--panel)] p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="h-20 w-20 rounded-xl object-cover ring-1 ring-[var(--line)]" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-[var(--mist)] text-xs text-[var(--slate)] ring-1 ring-[var(--line)]">
              DOC
            </div>
          )}
          <div>
            <p className="text-xs font-medium text-[var(--accent)]">
              {categoryLabel(analysis.category)}
            </p>
            <h2 className="font-display text-2xl text-[var(--night)]">{analysis.title || analysis.documentType}</h2>
            <p className="mt-1 text-sm text-[var(--slate)]">
              {analysis.documentType} · {Math.round((analysis.confidence ?? 0) * 100)}% confidence · {fileName}
            </p>
          </div>
        </div>
        <div className="no-print flex flex-wrap gap-2">
          {everyday && (
            <button
              type="button"
              onClick={onSaved}
              className="focus-ring rounded-xl border border-[var(--line)] px-3 py-2 text-sm font-medium hover:bg-[var(--mist)]"
            >
              Save to vault
            </button>
          )}
          <button
            type="button"
            onClick={() => downloadReportPdf(analysis, fileName)}
            className="focus-ring rounded-xl bg-[var(--accent)] px-3 py-2 text-sm font-medium text-white hover:bg-[var(--accent-deep)]"
          >
            Download PDF
          </button>
          <button
            type="button"
            onClick={() => downloadReport(analysis, fileName)}
            className="focus-ring rounded-xl border border-[var(--line)] px-3 py-2 text-sm font-medium hover:bg-[var(--mist)]"
          >
            Download TXT
          </button>
          <button
            type="button"
            onClick={printReport}
            className="focus-ring rounded-xl bg-[var(--night)] px-3 py-2 text-sm font-medium text-white"
          >
            Print
          </button>
        </div>
      </div>

      <CategoryDesk analysis={analysis} />

      {everyday ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <Metric
            label="Scam risk"
            value={`${scam}/100`}
            tone={scam >= 60 ? "danger" : scam >= 30 ? "warn" : "ok"}
          />
          <Metric
            label="High-priority actions"
            value={String(analysis.actionChecklist?.filter((a) => a.priority === "high").length || 0)}
            tone="neutral"
          />
          <Metric
            label="Urgent dates"
            value={String(analysis.importantDates?.filter((d) => d.urgency === "high").length || 0)}
            tone="neutral"
          />
        </div>
      ) : (
        <div className="border border-[var(--danger)] bg-red-50 px-5 py-4 text-sm text-red-900">
          Sahaj did not treat this upload as household or civic paperwork. Re-upload a clear
          photo or PDF of a bill, notice, form, policy, or official letter.
        </div>
      )}

      <section className="ruled-paper border border-[var(--night)] p-6 sm:p-8">
        <div className="no-print flex flex-wrap gap-2">
          {(
            [
              ["simple", "Simple"],
              ["hindi", "हिंदी"],
              ["elder", "Elder"],
              ["eli5", "ELI5"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={mode === id}
              onClick={() => setMode(id)}
              className={`rounded-full px-3 py-1.5 text-sm ${
                mode === id
                  ? "bg-[var(--night)] text-white"
                  : "bg-[var(--mist)] text-[var(--ink-soft)] hover:bg-[var(--line)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="mt-4 text-base leading-relaxed text-[var(--ink)]">{summary}</p>
        {analysis.whatHappensIfIgnored && (
          <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-950">
            <span className="font-semibold">If ignored: </span>
            {analysis.whatHappensIfIgnored}
          </p>
        )}
      </section>

      {everyday && (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="border border-[var(--night)] bg-[var(--panel)] p-6">
            <h3 className="font-display text-xl text-[var(--night)]">
              {analysis.category === "school_notice"
                ? "Parent action plan"
                : analysis.category === "utility_bill"
                  ? "Payment action plan"
                  : analysis.category === "loan_finance"
                    ? "Money action plan"
                    : "Action plan"}
            </h3>
            <ol className="mt-4 space-y-3">
              {(analysis.actionChecklist || []).map((item, i) => (
                <li key={i} className="flex gap-3">
                  <input
                    type="checkbox"
                    aria-label={`Mark action complete: ${item.step}`}
                    checked={!!checked[i]}
                    onChange={() => setChecked((c) => ({ ...c, [i]: !c[i] }))}
                    className="mt-1 h-4 w-4 accent-[var(--accent)]"
                  />
                  <div className={checked[i] ? "opacity-50 line-through" : ""}>
                    <p className="font-medium text-[var(--ink)]">{item.step}</p>
                    <p className="text-xs text-[var(--slate)]">
                      {item.priority} priority
                      {item.deadline ? ` · by ${item.deadline}` : ""}
                      {item.doneHint ? ` · ${item.doneHint}` : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="border border-[var(--night)] bg-[var(--panel)] p-6">
            <h3 className="font-display text-xl text-[var(--night)]">
              {analysis.category === "medical"
                ? "Clinic & dates"
                : analysis.category === "school_notice"
                  ? "Fees & dates"
                  : "Money & dates"}
            </h3>
            {(analysis.amounts || []).length === 0 &&
            (analysis.importantDates || []).length === 0 ? (
              <p className="mt-4 text-sm text-[var(--slate)]">
                No amounts or dates were clearly visible on this document.
              </p>
            ) : (
              <>
                <ul className="mt-4 space-y-2">
                  {(analysis.amounts || []).map((a) => (
                    <li
                      key={a.label}
                      className="flex justify-between gap-3 border-b border-[var(--mist)] py-2 text-sm"
                    >
                      <span className="text-[var(--slate)]">{a.label}</span>
                      <span className="font-semibold">{a.value}</span>
                    </li>
                  ))}
                </ul>
                <ul className="mt-4 space-y-2">
                  {(analysis.importantDates || []).map((d) => (
                    <li key={d.label + d.date} className="flex justify-between gap-3 text-sm">
                      <span className="text-[var(--slate)]">{d.label}</span>
                      <span
                        className={
                          d.urgency === "high" ? "font-semibold text-[var(--danger)]" : ""
                        }
                      >
                        {d.date}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        </div>
      )}

      {everyday && (analysis.riskFlags?.length > 0 || analysis.consumerTips?.length > 0) && (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="border border-[var(--night)] bg-[var(--panel)] p-6">
            <h3 className="font-display text-xl text-[var(--night)]">Risks</h3>
            <ul className="mt-4 space-y-2">
              {(analysis.riskFlags || []).map((r, i) => (
                <li
                  key={i}
                  className={`rounded-xl px-3 py-2 text-sm ${
                    r.level === "danger"
                      ? "bg-red-50 text-red-900"
                      : r.level === "warning"
                        ? "bg-amber-50 text-amber-950"
                        : "bg-[var(--mist)]"
                  }`}
                >
                  {r.message}
                </li>
              ))}
            </ul>
          </section>
          <section className="border border-[var(--night)] bg-[var(--panel)] p-6">
            <h3 className="font-display text-xl text-[var(--night)]">Consumer tips</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[var(--ink-soft)]">
              {(analysis.consumerTips || []).map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            {analysis.familyWhoShouldKnow?.length > 0 && (
              <>
                <h4 className="mt-5 text-sm font-semibold text-[var(--night)]">Family who should know</h4>
                <p className="mt-1 text-sm text-[var(--slate)]">{analysis.familyWhoShouldKnow.join(" · ")}</p>
              </>
            )}
          </section>
        </div>
      )}

      {everyday && (analysis.glossary?.length > 0 || analysis.keyQuotes?.length > 0) && (
        <div className="grid gap-6 lg:grid-cols-2">
          {analysis.glossary?.length > 0 && (
            <section className="border border-[var(--night)] bg-[var(--panel)] p-6">
              <h3 className="font-display text-xl text-[var(--night)]">Glossary</h3>
              <dl className="mt-4 space-y-3">
                {analysis.glossary.map((g) => (
                  <div key={g.term}>
                    <dt className="text-sm font-semibold">{g.term}</dt>
                    <dd className="text-sm text-[var(--slate)]">{g.meaning}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
          {analysis.keyQuotes?.length > 0 && (
            <section className="border border-[var(--night)] bg-[var(--panel)] p-6">
              <h3 className="font-display text-xl text-[var(--night)]">From the document</h3>
              <ul className="mt-4 space-y-2">
                {analysis.keyQuotes.map((q) => (
                  <li key={q} className="border-l-2 border-[var(--accent)] pl-3 text-sm italic text-[var(--ink-soft)]">
                    “{q}”
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      {everyday && analysis.legalGuidance && (
        <section className="border border-[var(--night)] bg-[var(--night)] text-white">
          <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
            <div className="border-b border-white/15 p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <p className="text-xs font-semibold text-[var(--glow)]">
                RIGHTS &amp; ESCALATION GUIDE
              </p>
              <h3 className="mt-4 font-display text-3xl">
                Know what this document asks of you.
              </h3>
              <p className="mt-4 text-sm leading-6 text-white/65">
                {analysis.legalGuidance.documentNature}
              </p>
              <div className="mt-6 border-l-2 border-[var(--glow)] pl-4 text-xs leading-5 text-white/60">
                Sahaj explains documents; it does not provide legal advice.
                For legal consequences or disputes, consult the issuing
                authority or a qualified professional.
              </div>
            </div>

            <div className="grid gap-px bg-white/15 sm:grid-cols-2">
              <LegalList
                title="Your obligations"
                items={analysis.legalGuidance.obligations}
              />
              <LegalList
                title="Your options"
                items={analysis.legalGuidance.rightsOrOptions}
              />
              <LegalList
                title="Escalation path"
                items={analysis.legalGuidance.escalationSteps}
              />
              <LegalList
                title="Official help"
                items={analysis.legalGuidance.officialHelp}
              />
            </div>
          </div>
          {analysis.legalGuidance.urgencyReason && (
            <p className="border-t border-white/15 bg-[var(--accent)] px-6 py-3 text-sm text-white sm:px-8">
              <span className="font-semibold">Why it may be urgent: </span>
              {analysis.legalGuidance.urgencyReason}
            </p>
          )}
        </section>
      )}

      <section className="no-print border border-[var(--night)] bg-[var(--panel)] p-6">
        <h3 className="font-display text-xl text-[var(--night)]">Ask Sahaj</h3>
        <p className="mt-1 text-sm text-[var(--slate)]">
          {everyday
            ? "Grounded answers only from this analysis."
            : "You can still ask what the upload appears to be — Sahaj will not invent bill details."}
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void ask()}
            placeholder="When is the last date? Who issued this?"
            className="h-12 flex-1 rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
          <button
            type="button"
            disabled={asking || !question.trim()}
            onClick={() => void ask()}
            className="h-12 rounded-xl bg-[var(--accent)] px-6 text-sm font-semibold text-white disabled:opacity-50"
          >
            {asking ? "Thinking…" : "Ask"}
          </button>
        </div>
        {askError && <p className="mt-3 text-sm text-[var(--danger)]">{askError}</p>}
        {askResult && (
          <div className="mt-4 rounded-xl bg-[var(--mist)] p-4">
            {askResult.mode === "grounded-fallback" && (
              <p className="mb-3 text-[11px] font-semibold text-[var(--warn)]">
                GEMINI BUSY · ANSWERED FROM EXTRACTED BRIEF
              </p>
            )}
            <p className="leading-relaxed">{askResult.answer}</p>
            <p className="mt-2 leading-relaxed text-[var(--ink-soft)]">{askResult.answerHindi}</p>
            {askResult.followUps?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {askResult.followUps.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => void ask(f)}
                    className="rounded-full border border-[var(--line)] bg-white px-3 py-1 text-xs hover:bg-[var(--paper)]"
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function LegalList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-[var(--night)] p-6">
      <h4 className="text-sm font-semibold text-[var(--glow)]">{title}</h4>
      {items?.length ? (
        <ul className="mt-3 list-disc space-y-2 pl-4 text-xs leading-5 text-white/75">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-xs text-white/45">
          Not stated in this document.
        </p>
      )}
    </div>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "ok" | "warn" | "danger" | "neutral";
}) {
  const color =
    tone === "danger"
      ? "text-[var(--danger)]"
      : tone === "warn"
        ? "text-[var(--warn)]"
        : tone === "ok"
          ? "text-[var(--ok)]"
          : "text-[var(--night)]";
  return (
    <div className="border border-[var(--night)] bg-[var(--panel)] p-4">
      <p className="text-xs text-[var(--slate)]">{label}</p>
      <p className={`mt-1 font-display text-3xl ${color}`}>{value}</p>
    </div>
  );
}
