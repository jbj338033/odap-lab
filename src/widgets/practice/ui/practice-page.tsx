"use client";

import { useState, useEffect } from "react";
import { Loader2, RotateCcw, CheckCircle2, Sparkles, BookOpen } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Progress } from "@/shared/ui/progress";
import { Skeleton } from "@/shared/ui/skeleton";
import { EmptyState } from "@/shared/ui/empty-state";
import { ProblemCard, usePractice } from "@/features/practice";

export function PracticePage() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const {
    problems,
    answers,
    submitted,
    loading,
    weakTopics,
    score,
    generate,
    selectAnswer,
    submit,
  } = usePractice();

  if (!hydrated) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-40 w-full rounded-lg" />
      </div>
    );
  }

  const answered = Object.keys(answers).length;
  const total = problems.length;

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold">연습 문제</h1>

      {weakTopics.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-6 w-6" />}
          title="약점 맞춤 연습문제"
          description="시험지를 분석하면 틀린 유형에 맞는 AI 연습문제를 생성합니다"
        />
      ) : problems.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <Sparkles className="h-6 w-6 text-muted-foreground/40" />
          <div>
            <p className="text-sm text-muted-foreground">
              {weakTopics.slice(0, 3).join(", ")} 관련
            </p>
          </div>
          <Button onClick={generate} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                생성 중...
              </>
            ) : (
              "연습문제 생성"
            )}
          </Button>
        </div>
      ) : (
        <>
          {submitted ? (
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <div>
                  <p className="text-sm font-medium">
                    <span className="font-mono">{score}/{total}</span> 정답
                  </p>
                  <p className="font-mono text-[11px] text-muted-foreground">
                    {Math.round((score / total) * 100)}%
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={generate}
              >
                <RotateCcw className="mr-1 h-3 w-3" />
                새 문제
              </Button>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>진행도</span>
                <span className="font-mono">
                  {answered}/{total}
                </span>
              </div>
              <Progress value={(answered / total) * 100} />
            </div>
          )}

          <div className="space-y-3">
            {problems.map((p, i) => (
              <ProblemCard
                key={i}
                index={i}
                problem={p}
                selectedAnswer={answers[i]}
                submitted={submitted}
                onSelect={(opt) => selectAnswer(i, opt)}
              />
            ))}
          </div>

          {!submitted && (
            <Button
              className="w-full"
              onClick={submit}
              disabled={answered < total}
            >
              제출 ({answered}/{total})
            </Button>
          )}
        </>
      )}
    </div>
  );
}
