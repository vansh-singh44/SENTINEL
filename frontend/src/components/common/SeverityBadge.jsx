// src/components/common/SeverityBadge.jsx
import React from 'react';

export default function SeverityBadge({ severity = 'BENIGN', size = 'md' }) {
  const norm = severity ? severity.toUpperCase() : 'BENIGN';

  const styles = {
    BENIGN: {
      bg: 'bg-emerald-950/40 text-emerald-400 border-emerald-700/40',
      dot: 'bg-emerald-500',
      label: 'BENIGN'
    },
    LOW: {
      bg: 'bg-sky-950/40 text-sky-400 border-sky-700/40',
      dot: 'bg-sky-400',
      label: 'LOW'
    },
    MEDIUM: {
      bg: 'bg-amber-950/40 text-amber-300 border-amber-700/40',
      dot: 'bg-amber-400',
      label: 'MEDIUM'
    },
    HIGH: {
      bg: 'bg-orange-950/50 text-orange-400 border-orange-600/50 shadow-sm shadow-orange-950',
      dot: 'bg-orange-500 animate-pulse',
      label: 'HIGH'
    },
    CRITICAL: {
      bg: 'bg-rose-950/60 text-rose-300 border-rose-600/60 shadow-sm shadow-rose-950 ring-1 ring-rose-500/20',
      dot: 'bg-rose-500 animate-ping inline-flex h-2 w-2 rounded-full mr-1.5',
      solidDot: 'bg-rose-500',
      label: 'CRITICAL'
    }
  };

  const current = styles[norm] || styles.BENIGN;
  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-[10px] tracking-wider' 
    : 'px-2.5 py-1 text-xs tracking-wider';

  return (
    <span 
      className={`inline-flex items-center font-mono font-semibold rounded border uppercase ${current.bg} ${sizeClasses}`}
      title={`Threat Severity: ${current.label}`}
    >
      <span className="relative flex h-2 w-2 mr-1.5 items-center justify-center">
        {norm === 'CRITICAL' && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
        )}
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${norm === 'CRITICAL' ? 'bg-rose-500' : current.dot}`}></span>
      </span>
      {current.label}
    </span>
  );
}
