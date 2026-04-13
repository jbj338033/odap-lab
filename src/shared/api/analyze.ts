import type {
  AnalysisResult,
  ErrorType,
  ErrorClassification,
  TestPaperExtraction,
} from "@/entities/analysis";

export function buildSummary(
  extraction: TestPaperExtraction,
  classifications: ErrorClassification[],
): AnalysisResult["summary"] {
  const totalCorrect = extraction.questions.filter((q) => q.isCorrect).length;
  const totalWrong = extraction.questions.filter((q) => !q.isCorrect).length;
  const accuracy =
    extraction.totalQuestions > 0
      ? Math.round((totalCorrect / extraction.totalQuestions) * 100)
      : 0;

  const errorCounts: Record<string, number> = {};
  for (const c of classifications) {
    errorCounts[c.errorType] = (errorCounts[c.errorType] || 0) + 1;
  }

  const dominantErrorType = (Object.entries(errorCounts).sort(
    ([, a], [, b]) => b - a,
  )[0]?.[0] ?? "careless_mistake") as ErrorType;

  const wrongTopics = new Set(
    extraction.questions.filter((q) => !q.isCorrect).map((q) => q.topic),
  );
  const correctTopics = new Set(
    extraction.questions.filter((q) => q.isCorrect).map((q) => q.topic),
  );

  return {
    totalCorrect,
    totalWrong,
    accuracy,
    dominantErrorType,
    weakTopics: [...wrongTopics],
    strongTopics: [...correctTopics].filter((t) => !wrongTopics.has(t)),
  };
}
