# Company Financial Health Calculator

An AI-powered financial health dashboard for Indian businesses. Upload any financial document — balance sheet, P&L, annual report, screenshot, PDF, Excel — and instantly get a comprehensive health score with 9 analysis sections, Indian compliance monitoring, and actionable recommendations.

## Deploy (click to get a live link)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ameyaagrawal99/company-financial-health-calculator&root-directory=frontend)

> Click the button above → sign in to Vercel → click **Deploy** → get your live link in ~2 minutes.
> No environment variables needed — the app asks each user for their own OpenAI API key.

## Features

- **Upload anything**: Photos, PDFs, Excel files, screenshots, CSV — GPT-4o Vision reads them all
- **Financial Health Score**: 0–100 weighted score (like CIBIL, but for company financials)
- **9 Analysis Sections**: Income, Expenses, Cash Flow, Receivables, Payables, Debt, Liquidity, Efficiency, Compliance
- **Indian-specific**: GST ITC tracking, TDS/PF/ESI compliance, MSME 45-day rule, IBC risk flags, NPA classification, CC/OD monitoring
- **Year-over-Year Comparison**: Upload comparative financials for delta analysis and trend tracking
- **Recommendations Engine**: Prioritised action items (HIGH / MEDIUM / POSITIVE)
- **No backend required**: Pure Next.js — deploy to Vercel in one click or run locally

## Quick Start

### Option 1: Run Locally (Recommended)

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

You will be prompted to enter your OpenAI API key in the UI, OR set it in a `.env.local` file:

```bash
cp .env.example .env.local
# Edit .env.local and add your key:
# OPENAI_API_KEY=sk-...
```

### Option 2: Docker

```bash
docker compose up
```

Open [http://localhost:3000](http://localhost:3000).

### Option 3: Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ameyaagrawal99/company-financial-health-calculator&root-directory=frontend)

No environment variables required — every user enters their own OpenAI API key in the UI.

## How to Use

1. **Open the app** in your browser
2. **Enter your OpenAI API key** (if not set in `.env.local`) — stored only in your browser, never sent to any server except OpenAI
3. **Upload a financial document**:
   - Balance sheet / P&L (PDF, Excel, photo, screenshot)
   - Annual report
   - CA-prepared statements
   - Any image containing financial data
4. **Wait ~10–20 seconds** for AI analysis
5. **Explore the dashboard**: Health score, 9 detailed sections, compliance monitor, recommendations

### Try Without API Key

Click **"Try with Sample Data"** on the landing page to explore the dashboard with TechPro Solutions Pvt Ltd — a realistic Indian SME for FY 2024-25 and FY 2023-24.

## Document Formats Supported

| Format | How it's processed |
|--------|-------------------|
| Images (JPG, PNG, WEBP) | GPT-4o Vision directly reads the image |
| Scanned PDFs | Converted to image → GPT-4o Vision |
| Digital PDFs | Text extracted → GPT-4o |
| Excel / XLSX | Data extracted via `xlsx` library → GPT-4o |
| CSV | Parsed → GPT-4o |
| Any text file | Sent directly to GPT-4o |

## Dashboard Sections

| Section | Key Metrics |
|---------|-------------|
| **Overview** | Health Score, Revenue, Net Margin, Cash, D/E |
| **Income & Profitability** | Gross/EBITDA/Net margins, ROE, ROA, ROCE |
| **Expenses** | Cost breakdown, labour/finance/material ratios |
| **Cash Flow** | OCF, FCF, cash conversion ratio |
| **Receivables** | DSO, ageing buckets, bad debt risk, ITC receivable |
| **Payables** | DPO, statutory payables (GST/TDS/PF/MSME) |
| **Debt & Leverage** | D/E, ICR, DSCR, NPA risk, IBC trigger flags |
| **Liquidity** | Current/Quick/Cash ratios, working capital composition |
| **Efficiency** | DSO, DPO, DIO, Cash Conversion Cycle, Asset Turnover |
| **Compliance** | GST/TDS/Advance Tax/PF-ESI/ROC/MSME/Related Party |
| **Compare (YoY)** | Side-by-side delta table with improvement/deterioration narrative |
| **Recommendations** | Priority action plan (HIGH/MEDIUM/POSITIVE) |

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **AI**: OpenAI GPT-4o Vision
- **Charts**: Recharts
- **State**: Zustand with persist
- **Styling**: Tailwind CSS
- **File parsing**: pdf-parse (PDFs), xlsx (Excel)
- **Icons**: Lucide React

## Development

```bash
cd frontend
npm install
npm run dev      # Development server on :3000
npm run build    # Production build
npm run lint     # ESLint
```

## Notes

- All financial calculations are performed client-side after AI extraction — no financial data is stored anywhere
- The OpenAI API key entered in the UI is used only for that session and never stored or sent to any server other than OpenAI
- Compliance status is estimated from balance sheet figures; verify with your Chartered Accountant
- The tool uses Indian accounting conventions (Schedules III, Ind AS, GST, TDS, MSME Act)
