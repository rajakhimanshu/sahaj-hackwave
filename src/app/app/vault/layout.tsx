import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Family vault",
  description: "Review and export document briefs saved on this device.",
};

export default function VaultLayout({ children }: { children: React.ReactNode }) {
  return children;
}
