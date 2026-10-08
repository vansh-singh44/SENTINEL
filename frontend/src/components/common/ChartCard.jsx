import React from "react";

export default function ChartCard({
  title,
  subtitle,
  children,
  action,
  className = "",
}) {
  return (
    <section
      className={[
        "rounded-xl border border-slate-200 bg-white shadow-sm",
        "transition-shadow duration-200 hover:shadow-md",
        className,
      ].join(" ")}
    >
      <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold tracking-tight text-slate-900">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 text-[11px] leading-4 text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

        {action && (
          <div className="shrink-0">
            {action}
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5">
        {children}
      </div>
    </section>
  );
}
