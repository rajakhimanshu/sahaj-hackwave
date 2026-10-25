import Link from "next/link";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--paper)] lg:grid lg:grid-cols-[15rem_1fr]">
      <aside className="hidden min-h-screen border-r border-[var(--night)] bg-[var(--night)] p-6 text-white lg:flex lg:flex-col">
        <Link href="/" className="focus-ring flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center bg-[var(--accent)] text-xs font-bold">
            स
          </span>
          <span className="font-display text-2xl">Sahaj</span>
        </Link>

        <nav className="mt-14 space-y-2 text-sm">
          <Link
            href="/app"
            className="focus-ring block border-l-2 border-[var(--glow)] bg-white/10 px-4 py-3"
          >
            New brief
          </Link>
          <Link
            href="/app/vault"
            className="focus-ring block border-l-2 border-transparent px-4 py-3 text-white/65 hover:border-white/30 hover:bg-white/5 hover:text-white"
          >
            Family vault
          </Link>
          <Link
            href="/app?demo=1"
            className="focus-ring block border-l-2 border-transparent px-4 py-3 text-white/65 hover:border-white/30 hover:bg-white/5 hover:text-white"
          >
            Demo document
          </Link>
          <Link
            href="/security"
            className="focus-ring block border-l-2 border-transparent px-4 py-3 text-white/65 hover:border-white/30 hover:bg-white/5 hover:text-white"
          >
            Security &amp; DPDP
          </Link>
        </nav>

        <div className="mt-auto border-t border-white/15 pt-6">
          <p className="text-[11px] font-semibold text-[var(--glow)]">
            DEVICE-LOCAL VAULT
          </p>
          <p className="mt-2 text-xs leading-5 text-white/50">
            No login dashboard yet — briefs stay in this browser. Gemini reads
            uploads only to build the brief.
          </p>
          <Link
            href="/privacy"
            className="focus-ring mt-4 inline-block text-xs text-white/65 hover:text-white"
          >
            Privacy notice →
          </Link>
          <Link
            href="/"
            className="focus-ring mt-3 block text-xs text-white/65 hover:text-white"
          >
            ← Back to website
          </Link>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[var(--night)] bg-[color-mix(in_oklab,var(--paper)_92%,transparent)] px-5 backdrop-blur lg:hidden">
          <Link href="/" className="focus-ring flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center bg-[var(--accent)] text-xs font-bold text-white">
              स
            </span>
            <span className="font-display text-xl text-[var(--night)]">Sahaj</span>
          </Link>
          <nav className="flex gap-4 text-xs font-semibold text-[var(--ink-soft)]">
            <Link href="/app">Workspace</Link>
            <Link href="/app/vault">Vault</Link>
          </nav>
        </header>

        <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
