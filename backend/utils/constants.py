"""
Benchmarks and thresholds for all financial ratios.
Indian context — SME and mid-market companies.
"""

RATIO_BENCHMARKS = {
    # Profitability
    "gross_margin": {"excellent": 40, "good": 25, "caution": 15, "unit": "%"},
    "net_margin": {"excellent": 15, "good": 8, "caution": 3, "unit": "%"},
    "ebitda_margin": {"excellent": 20, "good": 12, "caution": 6, "unit": "%"},
    "roe": {"excellent": 20, "good": 12, "caution": 6, "unit": "%"},
    "roa": {"excellent": 10, "good": 5, "caution": 2, "unit": "%"},
    "roce": {"excellent": 18, "good": 10, "caution": 5, "unit": "%"},

    # Liquidity
    "current_ratio": {"min_healthy": 1.5, "max_healthy": 2.5, "critical_low": 1.0, "unit": "x"},
    "quick_ratio": {"min_healthy": 1.0, "critical_low": 0.7, "unit": "x"},
    "cash_ratio": {"min_healthy": 0.2, "critical_low": 0.1, "unit": "x"},

    # Leverage
    "debt_to_equity": {"excellent": 0.5, "good": 1.0, "caution": 2.0, "critical": 3.0, "unit": "x", "lower_is_better": True},
    "interest_coverage": {"excellent": 5.0, "good": 3.0, "caution": 2.0, "critical": 1.5, "unit": "x"},
    "dscr": {"excellent": 2.0, "good": 1.5, "caution": 1.25, "critical": 1.0, "unit": "x"},
    "net_debt_to_ebitda": {"excellent": 1.0, "good": 2.0, "caution": 3.0, "critical": 5.0, "unit": "x", "lower_is_better": True},
    "debt_ratio": {"excellent": 0.3, "good": 0.5, "caution": 0.65, "unit": "ratio", "lower_is_better": True},

    # Efficiency
    "dso": {"excellent": 45, "good": 60, "caution": 90, "critical": 120, "unit": "days", "lower_is_better": True},
    "dpo": {"min_healthy": 30, "max_healthy": 60, "unit": "days"},
    "dio": {"excellent": 30, "good": 60, "caution": 90, "unit": "days", "lower_is_better": True},
    "ccc": {"excellent": 45, "good": 75, "caution": 100, "unit": "days", "lower_is_better": True},
    "asset_turnover": {"excellent": 1.5, "good": 1.0, "caution": 0.5, "unit": "x"},
    "inventory_turnover": {"excellent": 12, "good": 8, "caution": 4, "unit": "x"},

    # Cash Flow
    "ocf_margin": {"excellent": 15, "good": 8, "caution": 3, "unit": "%"},
    "cf_to_debt": {"excellent": 0.3, "good": 0.2, "caution": 0.1, "unit": "ratio"},
}

# Health Score weights (must sum to 100)
HEALTH_SCORE_WEIGHTS = {
    "liquidity": 20,
    "profitability": 25,
    "leverage": 20,
    "efficiency": 15,
    "cash_flow": 10,
    "compliance": 10,
}

# Health score zones
HEALTH_ZONES = [
    (80, 100, "Excellent", "green"),
    (60, 79, "Good", "yellow"),
    (40, 59, "Caution", "orange"),
    (0, 39, "Critical", "red"),
]

# Indian compliance thresholds
COMPLIANCE_THRESHOLDS = {
    "gst_itc_months": 3,            # Flag if ITC > 3 months of purchases
    "tds_payable_max_days": 7,       # TDS to be deposited by 7th of next month
    "msme_payment_days": 45,         # MSME payment within 45 days
    "dso_msme_limit": 45,            # MSME suppliers must be paid within 45 days
    "ibc_trigger_crores": 1.0,       # IBC trigger > ₹1 Cr default
}

# Indian number formatting
INDIAN_NUMBER_LABELS = {
    1e7: "Cr",     # 1 Crore = 10 million
    1e5: "L",      # 1 Lakh = 100 thousand
    1e3: "K",      # 1 Thousand
}

# NPA risk thresholds (RBI framework)
NPA_RISK = {
    "standard": {"dscr_min": 1.25},
    "sub_standard": {"dscr_range": (1.0, 1.25), "overdue_days": 90},
    "doubtful": {"overdue_days": 365},
}

# IBC risk flags
IBC_FLAGS = {
    "de_ratio_consecutive_years": 3,   # D/E > 3x for 3+ years
    "ibc_trigger_amount": 10000000,    # ₹1 Crore in rupees
}

# Expense alert thresholds
EXPENSE_ALERTS = {
    "labour_revenue_pct": 30,          # Labour > 30% of revenue
    "finance_revenue_pct": 5,          # Finance costs > 5% of revenue
}
