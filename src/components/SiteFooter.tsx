import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-[var(--night)] bg-[var(--paper)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:grid-cols-2 sm:px-10 lg:grid-cols-4 lg:px-14">
        <div>
          <p className="font-display text-3xl text-[var(--night)]">Sahaj</p>
          <p className="mt-2 text-xs leading-5 text-[var(--slate)]">
            Paperwork made understandable for Indian families. Device-local vault.
            Document education — not legal advice.
          </p>
        </div>
        <nav className="flex flex-col gap-2 text-sm text-[var(--ink-soft)]">
          <p className="text-xs font-semibold text-[var(--accent)]">PRODUCT</p>
          <Link href="/app" className="focus-ring w-fit hover:text-[var(--accent)]">
            Workspace
          </Link>
          <Link href="/app/vault" className="focus-ring w-fit hover:text-[var(--accent)]">
            Family vault
          </Link>
          <Link href="/app?demo=1" className="focus-ring w-fit hover:text-[var(--accent)]">
            Live demo
          </Link>
          <Link href="/about" className="focus-ring w-fit hover:text-[var(--accent)]">
            About
          </Link>
          <Link href="/earn" className="focus-ring w-fit hover:text-[var(--accent)]">
            Earn / ads model
          </Link>
        </nav>
        <nav className="flex flex-col gap-2 text-sm text-[var(--ink-soft)]">
          <p className="text-xs font-semibold text-[var(--accent)]">TRUST</p>
          <Link href="/security" className="focus-ring w-fit hover:text-[var(--accent)]">
            Security &amp; DPDP
          </Link>
          <Link href="/privacy" className="focus-ring w-fit hover:text-[var(--accent)]">
            Privacy
          </Link>
          <Link href="/terms" className="focus-ring w-fit hover:text-[var(--accent)]">
            Terms
          </Link>
        </nav>
        <div className="text-sm leading-6 text-[var(--slate)]">
          <p className="text-xs font-semibold text-[var(--accent)]">HACK WAVE</p>
          <p className="mt-2">Civic · Family · Education</p>
          <p>Powered by Google Gemini multimodal</p>
        </div>
      </div>
    </footer>
  );
}
