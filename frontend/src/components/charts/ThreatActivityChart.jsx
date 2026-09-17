// src/components/charts/ThreatActivityChart.jsx
import React, { useState } from 'react';
import { INITIAL_HOURLY_ACTIVITY } from '../../data/sampleData';

export default function ThreatActivityChart({ data = INITIAL_HOURLY_ACTIVITY, height = 240 }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-60 flex items-center justify-center font-mono text-xs text-slate-400">
        NO THREAT ACTIVITY RECORDED
      </div>
    );
  }

  const width = 700;
  const padding = { top: 20, right: 20, bottom: 35, left: 45 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Compute maximum values
  const maxTotal = Math.max(...data.map(d => d.total), 1000);
  const maxScaled = Math.ceil(maxTotal / 1000) * 1000;

  // Scale functions
  const getX = (i) => padding.left + (i / (data.length - 1)) * chartW;
  const getY = (val) => padding.top + chartH - (val / maxScaled) * chartH;

  // Build SVG path strings
  const totalPoints = data.map((d, i) => `${getX(i)},${getY(d.total)}`);
  const threatPoints = data.map((d, i) => `${getX(i)},${getY(d.threats * 8)}`); // Scaled for visual comparison
  const criticalPoints = data.map((d, i) => `${getX(i)},${getY(d.critical * 40)}`); // Scaled for visual comparison

  const totalPath = `M ${totalPoints.join(' L ')}`;
  const threatPath = `M ${threatPoints.join(' L ')}`;
  const criticalPath = `M ${criticalPoints.join(' L ')}`;

  const totalArea = `${totalPath} L ${getX(data.length - 1)},${padding.top + chartH} L ${getX(0)},${padding.top + chartH} Z`;
  const threatArea = `${threatPath} L ${getX(data.length - 1)},${padding.top + chartH} L ${getX(0)},${padding.top + chartH} Z`;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(r => ({
    val: Math.round(maxScaled * r),
    y: padding.top + chartH - chartH * r
  }));

  const activePoint = hoveredIndex !== null ? data[hoveredIndex] : null;

  return (
    <div className="w-full flex flex-col">
      {/* Legend & Current Hover Value */}
      <div className="flex flex-wrap items-center justify-between text-xs mb-2 pb-2 border-b border-white/[0.06] gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1.5 rounded-full bg-[#6c63ff]" />
            <span className="text-[#8b8fa8] text-[11px]">Total Events</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1.5 rounded-full bg-amber-400" />
            <span className="text-[#8b8fa8] text-[11px]">Threats</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1.5 rounded-full bg-rose-500" />
            <span className="text-[#8b8fa8] text-[11px]">Critical</span>
          </div>
        </div>

        {activePoint && (
          <div className="flex items-center gap-3 text-[11px] bg-[#0f1028] px-2.5 py-1 rounded-lg border border-white/[0.08]">
            <span className="text-[#5a5e7a]">@<strong className="text-white">{activePoint.time}</strong></span>
            <span className="text-[#9c94ff]">Events: <strong>{activePoint.total.toLocaleString()}</strong></span>
            <span className="text-amber-400">Threats: <strong>{activePoint.threats}</strong></span>
            <span className="text-rose-400">Critical: <strong>{activePoint.critical}</strong></span>
          </div>
        )}
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6c63ff" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#6c63ff" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="threatGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {yTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={padding.left}
                y1={tick.y}
                x2={width - padding.right}
                y2={tick.y}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 8}
                y={tick.y + 3}
                fill="#5a5e7a"
                fontSize="10"
                fontFamily="Inter"
                textAnchor="end"
              >
                {tick.val >= 1000 ? `${(tick.val / 1000).toFixed(1)}k` : tick.val}
              </text>
            </g>
          ))}

          {/* Area Fills */}
          <path d={totalArea} fill="url(#totalGrad)" />
          <path d={threatArea} fill="url(#threatGrad)" />

          {/* Path Lines */}
          <path d={totalPath}    fill="none" stroke="#6c63ff" strokeWidth="2" strokeLinecap="round" />
          <path d={threatPath}   fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
          <path d={criticalPath} fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />

          {/* X Axis labels */}
          {data.map((d, i) => {
            const x = getX(i);
            return (
              <text
                key={i}
                x={x}
                y={height - 8}
                fill={hoveredIndex === i ? '#9c94ff' : '#5a5e7a'}
                fontSize="10"
                fontFamily="Inter"
                textAnchor="middle"
              >
                {d.time}
              </text>
            );
          })}

          {data.map((d, i) => {
            const x = getX(i);
            const isHov = hoveredIndex === i;
            return (
              <g
                key={`hover-${i}`}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-crosshair"
              >
                <rect
                  x={x - chartW / (data.length * 2)}
                  y={padding.top}
                  width={chartW / data.length}
                  height={chartH}
                  fill="transparent"
                />
                {isHov && (
                  <>
                    <line
                      x1={x} y1={padding.top} x2={x} y2={padding.top + chartH}
                      stroke="rgba(108,99,255,0.4)" strokeWidth="1" strokeDasharray="3 3"
                    />
                    <circle cx={x} cy={getY(d.total)}         r="4"   fill="#6c63ff" stroke="#0b0c1e" strokeWidth="2" />
                    <circle cx={x} cy={getY(d.threats * 8)}   r="4"   fill="#f59e0b" stroke="#0b0c1e" strokeWidth="2" />
                    <circle cx={x} cy={getY(d.critical * 40)} r="4.5" fill="#ef4444" stroke="#0b0c1e" strokeWidth="2" />
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
