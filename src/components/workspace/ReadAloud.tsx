"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import type { ReadingMode } from "@/lib/types";
import { canSpeak, speakText, stopSpeaking } from "@/lib/speech";

function subscribeVoices(onStoreChange: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return () => {};
  }
  const warm = () => {
    window.speechSynthesis.getVoices();
    onStoreChange();
  };
  warm();
  window.speechSynthesis.addEventListener("voiceschanged", warm);
  return () => {
    window.speechSynthesis.removeEventListener("voiceschanged", warm);
  };
}

export default function ReadAloud({
  text,
  mode,
}: {
  text: string;
  mode: ReadingMode;
}) {
  const supported = useSyncExternalStore(subscribeVoices, canSpeak, () => false);
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tracked, setTracked] = useState({ mode, text });

  if (tracked.mode !== mode || tracked.text !== text) {
    setTracked({ mode, text });
    setSpeaking(false);
    setError(null);
  }

  useEffect(() => {
    stopSpeaking();
    return () => stopSpeaking();
  }, [mode, text]);

  function toggle() {
    setError(null);
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    try {
      const utterance = speakText(text, mode);
      setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => {
        setSpeaking(false);
        setError("Could not play voice in this browser.");
      };
    } catch (e) {
      setError(e instanceof Error ? e.message : "Voice unavailable");
    }
  }

  if (!supported) {
    return (
      <p className="mt-3 text-xs text-[var(--slate)]">
        Voice read-aloud needs a browser with speech support (Chrome / Edge).
      </p>
    );
  }

  return (
    <div className="no-print mt-4 flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={toggle}
        className={`focus-ring inline-flex items-center gap-2 border px-4 py-2 text-sm font-semibold ${
          speaking
            ? "border-[var(--accent)] bg-[var(--accent)] text-white"
            : "border-[var(--night)] bg-[var(--glow)] text-[var(--night)]"
        }`}
      >
        <span
          aria-hidden
          className={
            speaking
              ? "pulse-dot inline-block h-2 w-2 rounded-full bg-white"
              : "inline-block h-2 w-2 rounded-full bg-[var(--night)]"
          }
        />
        {speaking ? "Stop reading" : "Listen to this summary"}
      </button>
      <span className="text-xs text-[var(--slate)]">
        Elder-friendly voice · follows the language tab above
      </span>
      {error && (
        <p role="alert" className="w-full text-xs text-[var(--danger)]">
          {error}
        </p>
      )}
    </div>
  );
}
