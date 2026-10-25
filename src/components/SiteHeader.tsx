import Link from "next/link";

export default function SiteHeader({ variant = "marketing" }: { variant?: "marketing" | "app" }) {
  const marketing = variant === "marketing";

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
        marketing
          ? "border-white/10 bg-[color-mix(in_oklab,#07111f_72%,transparent)]"
          : "border-[var(--line)] bg-[color-mix(in_oklab,var(--panel)_90%,transparent)]"
      }`}
    >
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className={`font-display text-[1.35rem] font-semibold tracking-tight ${
            marketing ? "text-white" : "text-[var(--night)]"
          }`}
        >
          Sahaj
        </Link>

        <nav className="flex items-center gap-1 text-[13px] sm:gap-2">
          {marketing ? (
            <>
              <Link href="/#product" className="hidden rounded-lg px-3 py-2 text-white/65 hover:text-white md:inline">
                Product
              </Link>
              <Link href="/#how" className="hidden rounded-lg px-3 py-2 text-white/65 hover:text-white md:inline">
                How it works
              </Link>
              <Link href="/#families" className="hidden rounded-lg px-3 py-2 text-white/65 hover:text-white md:inline">
                For families
              </Link>
              <Link href="/app/vault" className="hidden rounded-lg px-3 py-2 text-white/65 hover:text-white sm:inline">
                Vault
              </Link>
              <Link
                href="/app"
                className="ml-1 rounded-full bg-white px-4 py-2.5 font-semibold text-[var(--night)] hover:bg-[var(--glow)]"
              >
                Open platform
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
