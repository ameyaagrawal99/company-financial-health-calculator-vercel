/**
 * Indian number formatting utilities.
 * All monetary values are in Lakhs (₹ Lakhs) internally.
 */

export function formatINR(lakhs: number | undefined | null): string {
  if (lakhs === undefined || lakhs === null || isNaN(lakhs)) return "—";
  const abs = Math.abs(lakhs);
  const sign = lakhs < 0 ? "-" : "";
  if (abs >= 10000) return `${sign}₹${(abs / 100).toFixed(0)} Cr`;
  if (abs >= 100) return `${sign}₹${(abs / 100).toFixed(1)} Cr`;
  if (abs >= 1) return `${sign}₹${abs.toFixed(1)} L`;
  const k = abs * 100;
  if (k >= 1) return `${sign}₹${k.toFixed(0)} K`;
  return `${sign}₹${(abs * 100000).toLocaleString("en-IN")}`;
}

export function formatCrore(lakhs: number): string {
  return `₹${(lakhs / 100).toFixed(2)} Cr`;
}

export function formatPct(
  value: number | undefined | null,
  dp = 1
): string {
  if (value === undefined || value === null || isNaN(value)) return "—";
  return `${value.toFixed(dp)}%`;
}

export function formatDelta(
  current: number | undefined | null,
  previous: number | undefined | null,
  unit: "pct" | "x" | "days" | "inr" = "pct",
  dp = 1
): { text: string; direction: "up" | "down" | "stable" } {
  if (current == null || previous == null) return { text: "—", direction: "stable" };
  const delta = current - previous;
  const arrow = delta > 0 ? "▲" : delta < 0 ? "▼" : "→";
  const direction: "up" | "down" | "stable" =
    delta > 0.001 ? "up" : delta < -0.001 ? "down" : "stable";

  let text = "";
  if (unit === "pct") {
    text = `${arrow} ${Math.abs(delta).toFixed(dp)}pp`;
  } else if (unit === "x") {
    text = `${arrow} ${Math.abs(delta).toFixed(dp)}x`;
  } else if (unit === "days") {
    text = `${arrow} ${Math.abs(delta).toFixed(0)} days`;
  } else {
    text = `${arrow} ${formatINR(Math.abs(delta))}`;
  }
  return { text, direction };
}

export function formatRatio(
  value: number | undefined | null,
  dp = 2
): string {
  if (value === undefined || value === null || isNaN(value)) return "—";
  return `${value.toFixed(dp)}x`;
}

export function formatDays(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return "—";
  return `${Math.round(value)} days`;
}

export function fyLabel(fy: string): string {
  return `FY ${fy}`;
}

export function formatPctDelta(
  current: number | null | undefined,
  previous: number | null | undefined,
): string {
  if (current == null || previous == null) return "—";
  const delta = current - previous;
  const sign = delta >= 0 ? "+" : "";
  return `${sign}${delta.toFixed(1)}pp`;
}

export function formatRevenueDelta(
  current: number | null | undefined,
  previous: number | null | undefined,
): string {
  if (current == null || previous == null) return "—";
  const pct = ((current - previous) / previous) * 100;
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}%`;
}

export function getStatusColor(
  value: number | null | undefined,
  thresholds: { excellent?: number; good?: number; caution?: number; critical?: number },
  lowerIsBetter = false
): "green" | "yellow" | "orange" | "red" {
  if (value == null) return "yellow";
  const { excellent, good, caution } = thresholds;

  if (lowerIsBetter) {
    if (excellent !== undefined && value <= excellent) return "green";
    if (good !== undefined && value <= good) return "yellow";
    if (caution !== undefined && value <= caution) return "orange";
    return "red";
  } else {
    if (excellent !== undefined && value >= excellent) return "green";
    if (good !== undefined && value >= good) return "yellow";
    if (caution !== undefined && value >= caution) return "orange";
    return "red";
  }
}

export const STATUS_COLORS = {
  green: {
    bg: "bg-green-50",
    text: "text-green-800",
    border: "border-green-200",
    badge: "bg-green-100 text-green-800",
    dot: "bg-green-500",
  },
  yellow: {
    bg: "bg-yellow-50",
    text: "text-yellow-800",
    border: "border-yellow-200",
    badge: "bg-yellow-100 text-yellow-800",
    dot: "bg-yellow-500",
  },
  orange: {
    bg: "bg-orange-50",
    text: "text-orange-800",
    border: "border-orange-200",
    badge: "bg-orange-100 text-orange-800",
    dot: "bg-orange-500",
  },
  red: {
    bg: "bg-red-50",
    text: "text-red-800",
    border: "border-red-200",
    badge: "bg-red-100 text-red-800",
    dot: "bg-red-500",
  },
};
