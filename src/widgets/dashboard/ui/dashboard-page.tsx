"use client";

import { useMemo, useState, useEffect } from "react";
import { BarChart3 } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { EmptyState } from "@/shared/ui/empty-state";
import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/lib/utils";
import { useAnalysisStore } from "@/shared/stores/analysis-store";
import { ProgressChart, ErrorTrend } from "@/features/dashboard";

export function DashboardPage() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const analyses = useAnalysisStore((s) => s.analyses);

  const { accuracyHistory, errorCounts, weakTopics, strongTopics } =
    useMemo(() => {
      const history = analyses
        .map((a) => ({ date: a.timestamp, accuracy: a.summary.accuracy }))
        .reverse();
      const counts: Record<string, number> = {};
      for (const a of analyses) {
        for (const c of a.classifications) {
          counts[c.errorType] = (counts[c.errorType] || 0) + 1;
        }
      }
      const weak = [...new Set(analyses.flatMap((a) => a.summary.weakTopics))];
      const strong =
        analyses.length > 0
          ? analyses[0].summary.strongTopics.filter((t) => !weak.includes(t))
          : [];
      return {
        accuracyHistory: history,
        errorCounts: counts,
        weakTopics: weak,
        strongTopics: strong,
      };
    }, [analyses]);

  if (!hydrated) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-24" />
        <div className="grid grid-cols-3 gap-px">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <div className="space-y-5">
        <h1 className="text-lg font-semibold">대시보드</h1>
        <EmptyState
          icon={<BarChart3 className="h-6 w-6" />}
          title="학습 현황을 한눈에"
          description="시험지를 분석하면 정답률 추이, 오류 유형, 약점/강점을 시각화합니다"
        />
      </div>
    );
  }

  const avgAccuracy = Math.round(
    analyses.reduce((s, a) => s + a.summary.accuracy, 0) / analyses.length,
  );
  const totalWrong = analyses.reduce((s, a) => s + a.summary.totalWrong, 0);
  const trend =
    analyses.length >= 2
      ? analyses[0].summary.accuracy - analyses[1].summary.accuracy
      : 0;

  return (
    <div className="space-y-8">
      <h1 className="text-lg font-semibold">대시보드</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "분석 횟수", value: analyses.length },
          { label: "평균 정답률", value: `${avgAccuracy}%` },
          { label: "누적 오답", value: totalWrong, color: "text-destructive" },
          {
            label: "추세",
            value: `${trend > 0 ? "+" : ""}${trend}%`,
            color: trend >= 0 ? "text-emerald-400" : "text-destructive",
          },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-lg border border-border bg-card p-4">
            <p className="text-[11px] text-muted-foreground">{label}</p>
            <p
              className={cn(
                "mt-1 font-mono text-xl font-bold tabular-nums",
                color ?? "text-foreground",
              )}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      {accuracyHistory.length > 1 && (
        <div className="space-y-3">
          <p className="section-label">정답률 추이</p>
          <div className="rounded-lg border border-border p-4">
            <ProgressChart data={accuracyHistory} />
          </div>
        </div>
      )}

      {/* Error trend */}
      {Object.keys(errorCounts).length > 0 && (
        <div className="space-y-3">
          <p className="section-label">오류 유형</p>
          <ErrorTrend counts={errorCounts} />
        </div>
      )}

      {/* Topics */}
      {(weakTopics.length > 0 || strongTopics.length > 0) && (
        <div className="grid grid-cols-2 gap-6">
          {weakTopics.length > 0 && (
            <div className="space-y-2">
              <p className="section-label">약점</p>
              <div className="flex flex-wrap gap-1.5">
                {weakTopics.map((t) => (
                  <Badge key={t} variant="destructive" className="text-[11px]">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {strongTopics.length > 0 && (
            <div className="space-y-2">
              <p className="section-label">강점</p>
              <div className="flex flex-wrap gap-1.5">
                {strongTopics.map((t) => (
                  <Badge key={t} variant="secondary" className="text-[11px]">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
