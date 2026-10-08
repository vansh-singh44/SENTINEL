import React, { useState } from "react";
import {
  Terminal,
  Play,
  Sparkles,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  Network,
  Clock3,
  CheckCircle2,
} from "lucide-react";
import { useSoc } from "../context/SocContext";
import { api } from "../services/api";
import { SIMULATOR_PRESETS } from "../data/sampleData";

const DEFAULT_EVENT = {
  source_ip: "185.220.101.5",
  destination_ip: "10.0.2.45",
  protocol: "TCP",
  port: 8080,
  packet_size: 4096,
  duration: 2.3,
  service: "http",
  state: "FIN",
};

function formatConfidence(value) {
  if (value === undefined || value === null || value === "") {
    return "—";
  }

  const numeric = Number(value);

  if (Number.isNaN(numeric)) {
    return String(value);
  }

  return `${numeric <= 1 ? Math.round(numeric * 100) : Math.round(numeric)}%`;
}

function severityClass(severity) {
  const value = String(severity || "").toUpperCase();

  if (value === "CRITICAL") {
    return {
      wrapper: "border-red-200 bg-red-50",
      icon: "bg-red-100 text-red-600",
      title: "text-red-700",
      badge: "border-red-200 bg-red-100 text-red-700",
    };
  }

  if (value === "HIGH") {
    return {
      wrapper: "border-orange-200 bg-orange-50",
      icon: "bg-orange-100 text-orange-600",
      title: "text-orange-700",
      badge: "border-orange-200 bg-orange-100 text-orange-700",
    };
  }

  if (value === "MEDIUM") {
    return {
      wrapper: "border-amber-200 bg-amber-50",
      icon: "bg-amber-100 text-amber-600",
      title: "text-amber-700",
      badge: "border-amber-200 bg-amber-100 text-amber-700",
    };
  }

  return {
    wrapper: "border-emerald-200 bg-emerald-50",
    icon: "bg-emerald-100 text-emerald-600",
    title: "text-emerald-700",
    badge: "border-emerald-200 bg-emerald-100 text-emerald-700",
  };
}

