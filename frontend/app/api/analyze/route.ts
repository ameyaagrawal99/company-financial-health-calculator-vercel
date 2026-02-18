import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const EXTRACTION_SYSTEM_PROMPT = `You are an expert Indian Chartered Accountant and financial analyst with deep knowledge of:
- Indian GAAP / Ind AS / Companies Act 2013 / Schedule III format
- Tally, Zoho Books, SAP, QuickBooks India exports
- MCA XBRL taxonomy
- Indian financial statement formats used by SMEs, mid-market companies, and large corporates

Your task is to extract ALL financial data from the provided document — no matter what format, language, or structure it appears in.

The document could be:
- A scanned image or photo of a balance sheet / P&L / annual report
- A digital PDF from Tally, Zoho, SAP, or any accounting software
- An Excel or CSV export
- A combined annual report with multiple statements
- A handwritten or typed statement in any Indian format
- A bank statement (extract relevant figures)

EXTRACTION RULES:
1. CURRENCY: Convert everything to Indian Rupees in LAKHS (₹ Lakhs)
   - If figures are in Crores → multiply by 100 to get Lakhs
   - If in Rupees (units) → divide by 100,000 to get Lakhs
   - If in Thousands → divide by 100 to get Lakhs
   - If in Millions → multiply by 10 to get Lakhs (1 Million = 10 Lakhs)
   - Round to 2 decimal places

2. FINANCIAL YEAR: Use Indian FY format "YYYY-YY" e.g., "2024-25" for year ending March 31 2025
   If multiple years shown, extract the MOST RECENT year as primary, and note previous year separately.

3. BALANCE SHEET - ASSETS MAPPING:
   "Fixed Assets" / "Property Plant & Equipment (PPE)" / "Tangible Assets" / "Net Block" → fixed_assets
   "Capital Work-in-Progress" / "CWIP" / "Assets Under Construction" → capital_wip
   "Long-term Investments" / "Non-current Investments" / "Investment in Subsidiaries" → long_term_investments
   "Deferred Tax Asset" / "DTA" → deferred_tax_asset
   "Long-term Loans & Advances" / "Security Deposits" / "Capital Advances" → long_term_loans_advances
   "Other Non-current Assets" / "Goodwill" / "Intangibles" → other_non_current_assets
   "Inventories" / "Stock" / "Stock-in-Trade" / "Raw Materials" / "WIP" / "Finished Goods" → inventories
   "Trade Receivables" / "Sundry Debtors" / "Accounts Receivable" / "Debtors" → trade_receivables
   "Cash and Cash Equivalents" / "Cash & Bank" / "Bank Balance" / "Current Account" → cash_and_equivalents
   "Short-term Loans & Advances" / "Advance to Vendors" / "Prepaid Expenses" → short_term_loans_advances
   "GST ITC" / "Input Tax Credit Receivable" / "IGST/CGST/SGST Receivable (asset)" → gst_itc_receivable
   "TDS Receivable" / "Advance Tax" / "Tax Refund Receivable" / "Income Tax Recoverable" → tds_advance_tax_receivable
   "Other Current Assets" → other_current_assets

4. BALANCE SHEET - EQUITY & LIABILITIES MAPPING:
   "Share Capital" / "Equity Share Capital" / "Paid-up Capital" → share_capital
   "Reserves & Surplus" / "Other Equity" / "Retained Earnings" / "General Reserve" / "Securities Premium" → reserves_surplus
   "Money Received Against Share Warrants" → money_received_share_warrants
   "Long-term Borrowings" / "Term Loans" / "Debentures" / "NCD" / "Bonds" → long_term_borrowings
   "Deferred Tax Liability" / "DTL" → deferred_tax_liability
   "Long-term Provisions" / "Gratuity Liability" / "Leave Encashment (LT)" → long_term_provisions
   "Short-term Borrowings" / "Cash Credit (CC)" / "Overdraft (OD)" / "WCDL" / "Bank Overdraft" / "Working Capital Loan" → short_term_borrowings
   "Trade Payables" / "Sundry Creditors" / "Accounts Payable" / "Creditors" → trade_payables
   "GST Payable" / "CGST Payable" / "SGST Payable" / "IGST Payable" / "Output Tax" → gst_payable
   "TDS Payable" / "TCS Payable" / "Tax Deducted at Source (liability)" → tds_payable
   "PF Payable" / "ESI Payable" / "Provident Fund Payable" / "ESIC Payable" / "Salary Payable" → pf_esi_payable
   "Advance from Customers" / "Customer Deposits" / "Unearned Revenue" → advance_from_customers
   "Other Current Liabilities" / "Accrued Liabilities" / "Expenses Payable" → other_current_liabilities

5. P&L MAPPING:
   "Revenue from Operations" / "Net Sales" / "Turnover" / "Net Revenue" / "Revenue" (net of GST) → revenue_from_operations
   "Other Income" / "Non-operating Income" / "Interest Income" / "Dividend Income" → other_income
   "Cost of Goods Sold" / "COGS" / "Cost of Materials Consumed" / "Raw Material Cost" / "Purchase of Stock-in-Trade" + "Changes in Inventories" → cogs
   "Employee Benefit Expense" / "Staff Costs" / "Salaries & Wages" / "Manpower Costs" / "Personnel Expenses" → employee_expenses
   "Finance Costs" / "Interest Expense" / "Bank Charges" / "Borrowing Costs" → finance_costs
   "Depreciation" / "Amortisation" / "D&A" / "Depreciation & Amortisation" → depreciation
   "Other Expenses" / "Administrative Expenses" / "Selling & Distribution" / "Miscellaneous Expenses" (not already captured) → other_expenses
   "Tax Expense" / "Current Tax" / "MAT" / "Income Tax" → tax_expense
   NOTE: If P&L is not available but only Balance Sheet, estimate PAT from change in Reserves & Surplus YoY

6. CASH FLOW MAPPING:
   "Net Cash from Operating Activities" / "Cash from Operations" → operating_cf
   "Net Cash from/(used in) Investing Activities" → investing_cf
   "Net Cash from/(used in) Financing Activities" → financing_cf
   "Purchase of Fixed Assets" / "Capital Expenditure" / "CapEx" → capex (always positive number)
   Note: If cash flow statement not present, these can be 0

7. OTHER:
   "Promoter Loans" / "Director Loans" / "Loans from Shareholders" / "Unsecured Loans from Directors" → promoter_loans
   "MSME Payables" / "Payables to MSME vendors" → msme_payables
   "Principal Repayment" / "Loan Repayment" (annual) → annual_loan_repayment
   Number of employees → headcount

8. VALIDATION:
   Total Assets should approximately equal Total Equity + Total Liabilities
   If there's a discrepancy, note it in the "notes" field

Return ONLY this valid JSON structure, no explanation, no markdown fences:
{
  "company_name": "string or null",
  "financial_year": "YYYY-YY",
  "previous_financial_year": "YYYY-YY or null",
  "balance_sheet": {
    "fixed_assets": 0,
    "capital_wip": 0,
    "long_term_investments": 0,
    "deferred_tax_asset": 0,
    "long_term_loans_advances": 0,
    "other_non_current_assets": 0,
    "inventories": 0,
    "trade_receivables": 0,
    "cash_and_equivalents": 0,
    "short_term_loans_advances": 0,
    "gst_itc_receivable": 0,
    "tds_advance_tax_receivable": 0,
    "other_current_assets": 0,
    "share_capital": 0,
    "reserves_surplus": 0,
    "money_received_share_warrants": 0,
    "long_term_borrowings": 0,
    "deferred_tax_liability": 0,
    "long_term_provisions": 0,
    "short_term_borrowings": 0,
    "trade_payables": 0,
    "gst_payable": 0,
    "tds_payable": 0,
    "pf_esi_payable": 0,
    "advance_from_customers": 0,
    "other_current_liabilities": 0
  },
  "profit_loss": {
    "revenue_from_operations": 0,
    "other_income": 0,
    "cogs": 0,
    "employee_expenses": 0,
    "finance_costs": 0,
    "depreciation": 0,
    "other_expenses": 0,
    "tax_expense": 0
  },
  "cash_flow": {
    "operating_cf": 0,
    "investing_cf": 0,
    "financing_cf": 0,
    "capex": 0
  },
  "previous_year_balance_sheet": null,
  "previous_year_profit_loss": null,
  "previous_year_cash_flow": null,
  "promoter_loans": 0,
  "msme_payables": 0,
  "annual_loan_repayment": 0,
  "headcount": null,
  "data_confidence": "high",
  "document_type": "balance_sheet_only or pl_only or combined or annual_report",
  "currency_detected": "INR_LAKHS",
  "notes": "any observations, assumptions, or data quality issues"
}`;

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import to avoid build issues
    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(buffer);
    return data.text || "";
  } catch {
    return "";
  }
}

