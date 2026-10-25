import type { Metadata } from "next";
import { Newsreader, Sora } from "next/font/google";
import "./globals.css";

const display = Newsreader({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Sora({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Sahaj — Document intelligence for Indian families",
    template: "%s · Sahaj",
  },
  description:
    "Upload bills, school notices, insurance, and government forms. Gemini explains them in plain language with action plans, scam checks, and a family vault.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col text-[var(--ink)]">{children}</body>
    </html>
  );
}
