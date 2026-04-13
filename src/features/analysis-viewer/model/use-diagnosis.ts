"use client";

import { useState, useEffect } from "react";
import { useCompletion } from "@ai-sdk/react";
import type { AnalysisResult } from "@/entities/analysis";

export function useDiagnosis(analysis: AnalysisResult | undefined) {
  const {
    completion,
    isLoading: isDiagnosing,
    complete,
  } = useCompletion({ api: "/api/diagnose" });

  const [requested, setRequested] = useState(false);

  useEffect(() => {
    if (analysis && !requested) {
      setRequested(true);
      complete("", { body: { analysisResult: analysis } });
    }
  }, [analysis, requested, complete]);

  return { completion, isDiagnosing };
}
