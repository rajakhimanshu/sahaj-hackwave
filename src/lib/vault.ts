import type { DocumentAnalysis, VaultItem } from "./types";

const KEY = "sahaj_vault_v1";

function read(): VaultItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as VaultItem[];
  } catch {
    return [];
  }
}

function write(items: VaultItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items.slice(0, 40)));
}

export function listVault(): VaultItem[] {
  return read().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function saveToVault(input: {
  fileName: string;
  analysis: DocumentAnalysis;
  previewDataUrl?: string;
}): VaultItem {
  const item: VaultItem = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    fileName: input.fileName,
    previewDataUrl: input.previewDataUrl,
    analysis: input.analysis,
    tags: [input.analysis.category, input.analysis.documentType].filter(Boolean),
  };
  const next = [item, ...read().filter((x) => x.fileName !== input.fileName)];
  write(next);
  return item;
}

export function getVaultItem(id: string): VaultItem | undefined {
  return read().find((x) => x.id === id);
}

export function deleteVaultItem(id: string) {
  write(read().filter((x) => x.id !== id));
}

export function vaultStats() {
  const items = read();
  const high = items.filter((i) =>
    i.analysis.importantDates?.some((d) => d.urgency === "high") ||
    i.analysis.actionChecklist?.some((a) => a.priority === "high") ||
    (i.analysis.scamScore ?? 0) >= 60
  ).length;
  return { total: items.length, needsAttention: high };
}
