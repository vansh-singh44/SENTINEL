import React from "react";

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendLabel,
  accent = "cyan",
}) {
  const accentStyles = {
    cyan: {
      icon: "bg-cyan-50 text-cyan-700 border-cyan-100",
      value: "text-slate-900",
    },
    blue: {
      icon: "bg-blue-50 text-blue-700 border-blue-100",
      value: "text-slate-900",
    },
    green: {
      icon: "bg-emerald-50 text-emerald-700 border-emerald-100",
      value: "text-slate-900",
    },
    amber: {
      icon: "bg-amber-50 text-amber-700 border-amber-100",
      value: "text-slate-900",
    },
    red: {
      icon: "bg-red-50 text-red-700 border-red-100",
      value: "text-slate-900",
    },
  };

  const styles =
    accentStyles[accent] || accentStyles.cyan;

  const hasTrend =
    trend !== undefined &&
    trend !== null &&
    trend !== "";

  const numericTrend =
    typeof trend === "number"
      ? trend
      : Number.parseFloat(String(trend));

  const trendPositive =
    Number.isFinite(numericTrend) && numericTrend >= 0;

  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>

          <div className="mt-2 flex items-baseline gap-2">
            <p
              className={[
                "text-2xl font-bold tracking-tight sm:text-3xl",
                styles.value,
              ].join(" ")}
            >
              {value ?? "—"}
            </p>
          </div>

          {subtitle && (
            <p className="mt-1.5 truncate text-[11px] text-slate-500">
              {subtitle}
            </p>
          )}

          {hasTrend && (
            <div className="mt-3 flex items-center gap-1.5">
              <span
                className={[
                  "text-[10px] font-semibold",
                  trendPositive
                    ? "text-emerald-600"
                    : "text-red-600",
                ].join(" ")}
              >
                {typeof trend === "number"
                  ? `${trend > 0 ? "+" : ""}${trend}%`
                  : trend}
              </span>

              {trendLabel && (
                <span className="text-[10px] text-slate-400">
                  {trendLabel}
                </span>
              )}
            </div>
          )}
        </div>

        {Icon && (
          <div
            className={[
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-transform duration-200 group-hover:scale-105",
              styles.icon,
            ].join(" ")}
          >
            <Icon
              className="h-[18px] w-[18px]"
              strokeWidth={1.9}
            />
          </div>
        )}
      </div>
    </div>
  );
}
