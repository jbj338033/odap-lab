import type { ErrorType } from "../model/types";

export const ERROR_TYPE_LABELS: Record<ErrorType, string> = {
  conceptual_misunderstanding: "개념 미이해",
  calculation_error: "계산/풀이 오류",
  careless_mistake: "부주의 실수",
  knowledge_gap: "지식 부족",
  misread_question: "문제 오독",
};

export const ERROR_TYPE_COLORS: Record<ErrorType, string> = {
  conceptual_misunderstanding: "#ef4444",
  calculation_error: "#f97316",
  careless_mistake: "#eab308",
  knowledge_gap: "#8b5cf6",
  misread_question: "#06b6d4",
};
