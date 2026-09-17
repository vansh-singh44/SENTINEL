// src/components/charts/SeverityChart.jsx
import React, { useState } from 'react';
import { INITIAL_SEVERITY_DISTRIBUTION } from '../../data/sampleData';

export default function SeverityChart({ data = INITIAL_SEVERITY_DISTRIBUTION }) {
  const [hoveredSegment, setHoveredSegment] = useState(null);

  // SVG Donut calculations
  const size = 180;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Immutably precompute offsets
  const segments = data.map((item, index) => {
    const prevPercent = data.slice(0, index).reduce((acc, curr) => acc + curr.percent, 0);
    const strokeDasharray = `${(item.percent / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((prevPercent / 100) * circumference);
    return { ...item, strokeDasharray, strokeDashoffset };
  });

  const activeItem = hoveredSegment || data[0];

  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-6">
      {/* SVG Donut */}
      <div className="relative flex items-center justify-center">
        <svg 
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90 select-none"
        >
          {/* Background circle track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#131c31"
            strokeWidth={strokeWidth}
          />

          {segments.map((item) => {
            const isHovered = hoveredSegment?.name === item.name;

            return (
              <circle
                key={item.name}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={item.strokeDasharray}
                strokeDashoffset={item.strokeDashoffset}
                strokeLinecap="butt"
                onMouseEnter={() => setHoveredSegment(item)}
                onMouseLeave={() => setHoveredSegment(null)}
                className="transition-all duration-200 cursor-pointer"
                style={{
                  filter: isHovered ? `drop-shadow(0 0 8px ${item.color}80)` : 'none'
                }}
              />
            );
          })}
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            {activeItem.name}
          </span>
          <span className="text-xl font-mono font-bold text-white tracking-tight">
            {activeItem.percent}%
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            {activeItem.count.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Legend & Details */}
      <div className="flex-1 w-full space-y-2 font-mono text-xs">
        {data.map((item) => {
          const isHovered = hoveredSegment?.name === item.name;

          return (
            <div
              key={item.name}
              onMouseEnter={() => setHoveredSegment(item)}
              onMouseLeave={() => setHoveredSegment(null)}
              className={`flex items-center justify-between p-1.5 rounded transition-all cursor-pointer ${
                isHovered ? 'bg-slate-800/80' : 'hover:bg-slate-900/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <span 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: item.color }} 
                />
                <span className={`font-semibold uppercase tracking-wider ${
                  isHovered ? 'text-white' : 'text-slate-300'
                }`}>
                  {item.name}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-slate-400 text-[11px]">
                  {item.count.toLocaleString()}
                </span>
                <span className="font-bold text-white w-10 text-right">
                  {item.percent}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
