# Product Requirements & Technical Plan (PRT)
## Company Financial Health Calculator — Indian Context
**Version:** 1.0
**Date:** February 2026
**Financial Year Reference:** Indian FY (April 1 – March 31)
**Standards:** Ind AS / Companies Act 2013 / Schedule III Format
**Currency:** Indian Rupee (₹)

---

## 1. PRODUCT VISION

> Imagine a CFO sitting down for a Monday morning review meeting. Within 60 seconds of uploading last year's financials, they should see the complete health picture of their company — not just numbers, but what those numbers mean, what's improving, what's deteriorating, what demands immediate attention, and what to do next.

This tool is that experience. Upload any Excel or PDF — Balance Sheet, P&L, Cash Flow Statement — and get an intelligent, interactive financial health dashboard built specifically for Indian businesses: GST exposure, TDS recoverables, promoter loans, NPA risk, IBC triggers, MSME classification, and everything a founder, CFO, or CA would need in a review meeting.

---

## 2. TARGET USERS

| User | What They Need |
|------|---------------|
| **Founder / Promoter** | Is my company healthy? Can I raise funds? Am I at risk? |
| **CFO / Finance Head** | Deep ratio analysis, cash flow visibility, compliance risk |
| **CA / Auditor** | Schedule III mapping, Ind AS ratios, audit-ready insights |
| **Bank / NBFC** | Creditworthiness, DSCR, NPA risk indicators |
| **Investor / PE** | Valuation readiness, profitability trends, working capital hygiene |

---

## 3. SUPPORTED INPUT FORMATS

### File Upload Types
| Format | Document Types Supported |
|--------|--------------------------|
| **.xlsx / .xls** | Balance Sheet, P&L/Income Statement, Cash Flow Statement, Trial Balance, Detailed Ledger |
| **.pdf** | Audited Annual Reports, CA-certified statements, MCA filings, Bank statements |
| **.csv** | Exported Tally/Zoho/SAP/QuickBooks data |

### Document Auto-Detection
The system will auto-detect which financial statement has been uploaded by scanning headers and row labels. Users can manually confirm or correct the mapping.

### Multi-Year Upload
Upload statements for up to **5 financial years** simultaneously. The tool will align them by period and generate year-over-year comparisons automatically.

### Indian Format Recognition
- Schedule III Balance Sheet format (as per Companies Act 2013)
- Standard P&L format with Indian line items (e.g., "Sundry Debtors", "Loans & Advances", "Reserves & Surplus")
- Tally-exported Excel formats
- MCA XBRL taxonomy mapping

---

## 4. DATA PARSING & INTELLIGENCE ENGINE

### Step 1: Upload & Preview
- Drag-and-drop or browse upload area
- Preview extracted tables before accepting
- Flag unrecognized rows and let user map them manually
- Handle merged cells, multi-level headers, and footer totals common in Indian CA-prepared statements

### Step 2: Smart Column Mapping
The AI/rule engine maps extracted rows to standard financial fields:

**Balance Sheet Mapping (Schedule III)**
```
Assets Side:
├── Non-Current Assets
│   ├── Fixed Assets (Tangible + Intangible)
│   ├── Capital Work-in-Progress
│   ├── Long-term Investments
│   ├── Deferred Tax Asset (DTA)
│   ├── Long-term Loans & Advances
│   └── Other Non-Current Assets
└── Current Assets
    ├── Inventories
    ├── Trade Receivables (Sundry Debtors)
    ├── Cash & Cash Equivalents
    ├── Short-term Loans & Advances
    ├── GST Input Tax Credit (ITC) Receivable       ← Indian-specific
    ├── TDS / Advance Tax Receivable                 ← Indian-specific
    └── Other Current Assets

Liabilities Side:
├── Shareholders' Funds
│   ├── Share Capital (Authorised / Subscribed / Paid-up)
│   ├── Reserves & Surplus
│   └── Money Received Against Share Warrants
├── Non-Current Liabilities
│   ├── Long-term Borrowings (Term Loans, Debentures, NCD)
│   ├── Deferred Tax Liability (DTL)
│   └── Long-term Provisions
└── Current Liabilities
    ├── Short-term Borrowings (CC / OD / WCDL)     ← Indian banking
    ├── Trade Payables (Sundry Creditors)
    ├── GST Payable (CGST / SGST / IGST)           ← Indian-specific
    ├── TDS Payable / TCS Payable                   ← Indian-specific
    ├── PF / ESI / PT Payable                       ← Indian compliance
    ├── Advance from Customers
    └── Other Current Liabilities
```

**P&L / Income Statement Mapping**
```
Revenue:
├── Revenue from Operations (Net of GST)
├── Other Income (Interest, Rent, Dividend)
└── Total Income

Expenses:
├── Cost of Materials / COGS
├── Purchase of Stock-in-Trade
├── Changes in Inventories
├── Employee Benefit Expense
│   ├── Salaries & Wages
│   ├── PF Contribution
│   └── ESIC / Gratuity / Leave Encashment
├── Finance Costs (Interest on Loans, Bank Charges)
├── Depreciation & Amortisation (as per Schedule II)
├── Other Expenses
│   ├── Rent
│   ├── Professional Fees
│   ├── Advertisement
│   └── Miscellaneous
└── Tax Expense
    ├── Current Tax (MAT / Regular)
    └── Deferred Tax
```

### Step 3: Validation & Alerts
- Check if Balance Sheet balances (Assets = Liabilities)
- Flag negative balances in unexpected places
- Warn if GST ITC > 3 months (possible blockage)
- Warn if TDS receivable is excessively large vs revenue
- Detect related party transaction disclosures

---

## 5. FINANCIAL HEALTH SCORE (MASTER KPI)

### Overall Health Score: 0–100 (like a CIBIL Score for companies)

```
┌─────────────────────────────────────────────────┐
│           FINANCIAL HEALTH SCORE                 │
│                                                  │
│              78 / 100                            │
│         ████████████████░░░░░                   │
│              GOOD                                │
│                                                  │
│  🟢 Liquidity   🟡 Profitability   🔴 Leverage  │
└─────────────────────────────────────────────────┘
```

### Score Composition
| Category | Weight | Sub-indicators |
|----------|--------|----------------|
| Liquidity | 20% | Current Ratio, Quick Ratio, Cash Ratio |
| Profitability | 25% | Net Margin, ROE, ROA, EBITDA Margin |
| Leverage/Solvency | 20% | Debt-to-Equity, Debt Ratio, Interest Coverage |
| Efficiency | 15% | Debtor Days, Creditor Days, Asset Turnover |
| Cash Flow Quality | 10% | Operating CF, Free CF, CF-to-Debt |
| Compliance Risk | 10% | GST dues, TDS dues, PF/ESI dues |

### Health Zones
- 🟢 **80–100:** Excellent — Strong financial position
- 🟡 **60–79:** Good — Minor areas of concern
- 🟠 **40–59:** Caution — Significant issues need attention
- 🔴 **0–39:** Critical — Immediate action required, IBC/NPA risk

---

## 6. MAIN DASHBOARD — THE REVIEW MEETING VIEW

