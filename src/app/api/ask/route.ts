import { NextRequest, NextResponse } from "next/server";
import { askAboutDocument } from "@/lib/gemini";
import { buildGroundedFallback } from "@/lib/grounded-fallback";
import { humanizeApiError, isRetryableModelError } from "@/lib/errors";
import type { ChatTurn, DocumentAnalysis } from "@/lib/types";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  let groundedAnalysis: DocumentAnalysis | undefined;
  let groundedQuestion = "";

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

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body. Send question + analysis." },
        { status: 400 }
      );
    }

    const question =
      typeof body.question === "string" ? body.question.trim() : "";
    const analysis = body.analysis as DocumentAnalysis | undefined;
    const history = Array.isArray(body.history)
      ? (body.history as ChatTurn[]).slice(-8)
      : [];
    groundedAnalysis = analysis;
    groundedQuestion = question;

    if (!question) {
      return NextResponse.json({ error: "Question required" }, { status: 400 });
    }
    if (question.length > 500) {
      return NextResponse.json(
        { error: "Keep the question under 500 characters" },
        { status: 400 }
      );
    }
    if (!analysis || typeof analysis !== "object") {
      return NextResponse.json(
        { error: "Analysis context required" },
        { status: 400 }
      );
    }
    if (JSON.stringify(analysis).length > 50_000) {
      return NextResponse.json(
        { error: "Analysis context is too large" },
        { status: 413 }
      );
    }

    const answer = await askAboutDocument(analysis, question, history);
    return NextResponse.json({ answer });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Ask failed";
    console.error("[ask]", message);
    if (isRetryableModelError(message) && groundedAnalysis && groundedQuestion) {
      return NextResponse.json({
        answer: buildGroundedFallback(groundedAnalysis, groundedQuestion),
      });
    }
    return NextResponse.json(
      {
        error: humanizeApiError(
          message,
          "Sahaj could not answer this question. Try again."
        ),
      },
      { status: isRetryableModelError(message) ? 503 : 500 }
    );
  }
}
