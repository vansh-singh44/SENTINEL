// src/pages/Analytics.jsx
import React from 'react';
import { 
  BarChart3 
} from 'lucide-react';
import ChartCard from '../components/common/ChartCard';
import ThreatActivityChart from '../components/charts/ThreatActivityChart';
import AttackDistributionChart from '../components/charts/AttackDistributionChart';
import SeverityChart from '../components/charts/SeverityChart';
import ProtocolDistributionChart from '../components/charts/ProtocolDistributionChart';
import { INITIAL_TOP_PORTS } from '../data/sampleData';

export default function Analytics() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide uppercase flex items-center gap-2.5">
              <BarChart3 className="w-6 h-6 text-cyan-400" />
              SECURITY ANALYTICS & THREAT INTELLIGENCE
            </h2>
            <span className="px-2 py-0.5 rounded text-xs bg-cyan-950/60 text-cyan-300 border border-cyan-800/60 font-semibold">
              UNSW-NB15 AGGREGATE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-normal font-sans">
            Comprehensive telemetry breakdowns across network flow protocols, port vectors, and severity distributions
          </p>
        </div>
      </div>

      {/* Primary Row: Threat Activity Timeline */}
      <ChartCard
        title="THREAT ACTIVITY OVER TIME (24-HOUR TRAJECTORY)"
        subtitle="Time-series telemetry comparing total flow rate against identified threat vectors"
        badge="TIMELINE"
        badgeColor="cyan"
      >
        <ThreatActivityChart height={260} />
      </ChartCard>

      {/* Secondary Grid: Attack Category Distribution + Severity Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="ATTACK CATEGORY DISTRIBUTION"
          subtitle="Frequency breakdown of all 10 UNSW-NB15 attack classifications"
          badge="10 CATEGORIES"
          badgeColor="amber"
        >
          <AttackDistributionChart showAll={true} />
        </ChartCard>

        <ChartCard
          title="THREAT SEVERITY BREAKDOWN"
          subtitle="Relative ratio of Benign traffic versus Low, Medium, High, and Critical alerts"
          badge="SEVERITY"
          badgeColor="rose"
        >
          <SeverityChart />
        </ChartCard>
      </div>

      {/* Tertiary Grid: Protocol Distribution + Top Attacked Destination Ports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Protocol Distribution */}
        <ChartCard
          title="TRANSPORT PROTOCOL DISTRIBUTION"
          subtitle="Proportion of network sessions categorized by TCP, UDP, ICMP, and auxiliary protocols"
          badge="PROTOCOLS"
          badgeColor="cyan"
        >
          <ProtocolDistributionChart />
        </ChartCard>

        {/* Top Attacked Ports */}
        <ChartCard
          title="TOP ATTACKED DESTINATION PORTS"
          subtitle="Most targeted service ports identified by intrusion detection classifier"
          badge="PORT VECTORS"
          badgeColor="slate"
        >
          <div className="space-y-2">
            {INITIAL_TOP_PORTS.map((p) => (
              <div
                key={p.port}
                className="flex items-center justify-between p-2.5 rounded bg-[#090d16] border border-slate-800 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-12 font-bold text-cyan-300">Port {p.port}</span>
                  <span className="text-slate-300 font-semibold">{p.service}</span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-slate-400">{p.count.toLocaleString()} attempts</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    p.risk === 'Critical' 
                      ? 'bg-rose-950 text-rose-300 border border-rose-800' 
                      : p.risk === 'High' 
                      ? 'bg-orange-950 text-orange-300 border border-orange-800' 
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {p.risk} Risk
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
