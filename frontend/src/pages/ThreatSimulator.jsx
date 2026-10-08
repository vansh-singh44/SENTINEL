import React, { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Crosshair,
  Loader2,
  Network,
  Play,
  RotateCcw,
  ShieldAlert,
  Terminal,
  Zap,
} from "lucide-react";
import { useSoc } from "../context/SocContext";

const PRESETS = {
  normal: {
    name: "Normal Traffic",
    description: "Low-risk network activity",
    source_ip: "192.168.1.25",
    destination_ip: "10.0.0.15",
    protocol: "TCP",
    port: 443,
    packet_size: 512,
    flow_duration: 120,
  },
  scan: {
    name: "Port Scan",
    description: "Suspicious reconnaissance activity",
    source_ip: "185.220.101.42",
    destination_ip: "10.0.0.20",
    protocol: "TCP",
    port: 22,
    packet_size: 64,
    flow_duration: 3,
  },
  brute: {
    name: "Brute Force",
    description: "Repeated authentication attempts",
    source_ip: "45.155.205.10",
    destination_ip: "10.0.0.10",
    protocol: "TCP",
    port: 22,
    packet_size: 128,
    flow_duration: 18,
  },
  dos: {
    name: "DoS / Flood",
    description: "High-volume traffic pattern",
    source_ip: "91.240.118.172",
    destination_ip: "10.0.0.30",
    protocol: "UDP",
    port: 80,
    packet_size: 1400,
    flow_duration: 1,
  },
};

const INITIAL_FORM = {
  source_ip: "192.168.1.25",
  destination_ip: "10.0.0.15",
  protocol: "TCP",
  port: 443,
  packet_size: 512,
  flow_duration: 120,
};

function normalizePrediction(result) {
  if (!result) {
    return {
      status: "Unknown",
      isAttack: false,
      confidence: null,
      raw: null,
    };
  }

  const prediction =
    result.prediction ??
    result.result ??
    result.label ??
    result.class ??
    result.predicted_class;

  const predictionText = String(prediction ?? "").toLowerCase();

  const isAttack =
    result.is_attack === true ||
    result.attack === true ||
    prediction === 1 ||
    predictionText === "attack" ||
    predictionText === "1" ||
    predictionText.includes("attack");

  const confidence =
    result.confidence ??
    result.probability ??
    result.attack_probability ??
    result.attack_prob ??
    null;

  return {
    status: isAttack ? "Attack Detected" : "Normal Traffic",
    isAttack,
    confidence,
    raw: result,
  };
}

function formatConfidence(value) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  const numeric = Number(value);

  if (!Number.isNaN(numeric)) {
    const percentage = numeric <= 1 ? numeric * 100 : numeric;
    return `${Math.round(percentage)}%`;
  }

  return String(value);
}

