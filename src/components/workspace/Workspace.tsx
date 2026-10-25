"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DocumentAnalysis } from "@/lib/types";
import { saveToVault, vaultStats } from "@/lib/vault";
import AnalysisView from "./AnalysisView";

type Phase = "idle" | "analyzing" | "ready" | "error";

const SAMPLES = [
  { label: "Utility bill sample", hint: "Try any electricity / water bill photo" },
  { label: "School notice", hint: "Circular, fee note, parent meeting letter" },
  { label: "Insurance / loan", hint: "Premium notice or EMI reminder" },
];

export default function Workspace() {
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, needsAttention: 0 });
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    setStats(vaultStats());
  }, [analysis]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }, []);

  async function onFile(file: File) {
    setError(null);
    setAnalysis(null);
    setFileName(file.name);
    setPhase("analyzing");

    let previewUrl: string | null = null;
    if (file.type.startsWith("image/")) {
      previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    } else {
      setPreview(null);
    }

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/analyze", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setAnalysis(data.analysis as DocumentAnalysis);
      setPhase("ready");
      showToast("Brief ready");
    } catch (e) {
      setPhase("error");
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  function handleSave() {
    if (!analysis) return;
    saveToVault({
      fileName,
      analysis,
      previewDataUrl: preview || undefined,
    });
    setStats(vaultStats());
    showToast("Saved to family vault");
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl text-[var(--night)] sm:text-4xl">Workspace</h1>
          <p className="mt-2 max-w-xl text-[var(--slate)]">
            Drop a document. Sahaj builds a bilingual brief, scam check, and action plan.
          </p>
        </div>
        <div className="flex gap-3 text-sm">
          <div className="rounded-xl border border-[var(--line)] bg-white px-4 py-2">
            <span className="text-[var(--slate)]">Vault </span>
            <span className="font-semibold">{stats.total}</span>
          </div>
          <div className="rounded-xl border border-[var(--line)] bg-white px-4 py-2">
            <span className="text-[var(--slate)]">Attention </span>
            <span className="font-semibold text-[var(--warn)]">{stats.needsAttention}</span>
          </div>
        </div>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) void onFile(f);
        }}
        className={`rounded-3xl border-2 border-dashed bg-white p-8 transition ${
          dragOver ? "border-[var(--accent)] bg-[color-mix(in_oklab,var(--glow)_25%,white)]" : "border-[var(--line)]"
        }`}
      >
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-display text-2xl text-[var(--night)]">Upload document</h2>
          <p className="mt-2 text-sm text-[var(--slate)]">JPG, PNG, WEBP, or PDF · max 8MB · drag & drop</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="h-12 rounded-2xl bg-[var(--night)] px-6 text-sm font-semibold text-white"
            >
              Choose file
            </button>
            <button
              type="button"
              onClick={() => cameraRef.current?.click()}
              className="h-12 rounded-2xl border border-[var(--line)] px-6 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--mist)]"
            >
              Use camera
            </button>
          </div>
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
          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onFile(f);
            }}
          />
        </div>

        {phase === "analyzing" && (
          <div className="mx-auto mt-8 max-w-md">
            <p className="mb-2 text-center text-sm text-[var(--slate)]">
              Gemini is reading {fileName || "your document"}…
            </p>
            <div className="h-1.5 overflow-hidden rounded-full bg-[var(--mist)]">
              <div className="h-full w-1/3 animate-[pulse-bar_1.1s_ease-in-out_infinite] rounded-full bg-[var(--accent)]" />
            </div>
            <ul className="mt-4 space-y-1 text-center text-xs text-[var(--slate)]">
              <li>Extracting parties, amounts, dates</li>
              <li>Building bilingual brief + scam score</li>
              <li>Drafting action checklist</li>
            </ul>
          </div>
        )}

        {error && (
          <p className="mx-auto mt-6 max-w-lg rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-800">
            {error}
          </p>
        )}
      </div>

      {phase === "idle" && (
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {SAMPLES.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-2xl border border-[var(--line)] bg-white p-4 text-left hover:border-[var(--accent)]"
            >
              <p className="font-medium text-[var(--night)]">{s.label}</p>
              <p className="mt-1 text-xs text-[var(--slate)]">{s.hint}</p>
            </button>
          ))}
        </div>
      )}

      {analysis && phase === "ready" && (
        <div className="mt-10">
          <AnalysisView
            analysis={analysis}
            fileName={fileName}
            preview={preview}
            onSaved={handleSave}
          />
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[var(--night)] px-5 py-2.5 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
