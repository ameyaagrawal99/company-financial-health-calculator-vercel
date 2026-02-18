from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class BalanceSheet(BaseModel):
    # Non-Current Assets
    fixed_assets: float = 0
    capital_wip: float = 0
    long_term_investments: float = 0
    deferred_tax_asset: float = 0
    long_term_loans_advances: float = 0
    other_non_current_assets: float = 0

    # Current Assets
    inventories: float = 0
    trade_receivables: float = 0
    cash_and_equivalents: float = 0
    short_term_loans_advances: float = 0
    gst_itc_receivable: float = 0
    tds_advance_tax_receivable: float = 0
    other_current_assets: float = 0

    # Equity
    share_capital: float = 0
    reserves_surplus: float = 0
    money_received_share_warrants: float = 0

    # Non-Current Liabilities
    long_term_borrowings: float = 0
    deferred_tax_liability: float = 0
    long_term_provisions: float = 0

    # Current Liabilities
    short_term_borrowings: float = 0
    trade_payables: float = 0
    gst_payable: float = 0
    tds_payable: float = 0
    pf_esi_payable: float = 0
    advance_from_customers: float = 0
    other_current_liabilities: float = 0

    @property
    def total_non_current_assets(self) -> float:
        return (self.fixed_assets + self.capital_wip + self.long_term_investments +
                self.deferred_tax_asset + self.long_term_loans_advances +
                self.other_non_current_assets)

    @property
    def total_current_assets(self) -> float:
        return (self.inventories + self.trade_receivables + self.cash_and_equivalents +
                self.short_term_loans_advances + self.gst_itc_receivable +
                self.tds_advance_tax_receivable + self.other_current_assets)

    @property
    def total_assets(self) -> float:
        return self.total_non_current_assets + self.total_current_assets

    @property
    def total_equity(self) -> float:
        return self.share_capital + self.reserves_surplus + self.money_received_share_warrants

    @property
    def total_non_current_liabilities(self) -> float:
        return self.long_term_borrowings + self.deferred_tax_liability + self.long_term_provisions

    @property
    def total_current_liabilities(self) -> float:
        return (self.short_term_borrowings + self.trade_payables + self.gst_payable +
                self.tds_payable + self.pf_esi_payable + self.advance_from_customers +
                self.other_current_liabilities)

    @property
    def total_liabilities_equity(self) -> float:
        return (self.total_equity + self.total_non_current_liabilities +
                self.total_current_liabilities)


class ProfitLoss(BaseModel):
    revenue_from_operations: float = 0
    other_income: float = 0
    cogs: float = 0
    employee_expenses: float = 0
    finance_costs: float = 0
    depreciation: float = 0
    other_expenses: float = 0
    tax_expense: float = 0

    @property
    def total_revenue(self) -> float:
        return self.revenue_from_operations + self.other_income

    @property
    def gross_profit(self) -> float:
        return self.revenue_from_operations - self.cogs

    @property
    def ebitda(self) -> float:
        return self.gross_profit - self.employee_expenses - self.other_expenses

    @property
    def ebit(self) -> float:
        return self.ebitda - self.depreciation

    @property
    def pbt(self) -> float:
        return self.ebit - self.finance_costs + self.other_income

    @property
    def pat(self) -> float:
        return self.pbt - self.tax_expense


class CashFlow(BaseModel):
    operating_cf: float = 0
    investing_cf: float = 0
    financing_cf: float = 0
    capex: float = 0

    @property
    def net_cash_change(self) -> float:
        return self.operating_cf + self.investing_cf + self.financing_cf

    @property
    def free_cash_flow(self) -> float:
        return self.operating_cf - self.capex


class DebtorAgeingBucket(BaseModel):
    zero_to_30: float = 0
    thirty_to_60: float = 0
    sixty_to_90: float = 0
    ninety_to_180: float = 0
    above_180: float = 0


