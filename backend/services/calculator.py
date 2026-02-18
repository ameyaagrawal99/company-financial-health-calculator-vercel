"""
Financial ratio calculator — all ratios for an Indian SME context.
All monetary inputs assumed to be in Lakhs (INR).
"""
from typing import Optional
from models.financial_data import FinancialData, FinancialRatios


def safe_div(numerator: float, denominator: float, default=None) -> Optional[float]:
    if denominator is None or denominator == 0:
        return default
    return numerator / denominator


def calculate_ratios(data: FinancialData, prev_data: Optional[FinancialData] = None) -> FinancialRatios:
    bs = data.balance_sheet
    pl = data.profit_loss
    cf = data.cash_flow

    revenue = pl.revenue_from_operations
    total_revenue = pl.total_revenue
    gross_profit = pl.gross_profit
    ebitda = pl.ebitda
    ebit = pl.ebit
    pbt = pl.pbt
    pat = pl.pat

    total_assets = bs.total_assets
    total_equity = bs.total_equity
    current_assets = bs.total_current_assets
    current_liabilities = bs.total_current_liabilities
    total_debt = bs.long_term_borrowings + bs.short_term_borrowings

    # Averages for efficiency ratios (use prev year if available)
    if prev_data:
        avg_assets = (total_assets + prev_data.balance_sheet.total_assets) / 2
        avg_equity = (total_equity + prev_data.balance_sheet.total_equity) / 2
        avg_inventory = (bs.inventories + prev_data.balance_sheet.inventories) / 2
        avg_trade_receivables = (bs.trade_receivables + prev_data.balance_sheet.trade_receivables) / 2
        avg_trade_payables = (bs.trade_payables + prev_data.balance_sheet.trade_payables) / 2
    else:
        avg_assets = total_assets
        avg_equity = total_equity
        avg_inventory = bs.inventories
        avg_trade_receivables = bs.trade_receivables
        avg_trade_payables = bs.trade_payables

    capital_employed = total_assets - current_liabilities

    # ── Profitability ──────────────────────────────────────────────
    gross_margin = safe_div(gross_profit, revenue) * 100 if revenue else None
    net_margin = safe_div(pat, revenue) * 100 if revenue else None
    ebitda_margin = safe_div(ebitda, revenue) * 100 if revenue else None
    ebit_margin = safe_div(ebit, revenue) * 100 if revenue else None
    roe = safe_div(pat, avg_equity) * 100 if avg_equity else None
    roa = safe_div(pat, avg_assets) * 100 if avg_assets else None
    roce = safe_div(ebit, capital_employed) * 100 if capital_employed else None
    eps = safe_div(pat, data.balance_sheet.share_capital / 10) if data.balance_sheet.share_capital else None  # Assuming face value ₹10

    # ── Liquidity ──────────────────────────────────────────────────
    current_ratio = safe_div(current_assets, current_liabilities)
    quick_ratio = safe_div(current_assets - bs.inventories, current_liabilities)
    cash_ratio = safe_div(bs.cash_and_equivalents, current_liabilities)
    working_capital = current_assets - current_liabilities

    # ── Leverage ───────────────────────────────────────────────────
    debt_to_equity = safe_div(total_debt, total_equity)
    debt_ratio = safe_div(total_debt, total_assets)
    interest_coverage = safe_div(ebit, pl.finance_costs)
    # DSCR: (PAT + Depreciation) / (Annual Loan Repayment + Interest)
    annual_repayment = data.annual_loan_repayment if data.annual_loan_repayment else total_debt * 0.15  # estimate 15% p.a.
    dscr_denominator = annual_repayment + pl.finance_costs
    dscr = safe_div(pat + pl.depreciation, dscr_denominator)
    net_debt = total_debt - bs.cash_and_equivalents
    net_debt_to_ebitda = safe_div(net_debt, ebitda)

    # ── Efficiency ─────────────────────────────────────────────────
    cogs = pl.cogs if pl.cogs > 0 else revenue * 0.6  # fallback estimate

    dso = safe_div(avg_trade_receivables, revenue) * 365 if revenue else None
    dpo = safe_div(avg_trade_payables, cogs) * 365 if cogs else None
    inventory_turnover = safe_div(cogs, avg_inventory)
    dio = safe_div(365, inventory_turnover) if inventory_turnover else None
    ccc = (dso or 0) + (dio or 0) - (dpo or 0) if all([dso, dio, dpo]) else None
    asset_turnover = safe_div(revenue, avg_assets)
    fixed_asset_turnover = safe_div(revenue, bs.fixed_assets) if bs.fixed_assets else None
    capital_productivity = safe_div(revenue, capital_employed) if capital_employed else None

    # ── Cash Flow ──────────────────────────────────────────────────
    ocf_margin = safe_div(cf.operating_cf, revenue) * 100 if revenue else None
    fcf = cf.free_cash_flow
    cf_to_debt = safe_div(cf.operating_cf, total_debt) if total_debt else None
    cash_conversion_ratio = safe_div(cf.operating_cf, ebitda) if ebitda else None
    capex_intensity = safe_div(cf.capex, revenue) * 100 if revenue else None

    return FinancialRatios(
        gross_margin=round(gross_margin, 2) if gross_margin is not None else None,
        net_margin=round(net_margin, 2) if net_margin is not None else None,
        ebitda_margin=round(ebitda_margin, 2) if ebitda_margin is not None else None,
        ebit_margin=round(ebit_margin, 2) if ebit_margin is not None else None,
        roe=round(roe, 2) if roe is not None else None,
        roa=round(roa, 2) if roa is not None else None,
        roce=round(roce, 2) if roce is not None else None,
        eps=round(eps, 2) if eps is not None else None,

        current_ratio=round(current_ratio, 2) if current_ratio is not None else None,
        quick_ratio=round(quick_ratio, 2) if quick_ratio is not None else None,
        cash_ratio=round(cash_ratio, 2) if cash_ratio is not None else None,
        working_capital=round(working_capital, 2) if working_capital is not None else None,

        debt_to_equity=round(debt_to_equity, 2) if debt_to_equity is not None else None,
        debt_ratio=round(debt_ratio, 2) if debt_ratio is not None else None,
        interest_coverage=round(interest_coverage, 2) if interest_coverage is not None else None,
        dscr=round(dscr, 2) if dscr is not None else None,
        net_debt=round(net_debt, 2) if net_debt is not None else None,
        net_debt_to_ebitda=round(net_debt_to_ebitda, 2) if net_debt_to_ebitda is not None else None,
        total_debt=round(total_debt, 2),

        dso=round(dso, 1) if dso is not None else None,
        dpo=round(dpo, 1) if dpo is not None else None,
        dio=round(dio, 1) if dio is not None else None,
        ccc=round(ccc, 1) if ccc is not None else None,
        asset_turnover=round(asset_turnover, 2) if asset_turnover is not None else None,
        inventory_turnover=round(inventory_turnover, 2) if inventory_turnover is not None else None,
        fixed_asset_turnover=round(fixed_asset_turnover, 2) if fixed_asset_turnover is not None else None,
        capital_productivity=round(capital_productivity, 2) if capital_productivity is not None else None,

        ocf_margin=round(ocf_margin, 2) if ocf_margin is not None else None,
        fcf=round(fcf, 2) if fcf is not None else None,
        cf_to_debt=round(cf_to_debt, 2) if cf_to_debt is not None else None,
        cash_conversion_ratio=round(cash_conversion_ratio, 2) if cash_conversion_ratio is not None else None,
        capex_intensity=round(capex_intensity, 2) if capex_intensity is not None else None,
    )
