"use client";
import type { FullAnalysis } from "@/lib/types";
import { formatINR, formatPct, formatRatio, formatRevenueDelta, formatPctDelta } from "@/lib/formatters";

interface Props {
  analysis: FullAnalysis;
}

interface KPICardData {
  label: string;
  value: string;
  delta?: string;
  deltaColor?: "green" | "yellow" | "red";
  subtext?: string;
}

function KPICard({ label, value, delta, deltaColor, subtext }: KPICardData) {
  const deltaColorMap = {
    green: { bg: "#F0FDF4", text: "#166534" },
    yellow: { bg: "#FEFCE8", text: "#854D0E" },
    red: { bg: "#FFF1F2", text: "#9F1239" },
  };
  const dc = deltaColor ? deltaColorMap[deltaColor] : null;

  return (
    <div className="rounded-xl border p-4 shadow-card flex-1"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
      <p className="metric-label mb-1.5">{label}</p>
      <p className="font-bold metric-value text-xl" style={{ color: "var(--text-primary)" }}>{value}</p>
      {delta && dc && (
        <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded mt-1.5"
          style={{ background: dc.bg, color: dc.text }}>
          {delta}
        </span>
      )}
      {subtext && (
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{subtext}</p>
      )}
    </div>
  );
}

export function KPIStrip({ analysis }: Props) {
  const { data, derived, prev_derived, ratios, health_score } = analysis;
  const pl = data.profit_loss;

  const revGrowth = prev_derived
    ? ((pl.revenue_from_operations - prev_derived.total_revenue + (prev_derived.total_revenue - prev_derived.gross_profit - (prev_derived.total_revenue - prev_derived.gross_profit - (prev_derived.total_revenue - prev_derived.gross_profit))) ) / prev_derived.total_revenue * 100)
    : null;

  // Simpler: YoY revenue growth
  const prevRev = data.previous_year_profit_loss?.revenue_from_operations;
  const revGrowthPct = prevRev
    ? ((pl.revenue_from_operations - prevRev) / prevRev) * 100
    : null;

  const prevNetMargin = analysis.prev_ratios?.net_margin;
  const netMarginDelta = prevNetMargin !== undefined && prevNetMargin !== null && ratios.net_margin !== undefined
    ? ratios.net_margin - prevNetMargin
    : null;

  const prevCash = data.previous_year_balance_sheet?.cash_and_equivalents;
  const cashDelta = prevCash !== undefined
    ? ((data.balance_sheet.cash_and_equivalents - prevCash) / prevCash) * 100
    : null;

  const prevDE = analysis.prev_ratios?.debt_to_equity;
  const deImproved = prevDE !== undefined && prevDE !== null && ratios.debt_to_equity !== undefined
    ? ratios.debt_to_equity < prevDE
    : null;

  const zoneColor = health_score.zone_color;
  const scoreColor = zoneColor === "green" ? "green" : zoneColor === "yellow" ? "yellow" : "red";

  return (
    <div className="flex gap-4 mb-6">
      <KPICard
        label="Health Score"
        value={`${health_score.overall.toFixed(0)} / 100`}
        delta={health_score.zone}
        deltaColor={scoreColor as "green" | "yellow" | "red"}
        subtext="Overall company health"
      />
      <KPICard
        label="Revenue"
        value={formatINR(pl.revenue_from_operations)}
        delta={revGrowthPct !== null ? `${revGrowthPct >= 0 ? "▲" : "▼"} ${Math.abs(revGrowthPct).toFixed(1)}% YoY` : undefined}
        deltaColor={revGrowthPct !== null ? (revGrowthPct >= 0 ? "green" : "red") : undefined}
        subtext="From operations (net of GST)"
      />
      <KPICard
        label="Net Profit Margin"
        value={formatPct(ratios.net_margin)}
        delta={netMarginDelta !== null ? `${netMarginDelta >= 0 ? "▲" : "▼"} ${Math.abs(netMarginDelta).toFixed(1)}pp` : undefined}
        deltaColor={netMarginDelta !== null ? (netMarginDelta >= 0 ? "green" : "red") : undefined}
        subtext="PAT ÷ Revenue"
      />
      <KPICard
        label="Cash Position"
        value={formatINR(data.balance_sheet.cash_and_equivalents)}
        delta={cashDelta !== null ? `${cashDelta >= 0 ? "▲" : "▼"} ${Math.abs(cashDelta).toFixed(0)}% YoY` : undefined}
        deltaColor={cashDelta !== null ? (cashDelta >= 0 ? "green" : "red") : undefined}
        subtext="Cash & bank balances"
      />
      <KPICard
        label="Debt-to-Equity"
        value={formatRatio(ratios.debt_to_equity)}
        delta={deImproved !== null ? (deImproved ? "▼ Better" : "▲ Higher") : undefined}
        deltaColor={deImproved !== null ? (deImproved ? "green" : "red") : undefined}
        subtext="Lower is better"
      />
    </div>
  );
}
