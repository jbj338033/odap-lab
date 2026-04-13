"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  BookOpen,
  BarChart3,
  Network,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Skeleton } from "@/shared/ui/skeleton";
import { Markdown } from "@/shared/ui/markdown";
import { cn } from "@/shared/lib/utils";
import { useAnalysisStore } from "@/shared/stores/analysis-store";
import {
  ErrorPieChart,
  QuestionCard,
  useDiagnosis,
} from "@/features/analysis-viewer";

function displayTitle(title: string) {
  return title.includes("[판독불가]") ? "제목 없는 시험지" : title;
}

export function AnalysisDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const analysis = useAnalysisStore((s) => s.getAnalysis(id));
  const { completion, isDiagnosing } = useDiagnosis(analysis);
  const [reportExpanded, setReportExpanded] = useState(false);

  if (!hydrated) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-40" />
        <div className="grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-32 rounded-lg" />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <p className="text-sm text-muted-foreground">
          분석 결과를 찾을 수 없습니다
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/upload")}
        >
          시험지 분석하기
        </Button>
      </div>
    );
  }

  const { extraction, classifications, summary } = analysis;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="mt-0.5 h-7 w-7 shrink-0"
          onClick={() => router.push("/history")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold">
            {displayTitle(extraction.testTitle)}
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {extraction.overallSubject} ·{" "}
            {new Date(analysis.timestamp).toLocaleDateString("ko-KR")} ·{" "}
            {extraction.totalQuestions}문항
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-border bg-card py-5 text-center">
          <span
            className={cn(
              "font-mono text-2xl font-bold tabular-nums",
              summary.accuracy >= 80
                ? "text-emerald-400"
                : summary.accuracy >= 50
                  ? "text-amber-400"
                  : "text-destructive",
            )}
          >
            {summary.accuracy}%
          </span>
          <span className="mt-1 block text-[11px] text-muted-foreground">
            정답률
          </span>
        </div>
        <div className="rounded-lg border border-border bg-card py-5 text-center">
          <span className="font-mono text-2xl font-bold tabular-nums text-emerald-400">
            {summary.totalCorrect}
          </span>
          <span className="mt-1 block text-[11px] text-muted-foreground">
            정답
          </span>
        </div>
        <div className="rounded-lg border border-border bg-card py-5 text-center">
          <span className="font-mono text-2xl font-bold tabular-nums text-destructive">
            {summary.totalWrong}
          </span>
          <span className="mt-1 block text-[11px] text-muted-foreground">
            오답
          </span>
        </div>
      </div>

      {/* Error types */}
      {classifications.length > 0 && (
        <div className="space-y-3">
          <p className="section-label">오류 유형</p>
          <ErrorPieChart classifications={classifications} />
        </div>
      )}

      {/* AI Diagnosis */}
      <div className="space-y-3">
        <p className="section-label flex items-center gap-1.5">
          <Sparkles className="h-3 w-3" />
          AI 진단
        </p>
        {isDiagnosing && !completion ? (
          <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            생성 중...
          </div>
        ) : completion ? (
          <div className="rounded-lg border border-border bg-card p-5">
            <div
              className={cn(
                "overflow-hidden transition-all",
                !reportExpanded && "max-h-32",
              )}
            >
              <Markdown>{completion}</Markdown>
            </div>
            {completion.length > 150 && (
              <button
                onClick={() => setReportExpanded((v) => !v)}
                className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {reportExpanded ? (
                  <>
                    접기 <ChevronUp className="h-3 w-3" />
                  </>
                ) : (
                  <>
                    더보기 <ChevronDown className="h-3 w-3" />
                  </>
                )}
              </button>
            )}
          </div>
        ) : null}
      </div>

      {/* Questions */}
      <div className="space-y-3">
        <p className="section-label">문제별 분석</p>
        {extraction.questions.map((q, i) => (
          <QuestionCard
            key={q.questionNumber}
            displayNumber={i + 1}
            question={q}
            classification={classifications.find(
              (c) => c.questionNumber === q.questionNumber,
            )}
          />
        ))}
      </div>

      {/* Next steps */}
      <div className="space-y-3">
        <p className="section-label">다음 단계</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {summary.weakTopics.length > 0 && (
            <Link href="/practice" className="group rounded-lg border border-border p-4 transition-colors hover:bg-accent">
              <BookOpen className="h-4 w-4 text-primary mb-2" />
              <p className="text-sm font-medium">약점 연습문제</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {summary.weakTopics.slice(0, 2).join(", ")} 집중 훈련
              </p>
            </Link>
          )}
          <Link href="/dashboard" className="group rounded-lg border border-border p-4 transition-colors hover:bg-accent">
            <BarChart3 className="h-4 w-4 text-primary mb-2" />
            <p className="text-sm font-medium">대시보드</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              학습 현황과 추이 확인
            </p>
          </Link>
          <Link href="/knowledge-map" className="group rounded-lg border border-border p-4 transition-colors hover:bg-accent">
            <Network className="h-4 w-4 text-primary mb-2" />
            <p className="text-sm font-medium">지식 맵</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              개념별 이해도 시각화
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
