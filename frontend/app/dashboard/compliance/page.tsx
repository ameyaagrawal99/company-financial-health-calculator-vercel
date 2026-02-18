"use client";
import { useAppStore } from "@/lib/store";
import { formatINR, formatPct } from "@/lib/formatters";
import { ShieldCheck, AlertTriangle, CheckCircle2, HelpCircle } from "lucide-react";
import type { ComplianceStatus } from "@/lib/types";

interface ComplianceRow {
  area: string;
  status: ComplianceStatus;
  amount?: number;
  description: string;
  consequence: string;
  action?: string;
}

function StatusIcon({ status }: { status: ComplianceStatus }) {
  if (status === "OK") return <CheckCircle2 className="w-5 h-5" style={{ color: "#22c55e" }} />;
  if (status === "CRITICAL") return <AlertTriangle className="w-5 h-5" style={{ color: "#ef4444" }} />;
  if (status === "WARNING") return <AlertTriangle className="w-5 h-5" style={{ color: "#eab308" }} />;
  return <HelpCircle className="w-5 h-5" style={{ color: "#A8A29E" }} />;
}

function statusStyle(status: ComplianceStatus) {
  if (status === "OK") return { bg: "#F0FDF4", text: "#166534", border: "#BBF7D0" };
  if (status === "CRITICAL") return { bg: "#FFF1F2", text: "#9F1239", border: "#FECDD3" };
  if (status === "WARNING") return { bg: "#FEFCE8", text: "#854D0E", border: "#FEF08A" };
  return { bg: "#F8F7F4", text: "#A8A29E", border: "#E4E2DC" };
}

