import { generateText, Output } from "ai";
import { nanoid } from "nanoid";
import { model } from "@/shared/api/ai";
import {
  TestPaperExtractionSchema,
  ErrorClassificationSchema,
  type ErrorClassification,
} from "@/entities/analysis";
import {
  EXTRACTION_SYSTEM_PROMPT,
  CLASSIFICATION_SYSTEM_PROMPT,
} from "@/shared/api/prompts";
import { buildSummary } from "@/shared/api/analyze";
import type { AnalysisResult } from "@/entities/analysis";

export const maxDuration = 60;

export async function POST(request: Request) {
  const formData = await request.formData();

  const entries = formData.getAll("images");
  const images = entries.filter((e): e is File => e instanceof File);
  const titleOverride = formData.get("title");
  const subjectOverride = formData.get("subject");

  if (images.length === 0) {
    return Response.json({ error: "no images provided" }, { status: 400 });
  }

  try {
    const imageParts = await Promise.all(
      images.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        return {
          type: "image" as const,
          image: buffer.toString("base64"),
          mimeType: file.type as
            | "image/jpeg"
            | "image/png"
            | "image/webp"
            | "image/gif",
        };
      }),
    );

    const extraction = await generateText({
      model,
      system: EXTRACTION_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "이 시험지 사진의 모든 문제를 빠짐없이 분석해주세요." },
            ...imageParts,
          ],
        },
      ],
      output: Output.object({ schema: TestPaperExtractionSchema }),
    });

    if (!extraction.output) {
      return Response.json(
        { error: "failed to extract test paper" },
        { status: 500 },
      );
    }

    if (typeof titleOverride === "string" && titleOverride.trim()) {
      extraction.output.testTitle = titleOverride.trim();
    }
    if (typeof subjectOverride === "string" && subjectOverride.trim()) {
      extraction.output.overallSubject = subjectOverride.trim();
    }

    const wrongQuestions = extraction.output.questions.filter(
      (q) => !q.isCorrect,
    );

    let classifications: ErrorClassification[] = [];

    if (wrongQuestions.length > 0) {
      const classificationResult = await generateText({
        model,
        system: CLASSIFICATION_SYSTEM_PROMPT,
        output: Output.array({ element: ErrorClassificationSchema }),
        prompt: `다음 틀린 문제들의 오류 유형을 각각 개별적으로 분류해주세요. 모든 문제를 같은 유형으로 분류하지 마세요:\n${JSON.stringify(wrongQuestions, null, 2)}`,
      });

      classifications = classificationResult.output ?? [];
    }

    const result: AnalysisResult = {
      id: nanoid(),
      timestamp: new Date().toISOString(),
      extraction: extraction.output,
      classifications,
      summary: buildSummary(extraction.output, classifications),
    };

    return Response.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "analysis failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
