import React from "react";
import {
  Crosshair,
  ShieldAlert,
  ShieldCheck,
  Activity,
  Target,
  AlertTriangle,
} from "lucide-react";
import { useSoc } from "../context/SocContext";
import ChartCard from "../components/common/ChartCard";

export default function ThreatAnalysis() {
  const {
    events = [],
    threatEvents = [],
    stats = {},
  } = useSoc();

  const sourceEvents =
    threatEvents.length > 0 ? threatEvents : events;

  const totalEvents =
    stats.totalEvents ??
    stats.total_events ??
    sourceEvents.length ??
    0;

  const detectedThreats =
    stats.threatsDetected ??
    stats.threats_detected ??
    sourceEvents.filter((event) => {
      const prediction =
        event.prediction ??
        event.is_attack ??
        event.attack;

      return (
        prediction === 1 ||
        prediction === "1" ||
        prediction === true ||
        String(event.severity || "").toLowerCase() !==
          "benign"
      );
    }).length;

  const attackRate =
    totalEvents > 0
      ? ((detectedThreats / totalEvents) * 100).toFixed(1)
      : "0.0";

  const severityCounts = {
    Critical: 0,
    High: 0,
    Medium: 0,
    Low: 0,
    Benign: 0,
  };

  sourceEvents.forEach((event) => {
    const severity = String(
      event.severity ||
        event.threat_level ||
        event.level ||
        (event.prediction === 1 ||
        event.prediction === "1"
          ? "High"
          : "Benign")
    ).toLowerCase();

    if (severity.includes("critical")) {
      severityCounts.Critical += 1;
    } else if (severity.includes("high")) {
      severityCounts.High += 1;
    } else if (severity.includes("medium")) {
      severityCounts.Medium += 1;
    } else if (severity.includes("low")) {
      severityCounts.Low += 1;
    } else {
      severityCounts.Benign += 1;
    }
  });

  const severityColors = {
    Critical: {
      bar: "bg-red-600",
      text: "text-red-700",
      bg: "bg-red-50",
      border: "border-red-200",
    },
    High: {
      bar: "bg-orange-500",
      text: "text-orange-700",
      bg: "bg-orange-50",
      border: "border-orange-200",
    },
    Medium: {
      bar: "bg-amber-500",
      text: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-200",
    },
    Low: {
      bar: "bg-blue-500",
      text: "text-blue-700",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    Benign: {
      bar: "bg-emerald-500",
      text: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
    },
  };

  const getProtocol = (event) =>
    event.protocol ||
    event.proto ||
    "Unknown";

  const getSource = (event) =>
    event.source_ip ||
    event.src_ip ||
    event.source ||
    "Unknown";

  const getDestination = (event) =>
    event.destination_ip ||
    event.dest_ip ||
    event.destination ||
    "Unknown";

  const getPrediction = (event) => {
    const prediction =
      event.prediction ??
      event.is_attack ??
      event.attack;

    if (
      prediction === 1 ||
      prediction === "1" ||
      prediction === true
    ) {
      return "Attack";
    }

    return (
      event.prediction_label ||
      "Normal"
    );
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-100 bg-cyan-50">
            <Crosshair className="h-4 w-4 text-cyan-700" />
          </div>

          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-700">
            Detection Analysis
          </span>
        </div>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
          Threat Analysis
        </h2>

        <p className="mt-1 max-w-2xl text-sm text-slate-500">
          Examine classification results, severity levels and
          network indicators identified by the SENTINEL detection
          pipeline.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Events Analyzed
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {Number(totalEvents).toLocaleString()}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-100 bg-cyan-50">
              <Activity className="h-4 w-4 text-cyan-700" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Threats Detected
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {Number(detectedThreats).toLocaleString()}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-red-50">
              <ShieldAlert className="h-4 w-4 text-red-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Detection Rate
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {attackRate}%
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-orange-100 bg-orange-50">
              <Target className="h-4 w-4 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Benign Events
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {severityCounts.Benign.toLocaleString()}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Analysis content */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ChartCard
          title="Severity Analysis"
          subtitle="Distribution of detected event severity"
        >
          <div className="space-y-4">
            {Object.entries(severityCounts).map(
              ([severity, count]) => {
                const styles =
                  severityColors[severity];

                const percentage =
                  sourceEvents.length > 0
                    ? (count / sourceEvents.length) * 100
                    : 0;

                return (
                  <div key={severity}>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={[
                            "h-2 w-2 rounded-full",
                            styles.bar,
                          ].join(" ")}
                        />

                        <span
                          className={[
                            "text-xs font-semibold",
                            styles.text,
                          ].join(" ")}
                        >
                          {severity}
                        </span>
                      </div>

                      <span className="text-[11px] font-semibold text-slate-600">
                        {count}{" "}
                        <span className="font-normal text-slate-400">
                          ({percentage.toFixed(1)}%)
                        </span>
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={[
                          "h-full rounded-full transition-all duration-500",
                          styles.bar,
                        ].join(" ")}
                        style={{
                          width: `${Math.min(
                            100,
                            percentage
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </ChartCard>

        <ChartCard
          title="Detection Logic"
          subtitle="How SENTINEL classifies network events"
        >
          <div className="space-y-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700">
                  <Activity className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    01 · Event Ingestion
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-slate-500">
                    Network event attributes are collected and
                    prepared for inference.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <Target className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    02 · Model Inference
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-slate-500">
                    The trained detection model evaluates the
                    supplied network features.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-700">
                  <AlertTriangle className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    03 · Threat Classification
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-slate-500">
                    Predictions are surfaced as normal activity or
                    potential attack events for SOC analysis.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <ShieldCheck className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    04 · SOC Response
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-slate-500">
                    Results are presented through the dashboard
                    for investigation and response.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Recent analyzed events */}
      <ChartCard
        title="Recent Analysis Results"
        subtitle="Latest events available to the analysis console"
      >
        {sourceEvents.length === 0 ? (
          <div className="flex min-h-[260px] items-center justify-center">
            <div className="text-center">
              <Crosshair className="mx-auto h-7 w-7 text-slate-300" />

              <p className="mt-3 text-sm font-semibold text-slate-700">
                No analysis results available
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Run the Threat Simulator to generate an event.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Result
                  </th>

                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Source
                  </th>

                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Destination
                  </th>

                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Protocol
                  </th>

                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Severity
                  </th>

                  <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Time
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {sourceEvents.slice(0, 12).map(
                  (event, index) => {
                    const severity = String(
                      event.severity ||
                        event.threat_level ||
                        (event.prediction === 1 ||
                        event.prediction === "1"
                          ? "High"
                          : "Benign")
                    );

                    const severityKey =
                      severity.toLowerCase();

                    const styles =
                      severityColors[
                        severityKey.includes("critical")
                          ? "Critical"
                          : severityKey.includes("high")
                          ? "High"
                          : severityKey.includes("medium")
                          ? "Medium"
                          : severityKey.includes("low")
                          ? "Low"
                          : "Benign"
                      ];

                    return (
                      <tr
                        key={
                          event.id ??
                          event.event_id ??
                          index
                        }
                        className="hover:bg-slate-50"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {getPrediction(event) ===
                            "Attack" ? (
                              <ShieldAlert className="h-4 w-4 text-red-500" />
                            ) : (
                              <ShieldCheck className="h-4 w-4 text-emerald-500" />
                            )}

                            <span className="text-xs font-semibold text-slate-700">
                              {getPrediction(event)}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3 font-mono text-[11px] text-slate-600">
                          {getSource(event)}
                        </td>

                        <td className="px-4 py-3 font-mono text-[11px] text-slate-600">
                          {getDestination(event)}
                        </td>

                        <td className="px-4 py-3">
                          <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-semibold uppercase text-slate-600">
                            {getProtocol(event)}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={[
                              "rounded-md border px-2 py-1 text-[10px] font-semibold",
                              styles.border,
                              styles.bg,
                              styles.text,
                            ].join(" ")}
                          >
                            {severity}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-right">
                          <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-400">
                            <Clock3 className="h-3 w-3" />
                            {event.timestamp ||
                              event.time ||
                              "—"}
                          </span>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </ChartCard>
    </div>
  );
}
