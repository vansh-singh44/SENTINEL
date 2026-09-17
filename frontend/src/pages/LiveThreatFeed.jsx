// src/pages/LiveThreatFeed.jsx
import React from 'react';
import { 
  Radio, 
  Pause, 
  Play, 
  Trash2 
} from 'lucide-react';
import { useSoc } from '../context/SocContext';
import ThreatTable from '../components/threats/ThreatTable';

export default function LiveThreatFeed() {
  const { 
    liveEvents, 
    isFeedPaused, 
    pauseFeed, 
    resumeFeed, 
    clearFeed,
    streamSpeedMs,
    setStreamSpeedMs
  } = useSoc();

  const eventsPerSec = (1000 / streamSpeedMs).toFixed(1);
  const criticalInFeed = liveEvents.filter(e => e.severity === 'CRITICAL').length;
  const threatsInFeed = liveEvents.filter(e => e.severity !== 'BENIGN').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-wide uppercase flex items-center gap-2.5">
              <Radio className={`w-6 h-6 ${isFeedPaused ? 'text-slate-400' : 'text-cyan-400 animate-pulse'}`} />
              LIVE THREAT FEED
            </h2>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-bold tracking-wider uppercase border ${
              isFeedPaused
                ? 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                : 'bg-cyan-950/60 text-cyan-300 border-cyan-800/60'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isFeedPaused ? 'bg-amber-400' : 'bg-cyan-400 animate-ping'}`} />
              {isFeedPaused ? 'STREAM PAUSED' : 'LIVE STREAM'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Continuous packet flow vector ingestion and real-time Random Forest inference
          </p>
        </div>

        {/* Live Stream Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={isFeedPaused ? resumeFeed : pauseFeed}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono font-bold border transition-all ${
              isFeedPaused
                ? 'bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border-emerald-700/80'
                : 'bg-amber-950 hover:bg-amber-900 text-amber-300 border-amber-700/80'
            }`}
          >
            {isFeedPaused ? (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Resume Feed</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Feed</span>
              </>
            )}
          </button>

          <button
            onClick={clearFeed}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-all"
            title="Clear current stream buffer"
          >
            <Trash2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Clear Buffer</span>
          </button>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-[#0d1322] p-1 rounded-lg border border-slate-800 text-xs font-mono">
            <span className="text-[10px] text-slate-400 px-1.5">Speed:</span>
            <button
              onClick={() => { setStreamSpeedMs(2500); if (isFeedPaused) resumeFeed(); }}
              className={`px-2 py-1 rounded text-[10px] ${streamSpeedMs === 2500 ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800' : 'text-slate-400 hover:text-white'}`}
            >
              2.5s
            </button>
            <button
              onClick={() => { setStreamSpeedMs(5000); if (isFeedPaused) resumeFeed(); }}
              className={`px-2 py-1 rounded text-[10px] ${streamSpeedMs === 5000 ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800' : 'text-slate-400 hover:text-white'}`}
            >
              5.0s
            </button>
          </div>
        </div>
      </div>

      {/* Stream Metrics Quick Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3 rounded-lg bg-[#0d1322] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Ingestion Rate</span>
          <span className="text-lg font-bold text-cyan-400">{eventsPerSec} evt/sec</span>
        </div>
        <div className="p-3 rounded-lg bg-[#0d1322] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Buffered In Memory</span>
          <span className="text-lg font-bold text-white">{liveEvents.length} events</span>
        </div>
        <div className="p-3 rounded-lg bg-[#0d1322] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Active Threats In Buffer</span>
          <span className="text-lg font-bold text-amber-400">{threatsInFeed} flagged</span>
        </div>
        <div className="p-3 rounded-lg bg-[#0d1322] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Critical Incidents</span>
          <span className="text-lg font-bold text-rose-400">{criticalInFeed} critical</span>
        </div>
      </div>

      {/* Full Live Threat Table */}
      <ThreatTable 
        events={liveEvents} 
        showControls={true}
      />
    </div>
  );
}
