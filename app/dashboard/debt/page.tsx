"use client";
import { useAppStore } from "@/lib/store";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DonutChartWrapper } from "@/components/charts/DonutChartWrapper";
import { formatINR, formatPct, formatRatio } from "@/lib/formatters";
import { TOOLTIPS } from "@/lib/tooltip-content";
import { Landmark, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function DebtPage() {
  const { analysis } = useAppStore();
  if (!analysis) return null;

  const { data, derived, ratios } = analysis;
  const bs = data.balance_sheet;
  const pl = data.profit_loss;

  const totalDebt = bs.long_term_borrowings + bs.short_term_borrowings;
  const debtMix = [
    { name: "Long-term Borrowings", value: bs.long_term_borrowings, color: "#3D5A80" },
    { name: "Short-term Borrowings (CC/OD)", value: bs.short_term_borrowings, color: "#98C1D9" },
    { name: "Promoter Loans", value: data.promoter_loans, color: "#8B7BB5" },
  ].filter((d) => d.value > 0);

  // NPA risk assessment
  const npaRisk =
    (ratios.dscr ?? 0) < 1.0 ? "Loss/Doubtful" :
    (ratios.dscr ?? 0) < 1.25 ? "Sub-Standard" :
    "Standard";

  const npaColor = npaRisk === "Standard" ? "#166534" : npaRisk === "Sub-Standard" ? "#854D0E" : "#9F1239";
  const npaBg = npaRisk === "Standard" ? "#F0FDF4" : npaRisk === "Sub-Standard" ? "#FEFCE8" : "#FFF1F2";

  // IBC risk
  const ibcRisk = derived.total_equity < 0 || (ratios.debt_to_equity ?? 0) > 3;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: "var(--accent-light)" }}>
          <Landmark className="w-5 h-5" style={{ color: "var(--accent)" }} />
        </div>
        <div>
          <h1 className="page-title">Debt & Loans</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Debt structure, coverage ratios, and NPA risk — FY {data.financial_year}
          </p>
        </div>
      </div>

      {/* IBC Risk Alert */}
      {ibcRisk && (
        <div className="mb-6 flex items-start gap-3 p-4 rounded-lg border"
          style={{ background: "#FFF1F2", borderColor: "#FECDD3" }}>
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#9F1239" }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: "#9F1239" }}>
              IBC Risk Flag — D/E Exceeds 3x
            </p>
            <p className="text-xs mt-1" style={{ color: "#9F1239" }}>
              If any creditor has an unpaid dues of ₹1 Crore or more, they can file CIRP application at NCLT under the Insolvency & Bankruptcy Code. Company management loses control within 14 days of admission.
            </p>
          </div>
        </div>
      )}

      {/* Key metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard label="Total Debt" value={formatINR(totalDebt)} subtext={`LT: ${formatINR(bs.long_term_borrowings)} | ST: ${formatINR(bs.short_term_borrowings)}`} />
        <MetricCard label="Debt-to-Equity" value={formatRatio(ratios.debt_to_equity)} tooltip={TOOLTIPS.debt_to_equity} statusColor={(ratios.debt_to_equity ?? 0) < 1 ? "green" : (ratios.debt_to_equity ?? 0) < 2 ? "yellow" : "red"} healthyRange="<1x conservative; <2x acceptable" />
        <MetricCard label="Debt Ratio" value={ratios.debt_ratio ? `${ratios.debt_ratio.toFixed(2)}` : "—"} tooltip={TOOLTIPS.debt_ratio} subtext="Total Debt ÷ Total Assets" statusColor={(ratios.debt_ratio ?? 0) < 0.5 ? "green" : "orange"} healthyRange="<0.5 preferred" />
        <MetricCard label="Net Debt" value={formatINR(ratios.net_debt)} tooltip={TOOLTIPS.net_debt} statusColor={(ratios.net_debt ?? 0) <= 0 ? "green" : (ratios.net_debt ?? 0) < totalDebt * 0.6 ? "yellow" : "orange"} />
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard label="Interest Coverage (ICR)" value={formatRatio(ratios.interest_coverage)} tooltip={TOOLTIPS.interest_coverage} statusColor={(ratios.interest_coverage ?? 0) >= 3 ? "green" : (ratios.interest_coverage ?? 0) >= 2 ? "yellow" : "red"} healthyRange=">2x minimum; >3x healthy" />
        <MetricCard label="DSCR" value={formatRatio(ratios.dscr)} tooltip={TOOLTIPS.dscr} statusColor={(ratios.dscr ?? 0) >= 1.5 ? "green" : (ratios.dscr ?? 0) >= 1.25 ? "yellow" : "red"} healthyRange=">1.25x (RBI min); >1.5x healthy" />
        <MetricCard label="Net Debt / EBITDA" value={formatRatio(ratios.net_debt_to_ebitda)} tooltip={TOOLTIPS.net_debt_to_ebitda} statusColor={(ratios.net_debt_to_ebitda ?? 0) < 2 ? "green" : (ratios.net_debt_to_ebitda ?? 0) < 3 ? "yellow" : "red"} healthyRange="<2x strong; <3x comfortable" />
        <MetricCard label="Finance Costs" value={formatINR(pl.finance_costs)} subtext={`${formatPct(pl.finance_costs / pl.revenue_from_operations * 100)} of revenue`} statusColor={pl.finance_costs / pl.revenue_from_operations < 0.05 ? "green" : "orange"} />
      </div>

      {/* Charts + NPA */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="rounded-xl border p-5 shadow-card"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <h3 className="section-heading mb-4">Debt Structure</h3>
          {debtMix.length > 0 ? <DonutChartWrapper data={debtMix} height={240} /> : (
            <div className="h-60 flex items-center justify-center text-sm" style={{ color: "var(--text-muted)" }}>No debt data</div>
          )}
        </div>

        {/* NPA Risk Card */}
        <div className="rounded-xl border p-5 shadow-card"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <h3 className="section-heading mb-4">🇮🇳 NPA Risk Assessment (RBI Framework)</h3>
          <div className="space-y-3">
            {[
              { label: "Standard Asset", desc: "DSCR ≥ 1.25x, regular repayment", active: npaRisk === "Standard", color: "#22c55e" },
              { label: "Sub-Standard", desc: "DSCR 1.0–1.25x or 90-day overdue", active: npaRisk === "Sub-Standard", color: "#eab308" },
              { label: "Doubtful", desc: "Sub-Standard for 12+ months", active: npaRisk === "Loss/Doubtful", color: "#ef4444" },
              { label: "Loss", desc: "Uncollectible — to be written off", active: false, color: "#9F1239" },
            ].map(({ label, desc, active, color }) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-lg"
                style={{ background: active ? npaBg : "var(--bg-subtle)", border: active ? `1px solid ${color}30` : "1px solid transparent" }}>
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: active ? color : "#D4D4D4" }} />
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: active ? npaColor : "var(--text-secondary)" }}>{label}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{desc}</p>
                </div>
                {active && <span className="text-xs font-bold" style={{ color: npaColor }}>← Current</span>}
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg text-xs"
            style={{ background: "var(--bg-subtle)", color: "var(--text-muted)" }}>
            <p>DSCR: {formatRatio(ratios.dscr)} | ICR: {formatRatio(ratios.interest_coverage)} | Finance costs: {formatINR(pl.finance_costs)}/yr</p>
          </div>
        </div>
      </div>

      {/* Promoter loans note */}
      {data.promoter_loans > 0 && (
        <div className="p-4 rounded-lg border text-xs"
          style={{ background: "var(--bg-subtle)", borderColor: "var(--border)", color: "var(--text-secondary)" }}>
          <p className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
            🇮🇳 Promoter / Director Loans: {formatINR(data.promoter_loans)}
          </p>
          <p>Unsecured loans from directors/promoters are common in Indian SMEs. Ensure proper board resolution, MCA intimation, and compliance with Companies Act Sections 185/186. Banks and investors scrutinise high promoter loan exposure as it may indicate cash extraction from the company.</p>
        </div>
      )}
    </div>
  );
}
