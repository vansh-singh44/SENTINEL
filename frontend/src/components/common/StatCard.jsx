// src/components/common/StatCard.jsx
import React from 'react';

const ACCENTS = {
  purple: {
    icon:       'bg-[#6c63ff]/15 text-[#9c94ff] border border-[#6c63ff]/20',
    glow:       'hover:border-[#6c63ff]/35 hover:shadow-[0_0_0_1px_rgba(108,99,255,0.25)]',
    valueColor: 'text-white',
    top:        'from-[#6c63ff]/30 to-transparent',
  },
  rose: {
    icon:       'bg-rose-500/12 text-rose-400 border border-rose-500/20',
    glow:       'hover:border-rose-500/35 hover:shadow-[0_0_0_1px_rgba(239,68,68,0.2)]',
    valueColor: 'text-rose-200',
    top:        'from-rose-500/30 to-transparent',
  },
  amber: {
    icon:       'bg-amber-500/12 text-amber-400 border border-amber-500/20',
    glow:       'hover:border-amber-500/35 hover:shadow-[0_0_0_1px_rgba(245,158,11,0.2)]',
    valueColor: 'text-amber-200',
    top:        'from-amber-500/30 to-transparent',
  },
  emerald: {
    icon:       'bg-emerald-500/12 text-emerald-400 border border-emerald-500/20',
    glow:       'hover:border-emerald-500/35 hover:shadow-[0_0_0_1px_rgba(34,197,94,0.2)]',
    valueColor: 'text-emerald-200',
    top:        'from-emerald-500/30 to-transparent',
  },
  cyan: {
    icon:       'bg-cyan-500/12 text-cyan-400 border border-cyan-500/20',
    glow:       'hover:border-cyan-500/35 hover:shadow-[0_0_0_1px_rgba(6,182,212,0.2)]',
    valueColor: 'text-cyan-200',
    top:        'from-cyan-500/30 to-transparent',
  },
};

const TREND_STYLES = {
  positive: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  negative: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
  critical: 'bg-rose-500/15 text-rose-300 border border-rose-500/30 animate-pulse',
  neutral:  'bg-white/[0.05] text-[#8b8fa8] border border-white/[0.07]',
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendType = 'neutral',
  accentColor = 'purple',
  onClick
}) {
  const a = ACCENTS[accentColor] || ACCENTS.purple;
  const t = TREND_STYLES[trendType] || TREND_STYLES.neutral;

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl p-5
                  bg-[#13152e] border border-white/[0.07]
                  transition-all duration-200
                  ${a.glow}
                  ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Top gradient streak */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${a.top}`} />

      {/* Subtle radial glow in corner */}
      <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full
                      bg-gradient-radial opacity-30 pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)' }} />

      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-semibold text-[#5a5e7a] uppercase tracking-widest truncate">
            {title}
          </p>
          <div className={`text-2xl sm:text-3xl font-bold tracking-tight ${a.valueColor}`}>
            {value}
          </div>
        </div>

        {Icon && (
          <div className={`shrink-0 p-2.5 rounded-xl ${a.icon}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <p className="text-[11px] text-[#5a5e7a] truncate">{subtitle}</p>
        {trend && (
          <span className={`shrink-0 px-2 py-0.5 rounded-lg text-[10px] font-semibold ${t}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
