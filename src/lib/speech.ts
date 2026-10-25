import type { ReadingMode } from "./types";

export function speechLangForMode(mode: ReadingMode): string {
  switch (mode) {
    case "hindi":
      return "hi-IN";
    case "marathi":
      return "mr-IN";
    case "tamil":
      return "ta-IN";
    case "bengali":
      return "bn-IN";
    case "gujarati":
      return "gu-IN";
    default:
      return "en-IN";
  }
}

export function canSpeak() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function stopSpeaking() {
  if (!canSpeak()) return;
  window.speechSynthesis.cancel();
}

export function speakText(text: string, mode: ReadingMode) {
  if (!canSpeak() || !text.trim()) {
    throw new Error("Voice read-aloud is not available in this browser.");
  }

  stopSpeaking();
  const utterance = new SpeechSynthesisUtterance(text.slice(0, 1200));
  const wanted = speechLangForMode(mode);
  utterance.lang = wanted;
  utterance.rate = mode === "elder" ? 0.85 : 0.95;

  const voices = window.speechSynthesis.getVoices();
  const match =
    voices.find((v) => v.lang === wanted) ||
    voices.find((v) => v.lang.startsWith(wanted.split("-")[0])) ||
    voices.find((v) => v.lang.startsWith("en"));
  if (match) utterance.voice = match;

  window.speechSynthesis.speak(utterance);
  return utterance;
}
