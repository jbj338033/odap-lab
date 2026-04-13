"use client";

import { ERROR_TYPE_LABELS, ERROR_TYPE_COLORS, type ErrorType } from "@/entities/analysis";

export function ErrorTrend({ counts }: { counts: Record<string, number> }) {
  const entries = Object.entries(counts).sort(([, a], [, b]) => b - a);
  const max = Math.max(...entries.map(([, v]) => v), 1);

  if (entries.length === 0) return null;

  return (
    <div className="space-y-3">
      {entries.map(([type, count]) => (
        <div key={type} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {ERROR_TYPE_LABELS[type as ErrorType]}
            </span>
            <span className="font-mono font-medium">{count}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(count / max) * 100}%`,
                backgroundColor: ERROR_TYPE_COLORS[type as ErrorType],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
