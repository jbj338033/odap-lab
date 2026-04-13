"use client";

import {
  ERROR_TYPE_LABELS,
  ERROR_TYPE_COLORS,
  type ErrorType,
  type ErrorClassification,
} from "@/entities/analysis";

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number,
) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function ErrorPieChart({
  classifications,
}: {
  classifications: ErrorClassification[];
}) {
  const counts: Record<string, number> = {};
  for (const c of classifications) {
    counts[c.errorType] = (counts[c.errorType] || 0) + 1;
  }

  const entries = Object.entries(counts).sort(([, a], [, b]) => b - a);
  const total = classifications.length;
  if (total === 0) return null;

  let cumulative = 0;

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 100 100" className="h-24 w-24">
        {entries.map(([type, count]) => {
          const pct = count / total;
          const startAngle = cumulative * 360;
          const endAngle = (cumulative + pct) * 360;
          cumulative += pct;

          const start = polarToCartesian(50, 50, 40, startAngle);
          const end = polarToCartesian(50, 50, 40, endAngle);
          const largeArc = pct > 0.5 ? 1 : 0;

          if (pct >= 1) {
            return (
              <circle
                key={type}
                cx="50"
                cy="50"
                r="40"
                fill={ERROR_TYPE_COLORS[type as ErrorType]}
              />
            );
          }

          return (
            <path
              key={type}
              d={`M 50 50 L ${start.x} ${start.y} A 40 40 0 ${largeArc} 1 ${end.x} ${end.y} Z`}
              fill={ERROR_TYPE_COLORS[type as ErrorType]}
            />
          );
        })}
        <circle cx="50" cy="50" r="24" className="fill-background" />
        <text
          x="50"
          y="48"
          textAnchor="middle"
          className="fill-foreground text-[10px] font-bold"
        >
          {total}
        </text>
        <text
          x="50"
          y="58"
          textAnchor="middle"
          className="fill-muted-foreground text-[6px]"
        >
          오답
        </text>
      </svg>

      <div className="flex flex-col gap-1">
        {entries.map(([type, count]) => (
          <div key={type} className="flex items-center gap-2 text-[13px]">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: ERROR_TYPE_COLORS[type as ErrorType] }}
            />
            <span className="text-muted-foreground">
              {ERROR_TYPE_LABELS[type as ErrorType]}
            </span>
            <span className="font-mono text-xs">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
