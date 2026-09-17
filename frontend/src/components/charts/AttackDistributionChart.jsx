// src/components/charts/AttackDistributionChart.jsx
import React, { useState } from 'react';
import { INITIAL_ATTACK_DISTRIBUTION } from '../../data/sampleData';

export default function AttackDistributionChart({ 
  data = INITIAL_ATTACK_DISTRIBUTION,
  limit = 8,
  showAll = false
}) {
  const [hovered, setHovered] = useState(null);

  const displayData = showAll ? data : data.slice(0, limit);
  const maxPercent = Math.max(...displayData.map(d => d.percent), 50);

  return (
    <div className="w-full space-y-3">
      {displayData.map((item, index) => {
        const isHovered = hovered === item.category;
        const barWidth = `${(item.percent / maxPercent) * 100}%`;

        return (
          <div
            key={item.category}
            onMouseEnter={() => setHovered(item.category)}
            onMouseLeave={() => setHovered(null)}
            className="group cursor-default"
          >
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[#5a5e7a] text-[10px] w-4 font-mono">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className={`font-semibold transition-colors ${
                  isHovered ? 'text-white' : 'text-[#e8eaf6]'
                }`}>
                  {item.category}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#5a5e7a] text-[11px]">
                  {item.count.toLocaleString()}
                </span>
                <span className="text-white text-xs font-bold w-10 text-right">
                  {item.percent}%
                </span>
              </div>
            </div>

            <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: barWidth,
                  backgroundColor: item.color || '#6c63ff',
                  boxShadow: isHovered ? `0 0 8px ${item.color || '#6c63ff'}80` : 'none'
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
