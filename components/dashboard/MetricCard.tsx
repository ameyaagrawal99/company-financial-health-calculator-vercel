"use client";
import type { TooltipContent } from "@/lib/types";
import { MetricTooltip } from "@/components/ui/Tooltip";
import type { StatusColor } from "./types";

interface Props {
  label: string;
  value: string;
  delta?: string;
  deltaDirection?: "up" | "down" | "stable";
  deltaPositiveIsGood?: boolean;
  statusColor?: "green" | "yellow" | "orange" | "red";
  healthyRange?: string;
  tooltip?: TooltipContent;
  subtext?: string;
  size?: "sm" | "md" | "lg";
}

const DELTA_COLORS = {
  up_good: { bg: "#F0FDF4", text: "#166534" },
  up_bad: { bg: "#FFF1F2", text: "#9F1239" },
  down_good: { bg: "#F0FDF4", text: "#166534" },
  down_bad: { bg: "#FFF1F2", text: "#9F1239" },
  stable: { bg: "#FEFCE8", text: "#854D0E" },
};

const STATUS_BG = {
  green: { left: "#22c55e" },
  yellow: { left: "#eab308" },
  orange: { left: "#f97316" },
  red: { left: "#ef4444" },
};

export function MetricCard({
  label,
  value,
  delta,
  deltaDirection,
  deltaPositiveIsGood = true,
  statusColor,
  healthyRange,
  tooltip,
  subtext,
  size = "md",
}: Props) {
  const valueFontSize = size === "lg" ? "2rem" : size === "md" ? "1.375rem" : "1.125rem";

  let deltaStyle = DELTA_COLORS.stable;
  if (deltaDirection === "up") {
    deltaStyle = deltaPositiveIsGood ? DELTA_COLORS.up_good : DELTA_COLORS.up_bad;
  } else if (deltaDirection === "down") {
    deltaStyle = deltaPositiveIsGood ? DELTA_COLORS.down_bad : DELTA_COLORS.down_good;
  }

  return (
    <div className="rounded-xl border shadow-card flex flex-col overflow-hidden"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
      {statusColor && (
        <div className="h-1 w-full" style={{ background: STATUS_BG[statusColor].left }} />
      )}
      <div className="p-5 flex-1 flex flex-col">
        {/* Label */}
        <div className="flex items-center justify-between mb-2">
          <p className="metric-label">{label}</p>
          {tooltip && <MetricTooltip content={tooltip} />}
        </div>

        {/* Value */}
        <p className="font-bold metric-value leading-tight mb-2"
          style={{ fontSize: valueFontSize, color: "var(--text-primary)" }}>
          {value}
        </p>

        {/* Delta */}
        {delta && (
          <span className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded text-xs font-semibold mb-2"
            style={{ background: deltaStyle.bg, color: deltaStyle.text }}>
            {delta}
          </span>
        )}

        {/* Divider */}
        {healthyRange && (
          <>
            <div className="mt-auto pt-3 border-t" style={{ borderColor: "var(--border)" }}>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Range: {healthyRange}
              </p>
            </div>
          </>
        )}

        {subtext && !healthyRange && (
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{subtext}</p>
        )}
      </div>
    </div>
  );
}
