"use client";

import { useState } from "react";
import type { DocumentAnalysis, ReadingMode } from "@/lib/types";
import {
  downloadReport,
  downloadReportPdf,
  printReport,
} from "@/lib/export-report";
import { categoryLabel } from "@/lib/category-focus";
import AdSlot from "@/components/AdSlot";
import CategoryDesk from "./CategoryDesk";
import DocumentChat from "./DocumentChat";
import ReadAloud from "./ReadAloud";

const MODES: { id: ReadingMode; label: string }[] = [
  { id: "simple", label: "English" },
  { id: "hindi", label: "हिंदी" },
  { id: "marathi", label: "मराठी" },
  { id: "tamil", label: "தமிழ்" },
  { id: "bengali", label: "বাংলা" },
  { id: "gujarati", label: "ગુજરાતી" },
  { id: "elder", label: "Elder" },
  { id: "eli5", label: "ELI5" },
];

function summaryFor(mode: ReadingMode, analysis: DocumentAnalysis) {
  switch (mode) {
    case "hindi":
      return analysis.summaryHindi;
    case "marathi":
      return analysis.summaryMarathi || analysis.summaryHindi;
    case "tamil":
      return analysis.summaryTamil || analysis.summarySimple;
    case "bengali":
      return analysis.summaryBengali || analysis.summarySimple;
    case "gujarati":
      return analysis.summaryGujarati || analysis.summarySimple;
    case "elder":
      return analysis.summaryElder;
    case "eli5":
      return analysis.eli5;
    default:
      return analysis.summarySimple;
  }
}

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
  const [mode, setMode] = useState<ReadingMode>("simple");
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const summary = summaryFor(mode, analysis);
  const scam = analysis.scamScore ?? 0;
  const everyday =
    analysis.isEverydayDocument !== false &&
    analysis.category !== "not_a_document";

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
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-[var(--accent)]">
              DOCUMENT SUMMARY
            </p>
            <h3 className="mt-1 font-display text-2xl text-[var(--night)]">
              Read it the way your family needs
            </h3>
          </div>
          <span className="border border-[var(--night)] bg-[var(--glow)] px-3 py-1 text-[11px] font-bold text-[var(--night)]">
            NEW · VOICE READ-ALOUD
          </span>
        </div>
        <div className="no-print flex flex-wrap gap-2">
          {MODES.map(({ id, label }) => (
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
        <ReadAloud text={summary} mode={mode} />
        {analysis.whatHappensIfIgnored && (
          <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-950">
            <span className="font-semibold">If ignored: </span>
            {analysis.whatHappensIfIgnored}
          </p>
        )}
      </section>

      {everyday && analysis.category !== "id_kyc" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="border border-[var(--night)] bg-[var(--panel)] p-6">
            <h3 className="font-display text-xl text-[var(--night)]">
              {analysis.category === "school_notice"
                ? "Parent action plan"
                : analysis.category === "utility_bill"
                  ? "Payment action plan"
                  : analysis.category === "loan_finance"
                    ? "Money action plan"
                    : analysis.category === "legal_notice"
                      ? "Legal next steps"
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
                  : analysis.category === "legal_notice"
                    ? "Claims & dates on the notice"
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

      {everyday && analysis.category === "id_kyc" && (
        <section className="border border-[var(--night)] bg-[var(--panel)] p-6">
          <h3 className="font-display text-xl text-[var(--night)]">ID privacy checklist</h3>
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
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {everyday && analysis.legalGuidance && (
        <section className="border border-[var(--night)] bg-[var(--night)] text-white">
          <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
            <div className="border-b border-white/15 p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <p className="text-xs font-semibold text-[var(--glow)]">
                {analysis.category === "legal_notice"
                  ? "LEGAL DOCUMENT HELP"
                  : "RIGHTS & ESCALATION GUIDE"}
              </p>
              <h3 className="mt-4 font-display text-3xl">
                {analysis.category === "legal_notice"
                  ? "Understand the notice — then get real legal help if needed."
                  : "Know what this document asks of you."}
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

      <DocumentChat analysis={analysis} />

      <AdSlot variant="banner" />
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
