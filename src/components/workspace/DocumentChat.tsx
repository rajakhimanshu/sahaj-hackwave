"use client";

import { useState } from "react";
import { humanizeApiError } from "@/lib/errors";
import type { AskResponse, ChatTurn, DocumentAnalysis } from "@/lib/types";

const STARTERS: Record<string, string[]> = {
  utility_bill: [
    "What is the total amount and due date?",
    "Where should I pay safely?",
    "What happens if I pay late?",
  ],
  legal_notice: [
    "What does this notice ask me to do?",
    "Is there a deadline to reply?",
    "Who should I contact officially?",
  ],
  id_kyc: [
    "What type of ID is this?",
    "How should I share this safely?",
    "Where do I update details officially?",
  ],
  school_notice: [
    "What must parents do next?",
    "Is there a fee or deadline?",
    "What should I send with my child?",
  ],
  default: [
    "Explain this document simply",
    "What should I do next?",
    "Any scam or risk flags?",
  ],
};

export default function DocumentChat({
  analysis,
}: {
  analysis: DocumentAnalysis;
}) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatTurn[]>([
    {
      role: "assistant",
      text:
        analysis.category === "id_kyc"
          ? "I’m Sahaj chat. This looks like an ID/KYC document — I’ll focus on privacy and official use, not bill payments."
          : analysis.category === "legal_notice"
            ? "I’m Sahaj chat. This looks like a legal/civic notice — I’ll explain what’s written, not give lawyer advice."
            : "I’m Sahaj chat. Ask anything grounded in this document’s brief.",
    },
  ]);
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [last, setLast] = useState<AskResponse | null>(null);

  const starters =
    STARTERS[analysis.category] || STARTERS.default;

  async function ask(q?: string) {
    const text = (q ?? question).trim();
    if (!text || asking) return;
    setAsking(true);
    setError(null);
    setMessages((m) => [...m, { role: "user", text }]);
    setQuestion("");

    try {
      const history = [...messages, { role: "user" as const, text }].slice(-8);
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis, question: text, history }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Ask failed");
      }
      const answer = data.answer as AskResponse;
      setLast(answer);
      const block = [
        answer.answer,
        answer.answerHindi ? `हिंदी: ${answer.answerHindi}` : "",
        answer.answerMarathi ? `मराठी: ${answer.answerMarathi}` : "",
      ]
        .filter(Boolean)
        .join("\n\n");
      setMessages((m) => [...m, { role: "assistant", text: block }]);
    } catch (e) {
      const msg = humanizeApiError(e, "Could not answer right now.");
      setError(msg);
      setMessages((m) => [
        ...m,
        { role: "assistant", text: `Sorry — ${msg}` },
      ]);
    } finally {
      setAsking(false);
    }
  }

  return (
    <section className="no-print border border-[var(--night)] bg-[var(--panel)]">
      <div className="border-b border-[var(--night)] bg-[var(--night)] px-5 py-4 text-white sm:px-6">
        <p className="text-xs font-semibold text-[var(--glow)]">DOCUMENT CHATBOT</p>
        <h3 className="mt-1 font-display text-2xl">Ask Sahaj about this paper</h3>
        <p className="mt-1 text-xs text-white/60">
          Grounded answers from this brief · English + Hindi + Marathi when available
        </p>
      </div>

      <div className="max-h-[22rem] space-y-3 overflow-y-auto px-5 py-4 sm:px-6">
        {messages.map((m, i) => (
          <div
            key={`${m.role}-${i}`}
            className={`max-w-[92%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${
              m.role === "user"
                ? "ml-auto bg-[var(--accent)] text-white"
                : "bg-[var(--mist)] text-[var(--ink)]"
            }`}
          >
            {m.text}
          </div>
        ))}
        {asking && (
          <p className="text-xs font-semibold text-[var(--slate)]">Sahaj is thinking…</p>
        )}
      </div>

      <div className="border-t border-[var(--line)] px-5 py-3 sm:px-6">
        <div className="mb-3 flex flex-wrap gap-2">
          {starters.map((s) => (
            <button
              key={s}
              type="button"
              disabled={asking}
              onClick={() => void ask(s)}
              className="focus-ring rounded-full border border-[var(--line)] bg-white px-3 py-1 text-xs hover:bg-[var(--paper)] disabled:opacity-50"
            >
              {s}
            </button>
          ))}
          {last?.followUps?.map((f) => (
            <button
              key={f}
              type="button"
              disabled={asking}
              onClick={() => void ask(f)}
              className="focus-ring rounded-full border border-[var(--glow)] bg-[color-mix(in_oklab,var(--glow)_28%,white)] px-3 py-1 text-xs disabled:opacity-50"
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void ask()}
            placeholder="Ask about amounts, deadlines, risks, or next steps…"
            className="h-12 flex-1 border border-[var(--line)] bg-[var(--paper)] px-4 outline-none focus:ring-2 focus:ring-[var(--accent)]"
            disabled={asking}
          />
          <button
            type="button"
            disabled={asking || !question.trim()}
            onClick={() => void ask()}
            className="h-12 bg-[var(--accent)] px-6 text-sm font-semibold text-white disabled:opacity-50"
          >
            {asking ? "…" : "Send"}
          </button>
        </div>
        {error && (
          <p role="alert" className="mt-3 text-sm text-[var(--danger)]">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}
