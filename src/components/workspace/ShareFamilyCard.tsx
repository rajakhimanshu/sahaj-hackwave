"use client";

import { useState } from "react";
import type { DocumentAnalysis } from "@/lib/types";
import {
  copyFamilyShareText,
  downloadShareCardPng,
  openWhatsAppShare,
} from "@/lib/share-card";

export default function ShareFamilyCard({
  analysis,
}: {
  analysis: DocumentAnalysis;
}) {
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const isId = analysis.category === "id_kyc";

  async function onCopy() {
    try {
      await copyFamilyShareText(analysis);
      setStatus("Message copied — paste into WhatsApp or SMS.");
    } catch {
      setStatus("Clipboard blocked — use WhatsApp share instead.");
    }
  }

  async function onImage() {
    setBusy(true);
    setStatus(null);
    try {
      await downloadShareCardPng(analysis);
      setStatus("Share image downloaded — attach it in WhatsApp.");
    } catch {
      setStatus("Could not build the share image in this browser.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="no-print border border-[var(--night)] bg-[var(--panel)]">
      <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
        <div className="border-b border-[var(--night)] p-6 sm:p-8 lg:border-b-0 lg:border-r">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs font-semibold text-[var(--accent)]">
              FAMILY SHARE
            </p>
            <span className="border border-[var(--night)] bg-[var(--glow)] px-2 py-0.5 text-[10px] font-bold text-[var(--night)]">
              NEW · WHATSAPP READY
            </span>
          </div>
          <h3 className="mt-3 font-display text-3xl text-[var(--night)]">
            Send the brief to someone who should know.
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--slate)]">
            {isId
              ? "For ID papers we share a privacy checklist only — never forward the full photo of an Aadhaar, PAN, or passport on chat."
              : "Opens WhatsApp with a short family message: summary, next steps, amounts, and dates. Or download a share image."}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => openWhatsAppShare(analysis)}
              className="focus-ring bg-[#128C7E] px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110"
            >
              Share on WhatsApp
            </button>
            <button
              type="button"
              onClick={onCopy}
              className="focus-ring border border-[var(--night)] px-4 py-2.5 text-sm font-semibold hover:bg-[var(--mist)]"
            >
              Copy message
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={onImage}
              className="focus-ring border border-[var(--night)] bg-[var(--night)] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {busy ? "Building…" : "Download share image"}
            </button>
          </div>
          {status && (
            <p role="status" className="mt-4 text-xs text-[var(--ok)]">
              {status}
            </p>
          )}
        </div>
        <div className="bg-[var(--night)] p-6 text-white sm:p-8">
          <p className="text-xs font-semibold text-[var(--glow)]">CARD PREVIEW</p>
          <p className="mt-3 font-display text-2xl leading-snug">
            {(isId
              ? "ID / KYC privacy checklist"
              : analysis.title || analysis.documentType
            ).slice(0, 72)}
          </p>
          <p className="mt-4 text-sm leading-6 text-white/70">
            {(analysis.summarySimple || "").slice(0, 160)}
            {(analysis.summarySimple || "").length > 160 ? "…" : ""}
          </p>
          <ul className="mt-5 space-y-2 text-sm text-white/80">
            {(analysis.actionChecklist || []).slice(0, 2).map((a) => (
              <li key={a.step} className="border-l-2 border-[var(--glow)] pl-3">
                {a.step}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[11px] text-white/45">
            Scam risk {analysis.scamScore ?? 0}/100 · Sahaj explains documents
          </p>
        </div>
      </div>
    </section>
  );
}
