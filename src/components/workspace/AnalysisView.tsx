"use client";

import { useState } from "react";
import type { AskResponse, DocumentAnalysis } from "@/lib/types";
import { downloadReport, printReport } from "@/lib/export-report";

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

  return (
    <div className="space-y-6 print:space-y-4">
      <div className="flex flex-col gap-4 rounded-2xl border border-[var(--line)] bg-white p-5 sm:flex-row sm:items-start sm:justify-between">
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
            <p className="text-xs font-medium text-[var(--accent)]">{analysis.category?.replaceAll("_", " ")}</p>
            <h2 className="font-display text-2xl text-[var(--night)]">{analysis.title || analysis.documentType}</h2>
            <p className="mt-1 text-sm text-[var(--slate)]">
              {analysis.documentType} · {Math.round((analysis.confidence ?? 0) * 100)}% confidence · {fileName}
            </p>
          </div>
        </div>
        <div className="no-print flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onSaved}
            className="rounded-xl border border-[var(--line)] px-3 py-2 text-sm font-medium hover:bg-[var(--mist)]"
          >
            Save to vault
          </button>
          <button
            type="button"
            onClick={() => downloadReport(analysis, fileName)}
            className="rounded-xl border border-[var(--line)] px-3 py-2 text-sm font-medium hover:bg-[var(--mist)]"
          >
            Download brief
          </button>
          <button
            type="button"
            onClick={printReport}
            className="rounded-xl bg-[var(--night)] px-3 py-2 text-sm font-medium text-white"
          >
            Print
          </button>
        </div>
      </div>

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

      <section className="rounded-2xl border border-[var(--line)] bg-white p-6">
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

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-[var(--line)] bg-white p-6">
          <h3 className="font-display text-xl text-[var(--night)]">Action plan</h3>
          <ol className="mt-4 space-y-3">
            {(analysis.actionChecklist || []).map((item, i) => (
              <li key={i} className="flex gap-3">
                <input
                  type="checkbox"
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

        <section className="rounded-2xl border border-[var(--line)] bg-white p-6">
          <h3 className="font-display text-xl text-[var(--night)]">Money & dates</h3>
          <ul className="mt-4 space-y-2">
            {(analysis.amounts || []).map((a) => (
              <li key={a.label} className="flex justify-between gap-3 border-b border-[var(--mist)] py-2 text-sm">
                <span className="text-[var(--slate)]">{a.label}</span>
                <span className="font-semibold">{a.value}</span>
              </li>
            ))}
          </ul>
          <ul className="mt-4 space-y-2">
            {(analysis.importantDates || []).map((d) => (
              <li key={d.label + d.date} className="flex justify-between gap-3 text-sm">
                <span className="text-[var(--slate)]">{d.label}</span>
                <span className={d.urgency === "high" ? "font-semibold text-[var(--danger)]" : ""}>
                  {d.date}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {(analysis.riskFlags?.length > 0 || analysis.consumerTips?.length > 0) && (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-[var(--line)] bg-white p-6">
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
          <section className="rounded-2xl border border-[var(--line)] bg-white p-6">
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

      {(analysis.glossary?.length > 0 || analysis.keyQuotes?.length > 0) && (
        <div className="grid gap-6 lg:grid-cols-2">
          {analysis.glossary?.length > 0 && (
            <section className="rounded-2xl border border-[var(--line)] bg-white p-6">
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
            <section className="rounded-2xl border border-[var(--line)] bg-white p-6">
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

      <section className="no-print rounded-2xl border border-[var(--line)] bg-white p-6">
        <h3 className="font-display text-xl text-[var(--night)]">Ask Sahaj</h3>
        <p className="mt-1 text-sm text-[var(--slate)]">Grounded answers only from this analysis.</p>
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
    <div className="rounded-2xl border border-[var(--line)] bg-white p-4">
      <p className="text-xs text-[var(--slate)]">{label}</p>
      <p className={`mt-1 font-display text-3xl ${color}`}>{value}</p>
    </div>
  );
}