async function extractDataFromExcel(buffer: Buffer): Promise<string> {
  try {
    const XLSX = await import("xlsx");
    const workbook = XLSX.read(buffer, { type: "buffer" });
    let allText = "";
    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const csv = XLSX.utils.sheet_to_csv(sheet);
      if (csv.trim().length > 10) {
        allText += `\n=== Sheet: ${sheetName} ===\n${csv}\n`;
      }
    }
    return allText;
  } catch {
    return "";
  }
}

export async function POST(request: NextRequest) {
  try {
    // API key must be provided by the user via the x-openai-key header.
    // No server-side key is used — every user supplies their own key.
    const apiKey = request.headers.get("x-openai-key") || "";

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "Please enter your OpenAI API key before uploading a document.",
          code: "NO_API_KEY",
        },
        { status: 401 }
      );
    }

    const openai = new OpenAI({ apiKey });
    const model = process.env.OPENAI_MODEL || "gpt-4o";

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || "";
    const fileName = file.name || "";
    const ext = fileName.split(".").pop()?.toLowerCase() || "";

    let messages: OpenAI.Chat.ChatCompletionMessageParam[];

    const isImage =
      mimeType.startsWith("image/") ||
      ["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(ext);
    const isPDF = mimeType === "application/pdf" || ext === "pdf";
    const isExcel =
      [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "text/csv",
      ].includes(mimeType) || ["xlsx", "xls", "csv"].includes(ext);

    if (isImage) {
      // Direct vision analysis
      const base64 = buffer.toString("base64");
      const imageMediaType = mimeType.startsWith("image/")
        ? (mimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp")
        : "image/jpeg";

      messages = [
        { role: "system", content: EXTRACTION_SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract all financial data from this document image. Return only the JSON as specified.",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${imageMediaType};base64,${base64}`,
                detail: "high",
              },
            },
          ],
        },
      ];
    } else if (isPDF) {
      // Try text extraction first
      const pdfText = await extractTextFromPDF(buffer);

      if (pdfText && pdfText.trim().length > 200) {
        // Text-based PDF — send text
        messages = [
          { role: "system", content: EXTRACTION_SYSTEM_PROMPT },
          {
            role: "user",
            content: `Extract all financial data from this PDF document text:\n\n${pdfText.slice(0, 60000)}\n\nReturn only the JSON as specified.`,
          },
        ];
      } else {
        // Scanned PDF — convert first page to base64 and use vision
        // For scanned PDFs, we send the raw PDF data as base64 with a note
        // GPT-4o can sometimes process PDF-embedded images
        const base64 = buffer.toString("base64");
        messages = [
          { role: "system", content: EXTRACTION_SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "This appears to be a scanned PDF. Extract all financial data visible. Return only the JSON as specified.",
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:application/pdf;base64,${base64}`,
                  detail: "high",
                },
              },
            ],
          },
        ];
      }
    } else if (isExcel) {
      let textContent = "";
      if (ext === "csv" || mimeType === "text/csv") {
        textContent = buffer.toString("utf-8");
      } else {
        textContent = await extractDataFromExcel(buffer);
      }

      if (!textContent || textContent.trim().length < 10) {
        return NextResponse.json(
          { error: "Could not extract data from the Excel file. Please try saving as CSV and uploading again." },
          { status: 422 }
        );
      }

      messages = [
        { role: "system", content: EXTRACTION_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Extract all financial data from this spreadsheet export:\n\n${textContent.slice(0, 60000)}\n\nReturn only the JSON as specified.`,
        },
      ];
    } else {
      // Try reading as text (txt, etc.)
      const textContent = buffer.toString("utf-8");
      messages = [
        { role: "system", content: EXTRACTION_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Extract all financial data from this document:\n\n${textContent.slice(0, 60000)}\n\nReturn only the JSON as specified.`,
        },
      ];
    }

    const response = await openai.chat.completions.create({
      model,
      messages,
      max_tokens: 4096,
      temperature: 0.1, // Low temperature for consistent extraction
    });

    const rawContent = response.choices[0]?.message?.content || "";

    // Clean up response — strip markdown fences if present
    let jsonString = rawContent.trim();
    if (jsonString.startsWith("```")) {
      jsonString = jsonString.replace(/^```[a-z]*\n?/, "").replace(/\n?```$/, "");
    }

    let extractedData;
    try {
      extractedData = JSON.parse(jsonString);
    } catch {
      // Try to find JSON in the response
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0]);
      } else {
        return NextResponse.json(
          {
            error: "AI could not extract structured financial data from this document. Please try a clearer image or a different file.",
            raw_response: rawContent.slice(0, 500),
          },
          { status: 422 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: extractedData,
      model_used: model,
    });
  } catch (error: unknown) {
    console.error("Analysis error:", error);
    const err = error as { status?: number; message?: string; code?: string };
    if (err.status === 401) {
      return NextResponse.json(
        { error: "Invalid OpenAI API key. Please check your key and try again.", code: "INVALID_KEY" },
        { status: 401 }
      );
    }
    if (err.status === 429) {
      return NextResponse.json(
        { error: "OpenAI rate limit reached. Please wait a moment and try again.", code: "RATE_LIMIT" },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: err.message || "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
