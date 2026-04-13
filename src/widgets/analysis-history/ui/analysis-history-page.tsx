"use client";

import { HistoryList } from "@/features/analysis-history";

export function AnalysisHistoryPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-lg font-semibold">분석 이력</h1>
      <HistoryList />
    </div>
  );
}
