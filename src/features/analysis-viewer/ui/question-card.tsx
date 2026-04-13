"use client";

import { useState } from "react";
import { ChevronDown, Check, X, Lightbulb, AlertTriangle } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import {
  ERROR_TYPE_LABELS,
  ERROR_TYPE_COLORS,
  type ExtractedQuestion,
  type ErrorClassification,
} from "@/entities/analysis";

interface QuestionCardProps {
  displayNumber?: number;
  question: ExtractedQuestion;
  classification?: ErrorClassification;
}

export function QuestionCard({
  displayNumber,
  question: q,
  classification,
}: QuestionCardProps) {
  const [open, setOpen] = useState(false);
  const num = displayNumber ?? q.questionNumber;

  return (
    <div
      className={cn(
        "rounded-lg border overflow-hidden",
        q.isCorrect ? "border-emerald-500/20" : "border-destructive/20",
      )}
    >
      {/* Header — always visible */}
      <button
        type="button"
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        {/* Number + status icon */}
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
            q.isCorrect
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-destructive/10 text-destructive",
          )}
        >
          {num}
        </div>

        {/* Question summary */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {q.isCorrect ? (
              <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                <Check className="h-3 w-3" />
                정답
              </span>
            ) : (
              <>
                <span className="flex items-center gap-1 text-[11px] font-medium text-destructive">
                  <X className="h-3 w-3" />
                  오답
                </span>
                {classification && (
                  <span
                    className="text-[11px]"
                    style={{ color: ERROR_TYPE_COLORS[classification.errorType] }}
                  >
                    {ERROR_TYPE_LABELS[classification.errorType]}
                  </span>
                )}
              </>
            )}
            <span className="text-[11px] text-muted-foreground">
              {q.topic}
            </span>
          </div>

          {/* Answer summary for wrong answers */}
          {!q.isCorrect && (
            <div className="mt-1 flex items-center gap-3 text-[12px]">
              <span className="text-muted-foreground">
                내 답 <span className="font-mono text-destructive">{q.studentAnswer}</span>
              </span>
              <span className="text-muted-foreground">
                정답 <span className="font-mono text-emerald-400">{q.correctAnswer}</span>
              </span>
            </div>
          )}
        </div>

        {/* Expand chevron */}
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {/* Expanded detail */}
      {open && (
        <div className="border-t border-border px-4 py-4 space-y-4">
          {/* Question text */}
          <div>
            <p className="text-[11px] font-medium text-muted-foreground mb-1">문제</p>
            <p className="text-[13px] leading-relaxed text-foreground/90">
              {q.questionText}
            </p>
          </div>

          {/* Answer comparison for wrong answers */}
          {!q.isCorrect && (
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-md bg-destructive/5 border border-destructive/10 px-3 py-2.5">
                <p className="text-[11px] text-muted-foreground mb-0.5">학생 답</p>
                <p className="font-mono text-sm text-destructive">{q.studentAnswer}</p>
              </div>
              <div className="rounded-md bg-emerald-500/5 border border-emerald-500/10 px-3 py-2.5">
                <p className="text-[11px] text-muted-foreground mb-0.5">정답</p>
                <p className="font-mono text-sm text-emerald-400">{q.correctAnswer}</p>
              </div>
            </div>
          )}

          {/* Error analysis */}
          {classification && (
            <>
              <div className="rounded-md bg-card border border-border p-3 space-y-2">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[11px] font-medium text-muted-foreground">원인 분석</span>
                </div>
                <p className="text-[13px] leading-relaxed text-foreground/80">
                  {classification.errorExplanation}
                </p>
              </div>

              <div className="rounded-md bg-card border border-border p-3 space-y-2">
                <div className="flex items-center gap-1.5">
                  <Lightbulb className="h-3.5 w-3.5 text-primary" />
                  <span className="text-[11px] font-medium text-muted-foreground">해결 방법</span>
                </div>
                <p className="text-[13px] leading-relaxed text-foreground/80">
                  {classification.remedyHint}
                </p>
              </div>

              {classification.prerequisiteConcepts.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {classification.prerequisiteConcepts.map((c) => (
                    <span
                      key={c}
                      className="inline-flex rounded-md bg-primary/10 px-2 py-0.5 text-[11px] text-primary"
                    >
                      선행: {c}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
