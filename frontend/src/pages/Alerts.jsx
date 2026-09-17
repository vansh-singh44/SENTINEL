// src/pages/Alerts.jsx
import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Search, 
  CheckCircle2 
} from 'lucide-react';
import { useSoc } from '../context/SocContext';
import AlertCard from '../components/alerts/AlertCard';

export default function Alerts() {
  const { alerts } = useSoc();

  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  // Counts
  const totalCount = alerts.length;
  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL' && a.status !== 'Resolved').length;
  const highCount = alerts.filter(a => a.severity === 'HIGH' && a.status !== 'Resolved').length;
  const resolvedCount = alerts.filter(a => a.status === 'Resolved').length;

  // Filtered alerts
  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = severityFilter === 'ALL' || alert.severity === severityFilter;
    const matchesSearch = 
      !search ||
      alert.title.toLowerCase().includes(search.toLowerCase()) ||
      alert.source.toLowerCase().includes(search.toLowerCase()) ||
      alert.destination.toLowerCase().includes(search.toLowerCase()) ||
      alert.attack_category.toLowerCase().includes(search.toLowerCase()) ||
      alert.id.toLowerCase().includes(search.toLowerCase());

    return matchesSeverity && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-wide uppercase flex items-center gap-2.5">
              <AlertTriangle className="w-6 h-6 text-rose-400" />
              SECURITY ALERTS
            </h2>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-rose-950/60 text-rose-300 border border-rose-800/60 font-semibold">
              TRIAGE QUEUE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Prioritized security incidents generated from classified network anomalies
          </p>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3.5 rounded-lg bg-[#0d1322] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block">Total Alerts</span>
          <span className="text-xl font-bold text-white mt-1 block">{totalCount}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Ingested Queue</span>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0d1322] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block">Active Critical</span>
          <span className="text-xl font-bold text-rose-400 mt-1 block">{criticalCount}</span>
          <span className="text-[10px] text-rose-400 block mt-0.5 font-bold">P1 Escalation</span>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0d1322] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block">Active High</span>
          <span className="text-xl font-bold text-orange-400 mt-1 block">{highCount}</span>
          <span className="text-[10px] text-orange-400 block mt-0.5 font-semibold">P2 Review</span>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0d1322] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block">Resolved Incidents</span>
          <span className="text-xl font-bold text-emerald-400 mt-1 block">{resolvedCount}</span>
          <span className="text-[10px] text-emerald-400 block mt-0.5">Triaged by SOC</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-lg bg-[#0d1322] border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 font-mono">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search alerts by IP, title, category..."
            className="w-full pl-9 pr-3 py-1.5 rounded-md bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-400 focus:outline-hidden focus:border-cyan-500"
          />
        </div>

        {/* Severity Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1 rounded text-xs font-semibold uppercase transition-all whitespace-nowrap ${
                severityFilter === sev
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map(alert => (
            <AlertCard key={alert.id} alert={alert} />
          ))
        ) : (
          <div className="p-12 text-center rounded-lg bg-[#0d1322] border border-slate-800 font-mono text-slate-400 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">NO MATCHING SECURITY ALERTS</h4>
            <p className="text-xs">All alerts in this filter category have been resolved or do not exist.</p>
          </div>
        )}
      </div>
    </div>
  );
}
