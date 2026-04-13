import { z } from "zod";

export const PracticeProblemSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctAnswer: z.number().min(0).max(3).describe("정답 인덱스 (0-3)"),
  explanation: z.string(),
  targetConcept: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
});
