// src/pages/ThreatAnalysis.jsx
import React from 'react';
import { 
  Crosshair, 
  Cpu, 
  Server, 
  ArrowLeft, 
  CheckCircle2, 
  Info,
  Layers,
  FileText
} from 'lucide-react';
import { useSoc } from '../context/SocContext';
import SeverityBadge from '../components/common/SeverityBadge';

export default function ThreatAnalysis() {
  const { selectedThreat, setActivePage } = useSoc();

  if (!selectedThreat) {
    return (
      <div className="p-12 text-center font-mono text-slate-400 space-y-4">
        <Crosshair className="w-12 h-12 mx-auto text-slate-400" />
        <h3 className="text-base text-white font-bold">NO EVENT SELECTED FOR ANALYSIS</h3>
        <p className="text-xs max-w-md mx-auto">
          Please choose a network session from the Live Threat Feed or Alerts page to inspect its telemetry vector.
        </p>
        <button
          onClick={() => setActivePage('live-feed')}
          className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-black text-xs font-bold font-mono uppercase"
        >
          Go to Live Feed
        </button>
      </div>
    );
  }

  const features = selectedThreat.features || {
    dur: 1.45,
    sbytes: selectedThreat.packet_size || 512,
    dbytes: 280,
    spkts: 14,
    dpkts: 8,
    service: selectedThreat.protocol.toLowerCase(),
    state: 'CON',
    rate: 1450.2,
    sttl: 64,
    dttl: 64
  };

  const isCritical = selectedThreat.severity === 'CRITICAL';
  const isHigh = selectedThreat.severity === 'HIGH';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Breadcrumb / Back button */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage('live-feed')}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Back to Live Feed"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-wide uppercase flex items-center gap-2">
                <Crosshair className="w-5 h-5 text-cyan-400" />
                THREAT INVESTIGATION & ANALYSIS
              </h2>
              <span className="font-mono text-xs text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                ID: {selectedThreat.id}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Deep forensic triage of flow session classified by SENTINEL ML Engine
            </p>
          </div>
        </div>

        <SeverityBadge severity={selectedThreat.severity} size="md" />
      </div>

      {/* Primary Triage Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        {/* Prediction */}
        <div className="p-4 rounded-lg bg-[#0d1322] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
            AI Classification
          </span>
          <div className="text-xl font-bold text-white flex items-center gap-2">
            <span className={isCritical ? 'text-rose-400' : isHigh ? 'text-orange-400' : 'text-cyan-400'}>
              {selectedThreat.prediction || selectedThreat.attack_category}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            UNSW-NB15 Class
          </span>
        </div>

        {/* Confidence */}
        <div className="p-4 rounded-lg bg-[#0d1322] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
            Prediction Confidence
          </span>
          <div className="text-xl font-bold text-cyan-400">
            {selectedThreat.confidence || 94.2}%
          </div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mt-2 border border-slate-800">
            <div 
              className="h-full bg-cyan-400 rounded-full" 
              style={{ width: `${selectedThreat.confidence || 94.2}%` }}
            />
          </div>
        </div>

        {/* Risk Score */}
        <div className="p-4 rounded-lg bg-[#0d1322] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
            Risk Score
          </span>
          <div className={`text-xl font-bold ${
            selectedThreat.risk_score >= 80 ? 'text-rose-400' : selectedThreat.risk_score >= 50 ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {selectedThreat.risk_score || 85} / 100
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            Severity Weight Matrix
          </span>
        </div>

        {/* Priority */}
        <div className="p-4 rounded-lg bg-[#0d1322] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
            Triage Priority
          </span>
          <div className="text-xl font-bold text-white flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-sm font-bold ${
              selectedThreat.priority === 'P1' ? 'bg-rose-950 text-rose-300 border border-rose-700' : 'bg-slate-800 text-slate-200'
            }`}>
              {selectedThreat.priority || 'P1'}
            </span>
            <span className="text-xs text-slate-400 font-normal">
              {selectedThreat.priority === 'P1' ? 'Immediate Triage' : 'Standard Queue'}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            SOC Workflow SLA: {selectedThreat.priority === 'P1' ? '< 15 mins' : '< 4 hours'}
          </span>
        </div>
      </div>

      {/* Two Column Layout: Network Session Details + Model Detection Context */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Network Session Context */}
        <div className="bg-[#0d1322] border border-slate-800 rounded-lg p-5 space-y-4 font-mono">
          <h3 className="text-xs uppercase tracking-wider text-slate-300 font-bold flex items-center gap-2 pb-2 border-b border-slate-800">
            <Server className="w-4 h-4 text-cyan-400" />
            Network Flow Identifiers
          </h3>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded bg-[#090d16] border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase block mb-0.5">Source IP</span>
              <span className="text-cyan-300 font-bold text-sm select-all">
                {selectedThreat.source_ip}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">Origin Endpoint</span>
            </div>

            <div className="p-3 rounded bg-[#090d16] border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase block mb-0.5">Destination IP</span>
              <span className="text-white font-bold text-sm select-all">
                {selectedThreat.destination_ip}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">Internal Target Host</span>
            </div>

            <div className="p-3 rounded bg-[#090d16] border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase block mb-0.5">Protocol & Port</span>
              <span className="text-slate-200 font-bold text-sm">
                {selectedThreat.protocol} / Port {selectedThreat.port || 80}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">
                Transport Layer
              </span>
            </div>

            <div className="p-3 rounded bg-[#090d16] border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase block mb-0.5">Timestamp</span>
              <span className="text-slate-200 font-bold text-sm">
                {selectedThreat.timestamp}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">Ingestion Time</span>
            </div>
          </div>
        </div>

        {/* Right: Detection Model Information */}
        <div className="bg-[#0d1322] border border-slate-800 rounded-lg p-5 space-y-4 font-mono">
          <h3 className="text-xs uppercase tracking-wider text-slate-300 font-bold flex items-center gap-2 pb-2 border-b border-slate-800">
            <Cpu className="w-4 h-4 text-emerald-400" />
            Detection Model & Dataset Information
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-[#090d16] border border-slate-800/80">
              <span className="text-slate-400">Classifying Model:</span>
              <span className="text-white font-bold">Random Forest Classifier</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-[#090d16] border border-slate-800/80">
              <span className="text-slate-400">Benchmark Training Dataset:</span>
              <span className="text-cyan-400 font-bold">UNSW-NB15 Cyber Benchmark</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-[#090d16] border border-slate-800/80">
              <span className="text-slate-400">Ensemble Tree Consensus:</span>
              <span className="text-emerald-400 font-bold">{selectedThreat.confidence || 94.2}% Agreement (150 trees)</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-[#090d16] border border-slate-800/80">
              <span className="text-slate-400">Trained Model Artifact:</span>
              <span className="text-slate-300 font-mono text-[11px]">sentinel_model.joblib</span>
            </div>
          </div>
        </div>
      </div>

      {/* Network Features Extracted (UNSW-NB15 Vector) */}
      <div className="bg-[#0d1322] border border-slate-800 rounded-lg p-5 space-y-3 font-mono">
        <h3 className="text-xs uppercase tracking-wider text-slate-300 font-bold flex items-center gap-2 pb-2 border-b border-slate-800">
          <Layers className="w-4 h-4 text-cyan-400" />
          UNSW-NB15 Flow Feature Vector (Inference Input)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
          <div className="p-2.5 rounded bg-[#090d16] border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">dur (Duration)</span>
            <span className="text-white font-bold">{features.dur} sec</span>
          </div>
          <div className="p-2.5 rounded bg-[#090d16] border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">sbytes (Src Bytes)</span>
            <span className="text-white font-bold">{features.sbytes} B</span>
          </div>
          <div className="p-2.5 rounded bg-[#090d16] border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">dbytes (Dst Bytes)</span>
            <span className="text-white font-bold">{features.dbytes} B</span>
          </div>
          <div className="p-2.5 rounded bg-[#090d16] border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">spkts (Src Packets)</span>
            <span className="text-white font-bold">{features.spkts} pkts</span>
          </div>
          <div className="p-2.5 rounded bg-[#090d16] border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">dpkts (Dst Packets)</span>
            <span className="text-white font-bold">{features.dpkts} pkts</span>
          </div>
          <div className="p-2.5 rounded bg-[#090d16] border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">service</span>
            <span className="text-cyan-300 font-bold">{features.service || 'http'}</span>
          </div>
          <div className="p-2.5 rounded bg-[#090d16] border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">state</span>
            <span className="text-cyan-300 font-bold">{features.state || 'CON'}</span>
          </div>
          <div className="p-2.5 rounded bg-[#090d16] border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">rate (Flow Rate)</span>
            <span className="text-white font-bold">{features.rate} pkt/s</span>
          </div>
          <div className="p-2.5 rounded bg-[#090d16] border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">sttl (Src TTL)</span>
            <span className="text-white font-bold">{features.sttl || 64}</span>
          </div>
          <div className="p-2.5 rounded bg-[#090d16] border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">dttl (Dst TTL)</span>
            <span className="text-white font-bold">{features.dttl || 64}</span>
          </div>
        </div>
      </div>

      {/* RECOMMENDED RESPONSE (Advisory Only) */}
      <div className="bg-[#0d1322] border border-slate-800 rounded-lg p-5 space-y-4 font-mono">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-xs uppercase tracking-wider text-amber-300 font-bold flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            RECOMMENDED RESPONSE (Analyst Advisory)
          </h3>
          <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            HUMAN-IN-THE-LOOP REQUIRED
          </span>
        </div>

        {/* Highlighted Recommendation Box */}
        <div className="p-4 rounded-lg bg-[#090d16] border border-amber-500/30 text-xs space-y-3">
          <div className="text-slate-200 font-semibold leading-relaxed">
            {selectedThreat.recommendation || 'Investigate source IP and inspect affected destination host logs for unauthorized sessions.'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Investigate source IP {selectedThreat.source_ip} history</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Review affected host {selectedThreat.destination_ip} service status</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Inspect related protocol traffic on Port {selectedThreat.port || 80}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Check firewall logs for repeated connection trials</span>
            </div>
          </div>
        </div>

        {/* Disclaimer on Non-automated Blocking */}
        <div className="flex items-start gap-2.5 p-3 rounded bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-slate-300">Policy Safeguard Notice:</strong> These recommendations are for security analysts. SENTINEL does NOT automatically drop or block network traffic without explicit security administrator approval.
          </p>
        </div>
      </div>
    </div>
  );
}