### Layout: Executive Command Center

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  COMPANY FINANCIAL HEALTH  │  FY 2024-25 vs FY 2023-24  │  [Upload New] [Export]│
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐ │
│  │  HEALTH   │  │ REVENUE   │  │NET PROFIT │  │   CASH    │  │ DEBT-TO-  │ │
│  │   SCORE   │  │           │  │  MARGIN   │  │ POSITION  │  │  EQUITY   │ │
│  │  78/100   │  │ ₹12.4 Cr  │  │   8.2%    │  │ ₹1.8 Cr   │  │   1.4x    │ │
│  │   GOOD    │  │ ▲ +14%    │  │ ▼ -1.2%   │  │ ▲ +23%    │  │ ▼ Better  │ │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘  └───────────┘ │
│                                                                              │
├────────────────────────────────────────────────────────────────────────────-─┤
│  SECTION CARDS (Click any card to drill down)                                │
│                                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐           │
│  │  💰 INCOME &     │  │  📤 EXPENDITURE  │  │  💵 CASH FLOW    │           │
│  │  PROFITABILITY   │  │  ANALYSIS        │  │  DASHBOARD       │           │
│  │                  │  │                  │  │                  │           │
│  │  Revenue: 12.4Cr │  │  Total Exp: 11.4Cr│  │  Op CF: +2.1Cr  │           │
│  │  Gross: 34.2%    │  │  Exp Ratio: 92%  │  │  Free CF: +1.3Cr │           │
│  │  Net: 8.2%       │  │  ⚠ Labour +18%  │  │  Cash Days: 54   │           │
│  │  EBITDA: 14.1%   │  │  [View Details→] │  │  [View Details→] │           │
│  │  [View Details→] │  └──────────────────┘  └──────────────────┘           │
│  └──────────────────┘                                                        │
│                                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐           │
│  │  📋 RECEIVABLES  │  │  📬 PAYABLES     │  │  🏦 DEBT & LOANS │           │
│  │  & DEBTORS       │  │  & CREDITORS     │  │                  │           │
│  │                  │  │                  │  │  Total Debt: 5Cr │           │
│  │  Total: ₹3.2 Cr  │  │  Total: ₹2.1 Cr  │  │  ST Debt: 2.1Cr  │           │
│  │  DSO: 94 days    │  │  DPO: 62 days    │  │  LT Debt: 2.9Cr  │           │
│  │  Bad Debt: 4.2%  │  │  ⚠ GST Pending  │  │  DSCR: 1.8x      │           │
│  │  ⚠ 60+ day dues  │  │  [View Details→] │  │  [View Details→] │           │
│  │  [View Details→] │  └──────────────────┘  └──────────────────┘           │
│  └──────────────────┘                                                        │
│                                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐           │
│  │  ⚡ LIQUIDITY &  │  │  🔄 EFFICIENCY   │  │  🇮🇳 COMPLIANCE  │           │
│  │  WORKING CAPITAL │  │  RATIOS          │  │  HEALTH          │           │
│  │                  │  │                  │  │                  │           │
│  │  Current: 1.6x   │  │  Asset TO: 1.2x  │  │  GST ITC: ✅    │           │
│  │  Quick: 1.1x     │  │  Inv TO: 8.4x    │  │  TDS Payable: ✅ │           │
│  │  Working Cap: 1Cr│  │  CCC: 86 days    │  │  PF/ESI: ⚠️      │           │
│  │  [View Details→] │  │  [View Details→] │  │  ROC Filing: ✅  │           │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘           │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. DETAILED SECTION SPECIFICATIONS

### 7.1 Income & Profitability

**Metrics Shown:**
| Metric | Formula | Indian Context |
|--------|---------|----------------|
| Revenue from Operations | Net of GST | As per Ind AS 115 |
| Gross Profit | Revenue - COGS | |
| EBITDA | PBT + Depreciation + Finance Costs | |
| EBIT / Operating Profit | PBT + Finance Costs | |
| PBT | Profit Before Tax | |
| PAT | Profit After Tax (Net Profit) | |
| Gross Margin % | Gross Profit / Revenue × 100 | |
| Net Margin % | PAT / Revenue × 100 | |
| EBITDA Margin % | EBITDA / Revenue × 100 | |
| Return on Equity (ROE) | PAT / Shareholders' Equity × 100 | |
| Return on Assets (ROA) | PAT / Total Assets × 100 | |
| Return on Capital Employed (ROCE) | EBIT / Capital Employed × 100 | Key for Indian investors |
| Earnings Per Share (EPS) | PAT / No. of Shares | If applicable |

**Charts:**
- Revenue trend (bar chart, monthly/quarterly/annual)
- Profitability waterfall: Revenue → Gross → EBITDA → EBIT → PBT → PAT
- Margin trend lines (Gross, EBITDA, Net) over years
- Revenue vs Expense comparison (stacked bar)

**Drill-Down:**
- Revenue split by product/segment (if available)
- Expense category breakdown
- YoY change on every line item with % delta

---

### 7.2 Expenditure Analysis

**Metrics Shown:**
| Category | Sub-items |
|----------|-----------|
| COGS / Direct Costs | Raw material, purchase of stock-in-trade, changes in inventory |
| Employee Costs | Salaries, PF, ESIC, Gratuity, Bonus |
| Finance Costs | Interest on term loans, CC/OD interest, bank charges, processing fees |
| Depreciation | As per Schedule II, Companies Act 2013 |
| GST Non-recoverable | Input tax on exempt supplies (Indian-specific) |
| Other Operating Expenses | Rent, utilities, professional fees, travel |
| Extraordinary Items | One-time write-offs, provisions |

**Charts:**
- Expense breakdown donut/pie chart
- Expense ratio (Exp / Revenue) trend over years
- Top 5 expense categories — trend bars
- Fixed vs Variable cost split
- Employee cost as % of revenue

**Key Indian Alerts:**
- Labour cost > 30% of revenue — flag for review
- Finance costs > 5% of revenue — debt servicing concern
- Depreciation mismatch between tax books and Companies Act books

---

### 7.3 Cash Flow Dashboard

**Three Sections:**
1. **Operating Cash Flow (OCF)** — Core business operations
2. **Investing Cash Flow (ICF)** — CapEx, investments
3. **Financing Cash Flow (FCF)** — Loan drawdowns, repayments, dividends

**Key Metrics:**
| Metric | Formula |
|--------|---------|
| Operating Cash Flow | PAT + Depreciation ± Working Capital changes |
| Free Cash Flow | OCF − Capital Expenditure |
| Cash Flow to Debt | OCF / Total Debt |
| Cash Conversion Ratio | OCF / EBITDA |
| CapEx Intensity | CapEx / Revenue |
| Cash Burn Rate | Monthly average negative OCF (if applicable) |
| Cash Runway | Cash Balance / Monthly Burn Rate |
| Operating CF Margin | OCF / Revenue |

**Charts:**
- Waterfall chart: OCF → ICF → FCF → Net Cash Change
- Cash position over 12 months (line chart)
- Cash flow vs PAT comparison (are profits converting to cash?)
- CapEx trend

**Indian Context Alerts:**
- Section 40A(3): If cash payments > ₹10,000 in a day detected in large misc. expense
- Cash sales vs bank receipts mismatch (possible tax risk)
- Loan repayments vs DSCR health

---

### 7.4 Receivables & Debtors

**Metrics Shown:**
| Metric | Formula | Benchmark |
|--------|---------|-----------|
| Total Trade Receivables | From Balance Sheet | — |
| Debtors Turnover Ratio | Revenue / Avg Trade Receivables | Higher = Better |
| Days Sales Outstanding (DSO) | 365 / Debtors Turnover | <60 days ideal for India |
| Debtors as % of Revenue | Trade Receivables / Revenue × 100 | <25% ideal |
| Bad Debt Ratio | Bad Debts Written Off / Revenue × 100 | <2% ideal |
| Provision for Doubtful Debts | From Notes to Accounts | — |
| Net Realizable Debtors | Gross Debtors − Provision | — |

**Ageing Bucket Analysis:**
```
Debtor Age Buckets:
├── 0–30 days:  ₹X Cr  (XX%)  🟢
├── 31–60 days: ₹X Cr  (XX%)  🟡
├── 61–90 days: ₹X Cr  (XX%)  🟠
├── 91–180 days:₹X Cr  (XX%)  🔴
└── 180+ days:  ₹X Cr  (XX%)  🔴 (Possible bad debt)
```

**Indian Context:**
- MSME debtors: Flag if outstanding > 45 days (MSME Act, Section 15 compliance risk for the payer)
- GST implications on bad debt write-offs (ITC reversal required)
- Related party debtors — highlight separately
- Advance to suppliers vs trade receivables distinction

---

### 7.5 Payables & Creditors

**Metrics Shown:**
| Metric | Formula | Benchmark |
|--------|---------|-----------|
| Total Trade Payables | From Balance Sheet | — |
| Creditor Turnover Ratio | COGS / Avg Trade Payables | — |
| Days Payable Outstanding (DPO) | 365 / Creditor Turnover | 30–60 days healthy |
| Statutory Payables | GST, TDS, PF, ESI, PT outstanding | Should be NIL ideally |

**Payables Breakdown:**
- MSME Creditors vs Non-MSME Creditors (MSME disclosure per Companies Act)
- GST Payable (CGST / SGST / IGST) — is it current or overdue?
- TDS Payable — overdue TDS attracts interest + penalty under IT Act
- PF / ESI Payable — overdue = serious legal risk (criminal liability)
- Advance from customers — liability or revenue recognition issue?

**Indian-Specific Alerts:**
- MSME payable overdue > 45 days: Legal risk + MCA filing obligation
- GST payable overdue: Interest @18% p.a. + penalties
- TDS payable overdue: Interest @1.5% per month under Section 201
- PF/ESI: Directors can be personally liable for defaults

---

### 7.6 Debt & Loans Dashboard

