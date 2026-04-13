"use client";

import { useState, useEffect } from "react";
import { Network } from "lucide-react";
import { Skeleton } from "@/shared/ui/skeleton";
import { EmptyState } from "@/shared/ui/empty-state";
import { useAnalysisStore } from "@/shared/stores/analysis-store";
import { ConceptGraph } from "@/features/knowledge-map";

export function KnowledgeMapPage() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const analyses = useAnalysisStore((s) => s.analyses);

  if (!hydrated) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">지식 맵</h1>
        <div className="flex gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400" /> 마스터
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-400" /> 주의
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-destructive" /> 약점
          </span>
        </div>
      </div>

      {analyses.length === 0 ? (
        <EmptyState
          icon={<Network className="h-6 w-6" />}
          title="개념별 이해도를 시각화"
          description="시험지를 분석하면 개념 간 연결 관계와 숙련도를 지식 맵으로 보여줍니다"
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <ConceptGraph />
        </div>
      )}
    </div>
  );
}
