"use client";
import { useAppStore } from "@/lib/store";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { WaterfallChart } from "@/components/charts/WaterfallChart";
import { formatINR, formatPct, formatRatio } from "@/lib/formatters";
import { TOOLTIPS } from "@/lib/tooltip-content";
import { Banknote } from "lucide-react";

export default function CashFlowPage() {
  const { analysis } = useAppStore();
  if (!analysis) return null;

  const { data, derived, ratios } = analysis;
  const cf = data.cash_flow;
  const pl = data.profit_loss;

  const waterfallItems = [
    { name: "Op. CF", value: cf.operating_cf },
    { name: "Inv. CF", value: cf.investing_cf },
    { name: "Fin. CF", value: cf.financing_cf },
    { name: "Net Change", value: cf.operating_cf + cf.investing_cf + cf.financing_cf, isTotal: true },
  ];

  const runway = data.balance_sheet.cash_and_equivalents > 0 && cf.operating_cf < 0
    ? data.balance_sheet.cash_and_equivalents / Math.abs(cf.operating_cf / 12)
    : null;

  const runwayColor = runway === null ? "green" : runway > 12 ? "green" : runway > 6 ? "yellow" : runway > 3 ? "orange" : "red";

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: "var(--accent-light)" }}>
          <Banknote className="w-5 h-5" style={{ color: "var(--accent)" }} />
        </div>
        <div>
          <h1 className="page-title">Cash Flow Dashboard</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Operating, investing and financing cash flows — FY {data.financial_year}
          </p>
        </div>
      </div>

      {/* Three CF cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border p-5 shadow-card"
          style={{ background: cf.operating_cf >= 0 ? "#F0FDF4" : "#FFF1F2", borderColor: cf.operating_cf >= 0 ? "#BBF7D0" : "#FECDD3" }}>
          <p className="text-xs font-medium uppercase tracking-wide mb-2"
            style={{ color: cf.operating_cf >= 0 ? "#166534" : "#9F1239" }}>Operating Cash Flow</p>
          <p className="text-3xl font-bold metric-value"
            style={{ color: cf.operating_cf >= 0 ? "#166534" : "#9F1239" }}>
            {formatINR(cf.operating_cf)}
          </p>
          <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
            Core business cash generation
          </p>
        </div>
        <div className="rounded-xl border p-5 shadow-card"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <p className="metric-label mb-2">Investing Cash Flow</p>
          <p className="text-3xl font-bold metric-value" style={{ color: "var(--text-primary)" }}>
            {formatINR(cf.investing_cf)}
          </p>
          <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
            CapEx, investments — typically negative
          </p>
        </div>
        <div className="rounded-xl border p-5 shadow-card"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <p className="metric-label mb-2">Financing Cash Flow</p>
          <p className="text-3xl font-bold metric-value" style={{ color: "var(--text-primary)" }}>
            {formatINR(cf.financing_cf)}
          </p>
          <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
            Loans drawn/repaid, dividends
          </p>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard label="Free Cash Flow" value={formatINR(ratios.fcf)} tooltip={TOOLTIPS.fcf} statusColor={(ratios.fcf ?? 0) >= 0 ? "green" : "red"} healthyRange="Positive for mature business" />
        <MetricCard label="OCF Margin" value={formatPct(ratios.ocf_margin)} tooltip={TOOLTIPS.ocf_margin} statusColor={(ratios.ocf_margin ?? 0) >= 8 ? "green" : "yellow"} healthyRange=">8% healthy" />
        <MetricCard label="Cash Conversion" value={formatRatio(ratios.cash_conversion_ratio)} subtext="OCF ÷ EBITDA" statusColor={(ratios.cash_conversion_ratio ?? 0) >= 0.7 ? "green" : "yellow"} healthyRange=">0.7x (profits converting to cash)" />
        <MetricCard label="CF to Debt" value={ratios.cf_to_debt ? `${ratios.cf_to_debt.toFixed(2)}x` : "—"} statusColor={(ratios.cf_to_debt ?? 0) >= 0.2 ? "green" : "red"} healthyRange=">0.2x (repay debt in <5 yrs from OCF)" />
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard label="Capital Expenditure" value={formatINR(cf.capex)} subtext="Investment in fixed assets" />
        <MetricCard label="CapEx Intensity" value={formatPct(ratios.capex_intensity)} subtext="CapEx ÷ Revenue" />
        <MetricCard label="Cash in Bank" value={formatINR(data.balance_sheet.cash_and_equivalents)} statusColor="green" />
        {runway !== null && (
          <MetricCard label="Cash Runway" value={`${runway.toFixed(1)} months`} statusColor={runwayColor} healthyRange=">12 months healthy" />
        )}
        {runway === null && (
          <MetricCard label="Net Cash Change" value={formatINR(cf.operating_cf + cf.investing_cf + cf.financing_cf)} statusColor={(cf.operating_cf + cf.investing_cf + cf.financing_cf) >= 0 ? "green" : "red"} />
        )}
      </div>

      {/* Waterfall chart */}
      <div className="rounded-xl border p-5 shadow-card"
        style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        <h3 className="section-heading mb-4">Cash Flow Waterfall</h3>
        <WaterfallChart items={waterfallItems} height={240} />
      </div>

      {/* Indian context alerts */}
      <div className="mt-6 p-4 rounded-lg border"
        style={{ background: "var(--bg-subtle)", borderColor: "var(--border)" }}>
        <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
          🇮🇳 Indian Context — Cash Flow Quality Checks
        </p>
        <div className="space-y-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
          <p>• Section 40A(3): Cash payments above ₹10,000 per day to any single person are disallowed as business expenses under Income Tax Act</p>
          <p>• Cash sales should reconcile with bank deposits — significant gap may indicate unreported income (tax risk)</p>
          <p>• Positive OCF but negative FCF is acceptable if company is in expansion phase — watch capex-to-revenue ratio</p>
          <p>• Poor OCF-to-EBITDA ratio (&lt;0.6x) suggests aggressive working capital consumption or non-cash adjustments inflating profits</p>
        </div>
      </div>
    </div>
  );
}