**Loan Portfolio View:**
```
┌────────────────────────────────────────────────────────┐
│               DEBT STRUCTURE                           │
│                                                        │
│  Short-Term (< 1 year)          Long-Term (> 1 year) │
│  ├── CC / OD Limit: ₹2Cr        ├── Term Loan 1: ₹2Cr │
│  ├── WCDL: ₹50L                 ├── Term Loan 2: ₹80L │
│  └── Buyers Credit: ₹30L        └── NCD: ₹10L         │
│                                                        │
│  Total: ₹2.8 Cr                 Total: ₹2.9 Cr        │
└────────────────────────────────────────────────────────┘
```

**Key Metrics:**
| Metric | Formula | Indian Benchmark |
|--------|---------|-----------------|
| Total Debt | ST Borrowings + LT Borrowings | — |
| Debt Ratio | Total Debt / Total Assets | <0.5 preferred |
| Debt-to-Equity (D/E) | Total Debt / Shareholders' Equity | <2x for most industries |
| Interest Coverage Ratio | EBIT / Finance Costs | >2x minimum; >3x healthy |
| Debt Service Coverage (DSCR) | (PAT + Depreciation) / (Loan EMI + Interest) | >1.25x (RBI norm) |
| Promoter Loans | Unsecured loans from directors/promoters | Flag if > 20% of total debt |
| Net Debt | Total Debt − Cash & Equivalents | — |
| Net Debt to EBITDA | Net Debt / EBITDA | <3x healthy |

**NPA Risk Assessment (RBI Framework):**
- Standard: Regular repayment, DSCR > 1.25x
- Sub-standard: Overdue 90 days, DSCR 1.0–1.25x
- Doubtful: Overdue 12+ months
- Loss: Unrecoverable

**IBC (Insolvency & Bankruptcy Code) Risk Flags:**
- Negative net worth
- Default on debt > ₹1 Crore (CIRP trigger threshold)
- Debt > 3x equity for 3+ consecutive years

**Charts:**
- Debt maturity profile (bar chart: what falls due each year)
- Interest expense trend
- Debt repayment schedule vs projected cash flow

---

### 7.7 Liquidity & Working Capital

| Metric | Formula | Healthy Range |
|--------|---------|---------------|
| Current Ratio | Current Assets / Current Liabilities | 1.5–2.5x |
| Quick Ratio (Acid Test) | (Current Assets − Inventory) / Current Liabilities | >1x |
| Cash Ratio | Cash & Equivalents / Current Liabilities | >0.2x |
| Working Capital | Current Assets − Current Liabilities | Positive |
| Net Working Capital Cycle | DSO + DIO − DPO | Lower = Better |
| Cash Conversion Cycle | DSO + DIO − DPO (in days) | <90 days ideal |
| Operating Cycle | DSO + DIO | — |

**Working Capital Components:**
```
Working Capital Composition:
├── (+) Debtors (DSO: XX days)
├── (+) Inventory (DIO: XX days)
├── (+) Advances to Suppliers
├── (+) GST ITC Receivable
├── (−) Creditors (DPO: XX days)
├── (−) Customer Advances
└── (−) Statutory Payables
     = Net Working Capital: ₹X Cr
```

---

### 7.8 Efficiency Ratios

| Metric | Formula |
|--------|---------|
| Asset Turnover | Revenue / Average Total Assets |
| Fixed Asset Turnover | Revenue / Net Fixed Assets |
| Inventory Turnover | COGS / Average Inventory |
| Days Inventory Outstanding (DIO) | 365 / Inventory Turnover |
| Capital Productivity | Revenue / Capital Employed |
| Revenue per Employee | Revenue / Total Headcount (if available) |
| Overhead Efficiency | Overheads / Revenue |

---

### 7.9 Indian Compliance Health Monitor

This is **unique to the Indian context** and not found in any global financial tool.

| Compliance Area | Status | Risk Level |
|----------------|--------|-----------|
| **GST Filing** | Returns filed up to date? | 🔴 Non-filing = heavy penalty |
| **GST ITC Utilisation** | ITC blocked > ₹X? | 🟡 Cash flow impact |
| **TDS Deducted & Deposited** | Deducted but not deposited? | 🔴 Sec 201 + interest + prosecution |
| **Advance Tax Paid** | Adequate installments paid? | 🟡 Interest under Sec 234B/234C |
| **PF / ESI Deposited** | Wage month + 15 days rule | 🔴 Criminal liability for directors |
| **Professional Tax** | State-specific | 🟡 Minor penalties |
| **ROC / MCA Filings** | Annual Return (AOC-4, MGT-7) | 🟠 Penalty + disqualification |
| **Related Party Disclosures** | Sec 188 compliance | 🟠 |
| **MSME Payments** | Within 45 days | 🟡 Interest obligation |

---

## 8. YEAR-OVER-YEAR COMPARISON ENGINE

### Comparison View (Side-by-Side)

```
┌──────────────────────────────────────────────────────────────────┐
│                  FY 2024-25  vs  FY 2023-24                     │
│                                                                  │
│  Metric              FY25        FY24       Change    Status     │
│  ─────────────────────────────────────────────────────────────  │
│  Revenue             ₹12.4 Cr    ₹10.9 Cr   +14.0%   🟢 Better  │
│  Gross Margin        34.2%       36.8%       -2.6pp   🔴 Worse   │
│  Net Margin          8.2%        9.4%        -1.2pp   🔴 Worse   │
│  EBITDA Margin       14.1%       13.9%       +0.2pp   🟡 Stable  │
│  Current Ratio       1.6x        1.4x        +0.2x    🟢 Better  │
│  D/E Ratio           1.4x        1.8x        -0.4x    🟢 Better  │
│  DSO                 94 days     102 days    -8 days  🟢 Better  │
│  DPO                 62 days     58 days     +4 days  🟡 Monitor │
│  Bad Debt %          4.2%        2.8%        +1.4pp   🔴 Worse   │
└──────────────────────────────────────────────────────────────────┘
```

### What Was Better / What Was Worse
Auto-generated narrative:
```
📈 IMPROVEMENTS (FY25 vs FY24):
• Revenue grew 14% — strong top-line growth
• Debt-to-Equity improved from 1.8x to 1.4x — deleveraging is working
• DSO improved by 8 days — collections are getting faster
• Current ratio improved — better short-term solvency

⚠️ DETERIORATION (FY25 vs FY24):
• Gross Margin fell 2.6 percentage points — cost of raw materials rose
• Net Margin declined — profitability not keeping pace with revenue growth
• Bad Debt ratio rose from 2.8% to 4.2% — debtors quality is worsening
• Finance costs up 22% despite lower D/E — possibly higher interest rates

🔍 ROOT CAUSE ANALYSIS:
Revenue grew but margins fell → suggests input cost pressure, not a demand problem
Bad debt rising alongside DSO improvement → some debtors paid faster, but new risky debtors added
Finance cost rising despite deleveraging → floating rate loans repriced higher
```

### Trend Charts (Multi-Year)
- Line charts for all key metrics across up to 5 FYs
- Waterfall charts showing what drove profit change
- Bridge charts: FY24 PAT → FY25 PAT (showing Revenue impact, Margin impact, Cost impact)
- Heatmap: All metrics × All years, colored Red/Green

---

## 9. INTERCONNECTIVITY & IMPACT ANALYSIS

### "What is affecting what?" — Cause & Effect Map

When user clicks on a metric showing deterioration, they see:

```
You clicked: Net Margin ↓ (from 9.4% to 8.2%)

WHAT IS IMPACTING THIS:
┌─────────────────────────────────────────┐
│  ↑ Finance Costs (+22%)    → Impact: -0.8pp on net margin  │
│  ↑ Labour Costs (+18%)     → Impact: -0.5pp on net margin  │
│  ↓ Gross Margin (-2.6pp)   → Impact: -2.6pp on net margin  │
│  ↑ Revenue (+14%)          → Positive: +1.7pp offset       │
└─────────────────────────────────────────────────────────────┘

THIS IS IMPACTING:
• ROE → reduced from 18% to 14%
• PAT → ₹X Cr lower than expected
• Free Cash Flow → lower by ₹Y Cr
• Dividend capacity → reduced
```

### Filter & Drill Capabilities
- **Date filter:** Select specific FY, quarter, or half-year
- **Metric filter:** Select which metrics to compare
- **Category filter:** View only Liquidity, or only Profitability, etc.
- **Statement filter:** View only Balance Sheet-derived vs P&L-derived metrics
- **Benchmark filter:** Compare against industry averages

---

## 10. SUGGESTIONS & RECOMMENDATIONS ENGINE

### Priority Action Panel

