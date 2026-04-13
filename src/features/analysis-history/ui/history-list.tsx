"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Trash2, ChevronRight, History } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { EmptyState } from "@/shared/ui/empty-state";
import { useAnalysisStore } from "@/shared/stores/analysis-store";
import { ERROR_TYPE_LABELS, type ErrorType } from "@/entities/analysis";

function displayTitle(title: string) {
  return title.includes("[판독불가]") ? "제목 없는 시험지" : title;
}

export function HistoryList() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const analyses = useAnalysisStore((s) => s.analyses);
  const deleteAnalysis = useAnalysisStore((s) => s.deleteAnalysis);

  if (!hydrated) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <EmptyState
        icon={<History className="h-6 w-6" />}
        title="분석 기록이 여기에"
        description="시험지를 분석하면 결과가 자동 저장됩니다"
      />
    );
  }

  return (
    <div className="space-y-2">
      {analyses.map((a) => (
        <Link key={a.id} href={`/analysis/${a.id}`}>
          <div className="group flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-accent">
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">
                {displayTitle(a.extraction.testTitle)}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground">
                  {new Date(a.timestamp).toLocaleDateString("ko-KR")}
                </span>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  <span className="font-mono">{a.summary.accuracy}%</span>
                </Badge>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {ERROR_TYPE_LABELS[a.summary.dominantErrorType as ErrorType]}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.preventDefault();
                  deleteAnalysis(a.id);
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
              <ChevronRight className="h-4 w-4 text-muted-foreground/30" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
