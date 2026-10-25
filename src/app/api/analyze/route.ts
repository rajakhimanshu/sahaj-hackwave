import { NextRequest, NextResponse } from "next/server";
import { analyzeDocument } from "@/lib/gemini";
import { humanizeApiError, isRetryableModelError } from "@/lib/errors";

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
        {
          error:
            "GEMINI_API_KEY not configured on server. Set it in the AWS/server environment.",
        },
        { status: 500 }
      );
    }

    let form: FormData;
    try {
      form = await req.formData();
    } catch {
      return NextResponse.json(
        { error: "Could not read upload. Try again with a smaller file." },
        { status: 400 }
      );
    }

    const file = form.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!ALLOWED.has(file.type)) {
      return NextResponse.json(
        { error: "Upload JPG, PNG, WEBP, GIF, or PDF only" },
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

    if (file.size < 64) {
      return NextResponse.json(
        { error: "File looks empty or corrupted. Try another photo." },
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
    return NextResponse.json(
      {
        error: humanizeApiError(
          message,
          "Sahaj could not read this document. Try a clearer image or PDF."
        ),
      },
      { status: isRetryableModelError(message) ? 503 : 500 }
    );
  }
}