```
┌──────────────────────────────────────────────────────────────┐
│                  RECOMMENDATIONS                              │
├──────────────────────────────────────────────────────────────┤
│  🔴 HIGH PRIORITY                                             │
│  ├── Bad debt ratio at 4.2% — Review and write off overdue   │
│  │   debtors. Reverse GST ITC on written-off amounts.        │
│  │   [Estimated Impact: Improve true net margin by 0.8pp]    │
│  └── PF payable overdue by 2 months — Deposit immediately    │
│      to avoid criminal liability on directors                │
│                                                              │
│  🟡 MEDIUM PRIORITY                                           │
│  ├── DSO at 94 days — Industry average is ~60 days           │
│  │   Introduce early payment discounts for key customers     │
│  ├── Finance costs rising — Consider fixed-rate refinancing  │
│  └── GST ITC utilisation can be improved — ₹X Lakh pending  │
│                                                              │
│  🟢 POSITIVE REINFORCEMENT                                    │
│  ├── D/E improvement is excellent — continue deleveraging    │
│  └── Revenue growth at 14% — above industry average          │
└──────────────────────────────────────────────────────────────┘
```

---

## 11. TECHNOLOGY STACK

### Frontend
| Layer | Technology | Reason |
|-------|-----------|--------|
| Framework | Next.js 14 (App Router) + TypeScript | SSR, performance, type safety |
| Styling | Tailwind CSS + shadcn/ui | Beautiful, consistent, accessible |
| Charts | Recharts + D3.js | Rich financial chart types |
| Tables | TanStack Table (React Table v8) | Sortable, filterable data tables |
| File Upload | react-dropzone | Drag-and-drop, multi-file |
| State | Zustand | Lightweight global state |
| Animations | Framer Motion | Smooth transitions, drill-down effects |
| Icons | Lucide React | Clean, consistent icon set |

### Backend
| Layer | Technology | Reason |
|-------|-----------|--------|
| Framework | FastAPI (Python) | Fast, async, auto-docs |
| Excel Parsing | pandas + openpyxl | Industry standard, handles Indian formats |
| PDF Parsing | pdfplumber + tabula-py | Table extraction from PDF |
| Tally Export | pandas (CSV/Excel) | Tally exports as Excel/CSV |
| Calculations | pandas + numpy | Vectorised financial calculations |
| Data Storage | SQLite (via SQLAlchemy) | Simple, file-based, no server needed |
| API Format | REST + JSON | Standard, easy frontend integration |

### Infrastructure
| Component | Choice |
|-----------|--------|
| Deployment | Docker (frontend + backend containers) |
| Environment | .env for API keys, config |
| File Storage | Local filesystem (uploads folder) |

---

## 12. APPLICATION PAGES / ROUTES

```
/                          → Landing page (upload area + feature overview)
/upload                    → File upload + mapping/validation wizard
/dashboard                 → Main financial health dashboard
/dashboard/income          → Income & Profitability deep-dive
/dashboard/expenses        → Expenditure deep-dive
/dashboard/cashflow        → Cash Flow statement deep-dive
/dashboard/receivables     → Debtors & receivables deep-dive
/dashboard/payables        → Creditors & payables deep-dive
/dashboard/debt            → Debt & loans deep-dive
/dashboard/liquidity       → Liquidity & working capital
/dashboard/efficiency      → Efficiency ratios
/dashboard/compliance      → Indian compliance health
/compare                   → Year-over-year comparison view
/recommendations           → Suggestions & action items
/reports                   → Export/download dashboard as PDF report
```

---

## 13. FILE STRUCTURE (PROPOSED)

```
company-financial-health-calculator/
├── frontend/                          # Next.js app
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                   # Landing / Upload
│   │   ├── dashboard/
│   │   │   ├── page.tsx               # Main dashboard
│   │   │   ├── income/page.tsx
│   │   │   ├── expenses/page.tsx
│   │   │   ├── cashflow/page.tsx
│   │   │   ├── receivables/page.tsx
│   │   │   ├── payables/page.tsx
│   │   │   ├── debt/page.tsx
│   │   │   ├── liquidity/page.tsx
│   │   │   ├── efficiency/page.tsx
│   │   │   └── compliance/page.tsx
│   │   ├── compare/page.tsx
│   │   └── recommendations/page.tsx
│   ├── components/
│   │   ├── upload/                    # Upload wizard components
│   │   ├── dashboard/                 # Dashboard cards, charts
│   │   ├── charts/                    # Recharts wrappers
│   │   ├── tables/                    # Data tables
│   │   ├── health-score/             # Health score widget
│   │   └── ui/                        # shadcn/ui components
│   └── lib/
│       ├── types.ts                   # TypeScript interfaces
│       ├── api.ts                     # API client
│       └── formatters.ts             # INR formatting, % formatting
│
├── backend/                           # FastAPI app
│   ├── main.py                        # FastAPI app entry
│   ├── routers/
│   │   ├── upload.py                  # File upload endpoints
│   │   ├── parse.py                   # Document parsing
│   │   ├── calculate.py               # Financial calculations
│   │   └── compare.py                 # YoY comparison
│   ├── services/
│   │   ├── excel_parser.py            # Excel/CSV parsing
│   │   ├── pdf_parser.py              # PDF table extraction
│   │   ├── mapper.py                  # Field mapping engine
│   │   ├── calculator.py              # All ratio calculations
│   │   ├── scorer.py                  # Health score engine
│   │   ├── recommender.py             # Suggestions engine
│   │   └── compliance_checker.py      # Indian compliance checks
│   ├── models/
│   │   ├── financial_data.py          # Data models
│   │   └── database.py                # SQLite setup
│   └── utils/
│       ├── indian_formats.py          # Indian number formatting
│       └── constants.py               # Ratio benchmarks, thresholds
│
├── PRT.md                             # This document
├── docker-compose.yml
└── README.md
```

---

## 14. IMPLEMENTATION PHASES

### Phase 1 — Foundation (Core working product)
1. Project setup: Next.js frontend + FastAPI backend
2. File upload UI + Excel/CSV parsing
3. Manual column mapping wizard
4. Core financial calculations (all ratios)
5. Main dashboard with 9 section cards
6. Health Score calculation

### Phase 2 — Depth & Detail
7. All 9 deep-dive pages
8. Interactive charts (Recharts)
9. Indian compliance checker
10. Year-over-year comparison engine

### Phase 3 — Intelligence & Polish
11. PDF parsing (pdfplumber)
12. Cause & effect impact analysis
13. Recommendations engine
14. Waterfall & bridge charts
15. Export to PDF report
16. Tally / Zoho data format support

---

## 15. INDIAN-SPECIFIC DESIGN DECISIONS

| Design Decision | Rationale |
|----------------|-----------|
| **₹ currency, Indian numbering** | Lakhs, Crores (not millions/billions) — e.g., ₹1,23,45,678 |
| **April–March FY labelling** | "FY 2024-25" not "FY 2025" |
| **Schedule III field names** | "Trade Receivables" not "Accounts Receivable", "Reserves & Surplus" not "Retained Earnings" |
| **GST as a separate module** | GST ITC, GST payable, GST on bad debts — all unique to India |
| **TDS/TCS tracking** | TDS deducted, deposited, refundable — a major working capital item in India |
| **MSME compliance** | Payment timelines, disclosure requirements — legal obligation |
| **Promoter loans** | Unsecured loans from directors/promoters — very common in Indian SMEs, needs special treatment |
| **CC/OD facility** | Indian banks' working capital facilities — different from standard ST debt |
| **IBC risk flag** | Unique to India — creditor-initiated insolvency if default > ₹1 Cr |
| **DTA/DTL** | Deferred tax treatment under Ind AS — shown separately |
| **Related Party Transactions** | Sec 188, Companies Act — significant governance risk in Indian SMEs |

---

## 16. USER EXPERIENCE PRINCIPLES

1. **First Glance = Full Picture** — The main dashboard should tell the full story in under 60 seconds without scrolling
2. **Traffic Light System** — Every metric has a muted color-coded status badge, instantly readable
3. **Click to Dive** — Every card on the dashboard is clickable to go deeper
4. **Indian Numerals** — Display in Lakhs and Crores (e.g., ₹12.4 Cr, ₹84.2 L)
5. **Tooltip on Everything** — Every metric, every abbreviation has a hover tooltip: formula + plain English + what it signifies + Indian context
6. **Comparison Always Visible** — When 2 years are uploaded, a delta badge appears on every metric automatically
7. **Mobile Responsive** — CFOs review on phones too

---

