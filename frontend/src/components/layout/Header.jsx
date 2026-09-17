// src/components/layout/Header.jsx
import React, { useState, useEffect } from 'react';
import {
  Bell,
  Settings,
  Clock,
  Play,
  Pause,
  Menu,
  Wifi,
  WifiOff,
  ChevronDown
} from 'lucide-react';
import { useSoc } from '../../context/SocContext';

const PAGE_TITLES = {
  'overview':         'Security Overview',
  'live-feed':        'Live Threat Feed',
  'threat-analysis':  'Threat Analysis',
  'ai-model':         'AI Model',
  'analytics':        'Analytics',
  'alerts':           'Alerts',
  'threat-simulator': 'Threat Simulator',
};

export default function Header({ onToggleSidebar }) {
  const {
    apiHealth,
    checkBackendHealth,
    alerts,
    isFeedPaused,
    pauseFeed,
    resumeFeed,
    notificationsOpen,
    setNotificationsOpen,
    setSettingsOpen,
    setActivePage,
    activePage
  } = useSoc();

  const [currentTime, setCurrentTime] = useState('');
  const unreadAlerts = alerts.filter(a => a.status === 'Active');
  const pageTitle = PAGE_TITLES[activePage] || 'Overview';

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour12: false }));
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16
                       bg-[#0b0c1e]/90 backdrop-blur-md
                       border-b border-white/[0.06]
                       px-5 sm:px-7 flex items-center justify-between gap-4">

      {/* Left — mobile menu + page title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden text-[#5a5e7a] hover:text-white p-1.5 rounded-lg
                     hover:bg-white/5 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
            {pageTitle}
          </h1>
          <p className="text-[11px] text-[#5a5e7a] font-medium hidden sm:block">
            SENTINEL · AI-Powered Threat Detection
          </p>
        </div>
      </div>

      {/* Right — controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">

        {/* Stream control */}
        <button
          onClick={isFeedPaused ? resumeFeed : pauseFeed}
          className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                      text-xs font-semibold border transition-all duration-200
                      ${isFeedPaused
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/15'
                        : 'bg-[#6c63ff]/10 border-[#6c63ff]/25 text-[#9c94ff] hover:bg-[#6c63ff]/15'
                      }`}
        >
          {isFeedPaused
            ? <><Play className="w-3 h-3 fill-amber-300" /><span>Paused</span></>
            : <><span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-[#6c63ff] opacity-60" />
                  <span className="relative h-2 w-2 rounded-full bg-[#9c94ff]" />
                </span><span>Live</span></>
          }
        </button>

        {/* API status chip */}
        <button
          onClick={checkBackendHealth}
          title="Click to ping FastAPI backend"
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                      text-[11px] font-semibold border transition-all duration-200
                      ${apiHealth.online
                        ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/15'
                        : 'bg-rose-500/10 border-rose-500/25 text-rose-400 hover:bg-rose-500/15'
                      }`}
        >
          {apiHealth.online
            ? <><Wifi className="w-3 h-3" /><span>Connected</span></>
            : <><WifiOff className="w-3 h-3" /><span>Demo Mode</span></>
          }
        </button>

        {/* Live clock */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                        bg-white/[0.04] border border-white/[0.07]
                        text-[11px] font-mono text-[#8b8fa8]">
          <Clock className="w-3 h-3 text-[#6c63ff]" />
          <span className="tracking-widest text-white font-semibold">
            {currentTime || '00:00:00'}
          </span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg
                       bg-white/[0.04] border border-white/[0.07] text-[#8b8fa8]
                       hover:text-white hover:bg-white/[0.08] transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center
                               rounded-full bg-rose-600 text-[9px] font-bold text-white">
                {unreadAlerts.length}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl
                            bg-[#13152e] border border-white/[0.09]
                            shadow-2xl shadow-black/60 p-4 z-50">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-sm text-white">Security Alerts</span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono
                                   bg-rose-950 text-rose-300 border border-rose-800/80">
                    {unreadAlerts.length} active
                  </span>
                  <button
                    onClick={() => { setActivePage('alerts'); setNotificationsOpen(false); }}
                    className="text-[11px] text-[#9c94ff] hover:underline"
                  >
                    View all →
                  </button>
                </div>
              </div>

              <div className="divide-y divide-white/[0.05] max-h-72 overflow-y-auto">
                {unreadAlerts.length === 0 ? (
                  <p className="py-6 text-center text-xs text-[#5a5e7a]">No active alerts</p>
                ) : (
                  unreadAlerts.slice(0, 5).map(alert => (
                    <div
                      key={alert.id}
                      onClick={() => { setActivePage('alerts'); setNotificationsOpen(false); }}
                      className="py-3 hover:bg-white/[0.03] rounded-lg px-2 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-semibold text-rose-400">{alert.title}</span>
                        <span className="text-[10px] text-[#5a5e7a]">{alert.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-[#8b8fa8] line-clamp-1">{alert.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <button
          onClick={() => setSettingsOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-lg
                     bg-white/[0.04] border border-white/[0.07] text-[#8b8fa8]
                     hover:text-white hover:bg-white/[0.08] transition-all"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#6c63ff] to-[#a78bfa]
                        flex items-center justify-center text-white font-bold text-xs
                        cursor-pointer select-none hover:opacity-90 transition-opacity"
             title="Security Analyst">
          SA
        </div>
      </div>
    </header>
  );
}
