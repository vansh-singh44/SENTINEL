// src/components/threats/ThreatTable.jsx
import React, { useState } from 'react';
import { Search, Filter, AlertOctagon, SlidersHorizontal } from 'lucide-react';
import ThreatRow from './ThreatRow';

export default function ThreatTable({ events = [], limit, showControls = true }) {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [protocolFilter, setProtocolFilter] = useState('ALL');

  const filteredEvents = events.filter(event => {
    const matchesSearch =
      !search ||
      event.source_ip.toLowerCase().includes(search.toLowerCase()) ||
      event.destination_ip.toLowerCase().includes(search.toLowerCase()) ||
      (event.attack_category || '').toLowerCase().includes(search.toLowerCase()) ||
      (event.protocol || '').toLowerCase().includes(search.toLowerCase());

    const matchesSeverity = severityFilter === 'ALL' || event.severity === severityFilter;
    const matchesProtocol = protocolFilter === 'ALL' || event.protocol === protocolFilter;

    return matchesSearch && matchesSeverity && matchesProtocol;
  });

  const displayEvents = limit ? filteredEvents.slice(0, limit) : filteredEvents;

  const selectCls = `px-3 py-1.5 rounded-lg bg-[#0f1028] border border-white/[0.08]
                     text-xs text-[#e8eaf6] focus:outline-none focus:border-[#6c63ff]/50
                     cursor-pointer transition-colors`;

  return (
    <div className="w-full flex flex-col bg-[#13152e] border border-white/[0.07] rounded-2xl overflow-hidden">

      {/* Controls */}
      {showControls && (
        <div className="p-4 border-b border-white/[0.06] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0f1028]">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-[#5a5e7a] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter by IP, category, protocol…"
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#0b0c1e] border border-white/[0.08]
                         text-xs text-[#e8eaf6] placeholder:text-[#5a5e7a]
                         focus:outline-none focus:border-[#6c63ff]/50 transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-[11px] text-[#5a5e7a]">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filter:</span>
            </div>
            <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)} className={selectCls}>
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
              <option value="BENIGN">Benign</option>
            </select>
            <select value={protocolFilter} onChange={e => setProtocolFilter(e.target.value)} className={selectCls}>
              <option value="ALL">All Protocols</option>
              <option value="TCP">TCP</option>
              <option value="UDP">UDP</option>
              <option value="ICMP">ICMP</option>
            </select>
            {(search || severityFilter !== 'ALL' || protocolFilter !== 'ALL') && (
              <button
                onClick={() => { setSearch(''); setSeverityFilter('ALL'); setProtocolFilter('ALL'); }}
                className="text-[11px] text-[#9c94ff] hover:underline"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/[0.06] bg-[#0f1028] text-[11px] font-semibold uppercase tracking-wider text-[#5a5e7a] select-none">
              <th className="py-3 px-4">Time</th>
              <th className="py-3 px-4">Source IP</th>
              <th className="py-3 px-4">Destination</th>
              <th className="py-3 px-4">Protocol</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Confidence</th>
              <th className="py-3 px-4">Risk</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {displayEvents.length > 0 ? (
              displayEvents.map(event => (
                <ThreatRow key={event.id} event={event} />
              ))
            ) : (
              <tr>
                <td colSpan={9} className="py-14 text-center">
                  <div className="flex flex-col items-center gap-2 text-[#5a5e7a]">
                    <AlertOctagon className="w-7 h-7" />
                    <span className="text-sm font-semibold text-[#8b8fa8]">No events found</span>
                    <span className="text-[11px]">Try adjusting your search or filters</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-5 py-2.5 bg-[#0f1028] border-t border-white/[0.06]
                      flex items-center justify-between text-[11px] text-[#5a5e7a]">
        <span>
          Showing <span className="text-white font-semibold">{displayEvents.length}</span> of{' '}
          <span className="text-white font-semibold">{events.length}</span> events
        </span>
        <span>Click any row to analyze</span>
      </div>
    </div>
  );
}