## 17. PRACTICAL DAY-TO-DAY DASHBOARD (OPERATOR'S VIEW)

> The audit-style dashboard tells you *how healthy your company is*. This view tells you *whether you can survive next Tuesday*.

This is a second dashboard mode — toggle between **"CFO Audit View"** and **"Operator's Daily View"**. Built for founders, operations heads, and finance managers who need ground-level, real-time operational clarity — not ratios, but answers to the questions that keep them up at night.

---

### 17.1 THE OPERATOR'S SEVEN QUESTIONS

Every section of this view answers one burning question:

| # | The Question | Section Name |
|---|-------------|-------------|
| 1 | **Can I pay everyone this month?** | Cash Survival Panel |
| 2 | **Who owes me money right now?** | Live Collections Tracker |
| 3 | **Who am I supposed to pay right now?** | Upcoming Obligations |
| 4 | **Am I spending more than I should?** | Expense Pulse |
| 5 | **How much runway do I have?** | Burn & Runway Meter |
| 6 | **How stretched is my credit line?** | Credit Headroom |
| 7 | **What could blindside me this month?** | Risk Radar |

---

### 17.2 CASH SURVIVAL PANEL

**"Can I pay everyone this month?"**

```
┌─────────────────────────────────────────────────────────┐
│  CASH POSITION                                          │
│                                                         │
│  In Bank Today:          ₹18.4 L                       │
│  Expected In (30 days):  ₹34.2 L   (from known debtors)│
│  Must Pay Out (30 days): ₹28.7 L   (known obligations) │
│                          ───────                        │
│  Projected Net (30 days): ₹23.9 L   ✅ SAFE            │
│                                                         │
│  60-day projection:       ₹9.2 L    🟡 WATCH           │
│  90-day projection:      -₹4.1 L    🔴 DANGER          │
│                                                         │
│  [View breakdown →]                                     │
└─────────────────────────────────────────────────────────┘
```

**What it shows:**
- Current bank balance (from uploaded statement or Balance Sheet)
- Money expected in (from debtor ageing — amounts due in next 30/60/90 days)
- Money going out (salary date, loan EMI date, GST date, vendor payments, rent)
- Net projected position at 30, 60, 90 days
- **Plain language verdict:** Safe / Watch / Danger

**Key sub-metrics with tooltips:**

| Metric | What it Means (Plain English) | Signifies |
|--------|-------------------------------|-----------|
| Net Cash Position | Money left after all known payments | Your financial breathing room |
| Salary Cover Ratio | Cash ÷ Monthly salary bill | How many months of salaries you can pay without any revenue |
| Cash-to-Monthly-Burn | Cash balance ÷ Monthly cash outflow | Weeks of operation left if revenue stops today |
| Payment-on-Time Score | % of your obligations paid on due date | Discipline and credibility with vendors and banks |

---

### 17.3 LIVE COLLECTIONS TRACKER

**"Who owes me money right now, and is it getting collected?"**

```
┌──────────────────────────────────────────────────────────────┐
│  MONEY OWED TO YOU                     Total: ₹32.4 Lakhs   │
├──────────────────────────────────────────────────────────────┤
│  Bucket        Amount    % of Total   Status                │
│  ─────────────────────────────────────────────────────────  │
│  Due this week  ₹8.2 L      25%       🟢 On Track          │
│  1–30 days      ₹12.4 L     38%       🟢 Normal            │
│  31–60 days     ₹6.8 L      21%       🟡 Follow Up         │
│  61–90 days     ₹3.1 L      10%       🟠 Urgent            │
│  90+ days       ₹1.9 L       6%       🔴 Possible Bad Debt  │
├──────────────────────────────────────────────────────────────┤
│  Top 3 overdue customers:                                    │
│  1. XYZ Pvt Ltd — ₹2.8 L — 74 days overdue                 │
│  2. ABC Traders — ₹1.6 L — 61 days overdue                 │
│  3. PQR Corp    — ₹1.1 L — 58 days overdue                 │
│                                                              │
│  MSME Alert: 2 customers are MSME — payment due within 45   │
│  days or you may owe them interest under MSME Act           │
└──────────────────────────────────────────────────────────────┘
```

**Practical indicators:**

| Metric | Plain English | Signifies |
|--------|--------------|-----------|
| Collection Efficiency % | Amount collected this month ÷ Amount billed × 100 | Are customers actually paying, or just placing orders? |
| Bad Debt Creep | Month-on-month rise in 90+ day bucket | Early warning that customer base quality is slipping |
| MSME Exposure | Amount owed BY you to MSME suppliers | Potential interest liability if not paid within 45 days |
| Top 5 Debtor Concentration | Top 5 debtors as % of total receivables | Business risk — if one big customer doesn't pay, how badly does it hurt? |

---

### 17.4 UPCOMING OBLIGATIONS CALENDAR

**"What do I need to pay, and when?"**

```
┌──────────────────────────────────────────────────────────┐
│  PAYMENT CALENDAR — Next 60 Days                        │
├──────────────────────────────────────────────────────────┤
│  Date        Obligation          Amount    Status        │
│  ─────────────────────────────────────────────────────  │
│  Feb 7       TDS Deposit          ₹1.4 L   ⚠ 3 days     │
│  Feb 10      Salaries             ₹8.2 L   ✅ Cash Ready │
│  Feb 15      GST-3B Filing        ₹3.1 L   ✅ Cash Ready │
│  Feb 20      PF / ESI Deposit     ₹62 K    ✅ Cash Ready │
│  Feb 28      Term Loan EMI        ₹1.8 L   🟡 Tight      │
│  Mar 7       TDS Deposit          ₹1.4 L   🔴 Shortfall  │
│  Mar 15      Advance Tax (Q4)     ₹4.2 L   🔴 Plan Ahead │
│  Mar 15      GST-3B Filing        Est.₹2.8L ✅           │
│  Mar 31      Financial Year Close                        │
└──────────────────────────────────────────────────────────┘
```

**Categories of obligations tracked:**

| Category | Items | Why It Matters |
|----------|-------|---------------|
| **Statutory (Hard Deadline)** | TDS deposit, GST, Advance Tax, PF, ESI | Missing = interest + penalty + legal action. No negotiation possible. |
| **Operational (Negotiable)** | Vendor payments, rent, subscriptions | Delaying affects relationships but not immediately legal |
| **Debt Service** | Loan EMIs, CC interest, OD charges | Missing = NPA risk, bank relationship damage |
| **Payroll** | Salaries, contractor payments | Missing = employee trust collapse, attrition risk |
| **Year-End** | March 31 closing obligations, audit fees | Annual compliance and audit readiness |

**Tooltip for each obligation type — what happens if missed:**
- TDS not deposited by 7th: 1.5% interest per month under Section 201 + potential prosecution
- GST-3B not filed: Late fee ₹50/day + interest 18% p.a. on liability
- PF not deposited: Criminal prosecution of directors, penalty, EPFO notice
- EMI missed: 30-day grace, then NPA classification, bank facilities at risk

---

### 17.5 EXPENSE PULSE

**"Am I spending more than I should this month?"**

```
┌──────────────────────────────────────────────────────────┐
│  EXPENSE PULSE                                           │
├──────────────────────────────────────────────────────────┤
│  Category          This Month   Last Month   vs Budget   │
│  ─────────────────────────────────────────────────────  │
│  Salaries           ₹8.2 L       ₹8.1 L      On track  │
│  Raw Material       ₹14.3 L      ₹11.2 L     🔴 +27%   │
│  Logistics          ₹2.1 L       ₹1.9 L      🟡 +11%   │
│  Marketing          ₹1.4 L       ₹2.2 L      🟢 -36%   │
│  Office & Admin     ₹0.8 L       ₹0.7 L      On track  │
│  Finance Costs      ₹1.1 L       ₹1.0 L      🟡 +10%   │
│                                                          │
│  ⚠ Raw Material spike — investigate before month close  │
└──────────────────────────────────────────────────────────┘
```

**Practical expense metrics:**

| Metric | Plain English | Signifies |
|--------|--------------|-----------|
| Expense-to-Revenue Ratio | Total expenses ÷ Revenue | For every ₹1 earned, how much is spent? If >90%, very little left as profit |
| Fixed Cost Coverage | Fixed monthly costs ÷ Monthly revenue | The minimum revenue needed just to keep the lights on |
| Variable Cost Ratio | Variable costs ÷ Revenue | How costs scale with sales — high ratio = good scalability |
| Cost Per Employee | Total costs ÷ Headcount | Productivity and overhead efficiency measure |
| Month-on-Month Expense Drift | % change in each expense category | Catches creeping costs before they become a problem |

