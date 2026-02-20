"use client";
import { useAppStore } from "@/lib/store";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { BarChartWrapper } from "@/components/charts/BarChartWrapper";
import { formatINR, formatPct, formatRatio, formatDays } from "@/lib/formatters";
import { TOOLTIPS } from "@/lib/tooltip-content";
import { Gauge } from "lucide-react";

export default function EfficiencyPage() {
  const { analysis } = useAppStore();
  if (!analysis) return null;

  const { data, ratios, prev_ratios } = analysis;
  const pl = data.profit_loss;
  const bs = data.balance_sheet;

  // CCC components
  const cccData = [
    { name: "DSO", value: ratios.dso ?? 0, color: "#3D5A80" },
    { name: "DIO", value: ratios.dio ?? 0, color: "#98C1D9" },
    { name: "DPO (subtract)", value: -(ratios.dpo ?? 0), color: "#6B9E78" },
    { name: "CCC = DSO+DIO-DPO", value: ratios.ccc ?? 0, color: "#C17B5A" },
  ];

  // YoY comparison
  const yoyComparison = prev_ratios ? [
    {
      metric: "DSO",
      current: ratios.dso,
      previous: prev_ratios.dso,
      unit: "days",
      lowerIsBetter: true,
    },
    {
      metric: "DIO",
      current: ratios.dio,
      previous: prev_ratios.dio,
      unit: "days",
      lowerIsBetter: true,
    },
    {
      metric: "DPO",
      current: ratios.dpo,
      previous: prev_ratios.dpo,
      unit: "days",
      lowerIsBetter: false,
    },
    {
      metric: "CCC",
      current: ratios.ccc,
      previous: prev_ratios.ccc,
      unit: "days",
      lowerIsBetter: true,
    },
    {
      metric: "Asset Turnover",
      current: ratios.asset_turnover,
      previous: prev_ratios.asset_turnover,
      unit: "x",
      lowerIsBetter: false,
    },
  ] : [];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: "var(--accent-light)" }}>
          <Gauge className="w-5 h-5" style={{ color: "var(--accent)" }} />
        </div>
        <div>
          <h1 className="page-title">Efficiency Ratios</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Asset utilisation and working capital cycle — FY {data.financial_year}
          </p>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard label="DSO" value={formatDays(ratios.dso)} tooltip={TOOLTIPS.dso} statusColor={(ratios.dso ?? 0) < 60 ? "green" : (ratios.dso ?? 0) < 90 ? "yellow" : "red"} healthyRange="<60 days ideal; <45 for MSME" />
        <MetricCard label="DPO" value={formatDays(ratios.dpo)} tooltip={TOOLTIPS.dpo} statusColor={(ratios.dpo ?? 0) >= 30 && (ratios.dpo ?? 0) <= 60 ? "green" : "yellow"} healthyRange="30–60 days" />
        <MetricCard label="DIO" value={formatDays(ratios.dio)} tooltip={TOOLTIPS.dio} statusColor={(ratios.dio ?? 0) < 60 ? "green" : (ratios.dio ?? 0) < 90 ? "yellow" : "orange"} healthyRange="Industry specific; lower is better" />
        <MetricCard label="Cash Conversion Cycle" value={formatDays(ratios.ccc)} tooltip={TOOLTIPS.ccc} statusColor={(ratios.ccc ?? 0) < 75 ? "green" : (ratios.ccc ?? 0) < 100 ? "yellow" : "red"} healthyRange="<90 days; negative = excellent" />
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard label="Asset Turnover" value={formatRatio(ratios.asset_turnover)} tooltip={TOOLTIPS.asset_turnover} statusColor={(ratios.asset_turnover ?? 0) >= 1 ? "green" : "yellow"} healthyRange=">1x services; 0.5–1x manufacturing" />
        <MetricCard label="Fixed Asset Turnover" value={formatRatio(ratios.fixed_asset_turnover)} statusColor={(ratios.fixed_asset_turnover ?? 0) >= 2 ? "green" : "yellow"} subtext="Revenue ÷ Net Fixed Assets" />
        <MetricCard label="Inventory Turnover" value={`${(ratios.inventory_turnover ?? 0).toFixed(1)}x`} tooltip={TOOLTIPS.inventory_turnover} statusColor={(ratios.inventory_turnover ?? 0) >= 8 ? "green" : (ratios.inventory_turnover ?? 0) >= 4 ? "yellow" : "red"} healthyRange="6–12x typical" />
        <MetricCard label="Capital Productivity" value={formatRatio(ratios.capital_productivity)} subtext="Revenue ÷ Capital Employed" statusColor={(ratios.capital_productivity ?? 0) >= 1 ? "green" : "yellow"} />
      </div>

      {/* CCC Visual */}
      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-xl border p-5 shadow-card"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <h3 className="section-heading mb-2">Cash Conversion Cycle Breakdown</h3>
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>CCC = DSO + DIO − DPO</p>

          <div className="space-y-4">
            {[
              { label: "Days Sales Outstanding (DSO)", value: ratios.dso ?? 0, desc: "Time to collect from customers", color: "#3D5A80" },
              { label: "Days Inventory Outstanding (DIO)", value: ratios.dio ?? 0, desc: "Days stock sits before sold", color: "#98C1D9" },
            ].map(({ label, value, desc, color }) => (
              <div key={label}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{label}</span>
                  <span className="text-sm font-bold metric-value" style={{ color }}>{value.toFixed(0)} days</span>
                </div>
                <div className="h-5 rounded" style={{ background: color + "20" }}>
                  <div className="h-5 rounded" style={{ width: `${Math.min(100, value / 180 * 100)}%`, background: color }} />
                </div>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{desc}</p>
              </div>
            ))}

            <div className="pt-2 border-t" style={{ borderColor: "var(--border)" }}>
              <div className="flex justify-between mb-1">
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Days Payable Outstanding (DPO)</span>
                <span className="text-sm font-bold metric-value" style={{ color: "#6B9E78" }}>{(ratios.dpo ?? 0).toFixed(0)} days (offset)</span>
              </div>
            </div>

            <div className="p-3 rounded-lg"
              style={{ background: (ratios.ccc ?? 0) < 90 ? "#F0FDF4" : "#FFF1F2", borderColor: "var(--border)" }}>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>= Cash Conversion Cycle</span>
                <span className="text-xl font-bold metric-value"
                  style={{ color: (ratios.ccc ?? 0) < 90 ? "#166534" : "#9F1239" }}>
                  {(ratios.ccc ?? 0).toFixed(0)} days
                </span>
              </div>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                Money takes {(ratios.ccc ?? 0).toFixed(0)} days to cycle from investment back to cash
              </p>
            </div>
          </div>
        </div>

        {/* YoY comparison */}
        {yoyComparison.length > 0 && (
          <div className="rounded-xl border p-5 shadow-card"
            style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
            <h3 className="section-heading mb-4">Year-over-Year Efficiency Change</h3>
            <div className="space-y-4">
              {yoyComparison.map(({ metric, current, previous, unit, lowerIsBetter }) => {
                if (current == null || previous == null) return null;
                const delta = current - previous;
                const isImproved = lowerIsBetter ? delta < 0 : delta > 0;
                return (
                  <div key={metric} className="flex items-center justify-between p-3 rounded-lg"
                    style={{ background: "var(--bg-subtle)" }}>
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{metric}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {previous.toFixed(1)}{unit}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded"
                        style={{
                          background: isImproved ? "#F0FDF4" : "#FFF1F2",
                          color: isImproved ? "#166534" : "#9F1239",
                        }}>
                        {isImproved ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}{unit}
                      </span>
                      <span className="text-sm font-bold metric-value" style={{ color: "var(--text-primary)" }}>
                        {current.toFixed(1)}{unit}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
