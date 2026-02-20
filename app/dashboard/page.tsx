"use client";
import { useAppStore } from "@/lib/store";
import { HealthScoreWidget } from "@/components/health-score/HealthScoreWidget";
import { KPIStrip } from "@/components/dashboard/KPIStrip";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { formatINR, formatPct, formatRatio, formatDays } from "@/lib/formatters";
import {
  TrendingUp, Receipt, Banknote, ArrowDownLeft, ArrowUpRight,
  Landmark, Droplets, Gauge, ShieldCheck,
} from "lucide-react";

export default function DashboardPage() {
  const { analysis } = useAppStore();
  if (!analysis) return null;

  const { data, derived, ratios, health_score, compliance } = analysis;
  const bs = data.balance_sheet;
  const pl = data.profit_loss;

  // Compliance alert count
  const criticalCount = Object.values(compliance).filter((v) => v === "CRITICAL").length;
  const warningCount = Object.values(compliance).filter((v) => v === "WARNING").length;

  const alert = (condition: boolean, msg: string) => (condition ? msg : undefined);

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title mb-1">Financial Health Overview</h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {data.company_name} — FY {data.financial_year}
          {data.data_confidence && (
            <span className="ml-2 text-xs px-2 py-0.5 rounded"
              style={{ background: "var(--bg-subtle)", color: "var(--text-muted)" }}>
              AI Confidence: {data.data_confidence}
            </span>
          )}
        </p>
      </div>

      {/* KPI Strip */}
      <KPIStrip analysis={analysis} />

      {/* Main grid: Health Score + Section Cards */}
      <div className="grid grid-cols-12 gap-4">
        {/* Health Score */}
        <div className="col-span-4">
          <HealthScoreWidget score={health_score} />
        </div>

        {/* Top 3 section cards */}
        <div className="col-span-8 grid grid-cols-3 gap-4">
          <SectionCard
            href="/dashboard/income"
            icon={TrendingUp}
            title="Income & Profitability"
            heroValue={formatINR(pl.revenue_from_operations)}
            heroLabel="Revenue from Operations"
            metrics={[
              { label: "Gross Margin", value: formatPct(ratios.gross_margin), color: ratios.gross_margin && ratios.gross_margin >= 25 ? "green" : "orange" },
              { label: "Net Margin", value: formatPct(ratios.net_margin), color: ratios.net_margin && ratios.net_margin >= 8 ? "green" : ratios.net_margin && ratios.net_margin >= 3 ? "yellow" : "red" },
              { label: "EBITDA Margin", value: formatPct(ratios.ebitda_margin), color: ratios.ebitda_margin && ratios.ebitda_margin >= 12 ? "green" : "yellow" },
            ]}
          />
          <SectionCard
            href="/dashboard/expenses"
            icon={Receipt}
            title="Expenditure Analysis"
            heroValue={formatINR(pl.cogs + pl.employee_expenses + pl.other_expenses)}
            heroLabel="Total Operating Expenses"
            metrics={[
              { label: "COGS", value: formatINR(pl.cogs) },
              { label: "Employee Costs", value: formatINR(pl.employee_expenses), color: pl.employee_expenses / pl.revenue_from_operations > 0.3 ? "orange" : "green" },
              { label: "Finance Costs", value: formatINR(pl.finance_costs), color: pl.finance_costs / pl.revenue_from_operations > 0.05 ? "orange" : "green" },
            ]}
            alert={pl.employee_expenses / pl.revenue_from_operations > 0.3 ? `Labour ${formatPct(pl.employee_expenses / pl.revenue_from_operations * 100)} of revenue` : undefined}
          />
          <SectionCard
            href="/dashboard/cashflow"
            icon={Banknote}
            title="Cash Flow"
            heroValue={formatINR(data.cash_flow.operating_cf)}
            heroLabel="Operating Cash Flow"
            metrics={[
              { label: "Free Cash Flow", value: formatINR(ratios.fcf), color: (ratios.fcf ?? 0) >= 0 ? "green" : "red" },
              { label: "OCF Margin", value: formatPct(ratios.ocf_margin), color: (ratios.ocf_margin ?? 0) >= 8 ? "green" : "yellow" },
              { label: "Cash Conversion", value: formatRatio(ratios.cash_conversion_ratio) },
            ]}
          />
        </div>

        {/* Row 2 */}
        <div className="col-span-12 grid grid-cols-3 gap-4">
          <SectionCard
            href="/dashboard/receivables"
            icon={ArrowDownLeft}
            title="Receivables & Debtors"
            heroValue={formatINR(bs.trade_receivables)}
            heroLabel="Total Trade Receivables"
            metrics={[
              { label: "DSO", value: formatDays(ratios.dso), color: (ratios.dso ?? 0) < 60 ? "green" : (ratios.dso ?? 0) < 90 ? "yellow" : "red" },
              { label: "Debtors / Revenue", value: formatPct(bs.trade_receivables / pl.revenue_from_operations * 100, 0), color: bs.trade_receivables / pl.revenue_from_operations < 0.25 ? "green" : "orange" },
              { label: "TDS Receivable", value: formatINR(bs.tds_advance_tax_receivable) },
            ]}
            alert={alert((ratios.dso ?? 0) > 90, `${formatDays(ratios.dso)} DSO — above 90-day threshold`)}
          />
          <SectionCard
            href="/dashboard/payables"
            icon={ArrowUpRight}
            title="Payables & Creditors"
            heroValue={formatINR(bs.trade_payables)}
            heroLabel="Total Trade Payables"
            metrics={[
              { label: "DPO", value: formatDays(ratios.dpo), color: (ratios.dpo ?? 0) <= 60 ? "green" : "yellow" },
              { label: "GST Payable", value: formatINR(bs.gst_payable), color: bs.gst_payable > 0 ? "orange" : "green" },
              { label: "TDS Payable", value: formatINR(bs.tds_payable), color: bs.tds_payable > 0 ? "red" : "green" },
            ]}
            alert={alert(bs.tds_payable > 0, `TDS Payable ₹${bs.tds_payable.toFixed(1)}L — deposit immediately`)}
          />
          <SectionCard
            href="/dashboard/debt"
            icon={Landmark}
            title="Debt & Loans"
            heroValue={formatINR((ratios.total_debt ?? 0))}
            heroLabel="Total Debt"
            metrics={[
              { label: "D/E Ratio", value: formatRatio(ratios.debt_to_equity), color: (ratios.debt_to_equity ?? 0) < 1 ? "green" : (ratios.debt_to_equity ?? 0) < 2 ? "yellow" : "red" },
              { label: "DSCR", value: formatRatio(ratios.dscr), color: (ratios.dscr ?? 0) >= 1.5 ? "green" : (ratios.dscr ?? 0) >= 1.25 ? "yellow" : "red" },
              { label: "ICR", value: formatRatio(ratios.interest_coverage), color: (ratios.interest_coverage ?? 0) >= 3 ? "green" : (ratios.interest_coverage ?? 0) >= 2 ? "yellow" : "red" },
            ]}
            alert={alert((ratios.dscr ?? 0) < 1.25, `DSCR ${formatRatio(ratios.dscr)} — below RBI minimum`)}
          />
        </div>

        {/* Row 3 */}
        <div className="col-span-12 grid grid-cols-3 gap-4">
          <SectionCard
            href="/dashboard/liquidity"
            icon={Droplets}
            title="Liquidity & Working Capital"
            heroValue={formatINR(ratios.working_capital)}
            heroLabel="Net Working Capital"
            metrics={[
              { label: "Current Ratio", value: formatRatio(ratios.current_ratio), color: (ratios.current_ratio ?? 0) >= 1.5 ? "green" : (ratios.current_ratio ?? 0) >= 1 ? "yellow" : "red" },
              { label: "Quick Ratio", value: formatRatio(ratios.quick_ratio), color: (ratios.quick_ratio ?? 0) >= 1 ? "green" : "orange" },
              { label: "Cash Ratio", value: formatRatio(ratios.cash_ratio), color: (ratios.cash_ratio ?? 0) >= 0.2 ? "green" : "orange" },
            ]}
          />
          <SectionCard
            href="/dashboard/efficiency"
            icon={Gauge}
            title="Efficiency Ratios"
            heroValue={formatDays(ratios.ccc)}
            heroLabel="Cash Conversion Cycle"
            metrics={[
              { label: "Asset Turnover", value: formatRatio(ratios.asset_turnover), color: (ratios.asset_turnover ?? 0) >= 1 ? "green" : "yellow" },
              { label: "Inv. Turnover", value: `${(ratios.inventory_turnover ?? 0).toFixed(1)}x`, color: (ratios.inventory_turnover ?? 0) >= 8 ? "green" : "yellow" },
              { label: "DIO", value: formatDays(ratios.dio), color: (ratios.dio ?? 0) <= 60 ? "green" : "orange" },
            ]}
          />
          <SectionCard
            href="/dashboard/compliance"
            icon={ShieldCheck}
            title="Compliance Health 🇮🇳"
            heroValue={criticalCount > 0 ? `${criticalCount} Critical` : warningCount > 0 ? `${warningCount} Warnings` : "All Clear"}
            heroLabel="Indian statutory compliance"
            metrics={[
              { label: "GST ITC", value: compliance.gst_itc_blocked === "OK" ? "✅ OK" : "⚠ Watch", color: compliance.gst_itc_blocked === "OK" ? "green" : "yellow" },
              { label: "TDS Status", value: compliance.tds_deposited === "OK" ? "✅ OK" : "🔴 Overdue", color: compliance.tds_deposited === "OK" ? "green" : "red" },
              { label: "PF/ESI", value: compliance.pf_esi === "OK" ? "✅ OK" : "🔴 Overdue", color: compliance.pf_esi === "OK" ? "green" : "red" },
            ]}
            alert={alert(criticalCount > 0, `${criticalCount} critical compliance issue${criticalCount > 1 ? "s" : ""} need immediate attention`)}
          />
        </div>
      </div>

      {/* Data notes */}
      {data.notes && (
        <div className="mt-6 p-4 rounded-lg border"
          style={{ background: "var(--bg-subtle)", borderColor: "var(--border)" }}>
          <p className="text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
            AI Analysis Notes
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>{data.notes}</p>
        </div>
      )}
    </div>
  );
}