---

### 17.6 BURN & RUNWAY METER

**"How long can we survive if revenue stops tomorrow?"**

```
┌────────────────────────────────────────────────────────────┐
│  BURN & RUNWAY                                             │
│                                                            │
│  Monthly Cash Burn (avg):      ₹22.4 L / month            │
│  Cash & Liquid Assets:         ₹68.2 L                    │
│  Runway:                       3.0 months                  │
│                                ████████░░░░░░░░░░░░░░░     │
│                                                            │
│  With CC/OD headroom:          ₹88.2 L                    │
│  Extended Runway:              3.9 months                  │
│                                                            │
│  🔴 CRITICAL — Less than 4 months runway                  │
│  Suggestion: Accelerate collections. ₹9.1 L in 60+ day   │
│  debtors can extend runway by 3 weeks.                    │
└────────────────────────────────────────────────────────────┘
```

**Runway zones:**
- 🟢 12+ months — Healthy, can plan and invest
- 🟡 6–12 months — Comfortable but plan fundraising or growth
- 🟠 3–6 months — Caution — accelerate collections, defer non-essential spend
- 🔴 <3 months — Critical — immediate action required

| Metric | Plain English | Signifies |
|--------|--------------|-----------|
| Gross Burn | Total cash spent per month | Absolute cost of running the company |
| Net Burn | Cash spent minus cash received per month | Real rate at which reserves are depleting |
| Runway | Cash ÷ Monthly net burn | How long the company can survive at current pace |
| Break-even Point | Revenue needed to make net burn = zero | The minimum revenue floor — falling below = emergency |

---

### 17.7 CREDIT HEADROOM MONITOR

**"How stretched is my bank credit line?"**

```
┌──────────────────────────────────────────────────────────┐
│  CREDIT LINE HEALTH                                      │
├──────────────────────────────────────────────────────────┤
│  CC Limit (SBI):     ₹50 L    Used: ₹38 L    Free: ₹12 L │
│  OD Limit (HDFC):    ₹20 L    Used: ₹18 L    Free: ₹2 L  │
│  WCDL (Axis):        ₹30 L    Used: ₹0 L     Free: ₹30 L │
│                                                           │
│  Total Sanctioned:   ₹100 L                              │
│  Total Utilised:     ₹56 L    (56%)  🟡 Moderate         │
│  Available Buffer:   ₹44 L                               │
│                                                           │
│  ⚠ OD almost maxed out — only ₹2 L headroom remaining   │
└──────────────────────────────────────────────────────────┘
```

| Metric | Plain English | Signifies |
|--------|--------------|-----------|
| CC Utilisation % | Cash Credit used ÷ Total CC limit | High utilisation = bank will be concerned; above 80% = overreliance |
| Available Credit Buffer | Undrawn limit across all facilities | Emergency liquidity available without new approvals |
| Interest on CC | Daily interest on CC drawn amount | Running cost of working capital — directly eats into margins |
| Drawing Power vs Limit | RBI norm: CC limited to stock + debtors value | If drawings exceed drawing power, bank can freeze account |

---

### 17.8 RISK RADAR (MONTH-END SURPRISES)

**"What could blindside me this month?"**

Automatically calculated from uploaded data:

```
┌──────────────────────────────────────────────────────────┐
│  RISK RADAR                          Last updated: Today  │
├──────────────────────────────────────────────────────────┤
│  🔴 HIGH                                                  │
│  • Advance Tax Q4 due Mar 15 — ₹4.2 L — only ₹1.8 L    │
│    provisioned. Shortfall of ₹2.4 L.                    │
│  • Debtor XYZ (₹2.8 L) — 74 days overdue, no movement  │
│    in 30 days. Initiate legal notice.                    │
│                                                          │
│  🟡 MEDIUM                                               │
│  • Raw material cost up 27% this month — investigate    │
│    supplier pricing or alternate vendor.                 │
│  • OD utilisation at 90% — only ₹2 L buffer remaining. │
│                                                          │
│  🟢 POSITIVE THIS MONTH                                  │
│  • Collections up 18% vs last month — great momentum.   │
│  • GST ITC of ₹1.1 L eligible for utilisation — use    │
│    before quarter end to reduce cash outflow.            │
└──────────────────────────────────────────────────────────┘
```

---

### 17.9 OPERATOR VIEW vs AUDIT VIEW — TOGGLE

```
┌─────────────────────────────────────┐
│  View Mode:  [Audit / CFO]  [Daily Ops]  │
└─────────────────────────────────────┘
```

| Dimension | Audit / CFO View | Operator's Daily View |
|-----------|-----------------|----------------------|
| **Time horizon** | Annual, Year-on-Year | Next 30 / 60 / 90 days |
| **Audience** | CFO, Board, Auditor, Bank, Investor | Founder, Finance Manager, Ops Head |
| **Language** | Ratios, percentages, Ind AS terms | Rupees, days, deadlines, action items |
| **Primary question** | "How did we do?" | "What do I do today?" |
| **Data source** | Annual financial statements | Balance sheet + debtor/creditor ageing |
| **Output** | Health score, benchmarks, trends | Cash position, payment calendar, risk alerts |

---

## 18. DESIGN SYSTEM

### 18.1 Design Philosophy

> **Calm, credible, and clear.** A financial dashboard should feel like a well-organised desk — not a casino floor. Muted tones, structured whitespace, and a single accent color. Numbers speak; decoration is quiet.

---

### 18.2 Color Palette

**Base Colors**

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-base` | `#F8F7F4` | Page background — warm off-white, easy on eyes |
| `bg-card` | `#FFFFFF` | Card / panel background |
| `bg-subtle` | `#F1F0ED` | Subtle section divider, table alternating row |
| `border` | `#E4E2DC` | All borders — soft, not harsh |
| `text-primary` | `#1C1917` | Main text — near black, warm undertone |
| `text-secondary` | `#6B6560` | Labels, captions, secondary info |
| `text-muted` | `#A8A29E` | Placeholder, disabled, footnote |

**Status Colors (Muted)**

| Status | Background | Text / Icon | Border | Usage |
|--------|-----------|------------|--------|-------|
| 🟢 Good/Positive | `#F0FDF4` | `#166534` | `#BBF7D0` | Healthy metric, improvement, on-track |
| 🟡 Watch/Neutral | `#FEFCE8` | `#854D0E` | `#FEF08A` | Monitor, slight concern |
| 🟠 Caution | `#FFF7ED` | `#9A3412` | `#FED7AA` | Needs attention soon |
| 🔴 Critical | `#FFF1F2` | `#9F1239` | `#FECDD3` | Immediate action required |
| ⬜ No Data | `#F8F7F4` | `#A8A29E` | `#E4E2DC` | Data not available |

**Accent (used sparingly — primary CTA, active tab, links)**

| Token | Hex | Usage |
|-------|-----|-------|
| `accent` | `#3D5A80` | Primary buttons, active navigation, chart primary line |
| `accent-light` | `#E8EEF5` | Accent hover backgrounds |

**Chart Color Sequence (ordered, muted)**

```
1. #3D5A80  — Muted Navy (primary data series)
2. #98C1D9  — Soft Blue (secondary series)
3. #6B9E78  — Muted Sage Green (positive / income)
4. #C17B5A  — Muted Terracotta (expense / cost)
5. #8B7BB5  — Muted Violet (third metric)
6. #B5A642  — Muted Gold (YoY comparison)
7. #A0A0A0  — Neutral Grey (baseline / benchmark)
```

---

### 18.3 Typography

**Font Family:** `Inter` (Google Fonts — free, highly legible, professional)
- Fallback: `system-ui, -apple-system, sans-serif`
- For large numeric values: `Inter` with `font-variant-numeric: tabular-nums` (aligns digits perfectly in tables)

**Type Scale**

| Role | Size | Weight | Color | Example |
|------|------|--------|-------|---------|
| Page Title | 24px / 1.5rem | 600 SemiBold | `text-primary` | "Financial Health Dashboard" |
| Section Heading | 16px / 1rem | 600 SemiBold | `text-primary` | "Income & Profitability" |
| Card Label | 12px / 0.75rem | 500 Medium | `text-secondary` | "NET PROFIT MARGIN" |
| Metric Value (Hero) | 32px / 2rem | 700 Bold | `text-primary` | "₹12.4 Cr" |
| Metric Value (Card) | 22px / 1.375rem | 700 Bold | `text-primary` | "8.2%" |
| Delta Badge | 12px / 0.75rem | 600 | Status color | "+14% vs FY24" |
| Body Text | 14px / 0.875rem | 400 Regular | `text-primary` | Descriptions |
| Caption / Label | 12px / 0.75rem | 400 Regular | `text-secondary` | Chart labels |
| Tooltip Text | 12px / 0.75rem | 400 Regular | `#FFFFFF` on dark bg | Tooltip content |
| Table Data | 13px / 0.8125rem | 400 Regular | `text-primary` | Table values |
| Table Header | 11px / 0.6875rem | 600 SemiBold | `text-secondary` | "CATEGORY", "AMOUNT" |

