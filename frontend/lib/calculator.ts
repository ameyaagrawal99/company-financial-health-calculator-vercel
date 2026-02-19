/**
 * Financial ratio calculator — all ratios for Indian SME context.
 * All monetary values assumed to be in Lakhs (₹ Lakhs).
 */
import type {
  BalanceSheet,
  ProfitLoss,
  CashFlow,
  FinancialData,
  FinancialRatios,
  DerivedBS,
  DerivedPL,
} from "./types";

function safeDiv(a: number, b: number | undefined | null): number | undefined {
  if (!b || b === 0) return undefined;
  return a / b;
}

export function deriveBS(bs: BalanceSheet): DerivedBS {
  const total_non_current_assets =
    bs.fixed_assets +
    bs.capital_wip +
    bs.long_term_investments +
    bs.deferred_tax_asset +
    bs.long_term_loans_advances +
    bs.other_non_current_assets;

  const total_current_assets =
    bs.inventories +
    bs.trade_receivables +
    bs.cash_and_equivalents +
    bs.short_term_loans_advances +
    bs.gst_itc_receivable +
    bs.tds_advance_tax_receivable +
    bs.other_current_assets;

  const total_assets = total_non_current_assets + total_current_assets;

  const total_equity =
    bs.share_capital + bs.reserves_surplus + bs.money_received_share_warrants;

  const total_non_current_liabilities =
    bs.long_term_borrowings + bs.deferred_tax_liability + bs.long_term_provisions;

  const total_current_liabilities =
    bs.short_term_borrowings +
    bs.trade_payables +
    bs.gst_payable +
    bs.tds_payable +
    bs.pf_esi_payable +
    bs.advance_from_customers +
    bs.other_current_liabilities;

  const total_liabilities_equity =
    total_equity + total_non_current_liabilities + total_current_liabilities;

  return {
    total_non_current_assets,
    total_current_assets,
    total_assets,
    total_equity,
    total_non_current_liabilities,
    total_current_liabilities,
    total_liabilities_equity,
  };
}

export function derivePL(pl: ProfitLoss): DerivedPL {
  const total_revenue = pl.revenue_from_operations + pl.other_income;
  const gross_profit = pl.revenue_from_operations - pl.cogs;
  const ebitda = gross_profit - pl.employee_expenses - pl.other_expenses;
  const ebit = ebitda - pl.depreciation;
  const pbt = ebit - pl.finance_costs + pl.other_income;
  const pat = pbt - pl.tax_expense;

  return { total_revenue, gross_profit, ebitda, ebit, pbt, pat };
}

