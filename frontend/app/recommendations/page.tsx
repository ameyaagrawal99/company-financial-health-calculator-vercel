"use client";
import { useAppStore } from "@/lib/store";
import { Lightbulb, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import type { Recommendation } from "@/lib/types";

function PriorityIcon({ priority }: { priority: Recommendation["priority"] }) {
  if (priority === "HIGH") return <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ color: "#ef4444" }} />;
  if (priority === "MEDIUM") return <Info className="w-5 h-5 flex-shrink-0" style={{ color: "#eab308" }} />;
  return <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: "#22c55e" }} />;
}

function priorityStyle(priority: Recommendation["priority"]) {
  if (priority === "HIGH") return {
    bg: "#FFF1F2", border: "#FECDD3",
    badge: { bg: "#ef4444", text: "#fff" },
    text: "#9F1239", label: "High Priority",
    actionLabel: "Action Required",
  };
  if (priority === "MEDIUM") return {
    bg: "#FEFCE8", border: "#FEF08A",
    badge: { bg: "#eab308", text: "#fff" },
    text: "#854D0E", label: "Medium Priority",
    actionLabel: "Recommended Action",
  };
  return {
    bg: "#F0FDF4", border: "#BBF7D0",
    badge: { bg: "#22c55e", text: "#fff" },
    text: "#166534", label: "Positive Signal",
    actionLabel: "Keep it up",
  };
}

export default function RecommendationsPage() {
  const { analysis } = useAppStore();
  if (!analysis) return null;

  const { recommendations, data, health_score } = analysis;

  const highPriority = recommendations.filter((r) => r.priority === "HIGH");
  const mediumPriority = recommendations.filter((r) => r.priority === "MEDIUM");
  const positive = recommendations.filter((r) => r.priority === "POSITIVE");

  const groups: Array<{ label: string; items: Recommendation[]; priority: Recommendation["priority"] }> = [
    { label: "High Priority — Immediate Action Required", items: highPriority, priority: "HIGH" },
    { label: "Medium Priority — Action Within 30 Days", items: mediumPriority, priority: "MEDIUM" },
    { label: "Positive Signals — Strengths to Maintain", items: positive, priority: "POSITIVE" },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: "var(--accent-light)" }}>
          <Lightbulb className="w-5 h-5" style={{ color: "var(--accent)" }} />
        </div>
        <div>
          <h1 className="page-title">Recommendations & Action Plan</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Priority actions based on financial health analysis — FY {data.financial_year}
          </p>
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border p-4 shadow-card"
          style={{ background: highPriority.length > 0 ? "#FFF1F2" : "var(--bg-card)", borderColor: highPriority.length > 0 ? "#FECDD3" : "var(--border)" }}>
          <p className="metric-label mb-1">High Priority</p>
          <p className="text-3xl font-bold" style={{ color: highPriority.length > 0 ? "#9F1239" : "#22c55e" }}>{highPriority.length}</p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Immediate attention</p>
        </div>
        <div className="rounded-xl border p-4 shadow-card"
          style={{ background: mediumPriority.length > 0 ? "#FEFCE8" : "var(--bg-card)", borderColor: mediumPriority.length > 0 ? "#FEF08A" : "var(--border)" }}>
          <p className="metric-label mb-1">Medium Priority</p>
          <p className="text-3xl font-bold" style={{ color: mediumPriority.length > 0 ? "#854D0E" : "#22c55e" }}>{mediumPriority.length}</p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Within 30 days</p>
        </div>
        <div className="rounded-xl border p-4 shadow-card"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <p className="metric-label mb-1">Positive Signals</p>
          <p className="text-3xl font-bold" style={{ color: "#22c55e" }}>{positive.length}</p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Strengths to maintain</p>
        </div>
        <div className="rounded-xl border p-4 shadow-card"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <p className="metric-label mb-1">Health Score</p>
          <p className="text-3xl font-bold" style={{
            color: health_score.zone === "Excellent" ? "#22c55e"
              : health_score.zone === "Good" ? "#3D5A80"
              : health_score.zone === "Caution" ? "#eab308"
              : "#ef4444"
          }}>
            {health_score.overall}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{health_score.zone}</p>
        </div>
      </div>

      {/* Recommendation groups */}
      {groups.map(({ label, items, priority }) => {
        if (items.length === 0) return null;
        const style = priorityStyle(priority);
        return (
          <div key={priority} className="mb-6">
            <h2 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: style.text }}>
              <PriorityIcon priority={priority} />
              {label}
            </h2>
            <div className="space-y-3">
              {items.map((rec, i) => (
                <div key={i}
                  className="rounded-xl border p-5 shadow-card"
                  style={{ background: style.bg, borderColor: style.border }}>
                  <div className="flex items-start gap-3">
                    <PriorityIcon priority={priority} />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{rec.title}</p>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {rec.impact && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{ background: "var(--accent-light)", color: "var(--accent)" }}>
                              {rec.impact}
                            </span>
                          )}
                          <span className="text-xs font-bold px-2 py-0.5 rounded whitespace-nowrap"
                            style={{ background: style.badge.bg, color: style.badge.text }}>
                            {priority === "POSITIVE" ? "STRENGTH" : priority}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs mb-2" style={{ color: "var(--text-secondary)" }}>{rec.description}</p>
                      {rec.action && (
                        <div className="mt-2 text-xs">
                          <span className="font-medium" style={{ color: style.text }}>{style.actionLabel}: </span>
                          <span style={{ color: "var(--text-secondary)" }}>{rec.action}</span>
                        </div>
                      )}
                      <p className="text-xs mt-1.5 font-medium" style={{ color: "var(--text-muted)" }}>
                        Category: {rec.category}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {recommendations.length === 0 && (
        <div className="rounded-xl border p-8 text-center shadow-card"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <CheckCircle2 className="w-12 h-12 mx-auto mb-4" style={{ color: "#22c55e" }} />
          <p className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>All Clear</p>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            No recommendations generated. This is either an excellent financial position or insufficient data for analysis.
          </p>
        </div>
      )}

      <p className="text-xs mt-4 text-center" style={{ color: "var(--text-muted)" }}>
        ⚠ Recommendations are generated from your financial data. Please validate key decisions with your Chartered Accountant or financial advisor.
      </p>
    </div>
  );
}
