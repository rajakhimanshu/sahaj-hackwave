import Link from "next/link";

export default function SiteHeader({ variant = "marketing" }: { variant?: "marketing" | "app" }) {
  return (
    <header
      className={`sticky top-0 z-40 border-b border-[var(--line)] backdrop-blur-md ${
        variant === "app" ? "bg-[color-mix(in_oklab,var(--panel)_88%,transparent)]" : "bg-[color-mix(in_oklab,var(--paper)_80%,transparent)]"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight text-[var(--night)]">
          Sahaj
        </Link>
        <nav className="flex items-center gap-1 text-sm sm:gap-2">
          {variant === "marketing" ? (
            <>
              <Link href="/#how" className="hidden rounded-lg px-3 py-2 text-[var(--slate)] hover:text-[var(--ink)] sm:inline">
                How it works
              </Link>
              <Link href="/#features" className="hidden rounded-lg px-3 py-2 text-[var(--slate)] hover:text-[var(--ink)] sm:inline">
                Platform
              </Link>
              <Link
                href="/app"
                className="rounded-xl bg-[var(--night)] px-4 py-2.5 font-medium text-white hover:bg-[var(--ink)]"
              >
                Open workspace
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
