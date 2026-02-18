// ─── Core Financial Data Types ───────────────────────────────────────────────

export interface BalanceSheet {
  // Non-Current Assets
  fixed_assets: number;
  capital_wip: number;
  long_term_investments: number;
  deferred_tax_asset: number;
  long_term_loans_advances: number;
  other_non_current_assets: number;
  // Current Assets
  inventories: number;
  trade_receivables: number;
  cash_and_equivalents: number;
  short_term_loans_advances: number;
  gst_itc_receivable: number;
  tds_advance_tax_receivable: number;
  other_current_assets: number;
  // Equity
  share_capital: number;
  reserves_surplus: number;
  money_received_share_warrants: number;
  // Non-Current Liabilities
  long_term_borrowings: number;
  deferred_tax_liability: number;
  long_term_provisions: number;
  // Current Liabilities
  short_term_borrowings: number;
  trade_payables: number;
  gst_payable: number;
  tds_payable: number;
  pf_esi_payable: number;
  advance_from_customers: number;
  other_current_liabilities: number;
}

export interface ProfitLoss {
  revenue_from_operations: number;
  other_income: number;
  cogs: number;
  employee_expenses: number;
  finance_costs: number;
  depreciation: number;
  other_expenses: number;
  tax_expense: number;
}

export interface CashFlow {
  operating_cf: number;
  investing_cf: number;
  financing_cf: number;
  capex: number;
}

export interface FinancialData {
  company_name: string;
  financial_year: string; // "2024-25"
  previous_financial_year?: string | null;
  balance_sheet: BalanceSheet;
  profit_loss: ProfitLoss;
  cash_flow: CashFlow;
  previous_year_balance_sheet?: BalanceSheet | null;
  previous_year_profit_loss?: ProfitLoss | null;
  previous_year_cash_flow?: CashFlow | null;
  promoter_loans: number;
  msme_payables: number;
  annual_loan_repayment: number;
  headcount?: number | null;
  data_confidence: "high" | "medium" | "low";
  document_type: string;
  currency_detected: string;
  notes?: string;
}

// ─── Derived Calculations ─────────────────────────────────────────────────────

export interface DerivedBS {
  total_non_current_assets: number;
  total_current_assets: number;
  total_assets: number;
  total_equity: number;
  total_non_current_liabilities: number;
  total_current_liabilities: number;
  total_liabilities_equity: number;
}

export interface DerivedPL {
  total_revenue: number;
  gross_profit: number;
  ebitda: number;
  ebit: number;
  pbt: number;
  pat: number;
}

export interface FinancialRatios {
  // Profitability
  gross_margin?: number;
  net_margin?: number;
  ebitda_margin?: number;
  ebit_margin?: number;
  roe?: number;
  roa?: number;
  roce?: number;
  eps?: number;
  // Liquidity
  current_ratio?: number;
  quick_ratio?: number;
  cash_ratio?: number;
  working_capital?: number;
  // Leverage
  debt_to_equity?: number;
  debt_ratio?: number;
  interest_coverage?: number;
  dscr?: number;
  net_debt?: number;
  net_debt_to_ebitda?: number;
  total_debt?: number;
  // Efficiency
  dso?: number;
  dpo?: number;
  dio?: number;
  ccc?: number;
  asset_turnover?: number;
  inventory_turnover?: number;
  fixed_asset_turnover?: number;
  capital_productivity?: number;
  // Cash Flow
  ocf_margin?: number;
  fcf?: number;
  cf_to_debt?: number;
  cash_conversion_ratio?: number;
  capex_intensity?: number;
}

// ─── Health Score ─────────────────────────────────────────────────────────────

export interface HealthScore {
  overall: number;
  liquidity: number;
  profitability: number;
  leverage: number;
  efficiency: number;
  cash_flow: number;
  compliance: number;
  zone: "Excellent" | "Good" | "Caution" | "Critical";
  zone_color: "green" | "yellow" | "orange" | "red";
}

// ─── Recommendations ──────────────────────────────────────────────────────────

export interface Recommendation {
  priority: "HIGH" | "MEDIUM" | "POSITIVE";
  category: string;
  title: string;
  description: string;
  impact?: string;
  action?: string;
}

// ─── Compliance ───────────────────────────────────────────────────────────────

export type ComplianceStatus = "OK" | "WARNING" | "CRITICAL" | "UNKNOWN";

export interface ComplianceHealth {
  gst_filing: ComplianceStatus;
  gst_itc_blocked: ComplianceStatus;
  tds_deposited: ComplianceStatus;
  advance_tax: ComplianceStatus;
  pf_esi: ComplianceStatus;
  roc_filing: ComplianceStatus;
  msme_payments: ComplianceStatus;
  related_party: ComplianceStatus;
}

// ─── Full Analysis ────────────────────────────────────────────────────────────

export interface FullAnalysis {
  data: FinancialData;
  derived: DerivedBS & DerivedPL;
  prev_derived?: (DerivedBS & DerivedPL) | null;
  ratios: FinancialRatios;
  prev_ratios?: FinancialRatios | null;
  health_score: HealthScore;
  recommendations: Recommendation[];
  compliance: ComplianceHealth;
}

// ─── UI State ─────────────────────────────────────────────────────────────────

export type ViewMode = "cfo" | "operator";

export interface AppState {
  analysis: FullAnalysis | null;
  viewMode: ViewMode;
  isAnalyzing: boolean;
  error: string | null;
  apiKey: string;
}

// ─── Tooltip content ──────────────────────────────────────────────────────────

export interface TooltipContent {
  full_name: string;
  formula?: string;
  plain_english: string;
  signifies: string;
  indian_context?: string;
  healthy_range?: string;
}
