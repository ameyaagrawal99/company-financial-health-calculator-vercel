"use client";
import { useAppStore } from "@/lib/store";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { BarChartWrapper } from "@/components/charts/BarChartWrapper";
import { WaterfallChart } from "@/components/charts/WaterfallChart";
import { LineChartWrapper } from "@/components/charts/LineChartWrapper";
import { formatINR, formatPct, formatRatio, formatPctDelta } from "@/lib/formatters";
import { TOOLTIPS } from "@/lib/tooltip-content";
import { TrendingUp } from "lucide-react";

export default function IncomePage() {
  const { analysis } = useAppStore();
  if (!analysis) return null;

  const { data, derived, prev_derived, ratios, prev_ratios } = analysis;
  const pl = data.profit_loss;
  const p = derived;

  // Profitability waterfall
  const waterfallItems = [
    { name: "Revenue", value: pl.revenue_from_operations, isTotal: false },
    { name: "- COGS", value: -pl.cogs },
    { name: "Gross Profit", value: p.gross_profit, isTotal: true },
    { name: "- Employee", value: -pl.employee_expenses },
    { name: "- Other Opex", value: -pl.other_expenses },
    { name: "EBITDA", value: p.ebitda, isTotal: true },
    { name: "- Depreciation", value: -pl.depreciation },
    { name: "EBIT", value: p.ebit, isTotal: true },
    { name: "- Finance", value: -pl.finance_costs },
    { name: "+ Other Inc.", value: pl.other_income },
    { name: "PBT", value: p.pbt, isTotal: true },
    { name: "- Tax", value: -pl.tax_expense },
    { name: "PAT", value: p.pat, isTotal: true },
  ];

  // Bar chart: Revenue vs Expenses
  const revVsExp: Array<{ name: string; [key: string]: number | string }> = [
    { name: "Revenue", Revenue: pl.revenue_from_operations },
    { name: "COGS", COGS: pl.cogs },
    { name: "Employee", Employee: pl.employee_expenses },
    { name: "Finance", Finance: pl.finance_costs },
    { name: "Depreciation", Dep: pl.depreciation },
    { name: "Other", Other: pl.other_expenses },
    { name: "PAT", PAT: p.pat },
  ];

  // YoY comparison if available
  const prevPL = data.previous_year_profit_loss;
  const yoyData = prevPL ? [
    { name: `FY ${data.previous_financial_year}`, "Net Margin": prev_ratios?.net_margin ?? 0, "EBITDA Margin": prev_ratios?.ebitda_margin ?? 0, "Gross Margin": prev_ratios?.gross_margin ?? 0 },
    { name: `FY ${data.financial_year}`, "Net Margin": ratios.net_margin ?? 0, "EBITDA Margin": ratios.ebitda_margin ?? 0, "Gross Margin": ratios.gross_margin ?? 0 },
  ] : [];

  function delta(curr?: number | null, prev?: number | null) {
    if (curr == null || prev == null) return undefined;
    const d = curr - prev;
    return {
      text: `${d >= 0 ? "▲" : "▼"} ${Math.abs(d).toFixed(1)}pp vs prior year`,
      dir: d >= 0 ? "up" as const : "down" as const,
    };
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: "var(--accent-light)" }}>
          <TrendingUp className="w-5 h-5" style={{ color: "var(--accent)" }} />
        </div>
        <div>
          <h1 className="page-title">Income & Profitability</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Revenue, margins, and returns for FY {data.financial_year}
          </p>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard
          label="Revenue from Operations"
          value={formatINR(pl.revenue_from_operations)}
          tooltip={TOOLTIPS.pat}
          statusColor={p.gross_profit > 0 ? "green" : "red"}
          delta={prevPL ? `${pl.revenue_from_operations >= prevPL.revenue_from_operations ? "▲" : "▼"} ${Math.abs((pl.revenue_from_operations - prevPL.revenue_from_operations) / prevPL.revenue_from_operations * 100).toFixed(1)}% YoY` : undefined}
          deltaDirection={prevPL ? (pl.revenue_from_operations >= prevPL.revenue_from_operations ? "up" : "down") : undefined}
        />
        <MetricCard
          label="Gross Margin"
          value={formatPct(ratios.gross_margin)}
          tooltip={TOOLTIPS.gross_margin}
          statusColor={ratios.gross_margin && ratios.gross_margin >= 25 ? "green" : ratios.gross_margin && ratios.gross_margin >= 15 ? "yellow" : "red"}
          delta={delta(ratios.gross_margin, prev_ratios?.gross_margin)?.text}
          deltaDirection={delta(ratios.gross_margin, prev_ratios?.gross_margin)?.dir}
          healthyRange="30–60% manufacturing; >50% services"
        />
        <MetricCard
          label="EBITDA Margin"
          value={formatPct(ratios.ebitda_margin)}
          tooltip={TOOLTIPS.ebitda_margin}
          statusColor={ratios.ebitda_margin && ratios.ebitda_margin >= 12 ? "green" : ratios.ebitda_margin && ratios.ebitda_margin >= 6 ? "yellow" : "red"}
          delta={delta(ratios.ebitda_margin, prev_ratios?.ebitda_margin)?.text}
          deltaDirection={delta(ratios.ebitda_margin, prev_ratios?.ebitda_margin)?.dir}
          healthyRange=">12% healthy; >20% excellent"
        />
        <MetricCard
          label="Net Profit Margin"
          value={formatPct(ratios.net_margin)}
          tooltip={TOOLTIPS.net_margin}
          statusColor={ratios.net_margin && ratios.net_margin >= 8 ? "green" : ratios.net_margin && ratios.net_margin >= 3 ? "yellow" : "red"}
          delta={delta(ratios.net_margin, prev_ratios?.net_margin)?.text}
          deltaDirection={delta(ratios.net_margin, prev_ratios?.net_margin)?.dir}
          healthyRange="5–15% for Indian SMEs"
        />
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard label="Gross Profit" value={formatINR(p.gross_profit)} statusColor={p.gross_profit > 0 ? "green" : "red"} />
        <MetricCard label="EBITDA" value={formatINR(p.ebitda)} statusColor={p.ebitda > 0 ? "green" : "red"} />
        <MetricCard label="EBIT" value={formatINR(p.ebit)} statusColor={p.ebit > 0 ? "green" : "red"} />
        <MetricCard label="PAT (Net Profit)" value={formatINR(p.pat)} statusColor={p.pat > 0 ? "green" : "red"} />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <MetricCard label="ROE" value={formatPct(ratios.roe)} tooltip={TOOLTIPS.roe} statusColor={ratios.roe && ratios.roe >= 15 ? "green" : "yellow"} healthyRange=">15% good; >20% excellent" />
        <MetricCard label="ROA" value={formatPct(ratios.roa)} tooltip={TOOLTIPS.roa} statusColor={ratios.roa && ratios.roa >= 5 ? "green" : "yellow"} healthyRange=">5% generally good" />
        <MetricCard label="ROCE" value={formatPct(ratios.roce)} tooltip={TOOLTIPS.roce} statusColor={ratios.roce && ratios.roce >= 10 ? "green" : "yellow"} healthyRange="Should exceed cost of capital" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Profitability Waterfall */}
        <div className="rounded-xl border p-5 shadow-card"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <h3 className="section-heading mb-4">Profit Waterfall — Revenue to PAT</h3>
          <WaterfallChart items={waterfallItems} height={280} />
        </div>

        {/* Revenue vs Expenses Bar */}
        <div className="rounded-xl border p-5 shadow-card"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <h3 className="section-heading mb-4">Revenue Breakdown (₹ Lakhs)</h3>
          <BarChartWrapper
            data={revVsExp}
            bars={[
              { key: "Revenue", color: "#3D5A80" },
              { key: "COGS", color: "#C17B5A" },
              { key: "Employee", color: "#8B7BB5" },
              { key: "Finance", color: "#B5A642" },
              { key: "Dep", color: "#A0A0A0" },
              { key: "Other", color: "#98C1D9" },
              { key: "PAT", color: "#6B9E78" },
            ]}
            height={280}
          />
        </div>

        {/* Margin Trends (if prev year available) */}
        {yoyData.length > 1 && (
          <div className="col-span-2 rounded-xl border p-5 shadow-card"
            style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
            <h3 className="section-heading mb-4">Margin Trends — Year-over-Year</h3>
            <LineChartWrapper
              data={yoyData}
              lines={[
                { key: "Gross Margin", color: "#3D5A80", label: "Gross Margin %" },
                { key: "EBITDA Margin", color: "#6B9E78", label: "EBITDA Margin %" },
                { key: "Net Margin", color: "#C17B5A", label: "Net Margin %" },
              ]}
              height={220}
              showLegend
              yFormatter={(v) => `${v.toFixed(1)}%`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
