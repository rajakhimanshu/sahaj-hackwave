import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function LegalPage({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--paper)]">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-5 py-14 sm:px-10 lg:px-14">
        <p className="reveal-up text-xs font-semibold text-[var(--accent)]">{eyebrow}</p>
        <h1 className="reveal-up mt-4 font-display text-4xl leading-tight text-[var(--night)] sm:text-5xl">
          {title}
        </h1>
        <p className="reveal-up mt-5 max-w-2xl text-base leading-7 text-[var(--ink-soft)]">
          {lead}
        </p>
        <div className="reveal-up mt-10 space-y-8 border-t border-[var(--night)] pt-10 text-sm leading-7 text-[var(--ink-soft)]">
          {children}
        </div>
        <p className="mt-12 text-xs text-[var(--slate)]">
          Questions? Start in the{" "}
          <Link href="/app" className="underline underline-offset-2">
            workspace
          </Link>{" "}
          or read{" "}
          <Link href="/security" className="underline underline-offset-2">
            Security &amp; DPDP
          </Link>
          .
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-2xl text-[var(--night)]">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}
