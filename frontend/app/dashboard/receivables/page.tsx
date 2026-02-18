"use client";
import { useAppStore } from "@/lib/store";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { BarChartWrapper } from "@/components/charts/BarChartWrapper";
import { formatINR, formatPct, formatDays } from "@/lib/formatters";
import { TOOLTIPS } from "@/lib/tooltip-content";
import { ArrowDownLeft, AlertTriangle } from "lucide-react";

const BUCKET_COLORS = ["#22c55e", "#eab308", "#f97316", "#ef4444", "#9F1239"];

export default function ReceivablesPage() {
  const { analysis } = useAppStore();
  if (!analysis) return null;

  const { data, ratios } = analysis;
  const bs = data.balance_sheet;
  const pl = data.profit_loss;
  const rev = pl.revenue_from_operations;

  // If ageing data available (from extracted data), use it; otherwise estimate
  const ageing = data.debtor_ageing || {
    zero_to_30: bs.trade_receivables * 0.35,
    thirty_to_60: bs.trade_receivables * 0.28,
    sixty_to_90: bs.trade_receivables * 0.18,
    ninety_to_180: bs.trade_receivables * 0.12,
    above_180: bs.trade_receivables * 0.07,
  };

  const ageingData = [
    { name: "0–30 days", value: ageing.zero_to_30, color: "#22c55e" },
    { name: "31–60 days", value: ageing.thirty_to_60, color: "#eab308" },
    { name: "61–90 days", value: ageing.sixty_to_90, color: "#f97316" },
    { name: "91–180 days", value: ageing.ninety_to_180, color: "#ef4444" },
    { name: "180+ days", value: ageing.above_180, color: "#9F1239" },
  ];

  const overdueTotal = ageing.sixty_to_90 + ageing.ninety_to_180 + ageing.above_180;
  const overdeuePct = bs.trade_receivables > 0 ? overdueTotal / bs.trade_receivables * 100 : 0;
  const msmRisk = data.msme_receivables > 0 && (ratios.dso ?? 0) > 45;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: "var(--accent-light)" }}>
          <ArrowDownLeft className="w-5 h-5" style={{ color: "var(--accent)" }} />
        </div>
        <div>
          <h1 className="page-title">Receivables & Debtors</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Collection performance and debtor quality — FY {data.financial_year}
          </p>
        </div>
      </div>

      {/* Alerts */}
      {(ratios.dso ?? 0) > 90 && (
        <div className="mb-6 flex items-start gap-3 p-4 rounded-lg border"
          style={{ background: "#FFF1F2", borderColor: "#FECDD3" }}>
          <AlertTriangle className="w-4 h-4 mt-0.5" style={{ color: "#9F1239" }} />
          <div>
            <p className="text-sm font-medium" style={{ color: "#9F1239" }}>
              DSO at {formatDays(ratios.dso)} — Collections require urgent attention
            </p>
            <p className="text-xs mt-1" style={{ color: "#9F1239" }}>
              Industry ideal is &lt;60 days. Customers are taking {formatDays(ratios.dso)} on average to pay — significant working capital is trapped.
            </p>
          </div>
        </div>
      )}

      {msmRisk && (
        <div className="mb-6 flex items-start gap-3 p-4 rounded-lg border"
          style={{ background: "#FEFCE8", borderColor: "#FEF08A" }}>
          <AlertTriangle className="w-4 h-4 mt-0.5" style={{ color: "#854D0E" }} />
          <p className="text-sm font-medium" style={{ color: "#854D0E" }}>
            MSME Alert: Receivables from MSME customers — If DSO exceeds 45 days, they may be entitled to interest under MSME Act Section 15
          </p>
        </div>
      )}

      {/* Key metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard label="Total Trade Receivables" value={formatINR(bs.trade_receivables)} statusColor={(ratios.dso ?? 0) < 60 ? "green" : "orange"} />
        <MetricCard label="DSO" value={formatDays(ratios.dso)} tooltip={TOOLTIPS.dso} statusColor={(ratios.dso ?? 0) < 60 ? "green" : (ratios.dso ?? 0) < 90 ? "yellow" : "red"} healthyRange="<60 days (services); <45 days (MSME goods)" />
        <MetricCard label="Debtors Turnover" value={`${(ratios.inventory_turnover ?? 0).toFixed(1)}x`} subtext="Revenue ÷ Avg Receivables" />
        <MetricCard label="Debtors as % of Revenue" value={formatPct(bs.trade_receivables / rev * 100, 0)} statusColor={bs.trade_receivables / rev < 0.25 ? "green" : "orange"} healthyRange="<25% of annual revenue" />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <MetricCard label="TDS / Advance Tax Receivable" value={formatINR(bs.tds_advance_tax_receivable)} subtext="Can be set off against tax payable" />
        <MetricCard label="GST ITC Receivable" value={formatINR(bs.gst_itc_receivable)} statusColor={bs.gst_itc_receivable / rev * 12 > 3 ? "yellow" : "green"} subtext={bs.gst_itc_receivable > 0 ? `${(bs.gst_itc_receivable / (rev / 12)).toFixed(1)} months of purchases` : "—"} />
        <MetricCard label="Overdue Receivables (60+ days)" value={formatINR(overdueTotal)} statusColor={overdeuePct < 15 ? "green" : overdeuePct < 30 ? "yellow" : "red"} subtext={`${overdeuePct.toFixed(0)}% of total receivables`} />
      </div>

      {/* Ageing chart */}
      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-xl border p-5 shadow-card"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <h3 className="section-heading mb-4">Debtor Ageing Buckets</h3>
          <BarChartWrapper
            data={ageingData.map((d) => ({ name: d.name, Amount: d.value }))}
            bars={[{ key: "Amount", color: "#3D5A80" }]}
            height={250}
          />
        </div>

        <div className="rounded-xl border p-5 shadow-card"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <h3 className="section-heading mb-4">Ageing Breakdown</h3>
          <div className="space-y-4 mt-2">
            {ageingData.map(({ name, value, color }, i) => {
              const pct = bs.trade_receivables > 0 ? value / bs.trade_receivables * 100 : 0;
              return (
                <div key={name}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: color }} />
                      <span style={{ color: "var(--text-secondary)" }}>{name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold metric-value" style={{ color: "var(--text-primary)" }}>
                        {formatINR(value)}
                      </span>
                      <span className="text-xs w-10 text-right" style={{ color: "var(--text-muted)" }}>
                        {pct.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "var(--bg-subtle)" }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Indian compliance note */}
          <div className="mt-6 p-3 rounded-lg text-xs"
            style={{ background: "var(--bg-subtle)", color: "var(--text-muted)" }}>
            <p className="font-medium mb-1" style={{ color: "var(--text-secondary)" }}>🇮🇳 Indian Context</p>
            <p>• 180+ day receivables may need GST ITC reversal on write-off</p>
            <p>• MSME debtors must be collected within 45 days — after that, you may owe them interest</p>
            <p>• Related party debtors require separate disclosure under Companies Act Sec 188</p>
          </div>
        </div>
      </div>
    </div>
  );
}
