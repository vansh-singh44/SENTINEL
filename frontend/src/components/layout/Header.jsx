import React, { useEffect, useState } from "react";
import {
  Bell,
  Settings,
  Clock3,
  Play,
  Pause,
  Menu,
  Wifi,
  WifiOff,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { useSoc } from "../../context/SocContext";

const PAGE_TITLES = {
  overview: "Security Overview",
  "live-feed": "Live Threat Feed",
  "threat-analysis": "Threat Analysis",
  "ai-model": "AI Model",
  analytics: "Security Analytics",
  alerts: "Security Alerts",
  "threat-simulator": "Threat Simulator",
};

export default function Header({ onToggleSidebar }) {
  const {
    apiHealth = {},
    checkBackendHealth,
    alerts = [],
    isFeedPaused,
    pauseFeed,
    resumeFeed,
    notificationsOpen,
    setNotificationsOpen,
    setSettingsOpen,
    setActivePage,
    activePage,
  } = useSoc();

  const [currentTime, setCurrentTime] = useState("");

  const activeAlerts = alerts.filter(
    (alert) => alert.status === "Active"
  );

  const pageTitle =
    PAGE_TITLES[activePage] || "Security Overview";

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      setCurrentTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Left section */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Open navigation"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
              {pageTitle}
            </h1>

            <span className="hidden rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-slate-500 md:inline-flex">
              SOC
            </span>
          </div>

          <p className="mt-0.5 hidden truncate text-[11px] text-slate-500 sm:block">
            SENTINEL · AI-powered network threat detection
          </p>
        </div>
      </div>

      {/* Right section */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {/* Feed status */}
        <button
          type="button"
          onClick={
            isFeedPaused
              ? resumeFeed
              : pauseFeed
          }
          className={[
            "hidden h-9 items-center gap-2 rounded-lg border px-3 text-[11px] font-semibold transition-colors md:flex",
            isFeedPaused
              ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
              : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
          ].join(" ")}
        >
          {isFeedPaused ? (
            <>
              <Play className="h-3 w-3" />
              <span>Feed Paused</span>
            </>
          ) : (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Live Feed</span>
            </>
          )}
        </button>

        {/* Backend status */}
        <button
          type="button"
          onClick={checkBackendHealth}
          title="Check SENTINEL API"
          className={[
            "hidden h-9 items-center gap-2 rounded-lg border px-3 text-[11px] font-semibold transition-colors sm:flex",
            apiHealth.online
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100",
          ].join(" ")}
        >
          {apiHealth.online ? (
            <>
              <Wifi className="h-3.5 w-3.5" />
              <span>API Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3.5 w-3.5" />
              <span>Demo Mode</span>
            </>
          )}
        </button>

        {/* Clock */}
        <div className="hidden h-9 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 lg:flex">
          <Clock3 className="h-3.5 w-3.5 text-slate-400" />

          <span className="font-mono text-[11px] font-semibold tracking-wide text-slate-600">
            {currentTime || "00:00:00"}
          </span>
        </div>

        {/* Divider */}
        <div className="hidden h-7 w-px bg-slate-200 lg:block" />

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setNotificationsOpen(
                !notificationsOpen
              )
            }
            aria-label="Open notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <Bell className="h-4 w-4" />

            {activeAlerts.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white">
                {activeAlerts.length > 9
                  ? "9+"
                  : activeAlerts.length}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-[46px] z-50 w-[calc(100vw-2rem)] max-w-[380px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Security Alerts
                  </p>

                  <p className="mt-0.5 text-[10px] text-slate-500">
                    Current active events
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActivePage("alerts");
                    setNotificationsOpen(false);
                  }}
                  className="text-[11px] font-semibold text-cyan-700 hover:text-cyan-800"
                >
                  View all
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto">
                {activeAlerts.length === 0 ? (
                  <div className="px-5 py-8 text-center">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    </div>

                    <p className="mt-3 text-xs font-medium text-slate-700">
                      No active alerts
                    </p>

                    <p className="mt-1 text-[11px] text-slate-500">
                      The system has no outstanding alerts.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {activeAlerts
                      .slice(0, 5)
                      .map((alert) => (
                        <button
                          type="button"
                          key={alert.id}
                          onClick={() => {
                            setActivePage("alerts");
                            setNotificationsOpen(false);
                          }}
                          className="w-full px-4 py-3 text-left transition-colors hover:bg-slate-50"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-xs font-semibold text-slate-800">
                                {alert.title ||
                                  "Security Alert"}
                              </p>

                              <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-slate-500">
                                {alert.description ||
                                  "Security event detected by SENTINEL."}
                              </p>
                            </div>

                            <span className="shrink-0 rounded-md border border-red-200 bg-red-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-red-700">
                              {alert.severity ||
                                "Alert"}
                            </span>
                          </div>

                          {alert.timestamp && (
                            <p className="mt-2 text-[10px] text-slate-400">
                              {alert.timestamp}
                            </p>
                          )}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          aria-label="Open settings"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          <Settings className="h-4 w-4" />
        </button>

        {/* Analyst */}
        <div
          title="Security Analyst"
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-[10px] font-bold tracking-wide text-white"
        >
          SA
        </div>
      </div>
    </header>
  );
}
