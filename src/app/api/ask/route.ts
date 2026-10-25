import { NextRequest, NextResponse } from "next/server";
import { askAboutDocument } from "@/lib/gemini";
import type { DocumentAnalysis } from "@/lib/types";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured on server" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const question = typeof body.question === "string" ? body.question.trim() : "";
    const analysis = body.analysis as DocumentAnalysis | undefined;

    if (!question) {
      return NextResponse.json({ error: "Question required" }, { status: 400 });
    }
    if (!analysis || typeof analysis !== "object") {
      return NextResponse.json({ error: "Analysis context required" }, { status: 400 });
    }

    const answer = await askAboutDocument(analysis, question);
    return NextResponse.json({ answer });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Ask failed";
    console.error("[ask]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
