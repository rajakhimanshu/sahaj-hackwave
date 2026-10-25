"use client";

import { useRef, useState, useTransition } from "react";
import type { AskResponse, DocumentAnalysis } from "@/lib/types";

type Phase = "idle" | "analyzing" | "ready" | "error";

export default function SahajApp() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [question, setQuestion] = useState("");
  const [askResult, setAskResult] = useState<AskResponse | null>(null);
  const [asking, startAsk] = useTransition();

  async function onFile(file: File) {
    setError(null);
    setAskResult(null);
    setAnalysis(null);
    setFileName(file.name);
    setPhase("analyzing");

    if (file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/analyze", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setAnalysis(data.analysis);
      setPhase("ready");
    } catch (e) {
      setPhase("error");
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  function ask() {
    if (!analysis || !question.trim()) return;
    startAsk(async () => {
      setAskResult(null);
      try {
        const res = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ analysis, question }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Ask failed");
        setAskResult(data.answer);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Ask failed");
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-5 pb-20 pt-10 sm:px-8">
      <header className="mb-12 max-w-2xl">
        <p className="mb-3 text-sm font-medium tracking-[0.18em] text-[var(--accent)] uppercase">
          Sahaj
        </p>
        <h1 className="font-display text-4xl leading-[1.1] tracking-tight text-[var(--ink)] sm:text-5xl">
          Understand any Indian document in seconds
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
          Upload a bill, school notice, insurance letter, or government form.
          Gemini reads it and explains what it means — in plain English and Hindi —
          with clear next steps.
        </p>
      </header>

      <section
        className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6 sm:p-8"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) void onFile(f);
        }}
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl text-[var(--ink)]">Upload document</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              JPG, PNG, WEBP, or PDF · max 8MB
            </p>
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex h-12 items-center justify-center rounded-xl bg-[var(--ink)] px-6 text-sm font-semibold text-[var(--paper)] transition hover:bg-[var(--ink-soft)]"
          >
            Choose file
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onFile(f);
            }}
          />
        </div>

        {(preview || fileName) && (
          <div className="mt-6 flex items-start gap-4 border-t border-[var(--line)] pt-6">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="Document preview"
                className="h-28 w-28 rounded-lg object-cover ring-1 ring-[var(--line)]"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-lg bg-[var(--wash)] text-xs text-[var(--muted)] ring-1 ring-[var(--line)]">
                PDF
              </div>
            )}
            <div>
              <p className="font-medium text-[var(--ink)]">{fileName}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {phase === "analyzing" && "Gemini is reading your document…"}
                {phase === "ready" && "Analysis ready"}
                {phase === "error" && "Could not analyze"}
              </p>
            </div>
          </div>
        )}

        {phase === "analyzing" && (
          <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-[var(--wash)]">
            <div className="h-full w-1/3 animate-[slide_1.2s_ease-in-out_infinite] rounded-full bg-[var(--accent)]" />
          </div>
        )}

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </p>
        )}
      </section>

      {analysis && (
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6">
            <p className="text-xs font-semibold tracking-wider text-[var(--accent)] uppercase">
              Meaning
            </p>
            <h3 className="mt-2 font-display text-2xl text-[var(--ink)]">
              {analysis.title || analysis.documentType}
            </h3>
            <p className="mt-1 text-sm text-[var(--muted)]">{analysis.documentType}</p>
            <p className="mt-4 leading-relaxed text-[var(--ink)]">{analysis.summarySimple}</p>
            <p className="mt-3 leading-relaxed text-[var(--ink-soft)]">{analysis.summaryHindi}</p>
            {analysis.amounts?.length > 0 && (
              <ul className="mt-5 space-y-2 border-t border-[var(--line)] pt-4">
                {analysis.amounts.map((a) => (
                  <li key={a.label} className="flex justify-between gap-4 text-sm">
                    <span className="text-[var(--muted)]">{a.label}</span>
                    <span className="font-semibold text-[var(--ink)]">{a.value}</span>
                  </li>
                ))}
              </ul>
            )}
          </article>

          <article className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6">
            <p className="text-xs font-semibold tracking-wider text-[var(--accent)] uppercase">
              Do this
            </p>
            <ol className="mt-4 space-y-3">
              {analysis.actionChecklist?.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--wash)] text-xs font-bold text-[var(--ink)]">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium text-[var(--ink)]">{item.step}</p>
                    {(item.deadline || item.priority === "high") && (
                      <p className="mt-0.5 text-[var(--muted)]">
                        {item.deadline && <>By {item.deadline} · </>}
                        {item.priority} priority
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>

            {analysis.riskFlags?.length > 0 && (
              <ul className="mt-5 space-y-2 border-t border-[var(--line)] pt-4">
                {analysis.riskFlags.map((r, i) => (
                  <li
                    key={i}
                    className={`rounded-lg px-3 py-2 text-sm ${
                      r.level === "danger"
                        ? "bg-red-50 text-red-900"
                        : r.level === "warning"
                          ? "bg-amber-50 text-amber-950"
                          : "bg-[var(--wash)] text-[var(--ink)]"
                    }`}
                  >
                    {r.message}
                  </li>
                ))}
              </ul>
            )}
          </article>

          <article className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6 lg:col-span-2">
            <p className="text-xs font-semibold tracking-wider text-[var(--accent)] uppercase">
              Ask Sahaj
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Questions are answered only from this document analysis (grounded).
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && ask()}
                placeholder="e.g. When is the last date to pay?"
                className="h-12 flex-1 rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 text-[var(--ink)] outline-none ring-[var(--accent)] focus:ring-2"
              />
              <button
                type="button"
                onClick={ask}
                disabled={asking || !question.trim()}
                className="h-12 rounded-xl bg-[var(--accent)] px-6 text-sm font-semibold text-white disabled:opacity-50"
              >
                {asking ? "Thinking…" : "Ask"}
              </button>
            </div>
            {askResult && (
              <div className="mt-4 rounded-xl bg-[var(--wash)] p-4">
                <p className="leading-relaxed text-[var(--ink)]">{askResult.answer}</p>
                <p className="mt-2 leading-relaxed text-[var(--ink-soft)]">
                  {askResult.answerHindi}
                </p>
              </div>
            )}
          </article>
        </div>
      )}
    </div>
  );
}
