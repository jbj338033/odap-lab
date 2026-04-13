import { z } from "zod";

export const ErrorTypeEnum = z.enum([
  "conceptual_misunderstanding",
  "calculation_error",
  "careless_mistake",
  "knowledge_gap",
  "misread_question",
]);

const ExtractedQuestionSchema = z.object({
  questionNumber: z.number().describe("문제 번호"),
  questionText: z.string().describe("문제 내용 (가능한 한 전체 텍스트)"),
  studentAnswer: z.string().describe("학생이 작성한 답"),
  correctAnswer: z.string().describe("정답 (판별 가능한 경우)"),
  isCorrect: z.boolean().describe("학생 답이 맞는지 여부"),
  subject: z
    .string()
    .describe("과목 (수학, 영어, 과학, 국어, 사회, 정보 등)"),
  topic: z.string().describe("세부 주제 (예: 이차방정식, 관계대명사)"),
});

export const TestPaperExtractionSchema = z.object({
  testTitle: z.string().describe("시험 제목 또는 과목명"),
  totalQuestions: z.number().describe("총 문항 수"),
  questions: z.array(ExtractedQuestionSchema),
  overallSubject: z.string().describe("전체 과목"),
});

export const ErrorClassificationSchema = z.object({
  questionNumber: z.number(),
  errorType: ErrorTypeEnum,
  errorExplanation: z.string().describe("이 오류가 왜 이 유형인지 설명"),
  conceptsInvolved: z.array(z.string()).describe("관련 개념 목록"),
  prerequisiteConcepts: z
    .array(z.string())
    .describe("선행 개념 중 부족한 것"),
  remedyHint: z.string().describe("이 오류를 고치기 위한 짧은 조언"),
  severityScore: z
    .number()
    .min(1)
    .max(5)
    .describe("심각도 (1: 경미, 5: 심각)"),
});