class FinancialData(BaseModel):
    company_name: str = "Company"
    financial_year: str = "2024-25"
    balance_sheet: BalanceSheet = BalanceSheet()
    profit_loss: ProfitLoss = ProfitLoss()
    cash_flow: CashFlow = CashFlow()
    headcount: Optional[int] = None
    debtor_ageing: Optional[DebtorAgeingBucket] = None
    # Promoter-related
    promoter_loans: float = 0
    msme_payables: float = 0
    msme_receivables: float = 0
    # Prior year for DSCR
    annual_loan_repayment: float = 0


class FinancialRatios(BaseModel):
    # Profitability
    gross_margin: Optional[float] = None
    net_margin: Optional[float] = None
    ebitda_margin: Optional[float] = None
    ebit_margin: Optional[float] = None
    roe: Optional[float] = None
    roa: Optional[float] = None
    roce: Optional[float] = None
    eps: Optional[float] = None

    # Liquidity
    current_ratio: Optional[float] = None
    quick_ratio: Optional[float] = None
    cash_ratio: Optional[float] = None
    working_capital: Optional[float] = None

    # Leverage
    debt_to_equity: Optional[float] = None
    debt_ratio: Optional[float] = None
    interest_coverage: Optional[float] = None
    dscr: Optional[float] = None
    net_debt: Optional[float] = None
    net_debt_to_ebitda: Optional[float] = None
    total_debt: Optional[float] = None

    # Efficiency
    dso: Optional[float] = None
    dpo: Optional[float] = None
    dio: Optional[float] = None
    ccc: Optional[float] = None
    asset_turnover: Optional[float] = None
    inventory_turnover: Optional[float] = None
    fixed_asset_turnover: Optional[float] = None
    capital_productivity: Optional[float] = None

    # Cash Flow
    ocf_margin: Optional[float] = None
    fcf: Optional[float] = None
    cf_to_debt: Optional[float] = None
    cash_conversion_ratio: Optional[float] = None
    capex_intensity: Optional[float] = None


class HealthScoreBreakdown(BaseModel):
    overall: float
    liquidity: float
    profitability: float
    leverage: float
    efficiency: float
    cash_flow: float
    compliance: float
    zone: str  # "Excellent", "Good", "Caution", "Critical"
    zone_color: str  # "green", "yellow", "orange", "red"


class Recommendation(BaseModel):
    priority: str  # "HIGH", "MEDIUM", "POSITIVE"
    category: str
    title: str
    description: str
    impact: Optional[str] = None
    action: Optional[str] = None


class ComplianceStatus(BaseModel):
    gst_filing: str = "UNKNOWN"   # "OK", "WARNING", "CRITICAL", "UNKNOWN"
    gst_itc_blocked: str = "UNKNOWN"
    tds_deposited: str = "UNKNOWN"
    advance_tax: str = "UNKNOWN"
    pf_esi: str = "UNKNOWN"
    roc_filing: str = "UNKNOWN"
    msme_payments: str = "UNKNOWN"
    related_party: str = "UNKNOWN"
    # Flags from data
    gst_itc_large: bool = False
    tds_payable_overdue: bool = False
    pf_esi_overdue: bool = False
    msme_overdue: bool = False


class FullAnalysis(BaseModel):
    financial_data: FinancialData
    ratios: FinancialRatios
    health_score: HealthScoreBreakdown
    recommendations: List[Recommendation]
    compliance: ComplianceStatus
    previous_year_ratios: Optional[FinancialRatios] = None
    session_id: Optional[str] = None


class UploadResponse(BaseModel):
    session_id: str
    detected_type: str
    company_name: Optional[str] = None
    financial_year: Optional[str] = None
    preview_data: Dict[str, Any] = {}
    message: str


class MultiYearAnalysis(BaseModel):
    years: List[str]
    analyses: List[FullAnalysis]
    comparison_table: List[Dict[str, Any]] = []
    improvements: List[str] = []
    deteriorations: List[str] = []
    root_cause_analysis: List[str] = []
