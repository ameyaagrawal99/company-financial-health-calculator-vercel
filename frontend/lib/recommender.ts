import type { FinancialData, FinancialRatios, Recommendation } from "./types";
import { derivePL, deriveBS } from "./calculator";

export function generateRecommendations(
  data: FinancialData,
  ratios: FinancialRatios,
  prevRatios?: FinancialRatios | null
): Recommendation[] {
  const recs: Recommendation[] = [];
  const bs = data.balance_sheet;
  const pl = data.profit_loss;
  const p = derivePL(pl);
  const d = deriveBS(bs);
  const rev = pl.revenue_from_operations;

  // ── HIGH PRIORITY ──────────────────────────────────────────────
  if (bs.pf_esi_payable > 0) {
    recs.push({
      priority: "HIGH",
      category: "Compliance",
      title: `PF/ESI Payable Outstanding — ₹${bs.pf_esi_payable.toFixed(1)}L`,
      description:
        "Directors face personal criminal liability under EPF/ESIC Acts for payment defaults. This is non-negotiable — deposit immediately via EPFO/ESIC portal.",
      impact: "Avoid criminal prosecution and compounding interest",
      action: "Deposit via EPFO portal before next salary cycle",
    });
  }

  if (bs.tds_payable > 0) {
    recs.push({
      priority: "HIGH",
      category: "Compliance",
      title: `TDS Payable Outstanding — ₹${bs.tds_payable.toFixed(1)}L`,
      description:
        "TDS deducted but not deposited attracts 1.5% interest per month under Section 201 of the Income Tax Act, plus potential prosecution of TAN holders.",
      impact: "Stop 1.5%/month interest accrual",
      action: "Deposit via NSDL challan ITNS 281 before 7th of next month",
    });
  }

  if (ratios.dscr !== undefined && ratios.dscr < 1.0) {
    recs.push({
      priority: "HIGH",
      category: "Debt",
      title: `DSCR at ${ratios.dscr.toFixed(2)}x — NPA Risk`,
      description:
        "DSCR below 1.0x means operating cash flow cannot cover debt obligations. Under RBI classification, your account may be heading toward NPA status. Seek loan restructuring immediately.",
      impact: "Prevent NPA classification and facility recall",
      action: "Approach your bank for restructuring or moratorium under RBI MSME schemes",
    });
  } else if (ratios.dscr !== undefined && ratios.dscr < 1.25) {
    recs.push({
      priority: "HIGH",
      category: "Debt",
      title: `DSCR Below RBI Minimum — ${ratios.dscr.toFixed(2)}x`,
      description:
        "RBI requires DSCR ≥ 1.25x for Standard Asset classification. Your current DSCR puts the account in Sub-Standard territory. A 90-day overdue will trigger NPA.",
      impact: "Prevent NPA classification",
      action: "Accelerate collections; defer non-critical expenditure",
    });
  }

  if (ratios.working_capital !== undefined && ratios.working_capital < 0) {
    recs.push({
      priority: "HIGH",
      category: "Liquidity",
      title: `Negative Working Capital — ₹${Math.abs(ratios.working_capital).toFixed(1)}L Shortfall`,
      description:
        "Current liabilities exceed current assets. The company technically cannot meet short-term obligations from current assets alone. Payment defaults are imminent.",
      impact: "Prevent vendor payment defaults and bounced cheques",
      action: "Convert long-term debt to short-term; accelerate debtor collections immediately",
    });
  }

  if (ratios.current_ratio !== undefined && ratios.current_ratio < 1.0) {
    recs.push({
      priority: "HIGH",
      category: "Liquidity",
      title: `Critical Current Ratio — ${ratios.current_ratio.toFixed(2)}x`,
      description:
        "Current ratio below 1.0x indicates a short-term solvency crisis. For every ₹1 of current dues, you have less than ₹1 in current assets.",
      impact: "Prevent immediate payment defaults",
      action: "Negotiate extended credit from suppliers; bring in short-term equity",
    });
  }

  if (ratios.debt_to_equity !== undefined && ratios.debt_to_equity > 3.0) {
    recs.push({
      priority: "HIGH",
      category: "Debt",
      title: `IBC Risk — D/E Ratio at ${ratios.debt_to_equity.toFixed(2)}x`,
      description:
        "If any creditor has a default of ₹1 Crore or more, they can initiate Corporate Insolvency Resolution Process (CIRP) under the Insolvency & Bankruptcy Code. D/E above 3x is a serious red flag.",
      impact: "Prevent loss of management control under IBC",
      action: "Raise equity capital or convert promoter loans to equity immediately",
    });
  }

  if (ratios.dso !== undefined && ratios.dso > 120) {
    recs.push({
      priority: "HIGH",
      category: "Receivables",
      title: `Very High DSO — ${ratios.dso.toFixed(0)} Days`,
      description:
        "Debtors outstanding for more than 120 days are likely to become bad debts. This also means 4+ months of revenue is trapped with customers.",
      impact: "Release working capital and reduce bad debt write-offs",
      action: "Issue legal notices to 90+ day overdue customers; engage collection agency; consider invoice discounting",
    });
  }

  if (rev > 0 && pl.finance_costs / rev > 0.08) {
    recs.push({
      priority: "HIGH",
      category: "Debt",
      title: `Finance Costs Very High — ${((pl.finance_costs / rev) * 100).toFixed(1)}% of Revenue`,
      description:
        `Finance costs consuming ${((pl.finance_costs / rev) * 100).toFixed(1)}% of revenue (healthy: <5%). This severely compresses net margins.`,
      impact: "Improve net margin by 2–4 percentage points",
      action: "Refinance high-cost loans; prepay CC/OD with surplus cash; explore MSME Samadhaan loan schemes",
    });
  }

  // ── MEDIUM PRIORITY ────────────────────────────────────────────
  if (ratios.dso !== undefined && ratios.dso > 60 && ratios.dso <= 120) {
    recs.push({
      priority: "MEDIUM",
      category: "Receivables",
      title: `DSO at ${ratios.dso.toFixed(0)} Days — Above Ideal`,
      description:
        "Industry ideal for Indian SMEs is <60 days. Introduce early payment discounts (2/15 net 45) to incentivise faster payments and reduce CC/OD utilisation.",
      impact: "Release working capital; reduce interest on CC",
      action: "Offer 1–2% discount for payment within 15 days",
    });
  }

  if (ratios.ccc !== undefined && ratios.ccc > 90) {
    recs.push({
      priority: "MEDIUM",
      category: "Efficiency",
      title: `Cash Conversion Cycle Too Long — ${ratios.ccc.toFixed(0)} Days`,
      description:
        `CCC of ${ratios.ccc.toFixed(0)} days means it takes ${(ratios.ccc / 30).toFixed(1)} months to convert inventory investment back into cash. High working capital requirement increases debt.`,
      impact: "Reduce CC/OD dependency",
      action: "Reduce inventory holding; negotiate better supplier payment terms (longer DPO)",
    });
  }

  if (ratios.dio !== undefined && ratios.dio > 90) {
    recs.push({
      priority: "MEDIUM",
      category: "Efficiency",
      title: `High Inventory Days — ${ratios.dio.toFixed(0)} Days`,
      description:
        "Inventory held for more than 3 months before sale indicates overstock or slow-moving products. This locks working capital and increases storage and obsolescence costs.",
      impact: "Release cash locked in inventory",
      action: "Identify slow-moving SKUs; implement JIT ordering; run clearance sales",
    });
  }

  if (rev > 0 && pl.employee_expenses / rev > 0.3) {
    recs.push({
      priority: "MEDIUM",
      category: "Expenses",
      title: `Labour Costs High — ${((pl.employee_expenses / rev) * 100).toFixed(1)}% of Revenue`,
      description:
        `Labour costs at ${((pl.employee_expenses / rev) * 100).toFixed(1)}% of revenue (threshold: 30%). Review staffing productivity and explore automation.`,
      impact: "Improve EBITDA margin by 3–5 percentage points",
      action: "Productivity analysis; explore automation ROI; review contract workforce",
    });
  }

  if (rev > 0 && bs.gst_itc_receivable > (rev / 12) * 3) {
    recs.push({
      priority: "MEDIUM",
      category: "Compliance",
      title: `GST ITC Blocked — ${bs.gst_itc_receivable.toFixed(1)}L`,
      description: `More than 3 months of GST Input Tax Credit is blocked (₹${bs.gst_itc_receivable.toFixed(1)}L). This is locked working capital with the government.`,
      impact: `Release ₹${bs.gst_itc_receivable.toFixed(1)}L of cash`,
      action: "Reconcile GSTR-2A vs purchase register; utilise ITC against pending GST liability; file GSTR-3B accurately",
    });
  }

  if (prevRatios && ratios.net_margin !== undefined && prevRatios.net_margin !== undefined) {
    const drop = prevRatios.net_margin - ratios.net_margin;
    if (drop > 1.5) {
      recs.push({
        priority: "MEDIUM",
        category: "Profitability",
        title: `Net Margin Declining — Down ${drop.toFixed(1)}pp`,
        description: `Net margin fell from ${prevRatios.net_margin.toFixed(1)}% to ${ratios.net_margin.toFixed(1)}%. Review whether this is input cost pressure, labour, or finance cost driven.`,
        impact: "Restore profitability",
        action: "Cost reduction task force; review pricing for key products",
      });
    }
  }

  if (ratios.interest_coverage !== undefined && ratios.interest_coverage > 1.5 && ratios.interest_coverage < 3.0) {
    recs.push({
      priority: "MEDIUM",
      category: "Debt",
      title: `Interest Coverage Thin — ${ratios.interest_coverage.toFixed(2)}x`,
      description:
        "ICR between 1.5x and 3.0x is thin. A revenue dip of even 20–25% would make interest coverage dangerous.",
      impact: "Buffer against revenue volatility",
      action: "Consider fixed-rate refinancing to reduce interest rate risk",
    });
  }

  if (data.msme_payables > 0) {
    recs.push({
      priority: "MEDIUM",
      category: "Compliance",
      title: `MSME Payables — ₹${data.msme_payables.toFixed(1)}L`,
      description:
        "Under MSME Act Section 15, payment to MSME suppliers must be made within 45 days of acceptance. Overdue attracts compound interest at 3× bank rate. Disclosure mandatory in MCA filing.",
      impact: "Avoid mandatory interest payment to MSME suppliers",
      action: "Prioritise MSME supplier payments; file Form MSME-1 if overdue",
    });
  }

  if (data.promoter_loans > 0 && data.promoter_loans > (bs.long_term_borrowings + bs.short_term_borrowings) * 0.2) {
    recs.push({
      priority: "MEDIUM",
      category: "Debt",
      title: `High Promoter Loans — ₹${data.promoter_loans.toFixed(1)}L`,
      description:
        "Promoter/director loans exceeding 20% of total debt are scrutinised by banks and investors. Ensure proper documentation, board resolution, and RBI compliance for unsecured loans.",
      impact: "Improve creditworthiness and governance",
      action: "Convert promoter loans to equity; ensure proper documentation under Companies Act Sec 185/186",
    });
  }

  // ── POSITIVE REINFORCEMENT ─────────────────────────────────────
  if (ratios.debt_to_equity !== undefined && ratios.debt_to_equity <= 0.5) {
    recs.push({
      priority: "POSITIVE",
      category: "Debt",
      title: `Excellent Leverage — D/E at ${ratios.debt_to_equity.toFixed(2)}x`,
      description:
        "D/E well below 1x shows strong financial discipline. The company has significant headroom to raise debt for growth if needed.",
      action: "Consider leveraged growth — project-linked debt with clear ROI",
    });
  }

  if (prevRatios?.debt_to_equity && ratios.debt_to_equity !== undefined) {
    const improvement = prevRatios.debt_to_equity - ratios.debt_to_equity;
    if (improvement > 0.2) {
      recs.push({
        priority: "POSITIVE",
        category: "Debt",
        title: `Deleveraging on Track — D/E Improved ${improvement.toFixed(2)}x`,
        description: `D/E improved from ${prevRatios.debt_to_equity.toFixed(2)}x to ${ratios.debt_to_equity.toFixed(2)}x. Debt reduction strategy is working well.`,
        action: "Continue debt repayment from operating cash flow",
      });
    }
  }

  if (ratios.current_ratio !== undefined && ratios.current_ratio >= 1.5 && ratios.current_ratio <= 2.5) {
    recs.push({
      priority: "POSITIVE",
      category: "Liquidity",
      title: `Healthy Liquidity — Current Ratio ${ratios.current_ratio.toFixed(2)}x`,
      description:
        "Current ratio in the ideal 1.5–2.5x range indicates good short-term solvency. The business can comfortably meet near-term obligations.",
      action: "Maintain working capital discipline; avoid over-stocking",
    });
  }

  if (ratios.dscr !== undefined && ratios.dscr >= 1.5) {
    recs.push({
      priority: "POSITIVE",
      category: "Debt",
      title: `Comfortable Debt Coverage — DSCR ${ratios.dscr.toFixed(2)}x`,
      description:
        `DSCR of ${ratios.dscr.toFixed(2)}x comfortably exceeds the RBI minimum of 1.25x. Loan accounts are in Standard Asset classification.`,
      action: "Maintain by protecting EBITDA margins and timely EMI payments",
    });
  }

  if (prevRatios?.revenue_from_operations && pl.revenue_from_operations > prevRatios.revenue_from_operations) {
    const growth = ((pl.revenue_from_operations - prevRatios.revenue_from_operations) / prevRatios.revenue_from_operations) * 100;
    if (growth > 10) {
      recs.push({
        priority: "POSITIVE",
        category: "Profitability",
        title: `Strong Revenue Growth — ${growth.toFixed(1)}%`,
        description: `Revenue grew ${growth.toFixed(1)}% year-over-year — strong top-line momentum. Focus on protecting margins while growing.`,
        action: "Now focus on operational leverage to improve margins alongside revenue growth",
      });
    }
  }

  // Sort: HIGH → MEDIUM → POSITIVE
  const order = { HIGH: 0, MEDIUM: 1, POSITIVE: 2 };
  return recs.sort((a, b) => order[a.priority] - order[b.priority]);
}
