"use client";

import { useCallback, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  type NodeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Badge } from "@/shared/ui/badge";
import { ERROR_TYPE_LABELS, type ErrorType } from "@/entities/analysis";
import { useKnowledgeMap } from "../model/use-knowledge-map";

export function ConceptGraph() {
  const { nodes, edges, isEmpty } = useKnowledgeMap();
  const [selected, setSelected] = useState<string | null>(null);

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    setSelected((prev) => (prev === node.id ? null : node.id));
  }, []);

  if (isEmpty) return null;

  const selectedData = nodes.find((n) => n.id === selected)?.data as
    | {
        label: string;
        status: string;
        accuracy: number;
        correct: number;
        wrong: number;
        errorTypes: string[];
      }
    | undefined;

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <div className="h-[400px] flex-1 lg:h-[500px]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={onNodeClick}
          fitView
          proOptions={{ hideAttribution: true }}
          className="bg-background"
        >
          <Background color="#ffffff08" gap={20} />
          <Controls
            showInteractive={false}
            className="[&>button]:!bg-card [&>button]:!border-border [&>button]:!text-foreground"
          />
        </ReactFlow>
      </div>

      {selectedData && (
        <div className="rounded-lg border border-border p-4 lg:w-64">
          <h3 className="text-sm font-semibold">{selectedData.label}</h3>
          <div className="mt-3 space-y-3">
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  selectedData.status === "mastered"
                    ? "secondary"
                    : selectedData.status === "weak"
                      ? "destructive"
                      : "outline"
                }
                className="text-[10px]"
              >
                {selectedData.status === "mastered"
                  ? "마스터"
                  : selectedData.status === "weak"
                    ? "약점"
                    : selectedData.status === "at_risk"
                      ? "주의"
                      : "미확인"}
              </Badge>
              <span className="font-mono text-sm">
                {selectedData.accuracy}%
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">정답 </span>
                <span className="font-mono text-emerald-400">{selectedData.correct}</span>
              </div>
              <div>
                <span className="text-muted-foreground">오답 </span>
                <span className="font-mono text-destructive">{selectedData.wrong}</span>
              </div>
            </div>
            {selectedData.errorTypes.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedData.errorTypes.map((t) => (
                  <Badge key={t} variant="outline" className="text-xs">
                    {ERROR_TYPE_LABELS[t as ErrorType]}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
