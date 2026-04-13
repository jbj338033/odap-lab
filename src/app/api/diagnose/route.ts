import { z } from "zod";
import { streamText } from "ai";
import { model } from "@/shared/api/ai";
import { DIAGNOSIS_SYSTEM_PROMPT } from "@/shared/api/prompts";

export const maxDuration = 60;

const BodySchema = z.object({
  analysisResult: z.object({
    extraction: z.object({ testTitle: z.string() }).passthrough(),
    classifications: z.array(z.object({}).passthrough()),
    summary: z.object({}).passthrough(),
  }),
});

export async function POST(req: Request) {
  const parsed = BodySchema.safeParse(await req.json());

  if (!parsed.success) {
    return Response.json({ error: "invalid request" }, { status: 400 });
  }

  const { analysisResult } = parsed.data;

  const result = streamText({
    model,
    system: DIAGNOSIS_SYSTEM_PROMPT,
    prompt: `다음 분석 결과를 바탕으로 학습 진단 리포트를 작성해주세요:\n${JSON.stringify(analysisResult, null, 2)}`,
  });

  return result.toUIMessageStreamResponse();
}
