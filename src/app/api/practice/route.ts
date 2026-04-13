import { z } from "zod";
import { generateText, Output } from "ai";
import { model } from "@/shared/api/ai";
import { PracticeProblemSchema } from "@/entities/practice";
import { PRACTICE_SYSTEM_PROMPT } from "@/shared/api/prompts";

export const maxDuration = 60;

const BodySchema = z.object({
  weakTopics: z.array(z.string()).min(1),
  errorTypes: z.array(z.string()),
  subject: z.string(),
  count: z.number().int().min(1).max(20).default(5),
});

export async function POST(req: Request) {
  const parsed = BodySchema.safeParse(await req.json());

  if (!parsed.success) {
    return Response.json({ error: "invalid request" }, { status: 400 });
  }

  const { weakTopics, errorTypes, subject, count } = parsed.data;

  try {
    const result = await generateText({
      model,
      system: PRACTICE_SYSTEM_PROMPT,
      output: Output.array({ element: PracticeProblemSchema }),
      prompt: `과목: ${subject}\n약점 주제: ${weakTopics.join(", ")}\n주요 오류 유형: ${errorTypes.join(", ")}\n문제 ${count}개를 생성해주세요.`,
    });

    return Response.json({ problems: result.output ?? [] });
  } catch (err) {
    const message = err instanceof Error ? err.message : "practice generation failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
