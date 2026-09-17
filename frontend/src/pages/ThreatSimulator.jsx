// src/pages/ThreatSimulator.jsx
import React, { useState } from 'react';
import { 
  Terminal, 
  Play, 
  Sparkles, 
  RotateCcw, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Layers
} from 'lucide-react';
import { useSoc } from '../context/SocContext';
import { api } from '../services/api';
import { SIMULATOR_PRESETS } from '../data/sampleData';
import SeverityBadge from '../components/common/SeverityBadge';

export default function ThreatSimulator() {
  const { addSimulatedThreatToFeed, inspectEvent } = useSoc();

  // Initial event form state
  const defaultEvent = {
    source_ip: '185.220.101.5',
    destination_ip: '10.0.2.45',
    protocol: 'TCP',
    port: 8080,
    packet_size: 4096,
    duration: 2.3,
    service: 'http',
    state: 'FIN'
  };

  const [eventData, setEventData] = useState(defaultEvent);
  const [selectedPresetName, setSelectedPresetName] = useState('Remote Code Execution / Exploit');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Handle Preset selection
  const handleSelectPreset = (preset) => {
    setSelectedPresetName(preset.name);
    setEventData({
      source_ip: preset.source_ip,
      destination_ip: preset.destination_ip,
      protocol: preset.protocol,
      port: preset.port,
      packet_size: preset.packet_size,
      duration: preset.duration || 1.8,
      service: preset.service || 'http',
      state: preset.state || 'CON'
    });
    setPredictionResult(null);
  };

  // Generate Sample Event from Backend or Random Preset
  const handleGenerateSample = async () => {
    setIsAnalyzing(true);
    const sample = await api.getSampleEvent();
    setEventData(sample.event);
    setSelectedPresetName('Custom Generated Event');
    setPredictionResult(null);
    setIsAnalyzing(false);
  };

  // Run AI Threat Analysis
  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await api.predictThreat(eventData);
      setPredictionResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Clear Form
  const handleClear = () => {
    setEventData({
      source_ip: '',
      destination_ip: '',
      protocol: 'TCP',
      port: '',
      packet_size: '',
      duration: '',
      service: 'http',
      state: 'CON'
    });
    setPredictionResult(null);
    setSelectedPresetName(null);
  };

  // Push to Live Feed & Inspect
  const handlePushAndInspect = () => {
    if (!predictionResult) return;
    addSimulatedThreatToFeed(predictionResult);
    inspectEvent(predictionResult);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 font-mono">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide uppercase flex items-center gap-2.5">
              <Terminal className="w-6 h-6 text-cyan-400" />
              THREAT SIMULATOR
            </h2>
            <span className="px-2 py-0.5 rounded text-xs bg-cyan-950/60 text-cyan-300 border border-cyan-800/60 font-semibold">
              INTERACTIVE INFERENCE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
            Run real-time AI analysis and classification on synthetic or sampled network flow events
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleGenerateSample}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0d1322] hover:bg-slate-800 border border-slate-700 text-cyan-300 text-xs font-bold transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Sample Event</span>
          </button>

          <button
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Preset Scenario Quick Selectors */}
      <div className="space-y-2">
        <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
          Select UNSW-NB15 Threat Scenario Preset:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {SIMULATOR_PRESETS.map((preset) => {
            const isSelected = selectedPresetName === preset.name;
            return (
              <button
                key={preset.name}
                onClick={() => handleSelectPreset(preset)}
                className={`p-2 rounded-md text-left text-xs border transition-all truncate ${
                  isSelected
                    ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 font-bold'
                    : 'bg-[#0d1322] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
                title={preset.description}
              >
                <span className="block truncate">{preset.name}</span>
                <span className="text-[10px] text-slate-400 block font-normal">
                  {preset.expected_category} / Port {preset.port}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: Event Form + AI Prediction Result Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Network Event Input Form (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0d1322] border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs uppercase tracking-wider text-white font-bold flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              NETWORK EVENT PARAMETERS
            </h3>
            <span className="text-[10px] text-slate-400">
              UNSW-NB15 Flow Vector
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Source IP */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-semibold block">
                Source IP
              </label>
              <input
                type="text"
                value={eventData.source_ip}
                onChange={(e) => setEventData({ ...eventData, source_ip: e.target.value })}
                placeholder="e.g. 198.51.100.42"
                className="w-full px-3 py-2 rounded bg-[#090d16] border border-slate-700 text-white focus:outline-hidden focus:border-cyan-500 text-xs"
              />
            </div>

            {/* Destination IP */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-semibold block">
                Destination IP
              </label>
              <input
                type="text"
                value={eventData.destination_ip}
                onChange={(e) => setEventData({ ...eventData, destination_ip: e.target.value })}
                placeholder="e.g. 10.0.1.15"
                className="w-full px-3 py-2 rounded bg-[#090d16] border border-slate-700 text-white focus:outline-hidden focus:border-cyan-500 text-xs"
              />
            </div>

            {/* Protocol */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-semibold block">
                Protocol
              </label>
              <select
                value={eventData.protocol}
                onChange={(e) => setEventData({ ...eventData, protocol: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[#090d16] border border-slate-700 text-white focus:outline-hidden focus:border-cyan-500 text-xs cursor-pointer"
              >
                <option value="TCP">TCP (Transmission Control)</option>
                <option value="UDP">UDP (User Datagram)</option>
                <option value="ICMP">ICMP (Internet Control Message)</option>
                <option value="ARP">ARP (Address Resolution)</option>
              </select>
            </div>

            {/* Port */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-semibold block">
                Destination Port
              </label>
              <input
                type="number"
                value={eventData.port}
                onChange={(e) => setEventData({ ...eventData, port: parseInt(e.target.value, 10) || 0 })}
                placeholder="e.g. 22, 80, 443, 8080"
                className="w-full px-3 py-2 rounded bg-[#090d16] border border-slate-700 text-white focus:outline-hidden focus:border-cyan-500 text-xs"
              />
            </div>

            {/* Packet Size */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-semibold block">
                Packet Size (bytes)
              </label>
              <input
                type="number"
                value={eventData.packet_size}
                onChange={(e) => setEventData({ ...eventData, packet_size: parseFloat(e.target.value) || 0 })}
                placeholder="e.g. 1024"
                className="w-full px-3 py-2 rounded bg-[#090d16] border border-slate-700 text-white focus:outline-hidden focus:border-cyan-500 text-xs"
              />
            </div>

            {/* Duration */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-semibold block">
                Flow Duration (sec)
              </label>
              <input
                type="number"
                step="0.01"
                value={eventData.duration}
                onChange={(e) => setEventData({ ...eventData, duration: parseFloat(e.target.value) || 0 })}
                placeholder="e.g. 1.45"
                className="w-full px-3 py-2 rounded bg-[#090d16] border border-slate-700 text-white focus:outline-hidden focus:border-cyan-500 text-xs"
              />
            </div>
          </div>

          {/* Advanced Features Accordion */}
          <div className="pt-2">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>{showAdvanced ? '[-] Hide Advanced UNSW-NB15 Fields' : '[+] Show Advanced UNSW-NB15 Fields'}</span>
            </button>

            {showAdvanced && (
              <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-800 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 block">Service</label>
                  <input
                    type="text"
                    value={eventData.service}
                    onChange={(e) => setEventData({ ...eventData, service: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded bg-[#090d16] border border-slate-700 text-slate-200 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 block">TCP State</label>
                  <input
                    type="text"
                    value={eventData.state}
                    onChange={(e) => setEventData({ ...eventData, state: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded bg-[#090d16] border border-slate-700 text-slate-200 text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Run Threat Analysis Primary Button */}
          <div className="pt-3 border-t border-slate-800">
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing || !eventData.source_ip}
              className="w-full py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-950/50 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>CLASSIFYING THREAT VECTOR...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>RUN THREAT ANALYSIS (POST /predict)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: AI PREDICTION Result Panel (5 Cols) */}
        <div className="lg:col-span-5 bg-[#0d1322] border border-slate-800 rounded-lg p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs uppercase tracking-wider text-white font-bold flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                AI THREAT PREDICTION
              </h3>
              {predictionResult && (
                <span className={`px-2 py-0.5 rounded text-[10px] ${
                  predictionResult.backend_source === 'live_backend'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}>
                  {predictionResult.backend_source === 'live_backend' ? 'LIVE FASTAPI' : 'HEURISTIC ENGINE'}
                </span>
              )}
            </div>

            {predictionResult ? (
              <div className="space-y-4 mt-3">
                {/* Prediction Result Header */}
                <div className="p-4 rounded-lg bg-[#090d16] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 uppercase">Classified Attack</span>
                    <SeverityBadge severity={predictionResult.severity} size="sm" />
                  </div>
                  <div className="text-2xl font-bold text-white tracking-wide">
                    {predictionResult.prediction || predictionResult.attack_category}
                  </div>
                  <div className="text-xs text-slate-400 font-sans">
                    Target: {predictionResult.destination_ip}:{predictionResult.port} ({predictionResult.protocol})
                  </div>
                </div>

                {/* Inference Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-3 rounded bg-[#090d16] border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block">Confidence</span>
                    <span className="text-base font-bold text-cyan-400 mt-0.5 block">
                      {predictionResult.confidence}%
                    </span>
                  </div>

                  <div className="p-3 rounded bg-[#090d16] border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block">Risk Score</span>
                    <span className={`text-base font-bold mt-0.5 block ${
                      predictionResult.risk_score >= 80 ? 'text-rose-400' : 'text-amber-400'
                    }`}>
                      {predictionResult.risk_score}/100
                    </span>
                  </div>

                  <div className="p-3 rounded bg-[#090d16] border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block">Priority</span>
                    <span className="text-base font-bold text-white mt-0.5 block">
                      {predictionResult.priority}
                    </span>
                  </div>
                </div>

                {/* Recommended Response Box */}
                <div className="p-3 rounded bg-[#090d16] border border-amber-500/30 text-xs space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-amber-300 block">
                    Recommended Analyst Response
                  </span>
                  <p className="text-slate-300 font-sans text-xs leading-relaxed">
                    {predictionResult.recommendation}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 space-y-3 font-sans">
                <ShieldCheck className="w-10 h-10 mx-auto text-slate-400" />
                <h4 className="text-sm font-bold text-white font-mono uppercase">
                  AWAITING INFERENCE EXECUTION
                </h4>
                <p className="text-xs max-w-xs mx-auto">
                  Configure the flow parameters on the left or select a preset scenario, then click "Run Threat Analysis".
                </p>
              </div>
            )}
          </div>

          {/* Bottom CTA when prediction exists */}
          {predictionResult && (
            <button
              onClick={handlePushAndInspect}
              className="w-full py-2.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-2"
            >
              <span>Push Event to Live SOC Feed & Investigate</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
