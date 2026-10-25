import { NextRequest, NextResponse } from "next/server";
import { analyzeDocument } from "@/lib/gemini";

export const maxDuration = 90;

const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
]);

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured on server" },
        { status: 500 }
      );
    }

    const form = await req.formData();
    const file = form.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!ALLOWED.has(file.type)) {
      return NextResponse.json(
        { error: "Upload JPG, PNG, WEBP, or PDF" },
        { status: 400 }
      );
    }

    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json(
        {
          error:
            "File too large (max 8MB). Compress the photo or PDF, then try again.",
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const analysis = await analyzeDocument(base64, file.type);

    return NextResponse.json({ analysis });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analysis failed";
    console.error("[analyze]", message);
    const unavailable =
      message.includes("503") ||
      message.includes("429") ||
      message.toLowerCase().includes("high demand") ||
      message.toLowerCase().includes("aborted") ||
      message.toLowerCase().includes("timed out");
    return NextResponse.json(
      {
        error: unavailable
          ? "Gemini is busy right now. Wait a moment and try again."
          : "Sahaj could not read this document. Try a clearer image or PDF.",
      },
      { status: unavailable ? 503 : 500 }
    );
  }
}
