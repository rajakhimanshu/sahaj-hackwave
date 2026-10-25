export function humanizeApiError(input: unknown, fallback: string) {
  const message =
    typeof input === "string"
      ? input
      : input instanceof Error
        ? input.message
        : fallback;

  const lower = message.toLowerCase();

  if (lower.includes("gemini_api_key") || lower.includes("not configured")) {
    return "Sahaj is missing its Gemini API key on the server. Ask the team to set GEMINI_API_KEY.";
  }
  if (lower.includes("file too large") || lower.includes("8mb")) {
    return "This file is over 8 MB. Compress the photo/PDF and try again.";
  }
  if (lower.includes("jpg") || lower.includes("mime") || lower.includes("supported")) {
    return "Upload a JPG, PNG, WEBP, GIF, or PDF only.";
  }
  if (
    lower.includes("503") ||
    lower.includes("429") ||
    lower.includes("high demand") ||
    lower.includes("busy")
  ) {
    return "Gemini is busy right now. Wait a few seconds and retry.";
  }
  if (lower.includes("timed out") || lower.includes("aborted") || lower.includes("timeout")) {
    return "The document took too long to read. Try a clearer, smaller photo.";
  }
  if (lower.includes("network") || lower.includes("fetch")) {
    return "Network issue while reaching Sahaj. Check internet and try again.";
  }
  return message || fallback;
}

export function isRetryableModelError(message: string) {
  const lower = message.toLowerCase();
  return (
    message.includes("503") ||
    message.includes("429") ||
    message.includes("404") ||
    lower.includes("high demand") ||
    lower.includes("timed out") ||
    lower.includes("aborted") ||
    lower.includes("unavailable")
  );
}
