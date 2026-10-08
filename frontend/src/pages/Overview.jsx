import React from "react";
import {
  Activity,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Server,
  Clock3,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useSoc } from "../context/SocContext";
import StatCard from "../components/common/StatCard";
import ChartCard from "../components/common/ChartCard";

export default function Overview() {
  const {
    stats = {},
    threatData = [],
    severityData = [],
    attackData = [],
    systemHealth = {},
    apiHealth = {},
    alerts = [],
    setActivePage,
  } = useSoc();

  const totalEvents =
    stats.totalEvents ??
    stats.total_events ??
    0;

  const threatsDetected =
    stats.threatsDetected ??
    stats.threats_detected ??
    0;

  const criticalAlerts =
    stats.criticalAlerts ??
    stats.critical_alerts ??
    0;

  const modelAccuracy =
    stats.modelAccuracy ??
    stats.model_accuracy ??
    0;

  const activeAlerts = alerts.filter(
    (alert) => alert.status === "Active"
  ).length;

  const healthItems = [
    {
      label: "API Service",
      value: apiHealth.online
        ? "Operational"
        : "Demo Mode",
      status: apiHealth.online
        ? "healthy"
        : "warning",
    },
    {
      label: "Detection Engine",
      value: "Operational",
      status: "healthy",
    },
    {
      label: "Threat Feed",
      value: "Receiving Events",
      status: "healthy",
    },
    {
      label: "Alert Pipeline",
      value:
        activeAlerts > 0
          ? `${activeAlerts} Active`
          : "Clear",
      status:
        activeAlerts > 0
          ? "warning"
          : "healthy",
    },
  ];

  const maxThreatValue = Math.max(
    ...threatData.map((item) =>
      Number(
        item.value ??
          item.count ??
          item.threats ??
          item.total ??
          0
      )
    ),
    1
  );

  const getSeverityClass = (name) => {
    const value = String(name || "").toLowerCase();

    if (value.includes("critical")) {
      return "bg-red-500";
    }

    if (value.includes("high")) {
      return "bg-orange-500";
    }

    if (value.includes("medium")) {
      return "bg-amber-500";
    }

    if (value.includes("low")) {
      return "bg-blue-500";
    }

    return "bg-emerald-500";
  };

  const getSeverityTextClass = (name) => {
    const value = String(name || "").toLowerCase();

    if (value.includes("critical")) {
      return "text-red-700";
    }

    if (value.includes("high")) {
      return "text-orange-700";
    }

    if (value.includes("medium")) {
      return "text-amber-700";
    }

    if (value.includes("low")) {
      return "text-blue-700";
    }

    return "text-emerald-700";
  };

  return (
    <div className="space-y-5">
      {/* Page heading */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-100 bg-cyan-50">
              <ShieldCheck className="h-4 w-4 text-cyan-700" />
            </div>

            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-700">
              Security Operations Center
            </p>
          </div>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Security Overview
          </h2>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Monitor network activity, detected threats, model
            performance and system health from a single console.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <span
            className={[
              "h-2 w-2 rounded-full",
              apiHealth.online
                ? "bg-emerald-500"
                : "bg-amber-500",
            ].join(" ")}
          />

          <span className="text-[11px] font-semibold text-slate-700">
            {apiHealth.online
              ? "Detection API Online"
              : "Demo Environment"}
          </span>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Events"
          value={totalEvents.toLocaleString()}
          subtitle="Network events processed"
          icon={Activity}
          accent="cyan"
        />

        <StatCard
          title="Threats Detected"
          value={threatsDetected.toLocaleString()}
          subtitle="Events classified as attacks"
          icon={AlertTriangle}
          accent="red"
        />

        <StatCard
          title="Critical Alerts"
          value={criticalAlerts.toLocaleString()}
          subtitle="High-priority security events"
          icon={Zap}
          accent="amber"
        />

        <StatCard
          title="Model Accuracy"
          value={
            typeof modelAccuracy === "number"
              ? `${modelAccuracy.toFixed(
                  modelAccuracy % 1 === 0 ? 0 : 1
                )}%`
              : modelAccuracy || "—"
          }
          subtitle="Current detection performance"
          icon={ShieldCheck}
          accent="green"
        />
      </div>

      {/* Main analytics row */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* Threat activity */}
        <div className="xl:col-span-2">
          <ChartCard
            title="Threat Activity"
            subtitle="Recent security events and detected threats"
            action={
              <button
                type="button"
                onClick={() => setActivePage("analytics")}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-700 hover:text-cyan-800"
              >
                View analytics
                <ArrowUpRight className="h-3 w-3" />
              </button>
            }
          >
            {threatData.length === 0 ? (
              <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50">
                <div className="text-center">
                  <Activity className="mx-auto h-6 w-6 text-slate-300" />

                  <p className="mt-2 text-xs font-medium text-slate-600">
                    No threat activity available
                  </p>

                  <p className="mt-1 text-[11px] text-slate-400">
                    Activity will appear when events are processed.
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-64">
                <div className="flex h-full items-end gap-2 overflow-x-auto pb-7 pt-5">
                  {threatData.map((item, index) => {
                    const value = Number(
                      item.value ??
                        item.count ??
                        item.threats ??
                        item.total ??
                        0
                    );

                    const height = Math.max(
                      5,
                      (value / maxThreatValue) * 100
                    );

                    const label =
                      item.label ??
                      item.time ??
                      item.name ??
                      item.date ??
                      `${index + 1}`;

                    return (
                      <div
                        key={`${label}-${index}`}
                        className="group flex h-full min-w-[34px] flex-1 flex-col items-center justify-end"
                      >
                        <div className="relative flex w-full flex-1 items-end justify-center">
                          <div
                            className="w-4 max-w-full rounded-t-md bg-cyan-500 transition-all duration-300 group-hover:bg-cyan-600 sm:w-6"
                            style={{
                              height: `${height}%`,
                            }}
                            title={`${label}: ${value}`}
                          />

                          <span className="pointer-events-none absolute -top-5 rounded bg-slate-900 px-1.5 py-1 text-[9px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                            {value}
                          </span>
                        </div>

                        <span className="mt-2 max-w-full truncate text-[9px] text-slate-400">
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </ChartCard>
        </div>

        {/* Severity split */}
        <ChartCard
          title="Severity Distribution"
          subtitle="Threats grouped by severity"
        >
          {severityData.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-center">
              <div>
                <ShieldCheck className="mx-auto h-7 w-7 text-slate-300" />
                <p className="mt-2 text-xs font-medium text-slate-600">
                  No severity data
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {severityData.map((item, index) => {
                const name =
                  item.name ??
                  item.label ??
                  item.severity ??
                  `Level ${index + 1}`;

                const value = Number(
                  item.value ??
                    item.count ??
                    item.total ??
                    item.percentage ??
                    0
                );

                return (
                  <div key={`${name}-${index}`}>
                    <div className="mb-1.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={[
                            "h-2 w-2 rounded-full",
                            getSeverityClass(name),
                          ].join(" ")}
                        />

                        <span
                          className={[
                            "text-[11px] font-semibold",
                            getSeverityTextClass(name),
                          ].join(" ")}
                        >
                          {name}
                        </span>
                      </div>

                      <span className="text-[11px] font-semibold text-slate-700">
                        {value}
                        {String(item.percentage ?? "").includes(
                          "%"
                        )
                          ? ""
                          : item.percentage !== undefined
                          ? "%"
                          : ""}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={[
                          "h-full rounded-full transition-all duration-500",
                          getSeverityClass(name),
                        ].join(" ")}
                        style={{
                          width: `${Math.min(
                            100,
                            Number(
                              item.percentage ??
                                value ??
                                0
                            )
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ChartCard>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Attack distribution */}
        <ChartCard
          title="Attack Distribution"
          subtitle="Classification breakdown from the detection pipeline"
          action={
            <button
              type="button"
              onClick={() =>
                setActivePage("threat-analysis")
              }
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-700 hover:text-cyan-800"
            >
              Analyze
              <ArrowUpRight className="h-3 w-3" />
            </button>
          }
        >
          {attackData.length === 0 ? (
            <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50">
              <div className="text-center">
                <AlertTriangle className="mx-auto h-6 w-6 text-slate-300" />

                <p className="mt-2 text-xs font-medium text-slate-600">
                  No attack distribution data
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {attackData.slice(0, 8).map((item, index) => {
                const name =
                  item.name ??
                  item.label ??
                  item.attack ??
                  item.category ??
                  `Category ${index + 1}`;

                const value = Number(
                  item.value ??
                    item.count ??
                    item.total ??
                    0
                );

                const total = attackData.reduce(
                  (sum, current) =>
                    sum +
                    Number(
                      current.value ??
                        current.count ??
                        current.total ??
                        0
                    ),
                  0
                );

                const percentage =
                  total > 0
                    ? (value / total) * 100
                    : 0;

                return (
                  <div
                    key={`${name}-${index}`}
                    className="flex items-center gap-3"
                  >
                    <div className="w-24 shrink-0 truncate text-[11px] font-medium text-slate-600 sm:w-32">
                      {name}
                    </div>

                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-slate-700 transition-all duration-500"
                        style={{
                          width: `${Math.max(
                            2,
                            percentage
                          )}%`,
                        }}
                      />
                    </div>

                    <div className="w-12 text-right text-[11px] font-semibold text-slate-700">
                      {value}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ChartCard>

        {/* System health */}
        <ChartCard
          title="System Health"
          subtitle="SENTINEL platform and detection services"
        >
          <div className="space-y-2">
            {healthItems.map((item) => {
              const healthy =
                item.status === "healthy";

              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={[
                        "flex h-8 w-8 items-center justify-center rounded-lg",
                        healthy
                          ? "bg-emerald-50"
                          : "bg-amber-50",
                      ].join(" ")}
                    >
                      <Server
                        className={[
                          "h-4 w-4",
                          healthy
                            ? "text-emerald-600"
                            : "text-amber-600",
                        ].join(" ")}
                      />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-700">
                        {item.label}
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        Security infrastructure
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={[
                        "h-1.5 w-1.5 rounded-full",
                        healthy
                          ? "bg-emerald-500"
                          : "bg-amber-500",
                      ].join(" ")}
                    />

                    <span
                      className={[
                        "text-[10px] font-semibold",
                        healthy
                          ? "text-emerald-700"
                          : "text-amber-700",
                      ].join(" ")}
                    >
                      {item.value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="flex items-center gap-2">
                <Clock3 className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Uptime
                </span>
              </div>

              <p className="mt-2 text-sm font-bold text-slate-800">
                {systemHealth.uptime ??
                  systemHealth.uptimeFormatted ??
                  "—"}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="flex items-center gap-2">
                <Activity className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Events
                </span>
              </div>

              <p className="mt-2 text-sm font-bold text-slate-800">
                {totalEvents.toLocaleString()}
              </p>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Status footer */}
      <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          </div>

          <div>
            <p className="text-[11px] font-semibold text-slate-700">
              SENTINEL protection active
            </p>

            <p className="text-[10px] text-slate-400">
              Monitoring and classification services are ready.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[10px] text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Operational
          </span>

          <span className="hidden sm:inline">•</span>

          <span>
            {apiHealth.online
              ? "Connected to detection API"
              : "Running in demo mode"}
          </span>
        </div>
      </div>
    </div>
  );
}