export default function ThreatSimulator() {
  const {
    addSimulatedThreatToFeed,
    inspectEvent,
  } = useSoc();

  const [eventData, setEventData] = useState(DEFAULT_EVENT);
  const [selectedPresetName, setSelectedPresetName] = useState(
    "Remote Code Execution / Exploit"
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [error, setError] = useState("");
  const [lastAnalysisTime, setLastAnalysisTime] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;

    let parsedValue = value;

    if (
      name === "port" ||
      name === "packet_size" ||
      name === "duration"
    ) {
      parsedValue = value === "" ? "" : Number(value);
    }

    setEventData((current) => ({
      ...current,
      [name]: parsedValue,
    }));

    setPredictionResult(null);
    setError("");
  };

  const handleSelectPreset = (preset) => {
    setSelectedPresetName(preset.name);

    setEventData({
      source_ip: preset.source_ip,
      destination_ip: preset.destination_ip,
      protocol: preset.protocol,
      port: preset.port,
      packet_size: preset.packet_size,
      duration: preset.duration || 1.8,
      service: preset.service || "http",
      state: preset.state || "CON",
    });

    setPredictionResult(null);
    setError("");
  };

  const handleGenerateSample = async () => {
    setIsAnalyzing(true);
    setError("");

    try {
      const sample = await api.getSampleEvent();

      setEventData(sample.event);
      setSelectedPresetName(
        sample.online
          ? "Backend Sample Event"
          : "Demo Sample Event"
      );
      setPredictionResult(null);
    } catch (err) {
      console.error(err);
      setError("Unable to generate a sample network event.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setPredictionResult(null);
    setError("");

    const startedAt = performance.now();

    try {
      /*
       * IMPORTANT:
       * api.predictThreat() contains the actual Demo Mode fallback.
       * When the backend is unavailable, it returns an offline
       * prediction instead of failing.
       */
      const result = await api.predictThreat(eventData);

      setPredictionResult(result);

      setLastAnalysisTime(
        Math.round(performance.now() - startedAt)
      );
    } catch (err) {
      console.error(err);

      setError(
        err?.message ||
          "Unable to analyze the network event."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setEventData({
      source_ip: "",
      destination_ip: "",
      protocol: "TCP",
      port: "",
      packet_size: "",
      duration: "",
      service: "http",
      state: "CON",
    });

    setPredictionResult(null);
    setSelectedPresetName("");
    setError("");
    setLastAnalysisTime(null);
  };

  const handlePushAndInspect = () => {
    if (!predictionResult) return;

    /*
     * Keep the existing SOC architecture.
     * This function already exists in SocContext.
     */
    addSimulatedThreatToFeed(predictionResult);

    inspectEvent(predictionResult);
  };

  const styles = severityClass(
    predictionResult?.severity
  );

  const isAttack =
    String(predictionResult?.severity || "").toUpperCase() !==
    "BENIGN";

  return (
    <div className="min-h-full bg-slate-50 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-100 bg-cyan-50 text-cyan-700">
                <Terminal className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                  Threat Simulator
                </h2>

                <p className="mt-0.5 text-[11px] text-slate-500">
                  Run controlled network events through the SENTINEL detection pipeline
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

            <span className="text-[10px] font-semibold text-slate-600">
              Demo fallback enabled
            </span>
          </div>
        </div>

        {/* Presets */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-700" />

            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Threat Scenarios
              </h3>

              <p className="mt-0.5 text-[10px] text-slate-500">
                Select a predefined UNSW-NB15-inspired network scenario
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {SIMULATOR_PRESETS.map((preset) => {
              const selected =
                selectedPresetName === preset.name;

              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={[
                    "rounded-lg border p-3 text-left transition-all",
                    selected
                      ? "border-cyan-300 bg-cyan-50"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
                  ].join(" ")}
                >
                  <p
                    className={[
                      "truncate text-[11px] font-semibold",
                      selected
                        ? "text-cyan-800"
                        : "text-slate-800",
                    ].join(" ")}
                  >
                    {preset.name}
                  </p>

                  <p className="mt-1 truncate text-[9px] text-slate-500">
                    {preset.expected_category || "Network event"}
                  </p>

                  <p className="mt-1 text-[9px] text-slate-400">
                    Port {preset.port}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Main */}
        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(350px,0.8fr)]">
          {/* Event Configuration */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Network className="h-4 w-4 text-cyan-700" />

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Network Event
                    </h3>

                    <p className="mt-0.5 text-[10px] text-slate-500">
                      Configure the event before running inference
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateSample}
                  disabled={isAnalyzing}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-cyan-200 bg-cyan-50 px-3 text-[10px] font-semibold text-cyan-700 transition-colors hover:bg-cyan-100 disabled:opacity-50"
                >
                  <Sparkles className="h-3 w-3" />
                  Generate Sample
                </button>
              </div>
            </div>

            <div className="p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="source_ip"
                    className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Source IP
                  </label>

                  <input
                    id="source_ip"
                    name="source_ip"
                    value={eventData.source_ip}
                    onChange={handleChange}
                    placeholder="185.220.101.5"
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 font-mono text-xs text-slate-800 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="destination_ip"
                    className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Destination IP
                  </label>

                  <input
                    id="destination_ip"
                    name="destination_ip"
                    value={eventData.destination_ip}
                    onChange={handleChange}
                    placeholder="10.0.2.45"
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 font-mono text-xs text-slate-800 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="protocol"
                    className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Protocol
                  </label>

                  <select
                    id="protocol"
                    name="protocol"
                    value={eventData.protocol}
                    onChange={handleChange}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  >
                    <option value="TCP">TCP</option>
                    <option value="UDP">UDP</option>
                    <option value="ICMP">ICMP</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="port"
                    className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Port
                  </label>

                  <input
                    id="port"
                    name="port"
                    type="number"
                    min="0"
                    max="65535"
                    value={eventData.port}
                    onChange={handleChange}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 font-mono text-xs text-slate-800 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="packet_size"
                    className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Packet Size
                  </label>

                  <div className="relative">
                    <input
                      id="packet_size"
                      name="packet_size"
                      type="number"
                      min="1"
                      value={eventData.packet_size}
                      onChange={handleChange}
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 pr-14 font-mono text-xs text-slate-800 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-slate-400">
                      bytes
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="duration"
                    className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Duration
                  </label>

                  <div className="relative">
                    <input
                      id="duration"
                      name="duration"
                      type="number"
                      min="0"
                      step="0.1"
                      value={eventData.duration}
                      onChange={handleChange}
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 pr-12 font-mono text-xs text-slate-800 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-slate-400">
                      sec
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="service"
                    className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Service
                  </label>

                  <input
                    id="service"
                    name="service"
                    value={eventData.service}
                    onChange={handleChange}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 font-mono text-xs text-slate-800 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Connection State
                  </label>

                  <input
                    id="state"
                    name="state"
                    value={eventData.state}
                    onChange={handleChange}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 font-mono text-xs text-slate-800 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <div className="flex items-start gap-2">
                    <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />

                    <div>
                      <p className="text-xs font-semibold text-red-800">
                        Analysis failed
                      </p>

                      <p className="mt-1 text-[10px] leading-4 text-red-700">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={isAnalyzing}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Clear
                </button>

                <button
                  type="button"
                  onClick={handleRunAnalysis}
                  disabled={isAnalyzing}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-cyan-700 px-5 text-xs font-semibold text-white shadow-sm hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5" />
                      Run AI Analysis
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* Result */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-cyan-700" />

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Detection Result
                  </h3>

                  <p className="mt-0.5 text-[10px] text-slate-500">
                    Model inference and SOC enrichment
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5">
              {!predictionResult && !isAnalyzing && (
                <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-400">
                    <Terminal className="h-6 w-6" />
                  </div>

                  <h4 className="mt-4 text-sm font-semibold text-slate-800">
                    Ready for analysis
                  </h4>

                  <p className="mt-1 max-w-xs text-[11px] leading-5 text-slate-500">
                    Configure a network event and run the analysis.
                    If the backend is unavailable, SENTINEL automatically
                    uses its Demo Mode fallback.
                  </p>
                </div>
              )}

              {isAnalyzing && (
                <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-cyan-100 bg-cyan-50 text-cyan-700">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>

                  <h4 className="mt-4 text-sm font-semibold text-slate-800">
                    Running detection
                  </h4>

                  <p className="mt-1 text-[11px] text-slate-500">
                    Processing the network event...
                  </p>
                </div>
              )}

              {predictionResult && !isAnalyzing && (
                <div>
                  <div
                    className={[
                      "rounded-xl border p-5",
                      styles.wrapper,
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={[
                            "flex h-11 w-11 items-center justify-center rounded-full",
                            styles.icon,
                          ].join(" ")}
                        >
                          {isAttack ? (
                            <ShieldAlert className="h-5 w-5" />
                          ) : (
                            <CheckCircle2 className="h-5 w-5" />
                          )}
                        </div>

                        <div>
                          <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                            Prediction
                          </p>

                          <h4
                            className={[
                              "mt-1 text-lg font-bold",
                              styles.title,
                            ].join(" ")}
                          >
                            {predictionResult.prediction ||
                              "Normal"}
                          </h4>
                        </div>
                      </div>

                      <span
                        className={[
                          "rounded-md border px-2 py-1 text-[9px] font-bold uppercase",
                          styles.badge,
                        ].join(" ")}
                      >
                        {predictionResult.severity ||
                          "BENIGN"}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[9px] uppercase tracking-wide text-slate-400">
                          Confidence
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-800">
                          {formatConfidence(
                            predictionResult.confidence
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] uppercase tracking-wide text-slate-400">
                          Risk Score
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-800">
                          {predictionResult.risk_score ?? "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] uppercase tracking-wide text-slate-400">
                          Priority
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-800">
                          {predictionResult.priority || "P4"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] uppercase tracking-wide text-slate-400">
                          Source
                        </p>

                        <p className="mt-1 text-[10px] font-semibold text-slate-700">
                          {predictionResult.online
                            ? "Live Backend"
                            : "Demo Mode"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                      Recommendation
                    </p>

                    <p className="mt-2 text-[11px] leading-5 text-slate-600">
                      {predictionResult.recommendation ||
                        "Continue monitoring the event."}
                    </p>
                  </div>

                  <div className="mt-4 rounded-lg border border-slate-200 bg-white">
                    <div className="grid grid-cols-2 divide-x divide-y divide-slate-200">
                      <div className="p-3">
                        <p className="text-[9px] uppercase tracking-wide text-slate-400">
                          Source
                        </p>

                        <p className="mt-1 truncate font-mono text-[10px] font-semibold text-slate-700">
                          {predictionResult.source_ip ||
                            eventData.source_ip ||
                            "—"}
                        </p>
                      </div>

                      <div className="p-3">
                        <p className="text-[9px] uppercase tracking-wide text-slate-400">
                          Destination
                        </p>

                        <p className="mt-1 truncate font-mono text-[10px] font-semibold text-slate-700">
                          {predictionResult.destination_ip ||
                            eventData.destination_ip ||
                            "—"}
                        </p>
                      </div>

                      <div className="p-3">
                        <p className="text-[9px] uppercase tracking-wide text-slate-400">
                          Protocol
                        </p>

                        <p className="mt-1 text-[10px] font-semibold text-slate-700">
                          {predictionResult.protocol ||
                            eventData.protocol}
                        </p>
                      </div>

                      <div className="p-3">
                        <p className="text-[9px] uppercase tracking-wide text-slate-400">
                          Port
                        </p>

                        <p className="mt-1 font-mono text-[10px] font-semibold text-slate-700">
                          {predictionResult.port ||
                            eventData.port ||
                            "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {lastAnalysisTime !== null && (
                    <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                      <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        <Clock3 className="h-3 w-3" />
                        Processing time
                      </div>

                      <span className="font-mono text-[10px] font-semibold text-slate-700">
                        {lastAnalysisTime} ms
                      </span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handlePushAndInspect}
                    className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
                  >
                    Push to Live Feed
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Explanation */}
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3">
          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />

          <p className="text-[10px] leading-4 text-slate-500">
            <span className="font-semibold text-slate-700">
              Demo Mode:
            </span>{" "}
            when the SENTINEL backend cannot be reached, the existing
            API service automatically performs an offline fallback
            classification. This allows the simulator to remain usable
            without the backend being online.
          </p>
        </div>
      </div>
    </div>
  );
}
