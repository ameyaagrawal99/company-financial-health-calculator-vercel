"use client";
import { useAppStore } from "@/lib/store";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DonutChartWrapper } from "@/components/charts/DonutChartWrapper";
import { BarChartWrapper } from "@/components/charts/BarChartWrapper";
import { formatINR, formatPct } from "@/lib/formatters";
import { Receipt, AlertTriangle } from "lucide-react";

export default function ExpensesPage() {
  const { analysis } = useAppStore();
  if (!analysis) return null;

  const { data, derived } = analysis;
  const pl = data.profit_loss;
  const revenue = pl.revenue_from_operations;

  const donutData = [
    { name: "COGS / Direct Costs", value: pl.cogs, color: "#3D5A80" },
    { name: "Employee Costs", value: pl.employee_expenses, color: "#98C1D9" },
    { name: "Finance Costs", value: pl.finance_costs, color: "#C17B5A" },
    { name: "Depreciation", value: pl.depreciation, color: "#8B7BB5" },
    { name: "Other Expenses", value: pl.other_expenses, color: "#B5A642" },
    { name: "Tax", value: pl.tax_expense, color: "#A0A0A0" },
  ].filter((d) => d.value > 0);

  const totalExpenses = pl.cogs + pl.employee_expenses + pl.finance_costs + pl.depreciation + pl.other_expenses + pl.tax_expense;

  // As % of revenue
  const expRatioData = [
    { name: "COGS", pct: revenue ? pl.cogs / revenue * 100 : 0 },
    { name: "Employee", pct: revenue ? pl.employee_expenses / revenue * 100 : 0 },
    { name: "Finance", pct: revenue ? pl.finance_costs / revenue * 100 : 0 },
    { name: "Depreciation", pct: revenue ? pl.depreciation / revenue * 100 : 0 },
    { name: "Other", pct: revenue ? pl.other_expenses / revenue * 100 : 0 },
  ];

  const alerts = [
    { condition: revenue > 0 && pl.employee_expenses / revenue > 0.3, msg: `Labour cost ${formatPct(pl.employee_expenses / revenue * 100)} of revenue (threshold: 30%)`, severity: "orange" },
    { condition: revenue > 0 && pl.finance_costs / revenue > 0.05, msg: `Finance costs ${formatPct(pl.finance_costs / revenue * 100)} of revenue (threshold: 5%)`, severity: "red" },
    { condition: revenue > 0 && totalExpenses / revenue > 0.9, msg: `Total expense ratio ${formatPct(totalExpenses / revenue * 100)} — very thin margin`, severity: "red" },
  ].filter((a) => a.condition);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: "var(--accent-light)" }}>
          <Receipt className="w-5 h-5" style={{ color: "var(--accent)" }} />
        </div>
        <div>
          <h1 className="page-title">Expenditure Analysis</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Cost structure and efficiency for FY {data.financial_year}
          </p>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {alerts.map((a, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-lg border"
              style={{ background: a.severity === "red" ? "#FFF1F2" : "#FFF7ED", borderColor: a.severity === "red" ? "#FECDD3" : "#FED7AA" }}>
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: a.severity === "red" ? "#9F1239" : "#9A3412" }} />
              <p className="text-sm font-medium" style={{ color: a.severity === "red" ? "#9F1239" : "#9A3412" }}>{a.msg}</p>
            </div>
          ))}
        </div>
      )}

      {/* Key metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard label="Total Expenses" value={formatINR(totalExpenses)} statusColor={totalExpenses < revenue ? "green" : "red"} />
        <MetricCard label="Expense Ratio" value={formatPct(totalExpenses / revenue * 100)} statusColor={totalExpenses / revenue < 0.85 ? "green" : totalExpenses / revenue < 0.92 ? "yellow" : "red"} subtext="Total exp ÷ Revenue" healthyRange="<85% for healthy margins" />
        <MetricCard label="Labour Ratio" value={formatPct(pl.employee_expenses / revenue * 100)} statusColor={pl.employee_expenses / revenue < 0.3 ? "green" : "orange"} healthyRange="<30% for most sectors" />
        <MetricCard label="Finance Cost Ratio" value={formatPct(pl.finance_costs / revenue * 100)} statusColor={pl.finance_costs / revenue < 0.05 ? "green" : "red"} healthyRange="<5% of revenue" />
      </div>

      {/* Expense breakdown */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <MetricCard label="COGS" value={formatINR(pl.cogs)} subtext={formatPct(pl.cogs / revenue * 100) + " of revenue"} />
        <MetricCard label="Employee Expenses" value={formatINR(pl.employee_expenses)} subtext={formatPct(pl.employee_expenses / revenue * 100) + " of revenue"} statusColor={pl.employee_expenses / revenue > 0.3 ? "orange" : "green"} />
        <MetricCard label="Finance Costs" value={formatINR(pl.finance_costs)} subtext={formatPct(pl.finance_costs / revenue * 100) + " of revenue"} statusColor={pl.finance_costs / revenue > 0.05 ? "red" : "green"} />
        <MetricCard label="Depreciation" value={formatINR(pl.depreciation)} subtext="As per Schedule II" />
        <MetricCard label="Other Expenses" value={formatINR(pl.other_expenses)} subtext={formatPct(pl.other_expenses / revenue * 100) + " of revenue"} />
        <MetricCard label="Tax Expense" value={formatINR(pl.tax_expense)} subtext={`Effective rate: ${formatPct(pl.tax_expense / (pl.tax_expense + derived.pat) * 100)}`} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-xl border p-5 shadow-card"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <h3 className="section-heading mb-4">Expense Mix</h3>
          <DonutChartWrapper data={donutData} height={280} />
        </div>
        <div className="rounded-xl border p-5 shadow-card"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <h3 className="section-heading mb-4">Expense Categories as % of Revenue</h3>
          <BarChartWrapper
            data={expRatioData}
            bars={[{ key: "pct", color: "#3D5A80", label: "% of Revenue" }]}
            height={280}
            yFormatter={(v) => `${v.toFixed(0)}%`}
          />
        </div>
      </div>
    </div>
  );
}
