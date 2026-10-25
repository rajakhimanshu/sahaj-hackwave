import Link from "next/link";

export default function AdSlot({
  variant = "inline",
}: {
  variant?: "inline" | "banner";
}) {
  if (variant === "banner") {
    return (
      <aside className="border border-dashed border-[var(--night)] bg-[color-mix(in_oklab,var(--glow)_22%,white)] px-4 py-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--slate)]">
              Sponsored · keeps Sahaj free
            </p>
            <p className="mt-1 text-sm font-semibold text-[var(--night)]">
              Official bill-pay &amp; literacy partners can sponsor this slot
            </p>
          </div>
          <Link
            href="/earn"
            className="focus-ring shrink-0 border border-[var(--night)] bg-[var(--panel)] px-3 py-2 text-xs font-semibold"
          >
            Revenue model →
          </Link>
        </div>
      </aside>
    );
  }

  return (
    <aside className="border border-[var(--line)] bg-[var(--mist)] p-4 text-sm">
      <p className="text-[10px] font-semibold uppercase text-[var(--slate)]">
        Ad placeholder
      </p>
      <p className="mt-2 text-[var(--ink-soft)]">
        Transparent family-safe ads fund free document help. No sale of vault
        data.
      </p>
      <Link href="/earn" className="mt-3 inline-block text-xs font-semibold text-[var(--accent)]">
        See earning model →
      </Link>
    </aside>
  );
}