export function calculateRatios(
  data: FinancialData,
  prevData?: FinancialData | null
): FinancialRatios {
  const bs = data.balance_sheet;
  const pl = data.profit_loss;
  const cf = data.cash_flow;
  const d = deriveBS(bs);
  const p = derivePL(pl);

  const revenue = pl.revenue_from_operations;
  const cogs = pl.cogs || revenue * 0.6;

  // Averages (use previous year if available)
  const prevBS = prevData?.balance_sheet;
  const prevD = prevBS ? deriveBS(prevBS) : null;
  const avg_assets = prevD
    ? (d.total_assets + prevD.total_assets) / 2
    : d.total_assets;
  const avg_equity = prevD
    ? (d.total_equity + prevD.total_equity) / 2
    : d.total_equity;
  const avg_inventory = prevBS
    ? (bs.inventories + prevBS.inventories) / 2
    : bs.inventories;
  const avg_receivables = prevBS
    ? (bs.trade_receivables + prevBS.trade_receivables) / 2
    : bs.trade_receivables;
  const avg_payables = prevBS
    ? (bs.trade_payables + prevBS.trade_payables) / 2
    : bs.trade_payables;

  const total_debt = bs.long_term_borrowings + bs.short_term_borrowings;
  const capital_employed = d.total_assets - d.total_current_liabilities;

  // Profitability
  const gross_margin = (r(safeDiv(p.gross_profit, revenue) ?? 0, 2) ?? 0) * 100 || undefined;
  const net_margin = (r(safeDiv(p.pat, revenue) ?? 0, 2) ?? 0) * 100 || undefined;
  const ebitda_margin = (r(safeDiv(p.ebitda, revenue) ?? 0, 2) ?? 0) * 100 || undefined;
  const ebit_margin = (r(safeDiv(p.ebit, revenue) ?? 0, 2) ?? 0) * 100 || undefined;
  const roe = avg_equity ? r(p.pat / avg_equity * 100, 2) : undefined;
  const roa = avg_assets ? r(p.pat / avg_assets * 100, 2) : undefined;
  const roce = capital_employed ? r(p.ebit / capital_employed * 100, 2) : undefined;
  const eps = bs.share_capital
    ? r((p.pat * 100000) / (bs.share_capital * 100000 / 10), 2)
    : undefined; // face value ₹10

  // Liquidity
  const current_ratio = r(safeDiv(d.total_current_assets, d.total_current_liabilities), 2);
  const quick_ratio = r(
    safeDiv(d.total_current_assets - bs.inventories, d.total_current_liabilities),
    2
  );
  const cash_ratio = r(
    safeDiv(bs.cash_and_equivalents, d.total_current_liabilities),
    2
  );
  const working_capital = r(d.total_current_assets - d.total_current_liabilities, 2);

  // Leverage
  const debt_to_equity = r(safeDiv(total_debt, d.total_equity), 2);
  const debt_ratio = r(safeDiv(total_debt, d.total_assets), 2);
  const interest_coverage = r(safeDiv(p.ebit, pl.finance_costs), 2);
  const annual_repayment =
    data.annual_loan_repayment > 0
      ? data.annual_loan_repayment
      : total_debt * 0.15;
  const dscr_denom = annual_repayment + pl.finance_costs;
  const dscr = dscr_denom > 0
    ? r((p.pat + pl.depreciation) / dscr_denom, 2)
    : undefined;
  const net_debt = r(total_debt - bs.cash_and_equivalents, 2);
  const net_debt_to_ebitda = r(safeDiv(net_debt ?? 0, p.ebitda), 2);

  // Efficiency
  const dso = revenue ? r((avg_receivables / revenue) * 365, 1) : undefined;
  const dpo = cogs ? r((avg_payables / cogs) * 365, 1) : undefined;
  const inventory_turnover = avg_inventory ? r(cogs / avg_inventory, 2) : undefined;
  const dio = inventory_turnover ? r(365 / inventory_turnover, 1) : undefined;
  const ccc =
    dso !== undefined && dio !== undefined && dpo !== undefined
      ? r(dso + dio - dpo, 1)
      : undefined;
  const asset_turnover = r(safeDiv(revenue, avg_assets), 2);
  const fixed_asset_turnover = bs.fixed_assets ? r(revenue / bs.fixed_assets, 2) : undefined;
  const capital_productivity = capital_employed ? r(revenue / capital_employed, 2) : undefined;

  // Cash Flow
  const ocf_margin = revenue ? r((cf.operating_cf / revenue) * 100, 2) : undefined;
  const fcf = r(cf.operating_cf - cf.capex, 2);
  const cf_to_debt = total_debt ? r(cf.operating_cf / total_debt, 2) : undefined;
  const cash_conversion_ratio = p.ebitda
    ? r(cf.operating_cf / p.ebitda, 2)
    : undefined;
  const capex_intensity = revenue ? r((cf.capex / revenue) * 100, 2) : undefined;

  return {
    gross_margin: pct(gross_margin),
    net_margin: pct(net_margin),
    ebitda_margin: pct(ebitda_margin),
    ebit_margin: pct(ebit_margin),
    roe: pct(roe),
    roa: pct(roa),
    roce: pct(roce),
    eps,
    current_ratio,
    quick_ratio,
    cash_ratio,
    working_capital,
    debt_to_equity,
    debt_ratio,
    interest_coverage,
    dscr,
    net_debt,
    net_debt_to_ebitda,
    total_debt: r(total_debt, 2),
    dso,
    dpo,
    dio,
    ccc,
    asset_turnover,
    inventory_turnover,
    fixed_asset_turnover,
    capital_productivity,
    ocf: r(cf.operating_cf, 2),
    ocf_margin,
    fcf,
    cf_to_debt,
    cash_conversion_ratio,
    capex_intensity,
  };
}

// Helpers
function r(v: number | undefined | null, dp: number): number | undefined {
  if (v === undefined || v === null || isNaN(v)) return undefined;
  return parseFloat(v.toFixed(dp));
}

function pct(v: number | undefined | null): number | undefined {
  if (v === undefined || v === null || isNaN(v)) return undefined;
  return parseFloat(v.toFixed(2));
}
