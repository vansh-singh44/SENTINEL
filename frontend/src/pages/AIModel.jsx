import React from "react";
import {
  BrainCircuit,
  CheckCircle2,
  Database,
  Gauge,
  Layers3,
  ShieldCheck,
  Target,
} from "lucide-react";
import {
  MODEL_METRICS,
  CONFUSION_MATRIX,
  DETECTION_PIPELINE_STAGES,
} from "../data/sampleData";

function formatNumber(value) {
  if (value === undefined || value === null) return "—";

  return Number(value).toLocaleString();
}

function formatPercent(value) {
  if (value === undefined || value === null) return "—";

  const number = Number(value);

  if (Number.isNaN(number)) return String(value);

  return `${number <= 1 ? (number * 100).toFixed(1) : number.toFixed(1)}%`;
}

export default function AIModel() {
  const metrics = MODEL_METRICS || {};
  const matrix = CONFUSION_MATRIX || {};
  const pipeline = Array.isArray(DETECTION_PIPELINE_STAGES)
    ? DETECTION_PIPELINE_STAGES
    : [];

  const classPerformance = Array.isArray(metrics.class_performance)
    ? metrics.class_performance
    : [];

  const matrixLabels = Array.isArray(matrix.labels)
    ? matrix.labels
    : ["Normal", "Attack"];

  const matrixValues = Array.isArray(matrix.matrix)
    ? matrix.matrix
    : [];

  const totalSamples =
    Number(metrics.training_samples || 0) +
    Number(metrics.testing_samples || 0);

  return (
    <div className="min-h-full bg-slate-50 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-100 bg-cyan-50 text-cyan-700">
                <BrainCircuit className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                  AI Model
                </h2>

                <p className="mt-0.5 text-[11px] text-slate-500">
                  Model performance, classification metrics and detection pipeline
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />

            <span className="text-[10px] font-semibold text-emerald-700">
              Model Operational
            </span>
          </div>
        </div>

        {/* Model Overview */}
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-2">
              <Layers3 className="h-4 w-4 text-cyan-700" />

              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Model Performance
                </h3>

                <p className="mt-0.5 text-[10px] text-slate-500">
                  Current SENTINEL classification model statistics
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white p-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Accuracy
                </span>

                <Gauge className="h-4 w-4 text-cyan-600" />
              </div>

              <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                {formatPercent(metrics.accuracy)}
              </p>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-cyan-600"
                  style={{
                    width: `${Math.min(
                      100,
                      Number(metrics.accuracy) <= 1
                        ? Number(metrics.accuracy) * 100
                        : Number(metrics.accuracy) || 0
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="bg-white p-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Precision
                </span>

                <Target className="h-4 w-4 text-blue-600" />
              </div>

              <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                {formatPercent(metrics.precision)}
              </p>

              <p className="mt-2 text-[10px] text-slate-500">
                Positive prediction reliability
              </p>
            </div>

            <div className="bg-white p-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Recall
                </span>

                <ShieldCheck className="h-4 w-4 text-emerald-600" />
              </div>

              <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                {formatPercent(metrics.recall)}
              </p>

              <p className="mt-2 text-[10px] text-slate-500">
                Threat detection coverage
              </p>
            </div>

            <div className="bg-white p-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  F1 Score
                </span>

                <BrainCircuit className="h-4 w-4 text-violet-600" />
              </div>

              <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                {formatPercent(metrics.f1_score)}
              </p>

              <p className="mt-2 text-[10px] text-slate-500">
                Balanced classification score
              </p>
            </div>
          </div>
        </section>

        {/* Dataset + Model Info */}
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-cyan-700" />

              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Model Dataset
                </h3>

                <p className="mt-0.5 text-[10px] text-slate-500">
                  Training and evaluation data used by the detection model
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                  Training Samples
                </p>

                <p className="mt-2 text-lg font-bold text-slate-900">
                  {formatNumber(metrics.training_samples)}
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                  Testing Samples
                </p>

                <p className="mt-2 text-lg font-bold text-slate-900">
                  {formatNumber(metrics.testing_samples)}
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                  Features
                </p>

                <p className="mt-2 text-lg font-bold text-slate-900">
                  {formatNumber(metrics.features_count)}
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                  Classes
                </p>

                <p className="mt-2 text-lg font-bold text-slate-900">
                  {formatNumber(metrics.classes_count)}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-cyan-100 bg-cyan-50 px-4 py-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-700">
                    Evaluation Dataset
                  </p>

                  <p className="mt-1 text-xs font-medium text-slate-800">
                    {metrics.dataset || "Network intrusion detection dataset"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[9px] uppercase tracking-wide text-slate-400">
                    Total Samples
                  </p>

                  <p className="mt-1 font-mono text-xs font-semibold text-slate-700">
                    {formatNumber(totalSamples)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />

              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Classification
                </h3>

                <p className="mt-0.5 text-[10px] text-slate-500">
                  Supported prediction classes
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {classPerformance.length > 0 ? (
                classPerformance.map((item, index) => {
                  const label =
                    item.class ||
                    item.label ||
                    item.name ||
                    matrixLabels[index] ||
                    `Class ${index + 1}`;

                  return (
                    <div
                      key={`${label}-${index}`}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-cyan-600" />

                          <span className="text-xs font-semibold text-slate-800">
                            {label}
                          </span>
                        </div>

                        {item.support !== undefined && (
                          <span className="text-[10px] text-slate-400">
                            Support {formatNumber(item.support)}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <div>
                          <p className="text-[8px] uppercase tracking-wide text-slate-400">
                            Precision
                          </p>
                          <p className="mt-1 text-xs font-semibold text-slate-700">
                            {formatPercent(item.precision)}
                          </p>
                        </div>

                        <div>
                          <p className="text-[8px] uppercase tracking-wide text-slate-400">
                            Recall
                          </p>
                          <p className="mt-1 text-xs font-semibold text-slate-700">
                            {formatPercent(item.recall)}
                          </p>
                        </div>

                        <div>
                          <p className="text-[8px] uppercase tracking-wide text-slate-400">
                            F1
                          </p>
                          <p className="mt-1 text-xs font-semibold text-slate-700">
                            {formatPercent(item.f1_score ?? item.f1)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                matrixLabels.map((label, index) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={[
                          "h-2 w-2 rounded-full",
                          index === 0
                            ? "bg-emerald-500"
                            : "bg-red-500",
                        ].join(" ")}
                      />

                      <span className="text-xs font-semibold text-slate-800">
                        {label}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-400">
                      Class {index}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Confusion Matrix */}
        <section className="mt-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Confusion Matrix
              </h3>

              <p className="mt-1 text-[10px] text-slate-500">
                Actual versus predicted classification results
              </p>
            </div>

            <div className="text-[10px] text-slate-400">
              Rows: Actual · Columns: Predicted
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <div className="mx-auto min-w-[360px] max-w-[620px]">
              <div
                className="mb-2 grid gap-2"
                style={{
                  gridTemplateColumns: `100px repeat(${Math.max(
                    matrixLabels.length,
                    2
                  )}, minmax(100px, 1fr))`,
                }}
              >
                <div />

                {matrixLabels.map((label) => (
                  <div
                    key={`predicted-${label}`}
                    className="text-center text-[9px] font-semibold uppercase tracking-wider text-slate-400"
                  >
                    {label}
                  </div>
                ))}
              </div>

              {matrixLabels.map((rowLabel, rowIndex) => (
                <div
                  key={`row-${rowLabel}`}
                  className="mb-2 grid gap-2"
                  style={{
                    gridTemplateColumns: `100px repeat(${Math.max(
                      matrixLabels.length,
                      2
                    )}, minmax(100px, 1fr))`,
                  }}
                >
                  <div className="flex items-center text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                    {rowLabel}
                  </div>

                  {matrixLabels.map((columnLabel, columnIndex) => {
                    const value =
                      matrixValues[rowIndex]?.[columnIndex] ?? 0;

                    const diagonal = rowIndex === columnIndex;

                    return (
                      <div
                        key={`${rowLabel}-${columnLabel}`}
                        className={[
                          "flex min-h-[76px] flex-col items-center justify-center rounded-lg border",
                          diagonal
                            ? "border-emerald-100 bg-emerald-50"
                            : "border-red-100 bg-red-50",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "text-xl font-bold",
                            diagonal
                              ? "text-emerald-700"
                              : "text-red-700",
                          ].join(" ")}
                        >
                          {formatNumber(value)}
                        </span>

                        <span className="mt-1 text-[8px] uppercase tracking-wide text-slate-400">
                          {diagonal ? "Correct" : "Misclassified"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Detection Pipeline */}
        <section className="mt-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Detection Pipeline
            </h3>

            <p className="mt-1 text-[10px] text-slate-500">
              High-level flow used to process network events
            </p>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {pipeline.length > 0 ? (
              pipeline.map((stage, index) => {
                const title =
                  stage.name ||
                  stage.title ||
                  stage.label ||
                  `Stage ${index + 1}`;

                const description =
                  stage.description ||
                  stage.details ||
                  stage.text ||
                  "";

                return (
                  <div
                    key={`${title}-${index}`}
                    className="relative rounded-lg border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-xs font-bold text-cyan-700 shadow-sm ring-1 ring-slate-200">
                        {index + 1}
                      </div>

                      <h4 className="text-xs font-semibold text-slate-800">
                        {title}
                      </h4>
                    </div>

                    {description && (
                      <p className="mt-3 text-[10px] leading-5 text-slate-500">
                        {description}
                      </p>
                    )}

                    {stage.status && (
                      <div className="mt-3 flex items-center gap-1.5 text-[9px] font-semibold text-emerald-600">
                        <CheckCircle2 className="h-3 w-3" />
                        {stage.status}
                      </div>
                    )}

                    {index < pipeline.length - 1 && (
                      <div className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-300 xl:flex">
                        →
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="col-span-full rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <p className="text-xs font-medium text-slate-600">
                  Detection pipeline information unavailable
                </p>

                <p className="mt-1 text-[10px] text-slate-400">
                  No pipeline stages were provided by the application data.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Footer status */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

            <span className="text-[10px] font-medium text-slate-600">
              SENTINEL model available for threat classification
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <span>Binary network threat classification</span>
          </div>
        </div>
      </div>
    </div>
  );
}
