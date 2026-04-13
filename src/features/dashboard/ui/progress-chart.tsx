"use client";

interface DataPoint {
  date: string;
  accuracy: number;
}

export function ProgressChart({ data }: { data: DataPoint[] }) {
  if (data.length === 0) return null;

  const maxY = 100;
  const w = 400;
  const h = 200;
  const pad = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;

  const points = data.map((d, i) => ({
    x: pad.left + (data.length === 1 ? chartW / 2 : (i / (data.length - 1)) * chartW),
    y: pad.top + chartH - (d.accuracy / maxY) * chartH,
    ...d,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${pad.top + chartH} L ${points[0].x} ${pad.top + chartH} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      {/* grid lines */}
      {[0, 25, 50, 75, 100].map((v) => {
        const y = pad.top + chartH - (v / maxY) * chartH;
        return (
          <g key={v}>
            <line
              x1={pad.left}
              y1={y}
              x2={w - pad.right}
              y2={y}
              stroke="currentColor"
              strokeOpacity={0.08}
            />
            <text
              x={pad.left - 8}
              y={y + 4}
              textAnchor="end"
              className="fill-muted-foreground text-[10px]"
            >
              {v}%
            </text>
          </g>
        );
      })}

      {/* area */}
      <path d={areaPath} fill="url(#gradient)" opacity={0.2} />
      <defs>
        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#848cd0" />
          <stop offset="100%" stopColor="#848cd0" stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* line */}
      <path d={linePath} fill="none" stroke="#848cd0" strokeWidth={2} />

      {/* dots + labels */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={4} fill="#848cd0" />
          <text
            x={p.x}
            y={pad.top + chartH + 16}
            textAnchor="middle"
            className="fill-muted-foreground text-[9px]"
          >
            {new Date(p.date).toLocaleDateString("ko-KR", {
              month: "short",
              day: "numeric",
            })}
          </text>
        </g>
      ))}
    </svg>
  );
}
