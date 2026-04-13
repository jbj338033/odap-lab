"use client";

import { useMemo } from "react";
import type { Node, Edge } from "@xyflow/react";
import { useAnalysisStore } from "@/shared/stores/analysis-store";

interface ConceptNode {
  concept: string;
  correctCount: number;
  wrongCount: number;
  relatedConcepts: Set<string>;
  errorTypes: Set<string>;
}

export function useKnowledgeMap() {
  const analyses = useAnalysisStore((s) => s.analyses);

  return useMemo(() => {
    const conceptMap = new Map<string, ConceptNode>();

    for (const analysis of analyses) {
      for (const q of analysis.extraction.questions) {
        const topic = q.topic;
        if (!conceptMap.has(topic)) {
          conceptMap.set(topic, {
            concept: topic,
            correctCount: 0,
            wrongCount: 0,
            relatedConcepts: new Set(),
            errorTypes: new Set(),
          });
        }
        const node = conceptMap.get(topic)!;
        if (q.isCorrect) node.correctCount++;
        else node.wrongCount++;
      }

      for (const c of analysis.classifications) {
        const q = analysis.extraction.questions.find(
          (qq) => qq.questionNumber === c.questionNumber,
        );
        if (!q) continue;

        const node = conceptMap.get(q.topic);
        if (!node) continue;

        node.errorTypes.add(c.errorType);

        for (const prereq of c.prerequisiteConcepts) {
          node.relatedConcepts.add(prereq);
          if (!conceptMap.has(prereq)) {
            conceptMap.set(prereq, {
              concept: prereq,
              correctCount: 0,
              wrongCount: 0,
              relatedConcepts: new Set(),
              errorTypes: new Set(),
            });
          }
        }

        for (const related of c.conceptsInvolved) {
          if (related !== q.topic) {
            node.relatedConcepts.add(related);
          }
        }
      }
    }

    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const concepts = [...conceptMap.values()];
    const cols = Math.ceil(Math.sqrt(concepts.length));

    concepts.forEach((c, i) => {
      const total = c.correctCount + c.wrongCount;
      const accuracy = total > 0 ? c.correctCount / total : 0;

      let status: "mastered" | "weak" | "at_risk" | "unknown";
      let color: string;

      if (total === 0) {
        status = "unknown";
        color = "#6b7280";
      } else if (accuracy >= 0.8) {
        status = "mastered";
        color = "#22c55e";
      } else if (accuracy >= 0.5) {
        status = "at_risk";
        color = "#eab308";
      } else {
        status = "weak";
        color = "#ef4444";
      }

      nodes.push({
        id: c.concept,
        position: {
          x: (i % cols) * 200 + 50,
          y: Math.floor(i / cols) * 120 + 50,
        },
        data: {
          label: c.concept,
          status,
          accuracy: Math.round(accuracy * 100),
          correct: c.correctCount,
          wrong: c.wrongCount,
          errorTypes: [...c.errorTypes],
        },
        style: {
          background: `${color}20`,
          border: `2px solid ${color}`,
          borderRadius: "12px",
          padding: "8px 16px",
          fontSize: "13px",
          color: "white",
          fontWeight: 500,
        },
      });

      for (const related of c.relatedConcepts) {
        if (conceptMap.has(related)) {
          edges.push({
            id: `${c.concept}-${related}`,
            source: c.concept,
            target: related,
            style: { stroke: "#ffffff20", strokeWidth: 1.5 },
            animated: true,
          });
        }
      }
    });

    return { nodes, edges, isEmpty: concepts.length === 0 };
  }, [analyses]);
}
