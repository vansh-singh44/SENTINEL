import React from "react";
import {
  BarChart3,
  Activity,
  ShieldAlert,
  TrendingUp,
  Clock3,
  Database,
} from "lucide-react";
import { useSoc } from "../context/SocContext";
import ChartCard from "../components/common/ChartCard";

export default function Analytics() {
  const {
    stats = {},
    threatData = [],
    severityData = [],
    attackData = [],
    events = [],
    threatEvents = [],
  } = useSoc();

  const totalEvents =
    stats.totalEvents ??
    stats.total_events ??
    events.length ??
    0;

  const threatsDetected =
    stats.threatsDetected ??
    stats.threats_detected ??
    threatEvents.length ??
    0;

  const modelAccuracy =
    stats.modelAccuracy ??
    stats.model_accuracy ??
    0;

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

  const totalSeverity = severityData.reduce(
    (sum, item) =>
      sum +
      Number(
        item.value ??
          item.count ??
          item.total ??
          0
      ),
    0
  );

  const totalAttacks = attackData.reduce(
    (sum, item) =>
      sum +
      Number(
        item.value ??
          item.count ??
          item.total ??
          0
      ),
    0
  );

  const severityColor = (name) => {
    const value = String(name).toLowerCase();

    if (value.includes("critical")) return "bg-red-600";
    if (value.includes("high")) return "bg-orange-500";
    if (value.includes("medium")) return "bg-amber-500";
    if (value.includes("low")) return "bg-blue-500";

    return "bg-emerald-500";
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-100 bg-cyan-50">
            <BarChart3 className="h-4 w-4 text-cyan-700" />
          </div>

          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-700">
            Security Intelligence
          </span>
        </div>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
          Security Analytics
        </h2>

        <p className="mt-1 max-w-2xl text-sm text-slate-500">
          Operational metrics and threat trends generated from
          the SENTINEL detection pipeline.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Processed Events
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {Number(totalEvents).toLocaleString()}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700">
              <Activity className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Threat Events
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {Number(threatsDetected).toLocaleString()}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Threat Rate
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {totalEvents > 0
                  ? (
                      (Number(threatsDetected) /
                        Number(totalEvents)) *
                      100
                    ).toFixed(1)
                  : "0.0"}
                %
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Model Accuracy
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {typeof modelAccuracy === "number"
                  ? `${modelAccuracy}%`
                  : modelAccuracy || "—"}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <Database className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Threat activity */}
      <ChartCard
        title="Threat Activity Trend"
        subtitle="Recent event volume across the available monitoring period"
      >
        {threatData.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50">
            <div className="text-center">
              <BarChart3 className="mx-auto h-7 w-7 text-slate-300" />

              <p className="mt-3 text-sm font-semibold text-slate-700">
                No activity data available
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Threat activity will appear after events are
                processed.
              </p>
            </div>
          </div>
        ) : (
          <div className="h-72">
            <div className="flex h-full items-end gap-2 overflow-x-auto border-b border-l border-slate-100 px-2 pb-7 pt-5">
              {threatData.map((item, index) => {
                const value = Number(
                  item.value ??
                    item.count ??
                    item.threats ??
                    item.total ??
                    0
                );

                const height = Math.max(
                  4,
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
                        className="w-4 rounded-t-md bg-cyan-500 transition-all duration-300 group-hover:bg-cyan-600 sm:w-6"
                        style={{
                          height: `${height}%`,
                        }}
                      />

                      <span className="pointer-events-none absolute -top-5 rounded bg-slate-900 px-1.5 py-1 text-[9px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
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

      {/* Distribution */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ChartCard
          title="Severity Distribution"
          subtitle="Security events grouped by severity level"
        >
          {severityData.length === 0 ? (
            <div className="flex h-56 items-center justify-center">
              <p className="text-xs text-slate-500">
                No severity information available.
              </p>
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
                    0
                );

                const percentage =
                  totalSeverity > 0
                    ? (value / totalSeverity) * 100
                    : 0;

                return (
                  <div key={`${name}-${index}`}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={[
                            "h-2 w-2 rounded-full",
                            severityColor(name),
                          ].join(" ")}
                        />

                        <span className="text-xs font-semibold text-slate-700">
                          {name}
                        </span>
                      </div>

                      <span className="text-[11px] font-semibold text-slate-600">
                        {value}{" "}
                        <span className="font-normal text-slate-400">
                          ({percentage.toFixed(1)}%)
                        </span>
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={[
                          "h-full rounded-full transition-all duration-500",
                          severityColor(name),
                        ].join(" ")}
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ChartCard>

        <ChartCard
          title="Attack Distribution"
          subtitle="Classification breakdown across analyzed events"
        >
          {attackData.length === 0 ? (
            <div className="flex h-56 items-center justify-center">
              <p className="text-xs text-slate-500">
                No attack distribution available.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {attackData
                .slice(0, 10)
                .map((item, index) => {
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

                  const percentage =
                    totalAttacks > 0
                      ? (value / totalAttacks) * 100
                      : 0;

                  return (
                    <div
                      key={`${name}-${index}`}
                      className="flex items-center gap-3"
                    >
                      <span className="w-28 shrink-0 truncate text-[11px] font-medium text-slate-600">
                        {name}
                      </span>

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

                      <span className="w-10 text-right text-[11px] font-semibold text-slate-700">
                        {value}
                      </span>
                    </div>
                  );
                })}
            </div>
          )}
        </ChartCard>
      </div>

      {/* Operational insights */}
      <ChartCard
        title="Operational Indicators"
        subtitle="Key observations from the current dataset"
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-700" />

              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Event Volume
              </span>
            </div>

            <p className="mt-2 text-sm font-bold text-slate-800">
              {Number(totalEvents).toLocaleString()} events
            </p>

            <p className="mt-1 text-[10px] leading-4 text-slate-500">
              Total network events currently represented in
              the dashboard.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-red-600" />

              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Threat Exposure
              </span>
            </div>

            <p className="mt-2 text-sm font-bold text-slate-800">
              {attackRateLabel(
                threatsDetected,
                totalEvents
              )}
            </p>

            <p className="mt-1 text-[10px] leading-4 text-slate-500">
              Proportion of analyzed events classified as
              potential threats.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-amber-700" />

              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Monitoring
              </span>
            </div>

            <p className="mt-2 text-sm font-bold text-slate-800">
              Continuous
            </p>

            <p className="mt-1 text-[10px] leading-4 text-slate-500">
              Dashboard analytics update as new events enter
              the application.
            </p>
          </div>
        </div>
      </ChartCard>
    </div>
  );
}

function attackRateLabel(threats, total) {
  if (!total || Number(total) === 0) {
    return "0.0% threat rate";
  }

  return `${(
    (Number(threats) / Number(total)) *
    100
  ).toFixed(1)}% threat rate`;
}
