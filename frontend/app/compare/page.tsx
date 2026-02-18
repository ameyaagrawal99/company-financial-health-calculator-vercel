"use client";
import { useAppStore } from "@/lib/store";
import { formatINR, formatPct, formatRatio, formatDays } from "@/lib/formatters";
import { GitCompare, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface CompareRow {
  label: string;
  category: string;
  current: number | null | undefined;
  previous: number | null | undefined;
  format: "inr" | "pct" | "ratio" | "days" | "number";
  lowerIsBetter?: boolean;
  unit?: string;
}

function fmt(value: number | null | undefined, format: CompareRow["format"]): string {
  if (value == null) return "—";
  switch (format) {
    case "inr": return formatINR(value);
    case "pct": return formatPct(value);
    case "ratio": return formatRatio(value);
    case "days": return formatDays(value);
    case "number": return value.toFixed(1);
    default: return String(value);
  }
}

function DeltaBadge({ current, previous, lowerIsBetter }: { current: number | null | undefined; previous: number | null | undefined; lowerIsBetter?: boolean }) {
  if (current == null || previous == null) return <span style={{ color: "var(--text-muted)" }}>—</span>;
  const delta = current - previous;
  const pctChange = previous !== 0 ? (delta / Math.abs(previous)) * 100 : 0;
  if (Math.abs(delta) < 0.001) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded"
        style={{ background: "var(--bg-subtle)", color: "var(--text-muted)" }}>
        <Minus className="w-3 h-3" /> Flat
      </span>
    );
  }
  const isImproved = lowerIsBetter ? delta < 0 : delta > 0;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded"
      style={{
        background: isImproved ? "#F0FDF4" : "#FFF1F2",
        color: isImproved ? "#166534" : "#9F1239",
      }}>
      {isImproved ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {pctChange > 0 ? "+" : ""}{pctChange.toFixed(1)}%
    </span>
  );
}

const CATEGORIES = [
  "Revenue & Profitability",
  "Liquidity",
  "Leverage & Solvency",
  "Efficiency",
  "Cash Flow",
];

