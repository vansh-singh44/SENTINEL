// src/components/common/StatusIndicator.jsx
import React from 'react';

export default function StatusIndicator({ 
  status = 'ONLINE', 
  label, 
  pulse = true, 
  subtext 
}) {
  const norm = status ? status.toUpperCase() : 'OFFLINE';

  const config = {
    ONLINE: {
      color: 'bg-emerald-500',
      pingColor: 'bg-emerald-400',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30'
    },
    HEALTHY: {
      color: 'bg-emerald-500',
      pingColor: 'bg-emerald-400',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30'
    },
    ACTIVE: {
      color: 'bg-cyan-500',
      pingColor: 'bg-cyan-400',
      text: 'text-cyan-400',
      border: 'border-cyan-500/30'
    },
    DEGRADED: {
      color: 'bg-amber-500',
      pingColor: 'bg-amber-400',
      text: 'text-amber-400',
      border: 'border-amber-500/30'
    },
    OFFLINE: {
      color: 'bg-rose-500',
      pingColor: 'bg-rose-400',
      text: 'text-rose-400',
      border: 'border-rose-500/30'
    },
    CHECKING: {
      color: 'bg-slate-400',
      pingColor: 'bg-slate-300',
      text: 'text-slate-400',
      border: 'border-slate-500/30'
    }
  };

  const current = config[norm] || config.OFFLINE;

  return (
    <div className="inline-flex items-center gap-2">
      <span className="relative flex h-2.5 w-2.5 items-center justify-center">
        {pulse && norm !== 'OFFLINE' && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.pingColor}`}></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${current.color}`}></span>
      </span>
      <div className="flex flex-col">
        <span className={`font-mono text-xs font-semibold tracking-wider ${current.text}`}>
          {label || norm}
        </span>
        {subtext && (
          <span className="text-[10px] text-slate-500 font-mono">
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
}
