"use client";
import { useAppStore } from "@/lib/store";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { BarChartWrapper } from "@/components/charts/BarChartWrapper";
import { formatINR, formatPct, formatRatio } from "@/lib/formatters";
import { TOOLTIPS } from "@/lib/tooltip-content";
import { Droplets } from "lucide-react";

export default function LiquidityPage() {
  const { analysis } = useAppStore();
  if (!analysis) return null;

  const { data, derived, ratios } = analysis;
  const bs = data.balance_sheet;

  // Working capital composition
  const wcData = [
    { name: "Debtors", value: bs.trade_receivables },
    { name: "Inventory", value: bs.inventories },
    { name: "GST ITC", value: bs.gst_itc_receivable },
    { name: "TDS Recv.", value: bs.tds_advance_tax_receivable },
    { name: "Advances (paid)", value: bs.short_term_loans_advances },
    { name: "- Creditors", value: -bs.trade_payables },
    { name: "- GST Pay.", value: -bs.gst_payable },
    { name: "- Cust Adv.", value: -bs.advance_from_customers },
    { name: "- Other CL", value: -bs.other_current_liabilities },
  ];

  const ratioGaugeData = [
    { name: "Current Ratio", value: ratios.current_ratio ?? 0, threshold: 1.5, max: 3 },
    { name: "Quick Ratio", value: ratios.quick_ratio ?? 0, threshold: 1.0, max: 2 },
    { name: "Cash Ratio", value: ratios.cash_ratio ?? 0, threshold: 0.2, max: 1 },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: "var(--accent-light)" }}>
          <Droplets className="w-5 h-5" style={{ color: "var(--accent)" }} />
        </div>
        <div>
          <h1 className="page-title">Liquidity & Working Capital</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Short-term solvency and working capital health — FY {data.financial_year}
          </p>
        </div>
      </div>

      {/* Ratio cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard label="Current Ratio" value={formatRatio(ratios.current_ratio)} tooltip={TOOLTIPS.current_ratio} statusColor={(ratios.current_ratio ?? 0) >= 1.5 && (ratios.current_ratio ?? 0) <= 2.5 ? "green" : (ratios.current_ratio ?? 0) >= 1 ? "yellow" : "red"} healthyRange="1.5x – 2.5x" />
        <MetricCard label="Quick Ratio" value={formatRatio(ratios.quick_ratio)} tooltip={TOOLTIPS.quick_ratio} statusColor={(ratios.quick_ratio ?? 0) >= 1 ? "green" : (ratios.quick_ratio ?? 0) >= 0.7 ? "yellow" : "red"} healthyRange=">1.0x" />
        <MetricCard label="Cash Ratio" value={formatRatio(ratios.cash_ratio)} tooltip={TOOLTIPS.cash_ratio} statusColor={(ratios.cash_ratio ?? 0) >= 0.2 ? "green" : "orange"} healthyRange="0.2x – 0.5x" />
        <MetricCard label="Net Working Capital" value={formatINR(ratios.working_capital)} tooltip={TOOLTIPS.working_capital} statusColor={(ratios.working_capital ?? 0) > 0 ? "green" : "red"} subtext="Current Assets − Current Liabilities" />
      </div>

      {/* Visual gauges */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {ratioGaugeData.map(({ name, value, threshold, max }) => {
          const pct = Math.min(100, (value / max) * 100);
          const thresholdPct = (threshold / max) * 100;
          const isGood = value >= threshold;
          return (
            <div key={name} className="rounded-xl border p-5 shadow-card"
              style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
              <p className="metric-label mb-3">{name}</p>
              <p className="text-3xl font-bold metric-value mb-3"
                style={{ color: isGood ? "#166534" : "#9F1239" }}>
                {value.toFixed(2)}x
              </p>
              <div className="relative h-3 rounded-full" style={{ background: "var(--bg-subtle)" }}>
                <div className="h-3 rounded-full transition-all" style={{ width: `${pct}%`, background: isGood ? "#22c55e" : "#ef4444" }} />
                <div className="absolute top-0 h-3 w-0.5" style={{ left: `${thresholdPct}%`, background: "#6B6560" }} />
              </div>
              <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>
                Threshold: {threshold}x | Current: {value.toFixed(2)}x
              </p>
            </div>
          );
        })}
      </div>

      {/* Summary numbers */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard label="Total Current Assets" value={formatINR(derived.total_current_assets)} />
        <MetricCard label="Total Current Liabilities" value={formatINR(derived.total_current_liabilities)} />
        <MetricCard label="Cash & Bank" value={formatINR(bs.cash_and_equivalents)} statusColor="green" />
        <MetricCard label="Inventories" value={formatINR(bs.inventories)} />
      </div>

      {/* Working Capital Composition */}
      <div className="rounded-xl border p-5 shadow-card"
        style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        <h3 className="section-heading mb-4">Working Capital Composition</h3>
        <div className="space-y-3">
          {wcData.filter((d) => Math.abs(d.value) > 0.1).map(({ name, value }) => {
            const isNeg = value < 0;
            const max = derived.total_current_assets;
            const pct = Math.abs(value) / max * 100;
            return (
              <div key={name} className="flex items-center gap-3">
                <span className="text-xs w-28 flex-shrink-0 text-right" style={{ color: isNeg ? "#9F1239" : "var(--text-secondary)" }}>
                  {name}
                </span>
                <div className="flex-1 flex items-center gap-2">
                  {isNeg ? (
                    <div className="flex-1 flex justify-start">
                      <div className="h-5 rounded flex items-center px-2" style={{ width: `${Math.min(pct, 80)}%`, background: "#FFF1F2", minWidth: 30 }}>
                        <span className="text-xs font-semibold" style={{ color: "#9F1239" }}>{formatINR(value)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center gap-2">
                      <div className="h-5 rounded flex items-center px-2" style={{ width: `${Math.min(pct, 80)}%`, background: "var(--accent-light)", minWidth: 30 }}>
                        <span className="text-xs font-semibold" style={{ color: "var(--accent)" }}>{formatINR(value)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div className="pt-3 border-t flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
            <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Net Working Capital</span>
            <span className="text-sm font-bold" style={{ color: (ratios.working_capital ?? 0) >= 0 ? "#166534" : "#9F1239" }}>
              {formatINR(ratios.working_capital)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
