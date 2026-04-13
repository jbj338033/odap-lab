"use client";

import { Badge } from "@/shared/ui/badge";
import { Markdown } from "@/shared/ui/markdown";
import { cn } from "@/shared/lib/utils";
import type { PracticeProblem } from "@/entities/practice";

const DIFF: Record<string, string> = {
  easy: "기본",
  medium: "보통",
  hard: "심화",
};

interface ProblemCardProps {
  index: number;
  problem: PracticeProblem;
  selectedAnswer?: number;
  submitted: boolean;
  onSelect: (optionIdx: number) => void;
}

export function ProblemCard({
  index,
  problem,
  selectedAnswer,
  submitted,
  onSelect,
}: ProblemCardProps) {
  return (
    <div className="rounded-lg border border-border">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <span className="flex h-5 w-5 items-center justify-center rounded bg-muted text-[11px] font-medium text-muted-foreground">
          {index + 1}
        </span>
        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
          {DIFF[problem.difficulty] ?? problem.difficulty}
        </Badge>
        <span className="text-[11px] text-muted-foreground">
          {problem.targetConcept}
        </span>
      </div>

      {/* Question */}
      <div className="px-4 py-3">
        <Markdown className="[&_p]:!mb-0">{problem.question}</Markdown>
      </div>

      {/* Options */}
      <div className="space-y-1.5 px-4 pb-4">
        {problem.options.map((option, i) => {
          const selected = selectedAnswer === i;
          const correct = problem.correctAnswer === i;

          return (
            <button
              key={i}
              type="button"
              className={cn(
                "flex w-full items-start gap-2.5 rounded-md border px-3 py-2 text-left text-[13px] transition-colors",
                submitted
                  ? correct
                    ? "border-emerald-500/40 bg-emerald-500/5"
                    : selected
                      ? "border-destructive/40 bg-destructive/5"
                      : "border-border opacity-40"
                  : selected
                    ? "border-primary/50 bg-primary/5"
                    : "border-border hover:bg-accent",
              )}
              onClick={() => onSelect(i)}
              disabled={submitted}
            >
              <span
                className={cn(
                  "mt-px flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border text-[10px] font-medium",
                  submitted
                    ? correct
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : selected
                        ? "border-destructive bg-destructive text-white"
                        : "border-border text-muted-foreground"
                    : selected
                      ? "border-primary bg-primary text-white"
                      : "border-border text-muted-foreground",
                )}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <Markdown className="flex-1 [&_p]:!mb-0">{option}</Markdown>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {submitted && (
        <div className="border-t border-border px-4 py-3">
          <p className="mb-1 text-[11px] font-medium text-muted-foreground">
            풀이
          </p>
          <Markdown>{problem.explanation}</Markdown>
        </div>
      )}
    </div>
  );
}
