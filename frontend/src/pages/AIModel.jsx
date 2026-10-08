import React from "react";
import {
  Cpu,
  CheckCircle2,
  Zap,
  Database,
  Layers3,
  Target,
  Activity,
} from "lucide-react";
import {
  MODEL_METRICS,
  CONFUSION_MATRIX,
  DETECTION_PIPELINE_STAGES,
} from "../data/sampleData";
import ChartCard from "../components/common/ChartCard";

export default function AIModel() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-100 bg-cyan-50">
              <Cpu className="h-4 w-4 text-cyan-700" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-700">
              Machine Learning
            </span>
          </div>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            AI Threat Detection Model
          </h2>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Model architecture, evaluation metrics and detection
            pipeline used by SENTINEL.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <Cpu className="h-3.5 w-3.5 text-cyan-700" />

          <span className="text-[10px] font-semibold text-slate-600">
            Random Forest Classifier
          </span>
        </div>
      </div>

      {/* Model information */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700">
            <Layers3 className="h-4 w-4" />
          </div>

          <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Architecture
          </p>

          <p className="mt-1 truncate text-sm font-bold text-slate-900">
            Random Forest
          </p>

          <p className="mt-0.5 text-[10px] text-slate-500">
            150 estimators
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
            <Database className="h-4 w-4" />
          </div>

          <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Dataset
          </p>

          <p className="mt-1 truncate text-sm font-bold text-slate-900">
            UNSW-NB15
          </p>

          <p className="mt-0.5 text-[10px] text-slate-500">
            Network flow benchmark
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-700">
            <Activity className="h-4 w-4" />
          </div>

          <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Training Samples
          </p>

          <p className="mt-1 text-sm font-bold text-slate-900">
            {MODEL_METRICS.training_samples.toLocaleString()}
          </p>

          <p className="mt-0.5 text-[10px] text-slate-500">
            80% stratified split
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-700">
            <Target className="h-4 w-4" />
          </div>

          <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Validation
          </p>

          <p className="mt-1 text-sm font-bold text-slate-900">
            {MODEL_METRICS.testing_samples.toLocaleString()}
          </p>

          <p className="mt-0.5 text-[10px] text-slate-500">
            20% holdout
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <Zap className="h-4 w-4" />
          </div>

          <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Features
          </p>

          <p className="mt-1 text-sm font-bold text-slate-900">
            {MODEL_METRICS.features_count}
          </p>

          <p className="mt-0.5 text-[10px] text-slate-500">
            Network flow features
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
            <Target className="h-4 w-4" />
          </div>

          <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Target Classes
          </p>

          <p className="mt-1 text-sm font-bold text-slate-900">
            {MODEL_METRICS.classes_count}
          </p>

          <p className="mt-0.5 text-[10px] text-slate-500">
            Model output classes
          </p>
        </div>
      </div>

      {/* Performance */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Accuracy",
            value: MODEL_METRICS.accuracy,
            icon: CheckCircle2,
            description: "Overall classification rate",
            style: "emerald",
          },
          {
            label: "Precision",
            value: MODEL_METRICS.precision,
            icon: Target,
            description: "Prediction reliability",
            style: "cyan",
          },
          {
            label: "Recall",
            value: MODEL_METRICS.recall,
            icon: Activity,
            description: "Threat detection coverage",
            style: "amber",
          },
          {
            label: "F1 Score",
            value: MODEL_METRICS.f1_score,
            icon: Zap,
            description: "Precision and recall balance",
            style: "blue",
          },
        ].map((metric) => {
          const styles = {
            emerald: {
              icon: "bg-emerald-50 text-emerald-700",
              value: "text-emerald-700",
            },
            cyan: {
              icon: "bg-cyan-50 text-cyan-700",
              value: "text-cyan-700",
            },
            amber: {
              icon: "bg-amber-50 text-amber-700",
              value: "text-amber-700",
            },
            blue: {
              icon: "bg-blue-50 text-blue-700",
              value: "text-blue-700",
            },
          }[metric.style];

          const Icon = metric.icon;

          return (
            <div
              key={metric.label}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    {metric.label}
                  </p>

                  <p
                    className={[
                      "mt-2 text-3xl font-bold tracking-tight",
                      styles.value,
                    ].join(" ")}
                  >
                    {metric.value}%
                  </p>
                </div>

                <div
                  className={[
                    "flex h-9 w-9 items-center justify-center rounded-lg",
                    styles.icon,
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1.5 text-[10px] text-slate-500">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                {metric.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* Confusion matrix + class performance */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <ChartCard
          title="Confusion Matrix"
          subtitle="True versus predicted classification results"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[320px] border-collapse text-center">
              <thead>
                <tr>
                  <th className="p-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Actual / Predicted
                  </th>

                  {CONFUSION_MATRIX.labels.map(
                    (label) => (
                      <th
                        key={label}
                        className="p-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500"
                      >
                        {label}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {CONFUSION_MATRIX.matrix.map(
                  (row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="border-t border-slate-100"
                    >
                      <td className="p-3 text-left text-[10px] font-semibold text-slate-500">
                        {
                          CONFUSION_MATRIX
                            .labels[rowIndex]
                        }
                      </td>

                      {row.map(
                        (value, columnIndex) => {
                          const diagonal =
                            rowIndex ===
                            columnIndex;

                          return (
                            <td
                              key={columnIndex}
                              className={[
                                "p-3 text-xs font-bold",
                                diagonal
                                  ? "bg-emerald-50 text-emerald-700"
                                  : value > 100
                                  ? "bg-red-50 text-red-700"
                                  : "bg-slate-50 text-slate-600",
                              ].join(" ")}
                            >
                              {value.toLocaleString()}
                            </td>
                          );
                        }
                      )}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-3 text-[10px] text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-emerald-100" />
              Correct prediction
            </span>

            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-red-100" />
              Misclassification
            </span>
          </div>
        </ChartCard>

        <ChartCard
          title="Attack Class Performance"
          subtitle="Per-class precision, recall and F1 metrics"
        >
          <div className="max-h-[330px] space-y-2 overflow-y-auto pr-1">
            {MODEL_METRICS.class_performance.map(
              (cls) => (
                <div
                  key={cls.category}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-slate-800">
                        {cls.category}
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        {cls.support.toLocaleString()} test
                        instances
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-right">
                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                          P
                        </p>

                        <p className="mt-0.5 text-xs font-semibold text-cyan-700">
                          {cls.precision}%
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                          R
                        </p>

                        <p className="mt-0.5 text-xs font-semibold text-amber-700">
                          {cls.recall}%
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                          F1
                        </p>

                        <p className="mt-0.5 text-xs font-bold text-emerald-700">
                          {cls.f1}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </ChartCard>
      </div>

      {/* Detection pipeline */}
      <ChartCard
        title="SENTINEL Detection Pipeline"
        subtitle="End-to-end flow from telemetry ingestion to analyst triage"
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {DETECTION_PIPELINE_STAGES.map(
            (stage) => (
              <div
                key={stage.id}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-cyan-200 hover:bg-cyan-50/30"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-md border border-cyan-100 bg-cyan-50 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-cyan-700">
                    Step {String(stage.id).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <span className="text-[9px] font-medium text-slate-400">
                    {stage.subtitle}
                  </span>
                </div>

                <h4 className="mt-3 text-xs font-bold text-slate-800">
                  {stage.title}
                </h4>

                <p className="mt-1 text-[11px] leading-5 text-slate-500">
                  {stage.description}
                </p>

                <div className="mt-3 border-t border-slate-200 pt-2 text-[10px] font-medium text-cyan-700">
                  {stage.meta}
                </div>
              </div>
            )
          )}
        </div>
      </ChartCard>
    </div>
  );
}
