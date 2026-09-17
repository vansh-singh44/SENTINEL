// src/pages/Overview.jsx
import React from 'react';
import { 
  Activity, 
  ShieldAlert, 
  AlertTriangle, 
  Cpu, 
  ArrowRight, 
  Server, 
  Radio, 
  Database,
  ExternalLink
} from 'lucide-react';
import { useSoc } from '../context/SocContext';
import StatCard from '../components/common/StatCard';
import ChartCard from '../components/common/ChartCard';

import ThreatActivityChart from '../components/charts/ThreatActivityChart';
import AttackDistributionChart from '../components/charts/AttackDistributionChart';
import SeverityChart from '../components/charts/SeverityChart';
import ThreatTable from '../components/threats/ThreatTable';

export default function Overview() {
  const { 
    stats, 
    liveEvents, 
    apiHealth, 
    setActivePage,
    isFeedPaused
  } = useSoc();

  return (
    <div className="space-y-6">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Security Overview
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#6c63ff]/10 text-[#9c94ff] border border-[#6c63ff]/25">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9c94ff] animate-pulse" />
              LIVE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#5a5e7a] mt-1">
            Real-time AI-powered network threat monitoring and classification
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage('threat-simulator')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl
                       bg-[#6c63ff] hover:bg-[#7c74ff] text-white text-sm font-semibold
                       transition-all shadow-lg shadow-[#6c63ff]/25"
          >
            <span>Threat Simulator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Events"
          value={stats.totalEvents.toLocaleString()}
          subtitle="Processed network flow vectors"
          icon={Activity}
          trend="+12.4% / 24h"
          trendType="neutral"
          accentColor="purple"
          onClick={() => setActivePage('live-feed')}
        />
        <StatCard
          title="Threats Detected"
          value={stats.threatsDetected.toLocaleString()}
          subtitle="Classified anomalous signatures"
          icon={ShieldAlert}
          trend="41.4% rate"
          trendType="negative"
          accentColor="amber"
          onClick={() => setActivePage('analytics')}
        />
        <StatCard
          title="Critical Alerts"
          value={stats.criticalAlerts.toLocaleString()}
          subtitle="High-priority triage required"
          icon={AlertTriangle}
          trend="P1 Escalation"
          trendType="critical"
          accentColor="rose"
          onClick={() => setActivePage('alerts')}
        />
        <StatCard
          title="Model Accuracy"
          value={`${stats.modelAccuracy}%`}
          subtitle="UNSW-NB15 benchmark validation"
          icon={Cpu}
          trend="Random Forest"
          trendType="positive"
          accentColor="emerald"
          onClick={() => setActivePage('ai-model')}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ChartCard
            title="Threat Activity"
            subtitle="Network throughput & anomalous incidents over 24h"
            badge="24H"
            badgeColor="purple"
            actions={
              <button
                onClick={() => setActivePage('analytics')}
                className="text-[11px] font-semibold text-[#9c94ff] hover:underline flex items-center gap-1"
              >
                <span>Full Analytics</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            }
          >
            <ThreatActivityChart height={240} />
          </ChartCard>
        </div>

        <div>
          <ChartCard
            title="Severity Split"
            subtitle="Distribution across 5 severity tiers"
            badge="LIVE"
            badgeColor="emerald"
          >
            <SeverityChart />
          </ChartCard>
        </div>
      </div>

      {/* Second Row: Attack Distribution + System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ChartCard
            title="Attack Distribution"
            subtitle="UNSW-NB15 multi-class — Normal vs 9 threat categories"
            badge="UNSW-NB15"
            badgeColor="purple"
            actions={
              <button
                onClick={() => setActivePage('ai-model')}
                className="text-[11px] font-semibold text-[#9c94ff] hover:underline"
              >
                View Model →
              </button>
            }
          >
            <AttackDistributionChart limit={6} />
          </ChartCard>
        </div>

        <div>
          <ChartCard
            title="System Health"
            subtitle="Backend, inference engine & stream status"
            badge="TELEMETRY"
            badgeColor="emerald"
          >
            <div className="space-y-2.5">
              {[
                { icon: Server,   color: 'text-[#9c94ff]', label: 'API Gateway',     status: apiHealth.online ? 'ONLINE' : 'OFFLINE',    sub: apiHealth.online ? 'Connected' : 'Demo Mode' },
                { icon: Cpu,      color: 'text-emerald-400', label: 'AI Model (RF)',  status: 'ONLINE',                                   sub: '150 Estimators' },
                { icon: Database, color: 'text-blue-400',   label: 'UNSW-NB15 Data', status: 'ONLINE',                                   sub: '42 Features' },
                { icon: Radio,    color: 'text-amber-400',  label: 'Live Ingestion', status: isFeedPaused ? 'PAUSED' : 'STREAMING',      sub: isFeedPaused ? 'Feed stopped' : 'Active tap' },
              ].map(({ icon: I, color, label, status, sub }) => (
                <div key={label} className="flex items-center justify-between p-3 rounded-xl
                                           bg-[#0f1028] border border-white/[0.06]">
                  <div className="flex items-center gap-2.5">
                    <I className={`w-4 h-4 ${color}`} />
                    <span className="text-xs font-semibold text-[#e8eaf6]">{label}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-[11px] font-semibold ${
                      status === 'ONLINE' || status === 'STREAMING' ? 'text-emerald-400'
                      : status === 'PAUSED' ? 'text-amber-400'
                      : 'text-rose-400'
                    }`}>{status}</span>
                    {sub && <p className="text-[10px] text-[#5a5e7a]">{sub}</p>}
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Live Threat Feed Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Radio className="w-4 h-4 text-[#9c94ff]" />
            <div>
              <h3 className="text-sm font-semibold text-white">Live Threat Feed</h3>
              <p className="text-[11px] text-[#5a5e7a]">Recent classified network sessions</p>
            </div>
          </div>
          <button
            onClick={() => setActivePage('live-feed')}
            className="text-xs font-semibold text-[#9c94ff] hover:underline flex items-center gap-1"
          >
            <span>View all ({liveEvents.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <ThreatTable
          events={liveEvents}
          limit={6}
          showControls={false}
        />
      </div>
    </div>
  );
}
