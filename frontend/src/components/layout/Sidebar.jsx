// src/components/layout/Sidebar.jsx
import React from 'react';
import {
  Shield,
  LayoutDashboard,
  Radio,
  Crosshair,
  Cpu,
  BarChart3,
  Bell,
  Terminal,
  Settings,
  LogOut,
  Server
} from 'lucide-react';
import { useSoc } from '../../context/SocContext';

const NAV_ITEMS = [
  { id: 'overview',          icon: LayoutDashboard, label: 'Overview' },
  { id: 'live-feed',         icon: Radio,           label: 'Live Threat Feed', pulse: true },
  { id: 'threat-analysis',   icon: Crosshair,       label: 'Threat Analysis' },
  { id: 'ai-model',          icon: Cpu,             label: 'AI Model' },
  { id: 'analytics',         icon: BarChart3,       label: 'Analytics' },
  { id: 'alerts',            icon: Bell,            label: 'Alerts', badge: true },
  { id: 'threat-simulator',  icon: Terminal,        label: 'Threat Simulator' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { activePage, setActivePage, alerts, apiHealth, setSettingsOpen } = useSoc();

  const unread = alerts.filter(a => a.status === 'Active' && a.severity === 'CRITICAL').length;

  const handleNav = (id) => {
    setActivePage(id);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar rail */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col
          bg-[#0b0d24] border-r border-white/[0.06]
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:w-[72px]
          w-[72px]
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo / Brand */}
        <div className="h-16 flex items-center justify-center border-b border-white/[0.06] shrink-0">
          <div className="w-10 h-10 rounded-xl bg-[#6c63ff]/15 border border-[#6c63ff]/30
                          flex items-center justify-center shadow-lg shadow-[#6c63ff]/10
                          relative group">
            <Shield className="w-5 h-5 text-[#9c94ff]" />
            {/* Tooltip */}
            <span className="sidebar-tooltip font-mono font-bold tracking-widest text-[11px]">
              SENTINEL SOC
            </span>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 flex flex-col items-center gap-1 py-4 overflow-y-auto overflow-x-visible">
          {NAV_ITEMS.map(({ id, icon: Icon, label, pulse, badge }) => {
            const isActive = activePage === id;
            const showBadge = badge && unread > 0;

            return (
              <button
                key={id}
                onClick={() => handleNav(id)}
                title={label}
                className={`sidebar-nav-item relative w-12 h-12 rounded-xl flex items-center justify-center
                  transition-all duration-200 group
                  ${isActive
                    ? 'bg-[#6c63ff]/20 text-[#9c94ff] shadow-md shadow-[#6c63ff]/10'
                    : 'text-[#5a5e7a] hover:text-[#9c94ff] hover:bg-[#6c63ff]/10'
                  }`}
                aria-label={label}
              >
                {/* Active pill indicator */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6
                                   bg-[#6c63ff] rounded-r-full" />
                )}

                <Icon className="w-[18px] h-[18px]" />

                {/* Pulse dot for live feed */}
                {pulse && (
                  <span className="absolute top-2 right-2 h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[#6c63ff] opacity-60 animate-ping" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#9c94ff]" />
                  </span>
                )}

                {/* Alert badge */}
                {showBadge && (
                  <span className="absolute top-1.5 right-1.5 h-4 w-4 flex items-center justify-center
                                   rounded-full bg-rose-600 text-[9px] font-bold text-white font-mono">
                    {unread}
                  </span>
                )}

                {/* Hover tooltip */}
                <span className="sidebar-tooltip">{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom section: status dot + settings */}
        <div className="flex flex-col items-center gap-1 pb-4 border-t border-white/[0.06] pt-4 shrink-0">
          {/* API health dot */}
          <div
            title={apiHealth.online ? 'Backend: Connected' : 'Backend: Offline (Demo Mode)'}
            className="sidebar-nav-item relative w-12 h-12 rounded-xl flex items-center justify-center
                       text-[#5a5e7a] hover:text-[#9c94ff] hover:bg-[#6c63ff]/10 transition-all group"
          >
            <Server className="w-[18px] h-[18px]" />
            <span className={`absolute top-2.5 right-2.5 h-2 w-2 rounded-full border-2 border-[#0b0d24]
              ${apiHealth.online ? 'bg-emerald-400' : 'bg-rose-500'}`}
            />
            <span className="sidebar-tooltip">
              {apiHealth.online ? 'API: Connected' : 'API: Demo Mode'}
            </span>
          </div>

          {/* Settings */}
          <button
            onClick={() => setSettingsOpen(true)}
            title="Settings"
            className="sidebar-nav-item relative w-12 h-12 rounded-xl flex items-center justify-center
                       text-[#5a5e7a] hover:text-[#9c94ff] hover:bg-[#6c63ff]/10 transition-all group"
            aria-label="Settings"
          >
            <Settings className="w-[18px] h-[18px]" />
            <span className="sidebar-tooltip">Settings</span>
          </button>

          {/* Spacer avatar */}
          <div
            title="Security Analyst"
            className="sidebar-nav-item relative w-12 h-12 rounded-xl flex items-center justify-center
                       hover:bg-[#6c63ff]/10 transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6c63ff] to-[#a78bfa]
                            flex items-center justify-center text-white font-bold text-xs select-none">
              SA
            </div>
            <span className="sidebar-tooltip">Security Analyst</span>
          </div>
        </div>
      </aside>
    </>
  );
}
