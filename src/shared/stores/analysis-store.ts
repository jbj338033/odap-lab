import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AnalysisResult } from "@/entities/analysis";

interface AnalysisState {
  analyses: AnalysisResult[];
  addAnalysis: (analysis: AnalysisResult) => void;
  getAnalysis: (id: string) => AnalysisResult | undefined;
  deleteAnalysis: (id: string) => void;
  getAllWeakTopics: () => string[];
  getErrorTypeCounts: () => Record<string, number>;
  getAccuracyHistory: () => { date: string; accuracy: number }[];
}

export const useAnalysisStore = create<AnalysisState>()(
  persist(
    (set, get) => ({
      analyses: [],

      addAnalysis: (analysis) =>
        set((state) => ({ analyses: [analysis, ...state.analyses] })),

      getAnalysis: (id) => get().analyses.find((a) => a.id === id),

      deleteAnalysis: (id) =>
        set((state) => ({
          analyses: state.analyses.filter((a) => a.id !== id),
        })),

      getAllWeakTopics: () => {
        const all = get().analyses.flatMap((a) => a.summary.weakTopics);
        return [...new Set(all)];
      },

      getErrorTypeCounts: () => {
        const counts: Record<string, number> = {};
        for (const c of get().analyses.flatMap((a) => a.classifications)) {
          counts[c.errorType] = (counts[c.errorType] || 0) + 1;
        }
        return counts;
      },

      getAccuracyHistory: () =>
        get()
          .analyses.map((a) => ({
            date: a.timestamp,
            accuracy: a.summary.accuracy,
          }))
          .reverse(),
    }),
    {
      name: "odap-lab-analyses",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