export default function ComparePage() {
  const { analysis } = useAppStore();
  if (!analysis) return null;

  const { data, ratios, prev_ratios, derived } = analysis;
  const pr = prev_ratios;

  if (!pr) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "var(--accent-light)" }}>
            <GitCompare className="w-5 h-5" style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <h1 className="page-title">Year-over-Year Comparison</h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Compare current year metrics against previous year
            </p>
          </div>
        </div>
        <div className="rounded-xl border p-8 text-center shadow-card"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <GitCompare className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--text-muted)" }} />
          <p className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>No Previous Year Data</p>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Upload a document that contains two years of financial data (e.g., a comparative balance sheet or P&L for FY {data.financial_year} and the previous year) to enable year-over-year comparison.
          </p>
        </div>
      </div>
    );
  }

  const rows: CompareRow[] = [
    // Revenue & Profitability
    { label: "Revenue from Operations", category: "Revenue & Profitability", current: data.profit_loss.revenue_from_operations, previous: data.previous_year_profit_loss?.revenue_from_operations, format: "inr" },
    { label: "Gross Profit Margin", category: "Revenue & Profitability", current: ratios.gross_margin, previous: pr.gross_margin, format: "pct" },
    { label: "EBITDA Margin", category: "Revenue & Profitability", current: ratios.ebitda_margin, previous: pr.ebitda_margin, format: "pct" },
    { label: "Net Profit Margin", category: "Revenue & Profitability", current: ratios.net_margin, previous: pr.net_margin, format: "pct" },
    { label: "Return on Equity (ROE)", category: "Revenue & Profitability", current: ratios.roe, previous: pr.roe, format: "pct" },
    { label: "Return on Assets (ROA)", category: "Revenue & Profitability", current: ratios.roa, previous: pr.roa, format: "pct" },
    { label: "ROCE", category: "Revenue & Profitability", current: ratios.roce, previous: pr.roce, format: "pct" },
    // Liquidity
    { label: "Current Ratio", category: "Liquidity", current: ratios.current_ratio, previous: pr.current_ratio, format: "ratio" },
    { label: "Quick Ratio", category: "Liquidity", current: ratios.quick_ratio, previous: pr.quick_ratio, format: "ratio" },
    { label: "Cash Ratio", category: "Liquidity", current: ratios.cash_ratio, previous: pr.cash_ratio, format: "ratio" },
    { label: "Net Working Capital", category: "Liquidity", current: ratios.working_capital, previous: pr.working_capital, format: "inr" },
    // Leverage & Solvency
    { label: "Debt-to-Equity Ratio", category: "Leverage & Solvency", current: ratios.debt_to_equity, previous: pr.debt_to_equity, format: "ratio", lowerIsBetter: true },
    { label: "Debt Ratio", category: "Leverage & Solvency", current: ratios.debt_ratio, previous: pr.debt_ratio, format: "ratio", lowerIsBetter: true },
    { label: "Interest Coverage (ICR)", category: "Leverage & Solvency", current: ratios.interest_coverage, previous: pr.interest_coverage, format: "ratio" },
    { label: "DSCR", category: "Leverage & Solvency", current: ratios.dscr, previous: pr.dscr, format: "ratio" },
    { label: "Net Debt / EBITDA", category: "Leverage & Solvency", current: ratios.net_debt_to_ebitda, previous: pr.net_debt_to_ebitda, format: "ratio", lowerIsBetter: true },
    // Efficiency
    { label: "Days Sales Outstanding (DSO)", category: "Efficiency", current: ratios.dso, previous: pr.dso, format: "days", lowerIsBetter: true },
    { label: "Days Inventory Outstanding (DIO)", category: "Efficiency", current: ratios.dio, previous: pr.dio, format: "days", lowerIsBetter: true },
    { label: "Days Payable Outstanding (DPO)", category: "Efficiency", current: ratios.dpo, previous: pr.dpo, format: "days" },
    { label: "Cash Conversion Cycle (CCC)", category: "Efficiency", current: ratios.ccc, previous: pr.ccc, format: "days", lowerIsBetter: true },
    { label: "Asset Turnover", category: "Efficiency", current: ratios.asset_turnover, previous: pr.asset_turnover, format: "ratio" },
    { label: "Inventory Turnover", category: "Efficiency", current: ratios.inventory_turnover, previous: pr.inventory_turnover, format: "ratio" },
    // Cash Flow
    { label: "Operating Cash Flow (OCF)", category: "Cash Flow", current: ratios.ocf, previous: pr.ocf, format: "inr" },
    { label: "Free Cash Flow (FCF)", category: "Cash Flow", current: ratios.fcf, previous: pr.fcf, format: "inr" },
    { label: "OCF Margin", category: "Cash Flow", current: ratios.ocf_margin, previous: pr.ocf_margin, format: "pct" },
  ];

  // Generate narrative
  const improvements: string[] = [];
  const deteriorations: string[] = [];
  rows.forEach(({ label, current, previous, lowerIsBetter }) => {
    if (current == null || previous == null || previous === 0) return;
    const delta = current - previous;
    const isImproved = lowerIsBetter ? delta < 0 : delta > 0;
    const pct = Math.abs(delta / Math.abs(previous)) * 100;
    if (pct < 2) return; // skip tiny changes
    if (isImproved) improvements.push(`${label} improved by ${pct.toFixed(1)}%`);
    else deteriorations.push(`${label} deteriorated by ${pct.toFixed(1)}%`);
  });

  const fyPrev = data.previous_financial_year || `FY ${(parseInt(data.financial_year.replace("FY ", "")) - 1).toString()}`;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: "var(--accent-light)" }}>
          <GitCompare className="w-5 h-5" style={{ color: "var(--accent)" }} />
        </div>
        <div>
          <h1 className="page-title">Year-over-Year Comparison</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {fyPrev} vs FY {data.financial_year} — financial performance delta
          </p>
        </div>
      </div>

      {/* Narrative Summary */}
      {(improvements.length > 0 || deteriorations.length > 0) && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {improvements.length > 0 && (
            <div className="rounded-xl border p-4 shadow-card" style={{ background: "#F0FDF4", borderColor: "#BBF7D0" }}>
              <p className="text-sm font-semibold mb-2" style={{ color: "#166534" }}>
                <TrendingUp className="w-4 h-4 inline mr-1" />
                {improvements.length} Metric{improvements.length > 1 ? "s" : ""} Improved
              </p>
              <ul className="space-y-1">
                {improvements.slice(0, 5).map((s) => (
                  <li key={s} className="text-xs" style={{ color: "#166534" }}>• {s}</li>
                ))}
                {improvements.length > 5 && (
                  <li className="text-xs" style={{ color: "#166534" }}>• …and {improvements.length - 5} more</li>
                )}
              </ul>
            </div>
          )}
          {deteriorations.length > 0 && (
            <div className="rounded-xl border p-4 shadow-card" style={{ background: "#FFF1F2", borderColor: "#FECDD3" }}>
              <p className="text-sm font-semibold mb-2" style={{ color: "#9F1239" }}>
                <TrendingDown className="w-4 h-4 inline mr-1" />
                {deteriorations.length} Metric{deteriorations.length > 1 ? "s" : ""} Deteriorated
              </p>
              <ul className="space-y-1">
                {deteriorations.slice(0, 5).map((s) => (
                  <li key={s} className="text-xs" style={{ color: "#9F1239" }}>• {s}</li>
                ))}
                {deteriorations.length > 5 && (
                  <li className="text-xs" style={{ color: "#9F1239" }}>• …and {deteriorations.length - 5} more</li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Comparison Table by Category */}
      {CATEGORIES.map((cat) => {
        const catRows = rows.filter((r) => r.category === cat);
        return (
          <div key={cat} className="rounded-xl border shadow-card overflow-hidden mb-4"
            style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
            {/* Category header */}
            <div className="px-5 py-3 border-b" style={{ background: "var(--bg-subtle)", borderColor: "var(--border)" }}>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{cat}</p>
            </div>
            {/* Column headers */}
            <div className="grid grid-cols-4 px-5 py-2 text-xs font-semibold border-b"
              style={{ color: "var(--text-muted)", borderColor: "var(--border)" }}>
              <span>Metric</span>
              <span className="text-right">{fyPrev}</span>
              <span className="text-right">FY {data.financial_year}</span>
              <span className="text-right">Change</span>
            </div>
            {catRows.map((row, i) => (
              <div key={row.label}
                className={`grid grid-cols-4 px-5 py-3 ${i > 0 ? "border-t" : ""}`}
                style={{ borderColor: "var(--border)" }}>
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{row.label}</span>
                <span className="text-sm text-right" style={{ color: "var(--text-muted)" }}>
                  {fmt(row.previous, row.format)}
                </span>
                <span className="text-sm font-semibold text-right metric-value" style={{ color: "var(--text-primary)" }}>
                  {fmt(row.current, row.format)}
                </span>
                <span className="text-right">
                  <DeltaBadge current={row.current} previous={row.previous} lowerIsBetter={row.lowerIsBetter} />
                </span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
