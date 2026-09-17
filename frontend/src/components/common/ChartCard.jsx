// src/components/common/ChartCard.jsx
import React from 'react';

const BADGE_STYLES = {
  purple:  'text-[#9c94ff] bg-[#6c63ff]/10 border border-[#6c63ff]/25',
  cyan:    'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20',
  amber:   'text-amber-400 bg-amber-500/10 border border-amber-500/20',
  rose:    'text-rose-400 bg-rose-500/10 border border-rose-500/20',
  emerald: 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20',
  slate:   'text-[#8b8fa8] bg-white/[0.05] border border-white/[0.08]',
};

export default function ChartCard({
  title,
  subtitle,
  badge,
  badgeColor = 'slate',
  actions,
  children,
  className = ''
}) {
  return (
    <div className={`bg-[#13152e] border border-white/[0.07] rounded-2xl overflow-hidden flex flex-col ${className}`}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-sm font-semibold text-white tracking-wide">
              {title}
            </h3>
            {badge && (
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold ${BADGE_STYLES[badgeColor] || BADGE_STYLES.slate}`}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-[11px] text-[#5a5e7a] mt-0.5">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2">{actions}</div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-center">
        {children}
      </div>
    </div>
  );
}
