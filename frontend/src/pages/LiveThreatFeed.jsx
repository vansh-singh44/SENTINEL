import React from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Radio,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";
import { useSoc } from "../context/SocContext";

export default function LiveThreatFeed() {
  const {
    events = [],
    threatEvents = [],
    liveEvents = [],
    isFeedPaused,
    pauseFeed,
    resumeFeed,
  } = useSoc();

  const sourceEvents =
    liveEvents.length > 0
      ? liveEvents
      : threatEvents.length > 0
      ? threatEvents
      : events;

  const displayEvents = sourceEvents.slice(0, 50);

  const getSeverity = (event) => {
    return (
      event.severity ||
      event.level ||
      event.threat_level ||
      (event.prediction === 1 ||
      event.prediction === "1" ||
      event.is_attack
        ? "High"
        : "Benign")
    );
  };

  const getSeverityClasses = (severity) => {
    const value = String(severity).toLowerCase();

    if (value.includes("critical")) {
      return {
        badge: "border-red-200 bg-red-50 text-red-700",
        dot: "bg-red-600",
      };
    }

    if (value.includes("high")) {
      return {
        badge: "border-orange-200 bg-orange-50 text-orange-700",
        dot: "bg-orange-500",
      };
    }

    if (value.includes("medium")) {
      return {
        badge: "border-amber-200 bg-amber-50 text-amber-700",
        dot: "bg-amber-500",
      };
    }

    if (value.includes("low")) {
      return {
        badge: "border-blue-200 bg-blue-50 text-blue-700",
        dot: "bg-blue-500",
      };
    }

    return {
      badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
      dot: "bg-emerald-500",
    };
  };

  const getEventTitle = (event) => {
    return (
      event.title ||
      event.threat ||
      event.attack_type ||
      event.attack ||
      event.prediction_label ||
      (event.prediction === 1 ||
      event.prediction === "1"
        ? "Potential Threat Detected"
        : "Normal Network Activity")
    );
  };

  const getTimestamp = (event) => {
    return (
      event.timestamp ||
      event.time ||
      event.created_at ||
      event.datetime ||
      "Just now"
    );
  };

  const getSourceIp = (event) => {
    return (
      event.source_ip ||
      event.src_ip ||
      event.source ||
      event.src ||
      "Unknown"
    );
  };

  const getDestinationIp = (event) => {
    return (
      event.destination_ip ||
      event.dest_ip ||
      event.destination ||
      event.dst ||
      "Unknown"
    );
  };

  const getProtocol = (event) => {
    return (
      event.protocol ||
      event.proto ||
      "Unknown"
    );
  };

  const getConfidence = (event) => {
    const confidence =
      event.confidence ??
      event.probability ??
      event.attack_probability;

    if (confidence === undefined || confidence === null) {
      return null;
    }

    const number = Number(confidence);

    if (Number.isNaN(number)) {
      return String(confidence);
    }

    return `${number <= 1 ? number * 100 : number}%`;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-100 bg-cyan-50">
              <Radio className="h-4 w-4 text-cyan-700" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-700">
              Network Monitoring
            </span>
          </div>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Live Threat Feed
          </h2>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Real-time security events processed by the SENTINEL
            detection pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={[
              "flex items-center gap-2 rounded-lg border px-3 py-2",
              isFeedPaused
                ? "border-amber-200 bg-amber-50"
                : "border-emerald-200 bg-emerald-50",
            ].join(" ")}
          >
            <span
              className={[
                "h-2 w-2 rounded-full",
                isFeedPaused
                  ? "bg-amber-500"
                  : "bg-emerald-500",
              ].join(" ")}
            />

            <span
              className={[
                "text-[11px] font-semibold",
                isFeedPaused
                  ? "text-amber-700"
                  : "text-emerald-700",
              ].join(" ")}
            >
              {isFeedPaused
                ? "Feed Paused"
                : "Live Monitoring"}
            </span>
          </div>

          <button
            type="button"
            onClick={
              isFeedPaused
                ? resumeFeed
                : pauseFeed
            }
            className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            {isFeedPaused ? (
              <>
                <Activity className="h-3.5 w-3.5" />
                Resume
              </>
            ) : (
              <>
                <RefreshCw className="h-3.5 w-3.5" />
                Pause
              </>
            )}
          </button>
        </div>
      </div>

      {/* Feed summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Events in Feed
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {displayEvents.length}
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
                Detected Threats
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {
                  displayEvents.filter((event) => {
                    const severity = String(
                      getSeverity(event)
                    ).toLowerCase();

                    return ![
                      "benign",
                      "normal",
                      "none",
                    ].includes(severity);
                  }).length
                }
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
                Feed Status
              </p>

              <p className="mt-2 text-lg font-bold text-slate-900">
                {isFeedPaused
                  ? "Paused"
                  : "Receiving Events"}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Feed table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-5">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Security Events
            </h3>

            <p className="mt-1 text-[11px] text-slate-500">
              Latest events received by the detection system
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden text-[10px] font-medium text-slate-400 sm:inline">
              Auto-updating
            </span>

            <span
              className={[
                "h-2 w-2 rounded-full",
                isFeedPaused
                  ? "bg-amber-500"
                  : "animate-pulse bg-emerald-500",
              ].join(" ")}
            />
          </div>
        </div>

        {displayEvents.length === 0 ? (
          <div className="flex min-h-[360px] items-center justify-center px-6">
            <div className="max-w-sm text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
                <Radio className="h-5 w-5 text-slate-400" />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-700">
                Waiting for security events
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                No network events are currently available in
                the live feed. Run a simulation to generate a
                new detection event.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Event
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

                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Confidence
                  </th>

                  <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Time
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {displayEvents.map((event, index) => {
                  const severity =
                    getSeverity(event);

                  const styles =
                    getSeverityClasses(severity);

                  const confidence =
                    getConfidence(event);

                  return (
                    <tr
                      key={
                        event.id ??
                        event.event_id ??
                        `${index}-${getTimestamp(event)}`
                      }
                      className="transition-colors hover:bg-slate-50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={[
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
                              styles.badge,
                            ].join(" ")}
                          >
                            <AlertTriangle className="h-3.5 w-3.5" />
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-[220px] truncate text-xs font-semibold text-slate-800">
                              {getEventTitle(event)}
                            </p>

                            <p className="mt-0.5 text-[10px] text-slate-400">
                              Event #{index + 1}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="font-mono text-[11px] text-slate-600">
                          {getSourceIp(event)}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="font-mono text-[11px] text-slate-600">
                          {getDestinationIp(event)}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-semibold uppercase text-slate-600">
                          {getProtocol(event)}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={[
                            "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-semibold uppercase",
                            styles.badge,
                          ].join(" ")}
                        >
                          <span
                            className={[
                              "h-1.5 w-1.5 rounded-full",
                              styles.dot,
                            ].join(" ")}
                          />

                          {severity}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="text-[11px] font-semibold text-slate-700">
                          {confidence || "—"}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-1.5 text-[10px] text-slate-400">
                          <Clock3 className="h-3 w-3" />
                          {getTimestamp(event)}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
