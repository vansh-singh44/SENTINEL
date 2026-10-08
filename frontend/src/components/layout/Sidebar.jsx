import React from "react";
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
  Server,
} from "lucide-react";
import { useSoc } from "../../context/SocContext";

const NAV_ITEMS = [
  {
    id: "overview",
    icon: LayoutDashboard,
    label: "Overview",
  },
  {
    id: "live-feed",
    icon: Radio,
    label: "Live Threat Feed",
    pulse: true,
  },
  {
    id: "threat-analysis",
    icon: Crosshair,
    label: "Threat Analysis",
  },
  {
    id: "ai-model",
    icon: Cpu,
    label: "AI Model",
  },
  {
    id: "analytics",
    icon: BarChart3,
    label: "Analytics",
  },
  {
    id: "alerts",
    icon: Bell,
    label: "Alerts",
    badge: true,
  },
  {
    id: "threat-simulator",
    icon: Terminal,
    label: "Threat Simulator",
  },
];

export default function Sidebar({ isOpen = false, onClose }) {
  const {
    activePage,
    setActivePage,
    alerts = [],
    apiHealth = {},
    setSettingsOpen,
  } = useSoc();

  const unreadAlerts = alerts.filter(
    (alert) => alert.status === "Active"
  );

  const handleNavigation = (page) => {
    setActivePage(page);

    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={[
          "fixed left-0 top-0 z-50 flex h-screen w-[72px] flex-col",
          "border-r border-slate-200 bg-white",
          "transition-transform duration-200",
          isOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div className="flex h-16 shrink-0 items-center justify-center border-b border-slate-200">
          <button
            type="button"
            onClick={() => handleNavigation("overview")}
            aria-label="SENTINEL dashboard"
            className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-200 bg-cyan-50 text-cyan-700 transition-colors hover:border-cyan-300 hover:bg-cyan-100"
          >
            <Shield
              className="h-5 w-5"
              strokeWidth={2}
            />

            <span className="pointer-events-none absolute left-[58px] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg group-hover:block">
              SENTINEL
            </span>
          </button>
        </div>

        <nav className="flex flex-1 flex-col items-center gap-1 overflow-y-auto overflow-x-visible py-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigation(item.id)}
                aria-label={item.label}
                title={item.label}
                className={[
                  "group relative flex h-11 w-11 items-center justify-center rounded-lg",
                  "transition-colors duration-150",
                  active
                    ? "bg-cyan-50 text-cyan-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                ].join(" ")}
              >
                {active && (
                  <span className="absolute -left-3 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r-full bg-cyan-600" />
                )}

                <Icon
                  className="h-[18px] w-[18px]"
                  strokeWidth={active ? 2.2 : 1.8}
                />

                {item.pulse && (
                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                )}

                {item.badge &&
                  unreadAlerts.length > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white">
                      {unreadAlerts.length > 9
                        ? "9+"
                        : unreadAlerts.length}
                    </span>
                  )}

                <span className="pointer-events-none absolute left-[58px] top-1/2 z-50 hidden -translate-y-1/2 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-lg group-hover:block">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="flex shrink-0 flex-col items-center gap-1 border-t border-slate-200 py-4">
          <div className="group relative flex h-11 w-11 items-center justify-center rounded-lg text-slate-500">
            <Server className="h-[18px] w-[18px]" />

            <span
              className={[
                "absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white",
                apiHealth.online
                  ? "bg-emerald-500"
                  : "bg-amber-500",
              ].join(" ")}
            />

            <span className="pointer-events-none absolute left-[58px] top-1/2 z-50 hidden -translate-y-1/2 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-lg group-hover:block">
              {apiHealth.online
                ? "API Connected"
                : "Demo Mode"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            aria-label="Settings"
            title="Settings"
            className="group relative flex h-11 w-11 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <Settings className="h-[18px] w-[18px]" />

            <span className="pointer-events-none absolute left-[58px] top-1/2 z-50 hidden -translate-y-1/2 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-lg group-hover:block">
              Settings
            </span>
          </button>

          <div
            title="Security Analyst"
            className="flex h-11 w-11 items-center justify-center"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-[10px] font-bold tracking-wide text-white">
              SA
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
