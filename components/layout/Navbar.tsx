"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Upload, Download, Building2 } from "lucide-react";
import { useAppStore } from "@/lib/store";

export function Navbar() {
  const router = useRouter();
  const { analysis, viewMode, setViewMode, clearAnalysis } = useAppStore();
  const company = analysis?.data.company_name || "Company";
  const fy = analysis?.data.financial_year || "";

  const handleUploadNew = () => {
    clearAnalysis();
    router.push("/");
  };

  return (
    <header
      className="fixed top-0 left-56 right-0 h-14 flex items-center justify-between px-6 border-b z-20"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
      {/* Company info */}
      <div className="flex items-center gap-3">
        <Building2 className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
        <div>
          <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
            {company}
          </span>
          {fy && (
            <span className="ml-2 text-xs px-2 py-0.5 rounded font-medium"
              style={{ background: "var(--bg-subtle)", color: "var(--text-secondary)" }}>
              FY {fy}
            </span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* View toggle */}
        <div className="flex rounded-lg overflow-hidden border text-xs font-medium"
          style={{ borderColor: "var(--border)" }}>
          <button
            onClick={() => setViewMode("cfo")}
            className="px-3 py-1.5 transition-all"
            style={{
              background: viewMode === "cfo" ? "var(--accent)" : "var(--bg-card)",
              color: viewMode === "cfo" ? "#fff" : "var(--text-secondary)",
            }}>
            CFO / Audit
          </button>
          <button
            onClick={() => setViewMode("operator")}
            className="px-3 py-1.5 transition-all"
            style={{
              background: viewMode === "operator" ? "var(--accent)" : "var(--bg-card)",
              color: viewMode === "operator" ? "#fff" : "var(--text-secondary)",
            }}>
            Operator
          </button>
        </div>

        <button
          onClick={handleUploadNew}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
          style={{
            borderColor: "var(--border)",
            color: "var(--text-secondary)",
            background: "var(--bg-card)",
          }}>
          <Upload className="w-3.5 h-3.5" />
          Upload New
        </button>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
          style={{ background: "var(--accent)" }}>
          <Download className="w-3.5 h-3.5" />
          Export PDF
        </button>
      </div>
    </header>
  );
}