export default function CompliancePage() {
  const { analysis } = useAppStore();
  if (!analysis) return null;

  const { data, compliance } = analysis;
  const bs = data.balance_sheet;
  const pl = data.profit_loss;

  const complianceRows: ComplianceRow[] = [
    {
      area: "GST Filing (GSTR-1 / GSTR-3B)",
      status: compliance.gst_filing,
      description: "Monthly/quarterly GST return filing status",
      consequence: "Late fee ₹50/day per return + 18% p.a. interest on tax due + GSTIN suspension",
      action: "File pending returns immediately via GST portal; use offline utility for bulk filing",
    },
    {
      area: "GST Input Tax Credit (ITC) Utilisation",
      status: compliance.gst_itc_blocked,
      amount: bs.gst_itc_receivable,
      description: `ITC receivable: ${formatINR(bs.gst_itc_receivable)} — ${bs.gst_itc_receivable > pl.revenue_from_operations / 12 * 3 ? "More than 3 months blocked" : "Within normal range"}`,
      consequence: "Blocked ITC = cash locked with government. Time-barred ITC (2 years) = permanent loss",
      action: "Reconcile GSTR-2A vs purchase register; utilise ITC against output tax liability before quarter end",
    },
    {
      area: "TDS Deducted & Deposited",
      status: compliance.tds_deposited,
      amount: bs.tds_payable,
      description: bs.tds_payable > 0 ? `TDS Payable: ${formatINR(bs.tds_payable)} — Outstanding, must deposit immediately` : "TDS payable appears to be Nil",
      consequence: "Section 201: 1.5% interest/month. Section 276B: Prosecution with imprisonment up to 7 years",
      action: "Deposit immediately via NSDL challan ITNS 281. File TDS returns (26Q/27Q) by due dates",
    },
    {
      area: "Advance Tax Payments",
      status: compliance.advance_tax,
      description: "Quarterly advance tax instalments (15 Jun, 15 Sep, 15 Dec, 15 Mar)",
      consequence: "Section 234B: 1% per month on shortfall. Section 234C: 1% per month on delayed instalment",
      action: "Estimate full-year tax liability; pay 90% by 15 March to avoid Section 234B interest",
    },
    {
      area: "PF / ESI / Professional Tax",
      status: compliance.pf_esi,
      amount: bs.pf_esi_payable,
      description: bs.pf_esi_payable > 0 ? `PF/ESI Payable: ${formatINR(bs.pf_esi_payable)} — OVERDUE. Wage month + 15 days rule violated` : "PF/ESI payable appears to be Nil",
      consequence: "EPF Act Section 14: Imprisonment up to 1 year + ₹10,000 penalty for directors. ESIC Act similar penalties",
      action: "Deposit immediately via EPFO Unified Portal (UAN) and ESIC portal. Submit ECR and challan",
    },
    {
      area: "ROC / MCA Annual Filings",
      status: compliance.roc_filing,
      description: "Annual return (MGT-7) and financial statements (AOC-4) filing with MCA",
      consequence: "₹100/day late fee per form + director disqualification under Section 164(2) after 3 years",
      action: "File AOC-4 within 30 days of AGM; MGT-7 within 60 days of AGM",
    },
    {
      area: "MSME Payments (45-Day Rule)",
      status: compliance.msme_payments,
      amount: data.msme_payables,
      description: data.msme_payables > 0 ? `MSME Payables: ${formatINR(data.msme_payables)} — Check if within 45-day window` : "MSME payables appear to be Nil",
      consequence: "MSMED Act Section 16: Compound interest at 3× RBI bank rate. MCA-1 filing mandatory if overdue",
      action: "Prioritise MSME payments; file Form MSME-1 for overdue amounts; maintain MSME supplier register",
    },
    {
      area: "Related Party Transactions",
      status: compliance.related_party,
      amount: data.promoter_loans,
      description: data.promoter_loans > 0 ? `Promoter/Director loans: ${formatINR(data.promoter_loans)} — Disclosure and approval required` : "No significant related party transactions detected",
      consequence: "Section 188/185 non-compliance: Fine ₹25,000 to ₹5 Lakh + imprisonment for directors",
      action: "Board resolution and shareholder approval as required; proper documentation; disclose in annual report",
    },
  ];

  const criticalCount = complianceRows.filter((r) => r.status === "CRITICAL").length;
  const warningCount = complianceRows.filter((r) => r.status === "WARNING").length;
  const okCount = complianceRows.filter((r) => r.status === "OK").length;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: "var(--accent-light)" }}>
          <ShieldCheck className="w-5 h-5" style={{ color: "var(--accent)" }} />
        </div>
        <div>
          <h1 className="page-title">Indian Compliance Health Monitor</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Statutory compliance obligations unique to Indian businesses
          </p>
        </div>
      </div>

      {/* Summary counts */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border p-4 shadow-card"
          style={{ background: criticalCount > 0 ? "#FFF1F2" : "var(--bg-card)", borderColor: criticalCount > 0 ? "#FECDD3" : "var(--border)" }}>
          <p className="metric-label mb-1">Critical Issues</p>
          <p className="text-3xl font-bold" style={{ color: criticalCount > 0 ? "#9F1239" : "#22c55e" }}>{criticalCount}</p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Immediate action required</p>
        </div>
        <div className="rounded-xl border p-4 shadow-card"
          style={{ background: warningCount > 0 ? "#FEFCE8" : "var(--bg-card)", borderColor: warningCount > 0 ? "#FEF08A" : "var(--border)" }}>
          <p className="metric-label mb-1">Warnings</p>
          <p className="text-3xl font-bold" style={{ color: warningCount > 0 ? "#854D0E" : "#22c55e" }}>{warningCount}</p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Monitor and action soon</p>
        </div>
        <div className="rounded-xl border p-4 shadow-card"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <p className="metric-label mb-1">OK / Compliant</p>
          <p className="text-3xl font-bold" style={{ color: "#22c55e" }}>{okCount}</p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>No immediate action needed</p>
        </div>
        <div className="rounded-xl border p-4 shadow-card"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <p className="metric-label mb-1">Unknown / Manual Check</p>
          <p className="text-3xl font-bold" style={{ color: "#A8A29E" }}>
            {complianceRows.filter((r) => r.status === "UNKNOWN").length}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Verify with your CA</p>
        </div>
      </div>

      {/* Compliance table */}
      <div className="rounded-xl border shadow-card overflow-hidden"
        style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        {complianceRows.map((row, i) => {
          const style = statusStyle(row.status);
          return (
            <div key={row.area}
              className={`p-5 ${i > 0 ? "border-t" : ""}`}
              style={{ borderColor: "var(--border)" }}>
              <div className="flex items-start gap-4">
                <StatusIcon status={row.status} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{row.area}</p>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded border"
                      style={{ background: style.bg, color: style.text, borderColor: style.border }}>
                      {row.status}
                    </span>
                  </div>
                  <p className="text-xs mb-2" style={{ color: "var(--text-secondary)" }}>{row.description}</p>
                  <div className="flex gap-4 text-xs">
                    <div>
                      <span className="font-medium" style={{ color: "#9F1239" }}>If missed: </span>
                      <span style={{ color: "var(--text-muted)" }}>{row.consequence}</span>
                    </div>
                  </div>
                  {row.action && row.status !== "OK" && (
                    <div className="mt-2 text-xs">
                      <span className="font-medium" style={{ color: "var(--accent)" }}>Action: </span>
                      <span style={{ color: "var(--text-secondary)" }}>{row.action}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs mt-4 text-center" style={{ color: "var(--text-muted)" }}>
        ⚠ Compliance status is estimated from your financial data. Please verify with your Chartered Accountant for definitive compliance assessment.
      </p>
    </div>
  );
}
