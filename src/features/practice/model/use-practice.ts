"use client";

import { useState, useMemo } from "react";
import type { PracticeProblem } from "@/entities/practice";
import { useAnalysisStore } from "@/shared/stores/analysis-store";
import { ERROR_TYPE_LABELS, type ErrorType } from "@/entities/analysis";

export function usePractice() {
  const analyses = useAnalysisStore((s) => s.analyses);

  const { weakTopics, topErrorTypes, subject } = useMemo(() => {
    const weak = [...new Set(analyses.flatMap((a) => a.summary.weakTopics))];

    const counts: Record<string, number> = {};
    for (const a of analyses) {
      for (const c of a.classifications) {
        counts[c.errorType] = (counts[c.errorType] || 0) + 1;
      }
    }
    const top = Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([t]) => ERROR_TYPE_LABELS[t as ErrorType]);

    const subj =
      analyses.length > 0 ? analyses[0].extraction.overallSubject : "수학";

    return { weakTopics: weak, topErrorTypes: top, subject: subj };
  }, [analyses]);

  const [problems, setProblems] = useState<PracticeProblem[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (weakTopics.length === 0) return;
    setLoading(true);
    setSubmitted(false);
    setAnswers({});
    setError(null);

    try {
      const res = await fetch("/api/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weakTopics: weakTopics.slice(0, 5),
          errorTypes: topErrorTypes,
          subject,
          count: 5,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "연습문제 생성에 실패했습니다");
      }

      const data = await res.json();
      setProblems(data.problems ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류");
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (problemIdx: number, optionIdx: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [problemIdx]: optionIdx }));
  };

  const submit = () => setSubmitted(true);

  const score = submitted
    ? problems.filter((p, i) => answers[i] === p.correctAnswer).length
    : 0;

  return {
    problems,
    answers,
    submitted,
    loading,
    error,
    weakTopics,
    score,
    generate,
    selectAnswer,
    submit,
  };
}
