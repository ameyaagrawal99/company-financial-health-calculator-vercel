"use client";
import { useAppStore } from "@/lib/store";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ComplianceBadge } from "@/components/ui/StatusBadge";
import { formatINR, formatPct, formatDays } from "@/lib/formatters";
import { TOOLTIPS } from "@/lib/tooltip-content";
import { ArrowUpRight, AlertTriangle } from "lucide-react";

interface StatutoryItem {
  label: string;
  amount: number;
  status: string;
  consequence: string;
  severity: "red" | "orange" | "green";
}

export default function PayablesPage() {
  const { analysis } = useAppStore();
  if (!analysis) return null;

  const { data, ratios, compliance } = analysis;
  const bs = data.balance_sheet;
  const pl = data.profit_loss;

  const totalPayables = bs.trade_payables + bs.gst_payable + bs.tds_payable + bs.pf_esi_payable + bs.advance_from_customers;

  const statutory: StatutoryItem[] = [
    {
      label: "GST Payable (CGST/SGST/IGST)",
      amount: bs.gst_payable,
      status: bs.gst_payable > 0 ? "Outstanding" : "Nil",
      consequence: "Interest @18% p.a. + late fee ₹50/day per return",
      severity: bs.gst_payable > 0 ? "orange" : "green",
    },
    {
      label: "TDS / TCS Payable",
      amount: bs.tds_payable,
      status: bs.tds_payable > 0 ? "OVERDUE" : "Nil",
      consequence: "Interest @1.5%/month under Sec 201 + prosecution",
      severity: bs.tds_payable > 0 ? "red" : "green",
    },
    {
      label: "PF / ESI Payable",
      amount: bs.pf_esi_payable,
      status: bs.pf_esi_payable > 0 ? "OVERDUE" : "Nil",
      consequence: "Criminal liability for directors under EPF Act",
      severity: bs.pf_esi_payable > 0 ? "red" : "green",
    },
    {
      label: "MSME Payables",
      amount: data.msme_payables,
      status: data.msme_payables > 0 ? "Check 45-day rule" : "Nil",
      consequence: "Compound interest @3× bank rate if overdue 45 days",
      severity: data.msme_payables > 0 ? "orange" : "green",
    },
  ];

  const criticalItems = statutory.filter((s) => s.severity === "red" && s.amount > 0);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: "var(--accent-light)" }}>
          <ArrowUpRight className="w-5 h-5" style={{ color: "var(--accent)" }} />
        </div>
        <div>
          <h1 className="page-title">Payables & Creditors</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Vendor payables and statutory obligations — FY {data.financial_year}
          </p>
        </div>
      </div>

      {/* Critical alerts */}
      {criticalItems.map((item) => (
        <div key={item.label} className="mb-4 flex items-start gap-3 p-4 rounded-lg border"
          style={{ background: "#FFF1F2", borderColor: "#FECDD3" }}>
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#9F1239" }} />
          <div>
            <p className="text-sm font-medium" style={{ color: "#9F1239" }}>
              {item.label}: {formatINR(item.amount)} — {item.status}
            </p>
            <p className="text-xs mt-1" style={{ color: "#9F1239" }}>{item.consequence}</p>
          </div>
        </div>
      ))}

      {/* Key metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard label="Total Trade Payables" value={formatINR(bs.trade_payables)} />
        <MetricCard label="DPO" value={formatDays(ratios.dpo)} tooltip={TOOLTIPS.dpo} healthyRange="30–60 days" statusColor={(ratios.dpo ?? 0) <= 60 ? "green" : "yellow"} />
        <MetricCard label="Advance from Customers" value={formatINR(bs.advance_from_customers)} subtext="Revenue recognition or refund risk" />
        <MetricCard label="Total Current Payables" value={formatINR(totalPayables)} />
      </div>

      {/* Statutory table */}
      <div className="rounded-xl border shadow-card overflow-hidden mb-6"
        style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        <div className="p-5 border-b" style={{ borderColor: "var(--border)" }}>
          <h3 className="section-heading">🇮🇳 Statutory Payables — Indian Compliance</h3>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            These cannot be negotiated or delayed without legal consequences
          </p>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {statutory.map((item) => (
            <div key={item.label} className="flex items-center justify-between p-4">
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{item.label}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{item.consequence}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold metric-value" style={{ color: "var(--text-primary)" }}>
                  {formatINR(item.amount)}
                </span>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded border"
                  style={{
                    background: item.severity === "red" ? "#FFF1F2" : item.severity === "orange" ? "#FFF7ED" : "#F0FDF4",
                    color: item.severity === "red" ? "#9F1239" : item.severity === "orange" ? "#9A3412" : "#166534",
                    borderColor: item.severity === "red" ? "#FECDD3" : item.severity === "orange" ? "#FED7AA" : "#BBF7D0",
                  }}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indian context */}
      <div className="rounded-xl border p-5 shadow-card"
        style={{ background: "var(--bg-subtle)", borderColor: "var(--border)" }}>
        <h3 className="section-heading mb-3">🇮🇳 What Happens If You Miss Payments?</h3>
        <div className="grid grid-cols-2 gap-4 text-xs" style={{ color: "var(--text-secondary)" }}>
          <div>
            <p className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>GST-3B Late Filing</p>
            <p>Late fee: ₹50/day (₹25 CGST + ₹25 SGST) per return. Interest: 18% p.a. on unpaid liability. GSTIN suspension after 6+ months.</p>
          </div>
          <div>
            <p className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>TDS Not Deposited</p>
            <p>Section 201: 1.5% per month interest. Prosecution of TAN holder. Disallowance of expense under Section 40(a)(ia) until TDS deposited.</p>
          </div>
          <div>
            <p className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>PF/ESI Default</p>
            <p>EPF Act Section 14: Imprisonment up to 1 year for directors. Penalty: ₹10,000. EPFO can attach company property. Employees can also file criminal complaints.</p>
          </div>
          <div>
            <p className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>MSME Payment Delay</p>
            <p>MSMED Act Section 16: Compound interest at 3× RBI bank rate from the date the payment was due. MCA-1 filing mandatory if MSME payables overdue beyond 45 days.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
