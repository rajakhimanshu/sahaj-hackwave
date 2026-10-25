import Link from "next/link";

export default function SiteHeader({ variant = "marketing" }: { variant?: "marketing" | "app" }) {
  const marketing = variant === "marketing";

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
        marketing
          ? "border-[var(--night)] bg-[color-mix(in_oklab,var(--paper)_92%,transparent)]"
          : "border-[var(--line)] bg-[color-mix(in_oklab,var(--panel)_90%,transparent)]"
      }`}
    >
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between px-5 sm:px-10 lg:px-14">
        <Link
          href="/"
          className="focus-ring flex items-center gap-3 font-display text-[1.35rem] font-semibold tracking-tight text-[var(--night)]"
        >
          <span className="flex h-7 w-7 items-center justify-center bg-[var(--accent)] font-sans text-xs font-bold text-white">
            स
          </span>
          Sahaj
        </Link>

        <nav className="flex items-center gap-1 text-[13px] sm:gap-2">
          {marketing ? (
            <>
              <Link href="/#product" className="focus-ring hidden px-3 py-2 text-[var(--ink-soft)] hover:text-[var(--accent)] md:inline">
                Product
              </Link>
              <Link href="/#how" className="focus-ring hidden px-3 py-2 text-[var(--ink-soft)] hover:text-[var(--accent)] md:inline">
                How it works
              </Link>
              <Link href="/security" className="focus-ring hidden px-3 py-2 text-[var(--ink-soft)] hover:text-[var(--accent)] md:inline">
                Security
              </Link>
              <Link href="/about" className="focus-ring hidden px-3 py-2 text-[var(--ink-soft)] hover:text-[var(--accent)] lg:inline">
                About
              </Link>
              <Link href="/app/vault" className="focus-ring hidden px-3 py-2 text-[var(--ink-soft)] hover:text-[var(--accent)] sm:inline">
                Vault
              </Link>
              <Link
                href="/app"
                className="focus-ring ml-1 bg-[var(--night)] px-4 py-2.5 font-semibold text-white hover:bg-[var(--accent)]"
              >
                Open Sahaj ↗
              </Link>
            </>
          ) : (
            <>
              <Link href="/app" className="rounded-lg px-3 py-2 text-[var(--slate)] hover:bg-[var(--mist)] hover:text-[var(--ink)]">
                Workspace
              </Link>
              <Link href="/app/vault" className="rounded-lg px-3 py-2 text-[var(--slate)] hover:bg-[var(--mist)] hover:text-[var(--ink)]">
                Vault
              </Link>
              <Link href="/" className="rounded-lg px-3 py-2 text-[var(--slate)] hover:bg-[var(--mist)] hover:text-[var(--ink)]">
                Home
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
