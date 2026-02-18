"""
Indian number formatting utilities.
Uses Lakh/Crore system with Indian comma placement.
"""


def format_inr(amount_in_lakhs: float, show_symbol: bool = True) -> str:
    """Format a number (in Lakhs) to Indian display format."""
    if amount_in_lakhs is None:
        return "—"

    symbol = "₹" if show_symbol else ""
    abs_amount = abs(amount_in_lakhs)
    sign = "-" if amount_in_lakhs < 0 else ""

    if abs_amount >= 100:
        # Crores
        crores = abs_amount / 100
        if crores >= 100:
            return f"{sign}{symbol}{crores:.0f} Cr"
        else:
            return f"{sign}{symbol}{crores:.1f} Cr"
    elif abs_amount >= 1:
        # Lakhs
        return f"{sign}{symbol}{abs_amount:.1f} L"
    else:
        # Thousands
        thousands = abs_amount * 100
        if thousands >= 1:
            return f"{sign}{symbol}{thousands:.0f} K"
        else:
            # Small amounts in rupees
            rupees = abs_amount * 100000
            return f"{sign}{symbol}{rupees:,.0f}"


def format_inr_exact(amount_rupees: float) -> str:
    """Format exact rupee amount with Indian comma placement."""
    if amount_rupees is None:
        return "—"

    is_negative = amount_rupees < 0
    abs_amount = abs(amount_rupees)

    # Indian comma placement: last 3 digits, then groups of 2
    int_part = int(abs_amount)
    dec_part = abs_amount - int_part

    s = str(int_part)
    if len(s) > 3:
        last_three = s[-3:]
        rest = s[:-3]
        # Group rest in twos from right
        rest_formatted = ""
        for i, c in enumerate(reversed(rest)):
            if i > 0 and i % 2 == 0:
                rest_formatted = "," + rest_formatted
            rest_formatted = c + rest_formatted
        formatted = rest_formatted + "," + last_three
    else:
        formatted = s

    if dec_part > 0:
        formatted += f".{int(dec_part * 100):02d}"

    sign = "-" if is_negative else ""
    return f"{sign}₹{formatted}"


def format_percentage(value: float, decimal_places: int = 1) -> str:
    """Format a percentage value."""
    if value is None:
        return "—"
    sign = "+" if value > 0 else ""
    return f"{sign}{value:.{decimal_places}f}%"


def format_ratio(value: float, decimal_places: int = 2) -> str:
    """Format a ratio value."""
    if value is None:
        return "—"
    return f"{value:.{decimal_places}f}x"


def format_days(value: float) -> str:
    """Format days value."""
    if value is None:
        return "—"
    return f"{value:.0f} days"


def lakhs_to_rupees(lakhs: float) -> float:
    """Convert Lakhs to Rupees."""
    return lakhs * 100000


def rupees_to_lakhs(rupees: float) -> float:
    """Convert Rupees to Lakhs."""
    return rupees / 100000


def crores_to_lakhs(crores: float) -> float:
    """Convert Crores to Lakhs."""
    return crores * 100


def lakhs_to_crores(lakhs: float) -> float:
    """Convert Lakhs to Crores."""
    return lakhs / 100


def fy_label(year_str: str) -> str:
    """Return 'FY 2024-25' format from '2024-25' input."""
    return f"FY {year_str}"
