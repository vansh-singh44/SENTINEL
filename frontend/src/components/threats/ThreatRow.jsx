// src/components/threats/ThreatRow.jsx
import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import SeverityBadge from '../common/SeverityBadge';
import { useSoc } from '../../context/SocContext';

export default function ThreatRow({ event }) {
  const { inspectEvent } = useSoc();
  const isCritical = event.severity === 'CRITICAL';
  const isHigh = event.severity === 'HIGH';

  return (
    <tr
      onClick={() => inspectEvent(event)}
      className={`group cursor-pointer text-xs select-none transition-colors
        ${isCritical
          ? 'bg-rose-500/[0.06] hover:bg-rose-500/[0.12]'
          : isHigh
          ? 'bg-orange-500/[0.05] hover:bg-orange-500/[0.10]'
          : 'hover:bg-[#6c63ff]/[0.05]'
        }`}
    >
      {/* Time */}
      <td className="py-3 px-4 whitespace-nowrap text-[#5a5e7a] font-mono">
        {event.timestamp}
      </td>

      {/* Source IP */}
      <td className="py-3 px-4 whitespace-nowrap font-mono">
        <span className="text-[#9c94ff] font-semibold">{event.source_ip}</span>
        {event.port && (
          <span className="text-[#5a5e7a] text-[10px] ml-1">:{event.port}</span>
        )}
      </td>

      {/* Destination IP */}
      <td className="py-3 px-4 whitespace-nowrap text-[#8b8fa8] font-mono">
        {event.destination_ip}
      </td>

      {/* Protocol */}
      <td className="py-3 px-4 whitespace-nowrap">
        <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold
                         bg-white/[0.06] text-[#8b8fa8] border border-white/[0.08]">
          {event.protocol}
        </span>
      </td>

      {/* Attack Category */}
      <td className="py-3 px-4 whitespace-nowrap">
        <span className={`font-semibold ${
          isCritical ? 'text-rose-400' : isHigh ? 'text-orange-400' : 'text-[#e8eaf6]'
        }`}>
          {event.attack_category || event.prediction}
        </span>
      </td>

      {/* Confidence */}
      <td className="py-3 px-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#e8eaf6]">{event.confidence || 94.0}%</span>
          <div className="w-12 h-1 bg-white/[0.08] rounded-full overflow-hidden hidden sm:block">
            <div
              className="h-full bg-[#6c63ff] rounded-full"
              style={{ width: `${event.confidence || 94}%` }}
            />
          </div>
        </div>
      </td>

      {/* Risk Score */}
      <td className="py-3 px-4 whitespace-nowrap">
        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
          event.risk_score >= 80
            ? 'bg-rose-500/15 text-rose-300 border border-rose-500/25'
            : event.risk_score >= 50
            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/25'
            : 'bg-white/[0.06] text-[#8b8fa8] border border-white/[0.08]'
        }`}>
          {event.risk_score || 10}/100
        </span>
      </td>

      {/* Severity Badge */}
      <td className="py-3 px-4 whitespace-nowrap">
        <SeverityBadge severity={event.severity} size="sm" />
      </td>

      {/* Action */}
      <td className="py-3 px-4 whitespace-nowrap text-right">
        <div className="inline-flex items-center gap-1 text-[11px] font-semibold
                        text-[#5a5e7a] group-hover:text-[#9c94ff] transition-colors">
          <span>Analyze</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </td>
    </tr>
  );
}
