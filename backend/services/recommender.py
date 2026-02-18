"""
Recommendations engine — generates actionable insights from financial ratios.
Indian context with statutory compliance awareness.
"""
from typing import List, Optional
from models.financial_data import FinancialRatios, FinancialData, Recommendation


def generate_recommendations(
    ratios: FinancialRatios,
    data: FinancialData,
    prev_ratios: Optional[FinancialRatios] = None,
) -> List[Recommendation]:
    recommendations: List[Recommendation] = []
    bs = data.balance_sheet
    pl = data.profit_loss
    revenue = pl.revenue_from_operations

    # ── HIGH PRIORITY ──────────────────────────────────────────────

    # PF/ESI overdue — criminal liability risk
    if bs.pf_esi_payable > 0:
        recommendations.append(Recommendation(
            priority="HIGH",
            category="Compliance",
            title="PF/ESI Payable Outstanding",
            description=f"PF/ESI payable of ₹{bs.pf_esi_payable:.1f}L is outstanding. Directors face personal criminal liability under EPF Act for defaults. Deposit immediately.",
            impact="Avoid criminal prosecution and penalty interest",
            action="Deposit immediately via EPFO/ESIC portal",
        ))

    # TDS payable — interest + prosecution
    if bs.tds_payable > 0:
        recommendations.append(Recommendation(
            priority="HIGH",
            category="Compliance",
            title="TDS Payable Overdue",
            description=f"TDS payable of ₹{bs.tds_payable:.1f}L outstanding. Interest @1.5% per month under Section 201 of IT Act plus potential prosecution of TAN holders.",
            impact="Stop accumulating 1.5%/month interest",
            action="Deposit via NSDL before 7th of next month",
        ))

    # DSCR critical
    if ratios.dscr is not None and ratios.dscr < 1.0:
        recommendations.append(Recommendation(
            priority="HIGH",
            category="Debt",
            title="DSCR Below 1.0x — NPA Risk",
            description=f"DSCR of {ratios.dscr:.2f}x is below the RBI minimum of 1.25x. Loan may be classified as NPA. Operating cash flow cannot cover debt obligations.",
            impact="Prevent NPA classification and bank facility withdrawal",
            action="Negotiate loan restructuring or moratorium immediately",
        ))
    elif ratios.dscr is not None and ratios.dscr < 1.25:
        recommendations.append(Recommendation(
            priority="HIGH",
            category="Debt",
            title="DSCR Below RBI Minimum (1.25x)",
            description=f"DSCR of {ratios.dscr:.2f}x is in Sub-Standard zone (RBI norm: >1.25x). Risk of NPA classification within 90 days.",
            impact="Protect credit rating and bank relationships",
            action="Accelerate collections, defer non-critical capex",
        ))

    # Negative working capital
    if ratios.working_capital is not None and ratios.working_capital < 0:
        recommendations.append(Recommendation(
            priority="HIGH",
            category="Liquidity",
            title="Negative Working Capital",
            description=f"Working capital is negative (₹{abs(ratios.working_capital):.1f}L shortfall). Current liabilities exceed current assets — short-term solvency crisis.",
            impact="Prevent payment defaults to vendors and banks",
            action="Accelerate debtor collections, negotiate extended credit from suppliers",
        ))

    # Current ratio critical
    if ratios.current_ratio is not None and ratios.current_ratio < 1.0:
        recommendations.append(Recommendation(
            priority="HIGH",
            category="Liquidity",
            title="Critical Current Ratio — Below 1.0x",
            description=f"Current ratio of {ratios.current_ratio:.2f}x indicates inability to meet short-term obligations from current assets.",
            impact="Prevent payment defaults and creditor escalations",
            action="Convert long-term debt to short-term, accelerate receivables",
        ))

    # IBC risk — D/E > 3x
    if ratios.debt_to_equity is not None and ratios.debt_to_equity > 3.0:
        recommendations.append(Recommendation(
            priority="HIGH",
            category="Debt",
            title="IBC Risk — D/E Exceeds 3x",
            description=f"Debt-to-Equity of {ratios.debt_to_equity:.2f}x. If a creditor default exceeds ₹1 Cr, they can initiate CIRP under IBC. Seek equity infusion urgently.",
            impact="Prevent insolvency proceedings",
            action="Raise equity capital or convert promoter loans to equity",
        ))

    # Bad debt risk (high DSO + large receivables)
    if ratios.dso is not None and ratios.dso > 120:
        receivables_pct = (bs.trade_receivables / revenue * 100) if revenue else 0
        recommendations.append(Recommendation(
            priority="HIGH",
            category="Receivables",
            title=f"Very High DSO — {ratios.dso:.0f} Days",
            description=f"DSO of {ratios.dso:.0f} days with receivables at {receivables_pct:.1f}% of revenue indicates serious collection issues. Risk of bad debt write-offs.",
            impact="Free up working capital, reduce bad debt risk",
            action="Issue demand notices to 90+ day overdue customers; consider factoring",
        ))

    # Finance costs high
    if revenue > 0 and pl.finance_costs / revenue > 0.08:
        fc_pct = pl.finance_costs / revenue * 100
        recommendations.append(Recommendation(
            priority="HIGH",
            category="Debt",
            title=f"Finance Costs Very High ({fc_pct:.1f}% of Revenue)",
            description=f"Finance costs consuming {fc_pct:.1f}% of revenue (threshold: 5%). Severely compressing net margins.",
            impact="Improve net margin by reducing debt servicing burden",
            action="Refinance at lower rates, prepay high-cost loans with surplus cash",
        ))

    # ── MEDIUM PRIORITY ────────────────────────────────────────────

    # DSO moderate
    if ratios.dso is not None and 60 < ratios.dso <= 120:
        recommendations.append(Recommendation(
            priority="MEDIUM",
            category="Receivables",
            title=f"DSO at {ratios.dso:.0f} Days — Above Ideal",
            description=f"Industry ideal for Indian SMEs is <60 days. DSO of {ratios.dso:.0f} days indicates collections need improvement. Introduce early payment discounts.",
            impact="Release working capital, reduce CC/OD utilisation",
            action="Offer 1–2% discount for payment within 15 days (2/15, net 45)",
        ))

    # High CCC
    if ratios.ccc is not None and ratios.ccc > 90:
        recommendations.append(Recommendation(
            priority="MEDIUM",
            category="Efficiency",
            title=f"Cash Conversion Cycle Too Long ({ratios.ccc:.0f} Days)",
            description=f"CCC of {ratios.ccc:.0f} days means it takes over {ratios.ccc/30:.1f} months to convert inventory investment back to cash. High working capital requirement.",
            impact="Reduce working capital borrowing needs",
            action="Reduce inventory holding; negotiate better supplier terms",
        ))

    # High inventory days
    if ratios.dio is not None and ratios.dio > 90:
        recommendations.append(Recommendation(
            priority="MEDIUM",
            category="Efficiency",
            title=f"High Inventory Days ({ratios.dio:.0f} Days)",
            description=f"Inventory held for {ratios.dio:.0f} days before sale. Excess stock increases storage costs and obsolescence risk.",
            impact="Release cash locked in inventory",
            action="Implement JIT ordering, identify slow-moving SKUs for liquidation",
        ))

    # Employee costs high
    if revenue > 0 and pl.employee_expenses / revenue > 0.30:
        emp_pct = pl.employee_expenses / revenue * 100
        recommendations.append(Recommendation(
            priority="MEDIUM",
            category="Expenses",
            title=f"Employee Costs High ({emp_pct:.1f}% of Revenue)",
            description=f"Labour costs at {emp_pct:.1f}% of revenue (threshold: 30%). Review staffing efficiency or automate repetitive tasks.",
            impact="Improve EBITDA margin by 3–5 percentage points",
            action="Conduct productivity analysis; explore automation ROI",
        ))

    # GST ITC large
    if bs.gst_itc_receivable > 0 and revenue > 0:
        itc_months = bs.gst_itc_receivable / (revenue / 12) if revenue else 0
        if itc_months > 3:
            recommendations.append(Recommendation(
                priority="MEDIUM",
                category="Compliance",
                title=f"GST ITC Blocked — {itc_months:.1f} Months of Purchases",
                description=f"₹{bs.gst_itc_receivable:.1f}L of GST Input Tax Credit is blocked. More than 3 months of ITC not utilised. This is locked working capital.",
                impact="Release ₹{:.1f}L of cash blocked with government".format(bs.gst_itc_receivable),
                action="Reconcile GSTR-2A vs books; utilise ITC against GST liability",
            ))

    # Net margin declining
    if prev_ratios and ratios.net_margin is not None and prev_ratios.net_margin is not None:
        margin_decline = prev_ratios.net_margin - ratios.net_margin
        if margin_decline > 1.5:
            recommendations.append(Recommendation(
                priority="MEDIUM",
                category="Profitability",
                title=f"Net Margin Declining ({margin_decline:.1f}pp Drop)",
                description=f"Net margin fell from {prev_ratios.net_margin:.1f}% to {ratios.net_margin:.1f}%. Review cost structure — identify if it's input cost pressure, labour, or finance costs.",
                impact="Restore profitability to prior year levels",
                action="Cost reduction task force; price revision for key products",
            ))

    # Interest coverage moderate
    if ratios.interest_coverage is not None and 1.5 < ratios.interest_coverage < 3.0:
        recommendations.append(Recommendation(
            priority="MEDIUM",
            category="Debt",
            title=f"Interest Coverage Ratio Thin ({ratios.interest_coverage:.2f}x)",
            description=f"ICR of {ratios.interest_coverage:.2f}x is above minimum but thin. A revenue dip of >25% would make interest coverage dangerous.",
            impact="Build buffer against revenue volatility",
            action="Consider fixed-rate refinancing to reduce rate risk",
        ))

    # MSME payables
    if data.msme_payables > 0:
        recommendations.append(Recommendation(
            priority="MEDIUM",
            category="Compliance",
            title="MSME Payables — 45-Day Compliance",
            description=f"₹{data.msme_payables:.1f}L due to MSME suppliers. Under MSME Act Section 15, payment must be made within 45 days. Overdue attracts compound interest @3× bank rate.",
            impact="Avoid mandatory interest payment to MSME suppliers",
            action="Prioritise MSME supplier payments; disclose in MCA filing if overdue",
        ))

    # ── POSITIVE REINFORCEMENT ─────────────────────────────────────

    # Good D/E
    if ratios.debt_to_equity is not None and ratios.debt_to_equity < 0.5:
        recommendations.append(Recommendation(
            priority="POSITIVE",
            category="Debt",
            title="Excellent Leverage Position",
            description=f"D/E of {ratios.debt_to_equity:.2f}x is well below 1x. Company has strong capacity to raise debt for growth if needed.",
            action="Consider leveraged growth — take on project-linked debt with clear ROI",
        ))

    # Good D/E improving
    if prev_ratios and ratios.debt_to_equity and prev_ratios.debt_to_equity:
        if prev_ratios.debt_to_equity - ratios.debt_to_equity > 0.2:
            recommendations.append(Recommendation(
                priority="POSITIVE",
                category="Debt",
                title="Deleveraging on Track",
                description=f"D/E improved from {prev_ratios.debt_to_equity:.2f}x to {ratios.debt_to_equity:.2f}x. Debt reduction strategy is working.",
                action="Continue debt repayment from operating cash flow",
            ))

    # Good current ratio
    if ratios.current_ratio is not None and 1.5 <= ratios.current_ratio <= 2.5:
        recommendations.append(Recommendation(
            priority="POSITIVE",
            category="Liquidity",
            title="Healthy Liquidity Position",
            description=f"Current ratio of {ratios.current_ratio:.2f}x is in the ideal range (1.5–2.5x). Short-term solvency is strong.",
            action="Maintain working capital discipline; avoid over-stocking",
        ))

    # Revenue growth
    if prev_ratios:
        prev_rev = (prev_ratios.asset_turnover or 0) * 1000  # proxy
        # Use data directly
        pass

    # Good DSCR
    if ratios.dscr is not None and ratios.dscr >= 1.5:
        recommendations.append(Recommendation(
            priority="POSITIVE",
            category="Debt",
            title=f"Comfortable Debt Coverage (DSCR {ratios.dscr:.2f}x)",
            description=f"DSCR of {ratios.dscr:.2f}x comfortably exceeds the RBI minimum of 1.25x. Loan accounts are in Standard category.",
            action="Maintain by protecting EBITDA margins",
        ))

    # Sort: HIGH first, then MEDIUM, then POSITIVE
    priority_order = {"HIGH": 0, "MEDIUM": 1, "POSITIVE": 2}
    recommendations.sort(key=lambda r: priority_order.get(r.priority, 3))

    return recommendations
