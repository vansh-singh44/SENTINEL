// src/components/alerts/AlertCard.jsx
import React from 'react';
import { 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  ShieldAlert, 
  ExternalLink 
} from 'lucide-react';
import SeverityBadge from '../common/SeverityBadge';
import { useSoc } from '../../context/SocContext';

export default function AlertCard({ alert }) {
  const { inspectEvent, resolveAlert, acknowledgeAlert } = useSoc();

  const isCritical = alert.severity === 'CRITICAL';
  const isResolved = alert.status === 'Resolved';
  const isInvestigating = alert.status === 'Investigating';

  const handleInvestigate = () => {
    // Map alert into threat event format
    inspectEvent({
      id: alert.id,
      timestamp: alert.timestamp,
      source_ip: alert.source.split(' ')[0],
      destination_ip: alert.destination.split(' ')[0],
      protocol: 'TCP',
      port: alert.port || 80,
      packet_size: 1024,
      attack_category: alert.attack_category,
      prediction: alert.attack_category,
      confidence: alert.confidence,
      risk_score: alert.risk,
      severity: alert.severity,
      priority: alert.priority || 'P1',
      status: alert.status,
      recommendation: alert.recommendation
    });
  };

  return (
    <div className={`p-4 rounded-lg border transition-all duration-200 bg-[#0d1322] ${
      isCritical 
        ? 'border-rose-900/60 hover:border-rose-600/60 shadow-xs shadow-rose-950' 
        : 'border-slate-800 hover:border-slate-700'
    } ${isResolved ? 'opacity-60' : ''}`}>
      {/* Top row: ID, Severity, Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-cyan-400">
            {alert.id}
          </span>
          <SeverityBadge severity={alert.severity} size="sm" />
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
            isResolved 
              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40' 
              : isInvestigating 
              ? 'bg-amber-950/40 text-amber-300 border-amber-800/40' 
              : 'bg-rose-950/40 text-rose-300 border-rose-800/40'
          }`}>
            {alert.status}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
          <Clock className="w-3 h-3" />
          <span>{alert.timestamp}</span>
        </div>
      </div>

      {/* Title */}
      <h4 className="text-sm font-semibold text-white font-mono mb-1">
        {alert.title}
      </h4>

      {/* Description */}
      <p className="text-xs text-slate-400 mb-3 leading-relaxed">
        {alert.description}
      </p>

      {/* Grid details */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono py-2.5 px-3 rounded bg-[#090d16] border border-slate-800/80 mb-3">
        <div>
          <span className="text-[10px] text-slate-400 block uppercase">Source</span>
          <span className="text-cyan-300 font-semibold truncate block">{alert.source}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block uppercase">Destination</span>
          <span className="text-slate-300 truncate block">{alert.destination}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block uppercase">Confidence</span>
          <span className="text-slate-200 font-semibold">{alert.confidence}%</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block uppercase">Risk Score</span>
          <span className={`font-bold ${alert.risk >= 80 ? 'text-rose-400' : 'text-amber-400'}`}>
            {alert.risk}/100 ({alert.priority})
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
        <button
          onClick={handleInvestigate}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800/60 text-xs font-mono font-semibold transition-colors"
        >
          <span>Investigate in Threat Analysis</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-2">
          {!isResolved && !isInvestigating && (
            <button
              onClick={() => acknowledgeAlert(alert.id)}
              className="px-2.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700 transition-colors"
            >
              Acknowledge
            </button>
          )}

          {!isResolved && (
            <button
              onClick={() => resolveAlert(alert.id)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/60 text-xs font-mono transition-colors"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Resolve</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
