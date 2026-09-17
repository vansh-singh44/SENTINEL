// src/pages/AIModel.jsx
import React from 'react';
import { 
  Cpu, 
  CheckCircle2, 
  Zap
} from 'lucide-react';
import { 
  MODEL_METRICS, 
  CONFUSION_MATRIX, 
  DETECTION_PIPELINE_STAGES 
} from '../data/sampleData';
import ChartCard from '../components/common/ChartCard';

export default function AIModel() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide uppercase flex items-center gap-2.5">
              <Cpu className="w-6 h-6 text-cyan-400" />
              AI THREAT DETECTION MODEL
            </h2>
            <span className="px-2 py-0.5 rounded text-xs bg-cyan-950/60 text-cyan-300 border border-cyan-800/60 font-semibold">
              RANDOM FOREST ENSEMBLE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-normal font-sans">
            Machine learning threat classification architecture trained on the UNSW-NB15 flow benchmark
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Model File:</span>
          <code className="text-xs px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-cyan-300">
            {MODEL_METRICS.trained_model_file}
          </code>
        </div>
      </div>

      {/* Model Overview Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-lg bg-[#0d1322] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block mb-1">Architecture</span>
          <span className="text-sm font-bold text-white truncate block">Random Forest</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">150 Estimators</span>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0d1322] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block mb-1">Benchmark Data</span>
          <span className="text-sm font-bold text-cyan-400 block">UNSW-NB15</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Flow Dataset</span>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0d1322] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block mb-1">Training Samples</span>
          <span className="text-sm font-bold text-white block">
            {MODEL_METRICS.training_samples.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">80% Stratified</span>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0d1322] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block mb-1">Validation Samples</span>
          <span className="text-sm font-bold text-white block">
            {MODEL_METRICS.testing_samples.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">20% Holdout</span>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0d1322] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block mb-1">Features</span>
          <span className="text-sm font-bold text-emerald-400 block">
            {MODEL_METRICS.features_count} Features
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Dur, bytes, rate...</span>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0d1322] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block mb-1">Target Classes</span>
          <span className="text-sm font-bold text-amber-400 block">
            {MODEL_METRICS.classes_count} Classes
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">9 Threats + Normal</span>
        </div>
      </div>

      {/* Model Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-[#0d1322] border border-slate-800 relative overflow-hidden">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
            ACCURACY
          </div>
          <div className="text-3xl font-bold text-emerald-400">
            {MODEL_METRICS.accuracy}%
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center gap-1 font-sans">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Overall classification rate</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#0d1322] border border-slate-800 relative overflow-hidden">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
            PRECISION
          </div>
          <div className="text-3xl font-bold text-cyan-400">
            {MODEL_METRICS.precision}%
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center gap-1 font-sans">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Low false alarm probability</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#0d1322] border border-slate-800 relative overflow-hidden">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
            RECALL
          </div>
          <div className="text-3xl font-bold text-amber-400">
            {MODEL_METRICS.recall}%
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center gap-1 font-sans">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>High threat catch probability</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#0d1322] border border-slate-800 relative overflow-hidden">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
            F1 SCORE
          </div>
          <div className="text-3xl font-bold text-indigo-400">
            {MODEL_METRICS.f1_score}%
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center gap-1 font-sans">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Harmonic mean balance</span>
          </div>
        </div>
      </div>

      {/* Row: Confusion Matrix + Class Performance Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Confusion Matrix Heatmap */}
        <ChartCard
          title="CONFUSION MATRIX"
          subtitle="True vs Predicted classification distribution across validation holdout"
          badge="EVALUATION"
          badgeColor="cyan"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse text-xs font-mono">
              <thead>
                <tr>
                  <th className="p-2 text-[10px] text-slate-400 text-left">Actual \ Pred</th>
                  {CONFUSION_MATRIX.labels.map(label => (
                    <th key={label} className="p-2 text-[10px] text-slate-300 font-semibold">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CONFUSION_MATRIX.matrix.map((row, rIdx) => (
                  <tr key={rIdx} className="border-t border-slate-800/80">
                    <td className="p-2 text-[10px] text-slate-400 font-semibold text-left">
                      {CONFUSION_MATRIX.labels[rIdx]}
                    </td>
                    {row.map((val, cIdx) => {
                      const isDiagonal = rIdx === cIdx;
                      return (
                        <td 
                          key={cIdx} 
                          className={`p-2 font-bold ${
                            isDiagonal 
                              ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40' 
                              : val > 100 
                              ? 'bg-rose-950/30 text-rose-300' 
                              : 'text-slate-400'
                          }`}
                        >
                          {val.toLocaleString()}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            <span>Diagonal cells: True Positives</span>
            <span className="text-emerald-400">High true-positive density along diagonal</span>
          </div>
        </ChartCard>

        {/* Attack Classes Breakdown */}
        <ChartCard
          title="ATTACK CLASS PERFORMANCE"
          subtitle="Per-class precision, recall, and F1 metrics on UNSW-NB15 test set"
          badge="10 CLASSES"
          badgeColor="slate"
        >
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {MODEL_METRICS.class_performance.map((cls) => (
              <div 
                key={cls.category}
                className="p-2.5 rounded bg-[#090d16] border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-white block">{cls.category}</span>
                  <span className="text-[10px] text-slate-400">{cls.support.toLocaleString()} test instances</span>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="text-[10px] text-slate-400 block">P</span>
                    <span className="text-cyan-300 font-semibold">{cls.precision}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">R</span>
                    <span className="text-amber-300 font-semibold">{cls.recall}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">F1</span>
                    <span className="text-emerald-400 font-bold">{cls.f1}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* HOW SENTINEL DETECTS THREATS - 9 Stage Detection Pipeline */}
      <div className="bg-[#0d1322] border border-slate-800 rounded-lg p-6 space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              HOW SENTINEL DETECTS THREATS — 9-STAGE DETECTION PIPELINE
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800">
              SOC PIPELINE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            End-to-end telemetry lifecycle from edge ingestion to human-in-the-loop analyst triage
          </p>
        </div>

        {/* Flow Diagram Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DETECTION_PIPELINE_STAGES.map((stage) => (
            <div 
              key={stage.id}
              className="p-4 rounded-lg bg-[#090d16] border border-slate-800 relative hover:border-cyan-500/50 transition-colors group"
            >
              {/* Step number badge */}
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                  STEP 0{stage.id}
                </span>
                <span className="text-[10px] text-slate-400 font-normal">
                  {stage.subtitle}
                </span>
              </div>

              {/* Title */}
              <h4 className="text-xs font-bold text-white uppercase tracking-wide group-hover:text-cyan-300 transition-colors">
                {stage.title}
              </h4>

              {/* Description */}
              <p className="text-xs text-slate-400 mt-1 font-sans leading-relaxed">
                {stage.description}
              </p>

              {/* Meta */}
              <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-cyan-400">
                {stage.meta}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
