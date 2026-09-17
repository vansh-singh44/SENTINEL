// src/components/charts/ProtocolDistributionChart.jsx
import React from 'react';
import { INITIAL_PROTOCOL_DISTRIBUTION } from '../../data/sampleData';

export default function ProtocolDistributionChart({ data = INITIAL_PROTOCOL_DISTRIBUTION }) {
  return (
    <div className="w-full space-y-4 font-mono">
      {data.map((item) => (
        <div key={item.protocol} className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-xs" style={{ backgroundColor: item.color }} />
              <span className="font-semibold text-slate-200">{item.protocol}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-400 text-[11px]">{item.count.toLocaleString()} pkts</span>
              <span className="font-bold text-white w-12 text-right">{item.percent}%</span>
            </div>
          </div>
          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${item.percent}%`,
                backgroundColor: item.color
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
