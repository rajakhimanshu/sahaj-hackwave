"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { VaultItem } from "@/lib/types";
import { deleteVaultItem, listVault } from "@/lib/vault";
import { downloadReport } from "@/lib/export-report";

export default function VaultPage() {
  const [items, setItems] = useState<VaultItem[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  function refresh() {
    setItems(listVault());
  }

  useEffect(() => {
    const frame = requestAnimationFrame(refresh);
    return () => cancelAnimationFrame(frame);
  }, []);

  const open = items.find((i) => i.id === openId);

  return (
    <div>
      <div className="mb-8 flex items-end justify-between gap-4 border-b border-[var(--night)] pb-7">
        <div>
          <p className="text-xs font-semibold text-[var(--accent)]">ON THIS DEVICE</p>
          <h1 className="mt-2 font-display text-4xl text-[var(--night)] sm:text-5xl">Family vault</h1>
          <p className="mt-2 text-[var(--slate)]">
            Documents stay on this device. Clear browser data to remove them.
          </p>
        </div>
        <Link href="/app" className="focus-ring bg-[var(--night)] px-4 py-2.5 text-sm font-semibold text-white">
          New brief
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="ruled-paper border-2 border-dashed border-[var(--night)] px-6 py-16 text-center">
          <p className="font-display text-2xl text-[var(--night)]">Vault is empty</p>
          <p className="mt-2 text-sm text-[var(--slate)]">Analyze a document, then tap Save to vault.</p>
          <Link href="/app" className="focus-ring mt-6 inline-flex border border-[var(--night)] bg-[var(--panel)] px-4 py-2 text-sm font-medium">
            Go to workspace
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(item.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    openId === item.id
                      ? "border-[var(--accent)] bg-[var(--panel)] shadow-[5px_5px_0_var(--glow)]"
                      : "border-[var(--night)] bg-[var(--panel)] hover:border-[var(--accent)]"
                  }`}
                >
                  <div className="flex gap-3">
                    {item.previewDataUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.previewDataUrl} alt="" className="h-14 w-14 rounded-lg object-cover" />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[var(--mist)] text-[10px] text-[var(--slate)]">
                        DOC
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-[var(--night)]">
                        {item.analysis.title || item.fileName}
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--slate)]">
                        {new Date(item.createdAt).toLocaleString()} · scam {item.analysis.scamScore ?? 0}
                      </p>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>

          <div className="border border-[var(--night)] bg-[var(--panel)] p-6">
            {open ? (
              <>
                <h2 className="font-display text-2xl text-[var(--night)]">{open.analysis.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
                  {open.analysis.summarySimple}
                </p>
                <p className="mt-2 text-sm text-[var(--slate)]">{open.analysis.summaryHindi}</p>
                <ol className="mt-4 space-y-2 text-sm">
                  {(open.analysis.actionChecklist || []).slice(0, 5).map((a, i) => (
                    <li key={i}>
                      {i + 1}. {a.step}
                    </li>
                  ))}
                </ol>
                <div className="mt-6 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => downloadReport(open.analysis, open.fileName)}
                    className="rounded-xl bg-[var(--night)] px-4 py-2 text-sm font-medium text-white"
                  >
                    Download brief
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      deleteVaultItem(open.id);
                      setOpenId(null);
                      refresh();
                    }}
                    className="rounded-xl border border-[var(--line)] px-4 py-2 text-sm text-[var(--danger)]"
                  >
                    Delete
                  </button>
                </div>
              </>
            ) : (
              <p className="text-[var(--slate)]">Select a document to review.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