export default function ThreatSimulator() {
  const {
    apiHealth = {},
    predictThreat,
    simulateThreat,
    addEvent,
  } = useSoc();

  const [form, setForm] = useState(INITIAL_FORM);
  const [selectedPreset, setSelectedPreset] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [requestTime, setRequestTime] = useState(null);

  const endpointStatus = apiHealth.online
    ? "API Connected"
    : "Demo Mode";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        name === "port" ||
        name === "packet_size" ||
        name === "flow_duration"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));

    setPrediction(null);
    setError("");
  };

  const applyPreset = (presetKey) => {
    const preset = PRESETS[presetKey];

    if (!preset) return;

    setSelectedPreset(presetKey);

    setForm({
      source_ip: preset.source_ip,
      destination_ip: preset.destination_ip,
      protocol: preset.protocol,
      port: preset.port,
      packet_size: preset.packet_size,
      flow_duration: preset.flow_duration,
    });

    setPrediction(null);
    setError("");
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setSelectedPreset("");
    setPrediction(null);
    setError("");
    setRequestTime(null);
  };

  const submitSimulation = async (event) => {
    event.preventDefault();

    setLoading(true);
    setPrediction(null);
    setError("");
    setRequestTime(null);

    const startedAt = performance.now();

    try {
      let result = null;

      if (typeof predictThreat === "function") {
        result = await predictThreat(form);
      } else if (typeof simulateThreat === "function") {
        result = await simulateThreat(form);
      } else {
        throw new Error(
          "Threat prediction service is not available in the current application context."
        );
      }

      const normalized = normalizePrediction(result);

      setPrediction(normalized);

      if (typeof addEvent === "function") {
        addEvent({
          id: `sim-${Date.now()}`,
          timestamp: new Date().toISOString(),
          source_ip: form.source_ip,
          destination_ip: form.destination_ip,
          protocol: form.protocol,
          port: form.port,
          prediction: normalized.isAttack ? "Attack" : "Normal",
          severity: normalized.isAttack ? "High" : "Low",
          confidence: normalized.confidence,
          source: "Threat Simulator",
          type: "Simulation",
          status: "Detected",
        });
      }
    } catch (err) {
      setError(
        err?.message ||
          "Unable to process the simulated network event."
      );
    } finally {
      setRequestTime(Math.round(performance.now() - startedAt));
      setLoading(false);
    }
  };

  const confidenceText = useMemo(
    () => formatConfidence(prediction?.confidence),
    [prediction]
  );

  return (
    <div className="min-h-full bg-slate-50 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-100 bg-cyan-50 text-cyan-700">
                <Crosshair className="h-4 w-4" />
              </div>

              <div>
                <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                  Threat Simulator
                </h2>

                <p className="text-[11px] text-slate-500">
                  Submit controlled network events for SENTINEL analysis
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={[
                "flex items-center gap-2 rounded-lg border px-3 py-2 text-[10px] font-semibold",
                apiHealth.online
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-amber-200 bg-amber-50 text-amber-700",
              ].join(" ")}
            >
              <span
                className={[
                  "h-1.5 w-1.5 rounded-full",
                  apiHealth.online
                    ? "bg-emerald-500"
                    : "bg-amber-500",
                ].join(" ")}
              />

              {endpointStatus}
            </div>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.75fr)]">
          {/* Configuration */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-2">
                <Network className="h-4 w-4 text-cyan-700" />

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Network Event
                  </h3>

                  <p className="mt-0.5 text-[10px] text-slate-500">
                    Configure the event that will be sent to the detection pipeline
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={submitSimulation} className="p-5">
              {/* Presets */}
              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Quick Presets
                </label>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {Object.entries(PRESETS).map(([key, preset]) => {
                    const active = selectedPreset === key;

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => applyPreset(key)}
                        className={[
                          "rounded-lg border p-3 text-left transition-all",
                          active
                            ? "border-cyan-300 bg-cyan-50"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
                        ].join(" ")}
                      >
                        <p
                          className={[
                            "text-[11px] font-semibold",
                            active
                              ? "text-cyan-800"
                              : "text-slate-800",
                          ].join(" ")}
                        >
                          {preset.name}
                        </p>

                        <p className="mt-1 text-[9px] leading-4 text-slate-500">
                          {preset.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
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
                    value={form.source_ip}
                    onChange={handleChange}
                    placeholder="192.168.1.10"
                    required
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 font-mono text-xs text-slate-800 outline-none transition-colors placeholder:text-slate-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
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
                    value={form.destination_ip}
                    onChange={handleChange}
                    placeholder="10.0.0.10"
                    required
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 font-mono text-xs text-slate-800 outline-none transition-colors placeholder:text-slate-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="protocol"
                    className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Protocol
                  </label>

                  <div className="relative">
                    <select
                      id="protocol"
                      name="protocol"
                      value={form.protocol}
                      onChange={handleChange}
                      className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-9 text-xs font-medium text-slate-800 outline-none transition-colors focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                    >
                      <option value="TCP">TCP</option>
                      <option value="UDP">UDP</option>
                      <option value="ICMP">ICMP</option>
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="port"
                    className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Destination Port
                  </label>

                  <input
                    id="port"
                    name="port"
                    type="number"
                    min="0"
                    max="65535"
                    value={form.port}
                    onChange={handleChange}
                    required
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 font-mono text-xs text-slate-800 outline-none transition-colors focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
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
                      value={form.packet_size}
                      onChange={handleChange}
                      required
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 pr-14 font-mono text-xs text-slate-800 outline-none transition-colors focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                    />

                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
                      bytes
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="flow_duration"
                    className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Flow Duration
                  </label>

                  <div className="relative">
                    <input
                      id="flow_duration"
                      name="flow_duration"
                      type="number"
                      min="0"
                      value={form.flow_duration}
                      onChange={handleChange}
                      required
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 pr-12 font-mono text-xs text-slate-800 outline-none transition-colors focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                    />

                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
                      sec
                    </span>
                  </div>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mt-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />

                  <div>
                    <p className="text-xs font-semibold text-red-800">
                      Simulation failed
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-red-700">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={loading}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-cyan-700 px-5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Analyzing Event...
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5" />
                      Analyze Threat
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* Result Panel */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-cyan-700" />

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Detection Result
                  </h3>

                  <p className="mt-0.5 text-[10px] text-slate-500">
                    SENTINEL inference output
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5">
              {!prediction && !loading && (
                <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-cyan-100 bg-cyan-50 text-cyan-700">
                    <Zap className="h-6 w-6" />
                  </div>

                  <h4 className="mt-4 text-sm font-semibold text-slate-800">
                    Ready for analysis
                  </h4>

                  <p className="mt-1 max-w-xs text-[11px] leading-5 text-slate-500">
                    Configure a network event or choose a preset, then run the
                    analysis to see the model response.
                  </p>
                </div>
              )}

              {loading && (
                <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-cyan-100 bg-cyan-50 text-cyan-700">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>

                  <h4 className="mt-4 text-sm font-semibold text-slate-800">
                    Analyzing network event
                  </h4>

                  <p className="mt-1 text-[11px] text-slate-500">
                    Sending event through the SENTINEL detection pipeline...
                  </p>
                </div>
              )}

              {prediction && !loading && (
                <div>
                  <div
                    className={[
                      "rounded-xl border p-5",
                      prediction.isAttack
                        ? "border-red-200 bg-red-50"
                        : "border-emerald-200 bg-emerald-50",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={[
                            "flex h-11 w-11 items-center justify-center rounded-full",
                            prediction.isAttack
                              ? "bg-red-100 text-red-600"
                              : "bg-emerald-100 text-emerald-600",
                          ].join(" ")}
                        >
                          {prediction.isAttack ? (
                            <ShieldAlert className="h-5 w-5" />
                          ) : (
                            <CheckCircle2 className="h-5 w-5" />
                          )}
                        </div>

                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                            Classification
                          </p>

                          <h4
                            className={[
                              "mt-1 text-lg font-bold tracking-tight",
                              prediction.isAttack
                                ? "text-red-700"
                                : "text-emerald-700",
                            ].join(" ")}
                          >
                            {prediction.status}
                          </h4>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                          Confidence
                        </p>

                        <p
                          className={[
                            "mt-1 text-xl font-bold",
                            prediction.isAttack
                              ? "text-red-700"
                              : "text-emerald-700",
                          ].join(" ")}
                        >
                          {confidenceText}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Event Summary
                    </p>

                    <div className="overflow-hidden rounded-lg border border-slate-200">
                      <div className="grid grid-cols-2 divide-x divide-y divide-slate-200">
                        <div className="p-3">
                          <p className="text-[9px] uppercase tracking-wide text-slate-400">
                            Source
                          </p>
                          <p className="mt-1 truncate font-mono text-[11px] font-medium text-slate-700">
                            {form.source_ip}
                          </p>
                        </div>

                        <div className="p-3">
                          <p className="text-[9px] uppercase tracking-wide text-slate-400">
                            Destination
                          </p>
                          <p className="mt-1 truncate font-mono text-[11px] font-medium text-slate-700">
                            {form.destination_ip}
                          </p>
                        </div>

                        <div className="p-3">
                          <p className="text-[9px] uppercase tracking-wide text-slate-400">
                            Protocol
                          </p>
                          <p className="mt-1 text-[11px] font-semibold text-slate-700">
                            {form.protocol}
                          </p>
                        </div>

                        <div className="p-3">
                          <p className="text-[9px] uppercase tracking-wide text-slate-400">
                            Port
                          </p>
                          <p className="mt-1 font-mono text-[11px] font-semibold text-slate-700">
                            {form.port}
                          </p>
                        </div>

                        <div className="p-3">
                          <p className="text-[9px] uppercase tracking-wide text-slate-400">
                            Packet Size
                          </p>
                          <p className="mt-1 font-mono text-[11px] font-semibold text-slate-700">
                            {form.packet_size} bytes
                          </p>
                        </div>

                        <div className="p-3">
                          <p className="text-[9px] uppercase tracking-wide text-slate-400">
                            Duration
                          </p>
                          <p className="mt-1 font-mono text-[11px] font-semibold text-slate-700">
                            {form.flow_duration} sec
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {requestTime !== null && (
                    <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                      <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        <Clock3 className="h-3.5 w-3.5" />
                        Processing time
                      </div>

                      <span className="font-mono text-[10px] font-semibold text-slate-700">
                        {requestTime} ms
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-[10px] leading-4 text-slate-500">
          <Terminal className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
          <p>
            The Threat Simulator generates controlled test events for
            demonstration and evaluation. It does not represent real-time
            network packet capture or live intrusion monitoring.
          </p>
        </div>
      </div>
    </div>
  );
}
