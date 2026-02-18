"""
Financial Health Score engine.
Scores each category 0–100, then weights them for the overall score.
"""
from typing import Optional
from models.financial_data import FinancialRatios, HealthScoreBreakdown
from utils.constants import HEALTH_SCORE_WEIGHTS, HEALTH_ZONES


def score_metric(value: Optional[float], excellent: float, good: float, caution: float,
                 lower_is_better: bool = False, max_score: float = 100) -> float:
    """Score a single metric on a 0–100 scale."""
    if value is None:
        return 50  # neutral when data not available

    if lower_is_better:
        # Lower value = better score
        if value <= excellent:
            return max_score
        elif value <= good:
            ratio = (good - value) / (good - excellent)
            return 60 + ratio * 40
        elif value <= caution:
            ratio = (caution - value) / (caution - good)
            return 30 + ratio * 30
        else:
            ratio = max(0, 1 - (value - caution) / caution)
            return ratio * 30
    else:
        # Higher value = better score
        if value >= excellent:
            return max_score
        elif value >= good:
            ratio = (value - good) / (excellent - good)
            return 60 + ratio * 40
        elif value >= caution:
            ratio = (value - caution) / (good - caution)
            return 30 + ratio * 30
        else:
            ratio = max(0, value / caution) if caution > 0 else 0
            return ratio * 30


def calculate_liquidity_score(ratios: FinancialRatios) -> float:
    scores = []

    # Current ratio: ideal 1.5–2.5x
    if ratios.current_ratio is not None:
        cr = ratios.current_ratio
        if 1.5 <= cr <= 2.5:
            scores.append(100)
        elif 1.0 <= cr < 1.5:
            scores.append(60 + (cr - 1.0) / 0.5 * 40)
        elif cr < 1.0:
            scores.append(max(0, cr / 1.0 * 30))
        else:  # > 2.5, too much idle assets
            scores.append(max(70, 100 - (cr - 2.5) * 10))
    else:
        scores.append(50)

    # Quick ratio: >1x ideal
    if ratios.quick_ratio is not None:
        qr = ratios.quick_ratio
        if qr >= 1.0:
            scores.append(min(100, 70 + qr * 10))
        else:
            scores.append(max(0, qr / 1.0 * 70))
    else:
        scores.append(50)

    # Cash ratio: >0.2x
    if ratios.cash_ratio is not None:
        cr = ratios.cash_ratio
        if cr >= 0.5:
            scores.append(100)
        elif cr >= 0.2:
            scores.append(60 + (cr - 0.2) / 0.3 * 40)
        else:
            scores.append(max(0, cr / 0.2 * 60))
    else:
        scores.append(50)

    return sum(scores) / len(scores)


def calculate_profitability_score(ratios: FinancialRatios) -> float:
    scores = []

    scores.append(score_metric(ratios.net_margin, 15, 8, 3))
    scores.append(score_metric(ratios.ebitda_margin, 20, 12, 6))
    scores.append(score_metric(ratios.gross_margin, 40, 25, 15))
    scores.append(score_metric(ratios.roe, 20, 12, 6))
    scores.append(score_metric(ratios.roa, 10, 5, 2))

    return sum(scores) / len(scores)


def calculate_leverage_score(ratios: FinancialRatios) -> float:
    scores = []

    scores.append(score_metric(ratios.debt_to_equity, 0.5, 1.0, 2.0, lower_is_better=True))
    scores.append(score_metric(ratios.interest_coverage, 5.0, 3.0, 2.0))
    scores.append(score_metric(ratios.dscr, 2.0, 1.5, 1.25))
    scores.append(score_metric(ratios.net_debt_to_ebitda, 1.0, 2.0, 3.0, lower_is_better=True))
    scores.append(score_metric(ratios.debt_ratio, 0.3, 0.5, 0.65, lower_is_better=True))

    return sum(scores) / len(scores)


def calculate_efficiency_score(ratios: FinancialRatios) -> float:
    scores = []

    scores.append(score_metric(ratios.dso, 45, 60, 90, lower_is_better=True))
    scores.append(score_metric(ratios.dio, 30, 60, 90, lower_is_better=True))
    scores.append(score_metric(ratios.ccc, 45, 75, 100, lower_is_better=True))
    scores.append(score_metric(ratios.asset_turnover, 1.5, 1.0, 0.5))
    scores.append(score_metric(ratios.inventory_turnover, 12, 8, 4))

    return sum(scores) / len(scores)


def calculate_cash_flow_score(ratios: FinancialRatios) -> float:
    scores = []

    scores.append(score_metric(ratios.ocf_margin, 15, 8, 3))
    scores.append(score_metric(ratios.cf_to_debt, 0.3, 0.2, 0.1))

    if ratios.cash_conversion_ratio is not None:
        ccr = ratios.cash_conversion_ratio
        if ccr >= 0.8:
            scores.append(100)
        elif ccr >= 0.5:
            scores.append(60 + (ccr - 0.5) / 0.3 * 40)
        else:
            scores.append(max(0, ccr / 0.5 * 60))
    else:
        scores.append(50)

    return sum(scores) / len(scores)


def calculate_compliance_score_from_flags(
    tds_payable_overdue: bool,
    gst_itc_large: bool,
    pf_esi_overdue: bool,
    msme_overdue: bool,
) -> float:
    score = 100
    if tds_payable_overdue:
        score -= 30   # serious — criminal liability
    if pf_esi_overdue:
        score -= 30   # serious — criminal liability
    if gst_itc_large:
        score -= 15   # ITC blockage
    if msme_overdue:
        score -= 15   # MSME interest obligation
    return max(0, score)


def calculate_health_score(
    ratios: FinancialRatios,
    tds_payable_overdue: bool = False,
    gst_itc_large: bool = False,
    pf_esi_overdue: bool = False,
    msme_overdue: bool = False,
) -> HealthScoreBreakdown:
    liquidity = calculate_liquidity_score(ratios)
    profitability = calculate_profitability_score(ratios)
    leverage = calculate_leverage_score(ratios)
    efficiency = calculate_efficiency_score(ratios)
    cash_flow = calculate_cash_flow_score(ratios)
    compliance = calculate_compliance_score_from_flags(
        tds_payable_overdue, gst_itc_large, pf_esi_overdue, msme_overdue
    )

    w = HEALTH_SCORE_WEIGHTS
    overall = (
        liquidity * w["liquidity"] / 100 +
        profitability * w["profitability"] / 100 +
        leverage * w["leverage"] / 100 +
        efficiency * w["efficiency"] / 100 +
        cash_flow * w["cash_flow"] / 100 +
        compliance * w["compliance"] / 100
    )

    zone, zone_color = "Critical", "red"
    for low, high, z, zc in HEALTH_ZONES:
        if low <= overall <= high:
            zone, zone_color = z, zc
            break

    return HealthScoreBreakdown(
        overall=round(overall, 1),
        liquidity=round(liquidity, 1),
        profitability=round(profitability, 1),
        leverage=round(leverage, 1),
        efficiency=round(efficiency, 1),
        cash_flow=round(cash_flow, 1),
        compliance=round(compliance, 1),
        zone=zone,
        zone_color=zone_color,
    )
