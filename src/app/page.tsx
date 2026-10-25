import SahajApp from "@/components/SahajApp";

export default function Home() {
  return (
    <main className="flex-1">
      <nav className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4 sm:px-8">
        <span className="font-display text-lg font-semibold tracking-tight text-[var(--ink)]">
          Sahaj
        </span>
        <span className="text-xs font-medium tracking-wide text-[var(--muted)] uppercase">
          Powered by Google Gemini
        </span>
      </nav>
      <SahajApp />
      <footer className="border-t border-[var(--line)] px-5 py-6 text-center text-xs text-[var(--muted)] sm:px-8">
        Hack Wave · Civic + Family + Education · Built with Gemini multimodal
      </footer>
    </main>
  );
}