**INR Formatting Standard:**
```
Under ₹1 Lakh:    ₹84,200   (show exact)
Lakhs:            ₹84.2 L   (1 decimal)
Crores:           ₹12.4 Cr  (1 decimal)
Hundreds of Cr:   ₹234 Cr   (no decimal)
```

---

### 18.4 Component Design Specs

**Metric Card (Standard)**
```
┌──────────────────────────────┐
│  NET PROFIT MARGIN     [?]  │   ← Label (12px, muted, UPPERCASE) + Tooltip icon
│                              │
│  8.2%                        │   ← Value (22px, bold)
│  ▼ 1.2pp vs FY24  🔴        │   ← Delta badge (12px, status-colored)
│                              │
│  ──────────────────────────  │   ← Subtle divider
│  Healthy range: 10–20%       │   ← Context hint (12px, muted)
└──────────────────────────────┘

Border: 1px solid #E4E2DC
Border-radius: 10px
Padding: 20px
Shadow: 0 1px 3px rgba(0,0,0,0.06)
Background: #FFFFFF
```

**Status Badge**
```
[ ▲ +14.0%  vs FY24 ]   ← Green background, dark green text
[ ▼  -1.2pp vs FY24 ]   ← Red background, dark red text
[  → Stable  ]           ← Yellow background, dark amber text
```

**Health Score Widget**
```
┌─────────────────────────────────┐
│  FINANCIAL HEALTH SCORE         │
│                                 │
│         78                      │   ← Large number, bold
│      ── / 100 ──                │
│      ● ● ● ● ○  GOOD           │   ← 5-dot visual scale
│                                 │
│  ████████████████░░░░  78%      │   ← Progress bar, accent color
└─────────────────────────────────┘
```

**Section Card (Clickable Dashboard Card)**
```
┌──────────────────────────────────┐
│  [Icon]  RECEIVABLES & DEBTORS  │   ← Icon + Section name
│  ─────────────────────────────  │
│  ₹32.4 Lakhs outstanding         │   ← Hero number
│  DSO: 94 days  🟠               │   ← Key metric + status
│  Bad Debt: 4.2%  🔴             │   ← Key metric + status
│                                  │
│  View Details  →                 │   ← Subtle link
└──────────────────────────────────┘

Hover state: border-color shifts to accent, subtle lift shadow
Cursor: pointer
```

---

### 18.5 Tooltip Specification

**Every metric on the entire platform carries a tooltip.** Triggered on hover (desktop) or tap (mobile).

**Tooltip Structure:**
```
┌──────────────────────────────────────────────────────┐
│  Days Sales Outstanding (DSO)                        │  ← Full name
│  ─────────────────────────────────────────────────  │
│  Formula:                                            │
│  (Trade Receivables ÷ Revenue) × 365                 │
│                                                      │
│  Plain English:                                      │
│  On average, how many days does it take your        │
│  customers to pay you after you raise an invoice?    │
│                                                      │
│  What it Signifies:                                  │
│  Lower is better. A rising DSO means customers are  │
│  taking longer to pay — hurting your cash flow even │
│  if revenue looks strong on paper.                  │
│                                                      │
│  Indian Context:                                     │
│  MSME customers must be paid within 45 days. If you │
│  are an MSME yourself, track this closely to ensure  │
│  you are not violating Section 15 of the MSME Act.  │
│                                                      │
│  Healthy Range:  < 60 days (services), < 45 days    │
│                  (MSME-supplied goods)               │
└──────────────────────────────────────────────────────┘

Background: #1C1917 (dark, near-black)
Text: #FFFFFF
Max-width: 320px
Border-radius: 8px
Padding: 14px 16px
Font-size: 12px
Shadow: 0 4px 12px rgba(0,0,0,0.2)
```

---

### 18.6 Complete Tooltip Library — All Abbreviations & Metrics

#### PROFITABILITY

| Abbreviation | Full Name | Formula | Plain English | Signifies | Healthy Range |
|-------------|-----------|---------|---------------|-----------|---------------|
| **PAT** | Profit After Tax | Revenue − All Expenses − Tax | The actual money the company kept after paying everyone, including the government | Bottom-line health. If PAT is shrinking even as revenue grows, costs or taxes are eating your business | Positive & growing |
| **PBT** | Profit Before Tax | Revenue − All Expenses (before tax) | Profit before paying income tax | Shows core profitability before tax planning effects | Positive |
| **EBIT** | Earnings Before Interest & Tax | PAT + Tax + Interest | Operating profit — how much the business earns from its core activity, ignoring how it's financed | Measures pure business performance, independent of debt structure or tax | Positive |
| **EBITDA** | Earnings Before Interest, Tax, Depreciation & Amortisation | EBIT + Depreciation + Amortisation | Cash-like profit — closest to "how much cash the business actually generates from operations" | Most commonly used by investors and banks to value a business and assess debt-repayment ability | Industry-dependent; higher = better |
| **Gross Margin** | Gross Profit Margin | (Revenue − COGS) ÷ Revenue × 100 | Of every ₹100 earned, how much is left after paying for what you sold | Measures pricing power and production/sourcing efficiency | Varies by industry; 30–60% for manufacturing |
| **Net Margin** | Net Profit Margin | PAT ÷ Revenue × 100 | Of every ₹100 earned, how much reaches the bottom line as profit | The ultimate efficiency measure — catches all costs, not just production | 5–15% for most Indian SMEs |
| **ROE** | Return on Equity | PAT ÷ Shareholders' Equity × 100 | How much profit does the business generate on money invested by shareholders | Measures how efficiently shareholder money is working. Compared against FD/debt returns | >15% generally considered good |
| **ROA** | Return on Assets | PAT ÷ Total Assets × 100 | How much profit is generated per rupee of assets owned | Asset-heavy businesses (manufacturing) will have lower ROA than asset-light (services) | >5% generally; asset-light >15% |
| **ROCE** | Return on Capital Employed | EBIT ÷ Capital Employed × 100 | How efficiently is ALL capital (equity + debt) being used to generate operating profit | Preferred over ROE by Indian investors — accounts for debt in the picture | Should exceed cost of capital / WACC |

#### LIQUIDITY

| Abbreviation | Full Name | Formula | Plain English | Signifies | Healthy Range |
|-------------|-----------|---------|---------------|-----------|---------------|
| **Current Ratio** | Current Ratio | Current Assets ÷ Current Liabilities | Can you pay all your short-term dues using your short-term assets? | Core short-term solvency check. If below 1, you technically cannot meet your near-term obligations from current assets | 1.5x – 2.5x |
| **Quick Ratio** | Quick Ratio / Acid Test | (Current Assets − Inventory) ÷ Current Liabilities | Can you pay short-term dues WITHOUT selling inventory? | More conservative than Current Ratio — inventory can take time to sell | >1x |
| **Cash Ratio** | Cash Ratio | Cash & Equivalents ÷ Current Liabilities | Can you pay short-term dues using only cash you have right now? | The most stringent liquidity test — pure cash sufficiency | >0.2x |
| **WC** | Working Capital | Current Assets − Current Liabilities | The money "tied up" in running day-to-day operations | Positive WC = business can run its operations. Negative WC = potential short-term crisis | Positive; should grow with revenue |

#### EFFICIENCY

