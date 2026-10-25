"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeAnalysis } from "@/lib/category-focus";
import {
  ALLOWED_UPLOAD_LABEL,
  MAX_UPLOAD_BYTES,
  MAX_UPLOAD_LABEL,
} from "@/lib/export-report";
import type { DocumentAnalysis } from "@/lib/types";
import { getActiveProfile, profileStatsCopy } from "@/lib/local-profile";
import { saveToVault, vaultStats } from "@/lib/vault";
import { DEMO_ANALYSIS } from "@/lib/demo-analysis";
import AnalysisView from "./AnalysisView";
import Link from "next/link";

type Phase = "idle" | "analyzing" | "ready" | "error";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
]);

export default function Workspace() {
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, needsAttention: 0 });
  const [dragOver, setDragOver] = useState(false);
  const [profileLine, setProfileLine] = useState("Guest mode · vault stays on this browser");

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setStats(vaultStats());
      setProfileLine(profileStatsCopy(getActiveProfile()));
      if (new URLSearchParams(window.location.search).get("demo") === "1") {
        setFileName("BESCOM-March-demo.pdf");
        setAnalysis(DEMO_ANALYSIS);
        setPhase("ready");
      }
    });
    return () => {
      cancelAnimationFrame(frame);
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }, []);

  async function onFile(file: File) {
    setError(null);
    setAnalysis(null);

    if (!ALLOWED_TYPES.has(file.type)) {
      setPhase("error");
      setError("This file type is not supported. Choose a JPG, PNG, WEBP, GIF, or PDF.");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setPhase("error");
      setError(
        `This file is larger than ${MAX_UPLOAD_LABEL}. Compress it or crop the photo, then try again.`
      );
      return;
    }

    setFileName(file.name);
    setPhase("analyzing");

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    if (file.type.startsWith("image/")) {
      const previewUrl = URL.createObjectURL(file);
      previewUrlRef.current = previewUrl;
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
      const next = normalizeAnalysis(data.analysis as DocumentAnalysis);
      setAnalysis(next);
      setPhase("ready");
      showToast(
        next.isEverydayDocument ? "Brief ready" : "Not everyday paperwork"
      );
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
    });
    setStats(vaultStats());
    showToast("Saved to family vault");
  }

  function loadDemo() {
    setError(null);
    setPreview(null);
    setFileName("BESCOM-March-demo.pdf");
    setAnalysis(DEMO_ANALYSIS);
    setPhase("ready");
    showToast("Demo brief loaded");
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-5 border-b border-[var(--night)] pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-[var(--accent)]">NEW BRIEF</p>
          <h1 className="mt-2 font-display text-4xl text-[var(--night)] sm:text-5xl">Understand a document</h1>
          <p className="mt-2 max-w-xl text-[var(--slate)]">
            Drop household paperwork. Sahaj builds a category desk, bilingual brief,
            scam check, and action plan — random photos are flagged, not treated as bills.
          </p>
        </div>
        <div className="flex flex-col items-stretch gap-3 text-sm sm:items-end">
          <div className="flex gap-3">
            <div className="border border-[var(--night)] bg-[var(--panel)] px-4 py-2">
              <span className="text-[var(--slate)]">Vault </span>
              <span className="font-semibold">{stats.total}</span>
            </div>
            <div className="border border-[var(--night)] bg-[var(--panel)] px-4 py-2">
              <span className="text-[var(--slate)]">Attention </span>
              <span className="font-semibold text-[var(--warn)]">
                {stats.needsAttention}
              </span>
            </div>
          </div>
          <Link
            href="/app/account"
            className="focus-ring border border-[var(--night)] bg-[var(--glow)] px-3 py-2 text-xs font-semibold text-[var(--night)]"
          >
            {profileLine} ↗
          </Link>
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
        className={`ruled-paper border-2 border-dashed p-8 transition sm:p-12 ${
          dragOver ? "border-[var(--accent)] bg-[color-mix(in_oklab,var(--glow)_25%,white)]" : "border-[var(--night)]"
        }`}
      >
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto mb-5 flex h-14 w-12 rotate-3 items-center justify-center border border-[var(--night)] bg-[var(--glow)] text-xl">
            +
          </div>
          <h2 className="font-display text-3xl text-[var(--night)]">Place your document here</h2>
          <p className="mt-2 text-sm text-[var(--slate)]">
            {ALLOWED_UPLOAD_LABEL} · max {MAX_UPLOAD_LABEL} · drag &amp; drop
          </p>
          <p className="mt-1 text-xs text-[var(--slate)]">
            Limit exists so Gemini can finish quickly on phone photos. Larger scans: compress first.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="focus-ring h-12 bg-[var(--night)] px-6 text-sm font-semibold text-white hover:bg-[var(--accent)]"
            >
              Choose file
            </button>
            <button
              type="button"
              onClick={() => cameraRef.current?.click()}
              className="focus-ring h-12 border border-[var(--night)] bg-[var(--panel)] px-6 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--mist)]"
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
          <p role="alert" className="mx-auto mt-6 max-w-lg border border-[var(--danger)] bg-red-50 px-4 py-3 text-center text-sm text-red-800">
            {error}
          </p>
        )}
      </div>

      {(phase === "idle" || phase === "error") && (
        <div className="mt-6 grid border border-[var(--night)] bg-[var(--panel)] sm:grid-cols-[1fr_auto]">
          <div className="p-5 sm:p-6">
            <p className="font-semibold text-[var(--night)]">No document nearby?</p>
            <p className="mt-1 text-sm text-[var(--slate)]">
              Load a complete electricity-bill brief. Every mode, checklist, vault, export, and Q&A control stays usable.
            </p>
          </div>
          <button
            type="button"
            onClick={loadDemo}
            className="focus-ring border-t border-[var(--night)] bg-[var(--glow)] px-7 py-4 text-sm font-bold text-[var(--night)] hover:bg-[#e2a936] sm:border-l sm:border-t-0"
          >
            Load judge demo ↗
          </button>
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
        <div role="status" className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 border border-white/20 bg-[var(--night)] px-5 py-2.5 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
