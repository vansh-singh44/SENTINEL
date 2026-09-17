// src/components/settings/SettingsModal.jsx
import React, { useState } from 'react';
import { X, Server, RefreshCw, CheckCircle, AlertTriangle, Database } from 'lucide-react';
import { useSoc } from '../../context/SocContext';

export default function SettingsModal() {
  const { 
    settingsOpen, 
    setSettingsOpen, 
    apiHealth, 
    checkBackendHealth,
    streamSpeedMs,
    setStreamSpeedMs,
    isFeedPaused,
    pauseFeed,
    resumeFeed
  } = useSoc();

  const [testing, setTesting] = useState(false);

  if (!settingsOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    await checkBackendHealth();
    setTesting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#0d1322] border border-slate-700 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
              <Server className="w-5 h-5 text-cyan-400" />
              SOC Engine Settings
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Backend endpoint and live telemetry preferences
            </p>
          </div>
          <button
            onClick={() => setSettingsOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Backend API Configuration */}
        <div className="space-y-3">
          <label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold block">
            FastAPI Backend Endpoint
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}
              className="flex-1 px-3 py-2 rounded-md bg-[#090d16] border border-slate-700 font-mono text-xs text-slate-200 select-all"
            />
            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="px-3 py-2 rounded-md bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 text-xs font-mono font-semibold transition-all inline-flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              <span>Test Ping</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-xs font-mono p-2.5 rounded bg-[#090d16] border border-slate-800">
            <span className="text-slate-400">Connection Status:</span>
            <span className={`font-semibold flex items-center gap-1.5 ${
              apiHealth.online ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {apiHealth.online ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  ONLINE ({apiHealth.latencyMs} ms)
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  STANDALONE DEMO (Backend Offline)
                </>
              )}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            To connect live: Run <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">uvicorn backend.main:app --reload</code> on port 8000.
          </p>
        </div>

        {/* Live Stream Telemetry Rate */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold block">
            Live Feed Ingestion Rate
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                setStreamSpeedMs(2500);
                if (isFeedPaused) resumeFeed();
              }}
              className={`py-2 px-3 rounded text-xs font-mono border transition-all ${
                streamSpeedMs === 2500 && !isFeedPaused
                  ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              Fast (2.5s)
            </button>
            <button
              onClick={() => {
                setStreamSpeedMs(5000);
                if (isFeedPaused) resumeFeed();
              }}
              className={`py-2 px-3 rounded text-xs font-mono border transition-all ${
                streamSpeedMs === 5000 && !isFeedPaused
                  ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              Standard (5.0s)
            </button>
            <button
              onClick={() => isFeedPaused ? resumeFeed() : pauseFeed()}
              className={`py-2 px-3 rounded text-xs font-mono border transition-all ${
                isFeedPaused
                  ? 'bg-amber-950 border-amber-500 text-amber-300 font-bold'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {isFeedPaused ? 'Resume Feed' : 'Pause Stream'}
            </button>
          </div>
        </div>

        {/* Machine Learning Specs */}
        <div className="space-y-2 pt-2 border-t border-slate-800 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2 text-slate-300 font-semibold uppercase">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            UNSW-NB15 Pipeline
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded bg-[#090d16] border border-slate-800">
            <div>Model: <strong className="text-white">Random Forest (150 trees)</strong></div>
            <div>Dataset: <strong className="text-white">UNSW-NB15 Flow</strong></div>
            <div>Accuracy: <strong className="text-emerald-400">94.82%</strong></div>
            <div>Attack Classes: <strong className="text-white">10 Categories</strong></div>
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-2">
          <button
            onClick={() => setSettingsOpen(false)}
            className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-semibold transition-colors uppercase tracking-wider"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