| Abbreviation | Full Name | Formula | Plain English | Signifies | Healthy Range |
|-------------|-----------|---------|---------------|-----------|---------------|
| **DSO** | Days Sales Outstanding | (Trade Receivables ÷ Revenue) × 365 | On average, how many days after billing does a customer pay? | Rising DSO = cash getting stuck in debtors even if revenue looks great | <60 days (services), <45 days (MSME goods) |
| **DPO** | Days Payable Outstanding | (Trade Payables ÷ COGS) × 365 | On average, how many days after receiving goods/services do you pay your vendor? | Higher DPO = more time to use vendors' money; but too high = strained relationships, MSME risk | 30–60 days |
| **DIO** | Days Inventory Outstanding | (Inventory ÷ COGS) × 365 | How many days does your inventory sit before it is sold? | High DIO = money locked in unsold stock. Low DIO = fast-moving, efficient operation | Industry specific; lower = better |
| **CCC** | Cash Conversion Cycle | DSO + DIO − DPO | How many days does it take to convert a rupee of investment back into cash? | The shorter the CCC, the less working capital you need. Negative CCC (e.g., e-commerce) = business funds itself | <90 days for most; lower = better |
| **Asset TO** | Asset Turnover Ratio | Revenue ÷ Average Total Assets | How much revenue does each rupee of assets generate? | Measures operational efficiency — are assets sitting idle or working hard? | >1x (services), 0.5–1x (manufacturing) |
| **Inv TO** | Inventory Turnover Ratio | COGS ÷ Average Inventory | How many times per year is your inventory sold and replaced? | Low turnover = overstock or slow-moving goods. High turnover = lean and efficient | Industry-dependent; 6–12x typical |

#### LEVERAGE / DEBT

| Abbreviation | Full Name | Formula | Plain English | Signifies | Healthy Range |
|-------------|-----------|---------|---------------|-----------|---------------|
| **D/E** | Debt-to-Equity Ratio | Total Debt ÷ Shareholders' Equity | For every ₹1 of owner money, how many rupees are borrowed? | Core leverage measure — banks watch this closely. Very high D/E = fragile to shocks | <2x (SME), <1x (conservative) |
| **Debt Ratio** | Debt Ratio | Total Debt ÷ Total Assets | What fraction of assets is funded by debt? | >0.5 means creditors own more of the business than shareholders | <0.5 preferred |
| **ICR** | Interest Coverage Ratio | EBIT ÷ Finance Costs | How many times can your operating profit cover your interest payments? | Below 1.5x = dangerous — barely covering interest, nothing left for principal. Banks use this for credit decisions | >2x minimum; >3x healthy |
| **DSCR** | Debt Service Coverage Ratio | (PAT + Depreciation) ÷ (Annual Loan Repayment + Interest) | Can operating cash flow comfortably cover all loan repayments + interest? | RBI norm: >1.25x for Standard Asset classification. Below 1x = NPA territory | >1.25x (RBI minimum); >1.5x (healthy) |
| **Net Debt** | Net Debt | Total Debt − Cash & Cash Equivalents | Total borrowings minus what you could immediately use to repay | More accurate than gross debt — cash in bank reduces effective debt burden | Lower = better; zero = debt-free |
| **ND/EBITDA** | Net Debt to EBITDA | Net Debt ÷ EBITDA | How many years of current operating profits would it take to repay net debt? | Standard investor and bank metric. Used for leveraged buyout and credit rating | <3x comfortable; <2x strong |

#### CASH FLOW

| Abbreviation | Full Name | Formula | Plain English | Signifies | Healthy Range |
|-------------|-----------|---------|---------------|-----------|---------------|
| **OCF** | Operating Cash Flow | Cash generated from core business operations (from Cash Flow Statement) | How much actual cash the business generates just by running its operations — not accounting adjustments, real cash | The most honest indicator of business health. A company with good PAT but poor OCF is generating paper profits, not cash | Positive; should track EBITDA |
| **FCF** | Free Cash Flow | OCF − Capital Expenditure | Cash left over after investing in the upkeep and growth of the business | FCF is what's available to repay debt, pay dividends, or fund new growth. Negative FCF is fine during growth phase but not sustainably | Positive for mature businesses |
| **CapEx** | Capital Expenditure | Money spent on buying/upgrading long-term assets (plant, machinery, equipment) | Investment in the future productive capacity of the business | High CapEx vs revenue = aggressive expansion; very low CapEx for an asset-heavy business = ageing infrastructure risk | Benchmarked against revenue and industry |
| **CF/Debt** | Cash Flow to Debt Ratio | OCF ÷ Total Debt | How quickly could you repay all your debt using operating cash flow? | Practicality check on debt load vs. real cash generating capacity | >0.2x (repay in <5 years from OCF) |

#### INDIAN-SPECIFIC

| Abbreviation | Full Name | Plain English | What it Signifies | Risk if Ignored |
|-------------|-----------|--------------|-------------------|----------------|
| **ITC** | Input Tax Credit | GST you paid on purchases that can be offset against GST you collect on sales | Working capital asset — unutilised ITC = cash locked with government | Blocked ITC reduces cash flow; excess ITC vs liability needs GSTR reconciliation |
| **TDS** | Tax Deducted at Source | Tax deducted by the payer before making certain payments (salary, rent, professional fees, etc.) | Governs cash flows — TDS deducted reduces vendor payment; TDS recoverable is a current asset | Deducted but not deposited = interest + penalty + prosecution of directors |
| **TCS** | Tax Collected at Source | Tax collected by seller from buyer on certain high-value transactions | Similar to TDS but collected, not deducted — creates a liability | Must be deposited by 7th of next month; default = same consequences as TDS |
| **MAT** | Minimum Alternate Tax | Minimum tax payable if regular tax works out too low due to deductions | Ensures profitable companies pay some minimum tax even with heavy deductions | MAT credit can be carried forward — track as deferred tax asset |
| **DTA** | Deferred Tax Asset | Tax benefit in the future arising from timing differences between accounting and tax books | Asset on balance sheet — realised when tax savings actually occur in future years | Overstated DTA = inflated balance sheet; reassess annually |
| **DTL** | Deferred Tax Liability | Tax payable in the future due to timing differences | Liability that will crystallise — important for true profit picture | Understated DTL = inflated current profits |
| **CC** | Cash Credit | A revolving short-term credit facility from a bank against stock and debtors | Working capital lifeline for Indian businesses — draws and repays as needed | High utilisation near limit = bank may review/reduce limit; drawing beyond drawing power = account freeze risk |
| **OD** | Overdraft Facility | Bank allows you to withdraw more than the balance in your current account, up to a limit | Short-term operational buffer — usually against FD or property collateral | Maxed-out OD = no emergency buffer; overuse = signals cash flow problems to bank |
| **WCDL** | Working Capital Demand Loan | A fixed-term short-term loan (30–180 days) for specific working capital needs | Cheaper than CC for specific, predictable working capital gaps | Must be repaid by fixed date; cannot roll over indefinitely like CC |
| **NPA** | Non-Performing Asset | A loan where borrower has not made EMI/interest payment for 90+ days | Once classified NPA, bank can recall entire loan, report to CIBIL, and initiate recovery | DSCR < 1.0x is the leading indicator; DSCR < 1.25x = Sub-Standard warning zone |
| **IBC** | Insolvency & Bankruptcy Code | India's insolvency law — a creditor can drag a company to NCLT if a debt of ₹1 Cr+ defaults | The nuclear option — company management loses control; Resolution Professional takes over | Triggered by: negative net worth + inability to pay + creditor filing; Altman Z-Score < 1.8 is a proxy warning |
| **MSME** | Micro, Small & Medium Enterprise | Classification of businesses by investment and turnover thresholds under MSMED Act 2006 | Affects payment timelines — buyers must pay MSMEs within 45 days or face mandatory interest payment | Overdue MSME payables require disclosure in MCA filings; also triggers interest liability |

---

### 18.7 Empty & Loading States

| State | Display |
|-------|---------|
| No data uploaded | Illustrated empty state — "Upload your financials to begin" + upload CTA |
| Data parsing in progress | Skeleton loader on all cards — same layout, pulsing grey blocks |
| Partial data (only P&L, no Balance Sheet) | Cards for missing sections show "Requires Balance Sheet" with explanation |
| Metric not calculable | Metric card shows "—" with tooltip explaining which data is missing |

---

### 18.8 Iconography

**Use Lucide React icons throughout — consistent, clean, minimal stroke weight.**

| Section | Icon |
|---------|------|
| Income / Revenue | `TrendingUp` |
| Expenses / Costs | `Receipt` |
| Cash Flow | `Banknote` |
| Receivables / Debtors | `ArrowDownLeft` |
| Payables / Creditors | `ArrowUpRight` |
| Debt & Loans | `Landmark` |
| Liquidity | `Droplets` |
| Efficiency | `Gauge` |
| Compliance (India) | `ShieldCheck` |
| Health Score | `HeartPulse` |
| Risk / Warning | `AlertTriangle` |
| Recommendation | `Lightbulb` |
| YoY Comparison | `GitCompare` |
| Tooltip / Info | `Info` (size 14, muted color) |
| Download / Export | `Download` |
| Upload | `Upload` |

---

*End of PRT v2.0 — Includes Operator's View + Complete Design System + Full Tooltip Library*
