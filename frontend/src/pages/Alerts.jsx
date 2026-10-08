import React, { useMemo } from "react";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock3,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { useSoc } from "../context/SocContext";

const severityConfig = {
  Critical: {
    label: "Critical",
    icon: XCircle,
    badge: "border-red-200 bg-red-50 text-red-700",
    iconBox: "border-red-100 bg-red-50 text-red-600",
    dot: "bg-red-500",
  },
  High: {
    label: "High",
    icon: ShieldAlert,
    badge: "border-orange-200 bg-orange-50 text-orange-700",
    iconBox: "border-orange-100 bg-orange-50 text-orange-600",
    dot: "bg-orange-500",
  },
  Medium: {
    label: "Medium",
    icon: AlertTriangle,
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    iconBox: "border-amber-100 bg-amber-50 text-amber-600",
    dot: "bg-amber-500",
  },
  Low: {
    label: "Low",
    icon: Bell,
    badge: "border-blue-200 bg-blue-50 text-blue-700",
    iconBox: "border-blue-100 bg-blue-50 text-blue-600",
    dot: "bg-blue-500",
  },
};

function getSeverityConfig(severity) {
  return severityConfig[severity] || severityConfig.Medium;
}

function getAlertTitle(alert) {
  return (
    alert.title ||
    alert.name ||
    alert.message ||
    "Security Alert"
  );
}

function getAlertDescription(alert) {
  return (
    alert.description ||
    alert.details ||
    alert.message ||
    "A security event was detected by SENTINEL."
  );
}

function getAlertStatus(alert) {
  return alert.status || "Active";
}

function getAlertSeverity(alert) {
  return (
    alert.severity ||
    alert.risk ||
    alert.level ||
    "Medium"
  );
}

function getAlertTimestamp(alert) {
  return (
    alert.timestamp ||
    alert.time ||
    alert.created_at ||
    alert.createdAt ||
    "Recently detected"
  );
}

export default function Alerts() {
  const { alerts = [] } = useSoc();

  const alertList = Array.isArray(alerts) ? alerts : [];

  const summary = useMemo(() => {
    return {
      total: alertList.length,
      active: alertList.filter(
        (alert) => getAlertStatus(alert) === "Active"
      ).length,
      critical: alertList.filter(
        (alert) => getAlertSeverity(alert) === "Critical"
      ).length,
      high: alertList.filter(
        (alert) => getAlertSeverity(alert) === "High"
      ).length,
      resolved: alertList.filter(
        (alert) => getAlertStatus(alert) === "Resolved"
      ).length,
    };
  }, [alertList]);

  return (
    <div className="min-h-full bg-slate-50 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Page Header */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600">
                <Bell className="h-4 w-4" />
              </div>

              <div>
                <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                  Security Alerts
                </h2>
                <p className="text-[11px] text-slate-500">
                  Monitor and review detected security events
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-medium text-slate-600">
              Alert engine operational
            </span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Total Alerts
              </span>

              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 text-slate-500">
                <Bell className="h-4 w-4" />
              </div>
            </div>

            <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
              {summary.total}
            </p>

            <p className="mt-1 text-[10px] text-slate-500">
              Recorded security events
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Active
              </span>

              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600">
                <ShieldAlert className="h-4 w-4" />
              </div>
            </div>

            <p className="mt-3 text-2xl font-bold tracking-tight text-red-600">
              {summary.active}
            </p>

            <p className="mt-1 text-[10px] text-slate-500">
              Require analyst attention
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Critical
              </span>

              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600">
                <XCircle className="h-4 w-4" />
              </div>
            </div>

            <p className="mt-3 text-2xl font-bold tracking-tight text-red-600">
              {summary.critical}
            </p>

            <p className="mt-1 text-[10px] text-slate-500">
              Highest severity events
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Resolved
              </span>

              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>

            <p className="mt-3 text-2xl font-bold tracking-tight text-emerald-600">
              {summary.resolved}
            </p>

            <p className="mt-1 text-[10px] text-slate-500">
              Successfully closed alerts
            </p>
          </div>
        </div>

        {/* Alert List */}
        <section className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Alert Queue
              </h3>

              <p className="mt-1 text-[11px] text-slate-500">
                Latest security alerts generated by SENTINEL
              </p>
            </div>

            <div className="flex items-center gap-3 text-[10px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                <span>{summary.critical} critical</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                <span>{summary.high} high</span>
              </div>
            </div>
          </div>

          {alertList.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>

              <h4 className="mt-4 text-sm font-semibold text-slate-800">
                No security alerts
              </h4>

              <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
                SENTINEL has not generated any active security alerts yet.
                Detected threats will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {alertList.map((alert, index) => {
                const severity = getAlertSeverity(alert);
                const config = getSeverityConfig(severity);
                const SeverityIcon = config.icon;

                const status = getAlertStatus(alert);
                const isActive = status === "Active";

                return (
                  <div
                    key={alert.id || alert._id || `alert-${index}`}
                    className="px-4 py-4 transition-colors hover:bg-slate-50 sm:px-5"
                  >
                    <div className="flex gap-3">
                      <div
                        className={[
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
                          config.iconBox,
                        ].join(" ")}
                      >
                        <SeverityIcon className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-xs font-semibold text-slate-900 sm:text-sm">
                                {getAlertTitle(alert)}
                              </h4>

                              <span
                                className={[
                                  "inline-flex items-center gap-1.5 rounded-md border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide",
                                  config.badge,
                                ].join(" ")}
                              >
                                <span
                                  className={[
                                    "h-1.5 w-1.5 rounded-full",
                                    config.dot,
                                  ].join(" ")}
                                />
                                {severity}
                              </span>
                            </div>

                            <p className="mt-1.5 max-w-3xl text-[11px] leading-5 text-slate-500">
                              {getAlertDescription(alert)}
                            </p>
                          </div>

                          <span
                            className={[
                              "inline-flex w-fit shrink-0 items-center rounded-md border px-2 py-1 text-[9px] font-semibold uppercase tracking-wide",
                              isActive
                                ? "border-red-200 bg-red-50 text-red-700"
                                : "border-emerald-200 bg-emerald-50 text-emerald-700",
                            ].join(" ")}
                          >
                            {status}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-slate-400">
                          <span className="inline-flex items-center gap-1.5">
                            <Clock3 className="h-3 w-3" />
                            {getAlertTimestamp(alert)}
                          </span>

                          {alert.source && (
                            <span>
                              Source:{" "}
                              <span className="font-medium text-slate-500">
                                {alert.source}
                              </span>
                            </span>
                          )}

                          {alert.type && (
                            <span>
                              Type:{" "}
                              <span className="font-medium text-slate-500">
                                {alert.type}
                              </span>
                            </span>
                          )}

                          {alert.confidence !== undefined && (
                            <span>
                              Confidence:{" "}
                              <span className="font-medium text-slate-500">
                                {typeof alert.confidence === "number"
                                  ? `${Math.round(
                                      alert.confidence <= 1
                                        ? alert.confidence * 100
                                        : alert.confidence
                                    )}%`
                                  : alert.confidence}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Severity Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <span className="mr-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Severity
          </span>

          {Object.values(severityConfig).map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-1.5 text-[10px] text-slate-500"
            >
              <span
                className={[
                  "h-1.5 w-1.5 rounded-full",
                  item.dot,
                ].join(" ")}
              />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
