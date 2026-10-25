"use client";

import { useSyncExternalStore } from "react";
import type { DocumentAnalysis } from "@/lib/types";
import {
  compareUtilityBill,
  formatInr,
} from "@/lib/bill-compare";

function subscribeNoop() {
  return () => {};
}

export default function BillCompare({
  analysis,
  fileName,
}: {
  analysis: DocumentAnalysis;
  fileName?: string;
}) {
  const ready = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const result = ready ? compareUtilityBill(analysis, fileName) : null;

  if (analysis.category !== "utility_bill") return null;

  if (!ready) {
    return (
      <section className="border border-[var(--night)] bg-[var(--panel)] p-6 sm:p-8">
        <p className="text-xs font-semibold text-[var(--accent)]">BILL COMPARE</p>
        <p className="mt-3 text-sm text-[var(--slate)]">Loading vault history…</p>
      </section>
    );
  }

  if (!result) {
    return (
      <section className="border border-[var(--night)] bg-[var(--panel)] p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-semibold text-[var(--accent)]">
            BILL COMPARE
          </p>
          <span className="border border-[var(--night)] bg-[var(--mist)] px-2 py-0.5 text-[10px] font-bold text-[var(--slate)]">
            NEEDS VAULT HISTORY
          </span>
        </div>
        <h3 className="mt-3 font-display text-2xl text-[var(--night)]">
          Month-vs-month compare unlocks after you save a prior bill.
        </h3>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--slate)]">
          Save this brief to the family vault, then upload next month&apos;s bill.
          Sahaj will match the issuer and show how the amount moved.
        </p>
      </section>
    );
  }

  const tone =
    result.direction === "up"
      ? "text-[var(--danger)]"
      : result.direction === "down"
        ? "text-[var(--ok)]"
        : "text-[var(--night)]";
  const arrow =
    result.direction === "up" ? "↑" : result.direction === "down" ? "↓" : "→";
  const deltaLabel =
    result.direction === "same"
      ? "About the same"
      : `${arrow} ${formatInr(Math.abs(result.delta))}${
          result.deltaPct != null ? ` (${Math.abs(result.deltaPct)}%)` : ""
        }`;

  return (
    <section className="border border-[var(--night)] bg-[var(--panel)]">
      <div className="border-b border-[var(--night)] px-6 py-5 sm:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-semibold text-[var(--accent)]">
            BILL COMPARE
          </p>
          <span className="border border-[var(--night)] bg-[var(--glow)] px-2 py-0.5 text-[10px] font-bold text-[var(--night)]">
            NEW · MONTH VS MONTH
          </span>
          {result.source === "demo-baseline" && (
            <span className="text-[10px] font-semibold text-[var(--slate)]">
              Demo baseline
            </span>
          )}
        </div>
        <h3 className="mt-3 font-display text-3xl text-[var(--night)]">
          How this bill stacks against the last one.
        </h3>
        <p className="mt-2 text-sm text-[var(--slate)]">{result.matchedOn}</p>
      </div>

      <div className="grid sm:grid-cols-3">
        <div className="border-b border-[var(--night)] p-6 sm:border-b-0 sm:border-r">
          <p className="text-xs text-[var(--slate)]">This bill</p>
          <p className="mt-2 font-display text-4xl text-[var(--night)]">
            {formatInr(result.currentAmount)}
          </p>
        </div>
        <div className="border-b border-[var(--night)] p-6 sm:border-b-0 sm:border-r">
          <p className="text-xs text-[var(--slate)]">Previous</p>
          <p className="mt-2 font-display text-4xl text-[var(--night)]">
            {formatInr(result.previousAmount)}
          </p>
          <p className="mt-2 text-xs text-[var(--slate)] line-clamp-2">
            {result.previousLabel}
            {result.previousDue ? ` · due ${result.previousDue}` : ""}
          </p>
        </div>
        <div className="p-6">
          <p className="text-xs text-[var(--slate)]">Change</p>
          <p className={`mt-2 font-display text-4xl ${tone}`}>{deltaLabel}</p>
        </div>
      </div>

      <ul className="border-t border-[var(--night)] px-6 py-5 text-sm leading-6 text-[var(--ink-soft)] sm:px-8">
        {result.tips.map((tip) => (
          <li key={tip} className="ml-4 list-disc">
            {tip}
          </li>
        ))}
      </ul>
    </section>
  );
}
