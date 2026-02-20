"use client";
import type { HealthScore } from "@/lib/types";

const ZONE_STYLES = {
  Excellent: { bg: "#F0FDF4", text: "#166534", bar: "#22c55e" },
  Good: { bg: "#FEFCE8", text: "#854D0E", bar: "#eab308" },
  Caution: { bg: "#FFF7ED", text: "#9A3412", bar: "#f97316" },
  Critical: { bg: "#FFF1F2", text: "#9F1239", bar: "#ef4444" },
};

const CATEGORY_LABELS = {
  liquidity: { label: "Liquidity", weight: "20%" },
  profitability: { label: "Profitability", weight: "25%" },
  leverage: { label: "Leverage", weight: "20%" },
  efficiency: { label: "Efficiency", weight: "15%" },
  cash_flow: { label: "Cash Flow", weight: "10%" },
  compliance: { label: "Compliance 🇮🇳", weight: "10%" },
};

function scoreColor(score: number): string {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#eab308";
  if (score >= 40) return "#f97316";
  return "#ef4444";
}

export function HealthScoreWidget({ score }: { score: HealthScore }) {
  const zone = ZONE_STYLES[score.zone];

  return (
    <div className="rounded-xl border p-6 shadow-card"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide mb-0.5"
            style={{ color: "var(--text-secondary)" }}>
            Financial Health Score
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Like a CIBIL score for your company
          </p>
        </div>
        <span
          className="px-3 py-1 rounded-full text-sm font-semibold border"
          style={{ background: zone.bg, color: zone.text, borderColor: zone.bar + "40" }}>
          {score.zone}
        </span>
      </div>

      {/* Big score */}
      <div className="text-center mb-6">
        <div className="text-7xl font-bold leading-none mb-1 metric-value"
          style={{ color: zone.bar }}>
          {score.overall.toFixed(0)}
        </div>
        <div className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>/ 100</div>

        {/* Progress bar */}
        <div className="mt-4 h-3 rounded-full" style={{ background: "var(--bg-subtle)" }}>
          <div
            className="h-3 rounded-full transition-all"
            style={{ width: `${score.overall}%`, background: zone.bar }}
          />
        </div>
      </div>

      {/* Sub-scores */}
      <div className="grid grid-cols-2 gap-3">
        {(Object.keys(CATEGORY_LABELS) as Array<keyof typeof CATEGORY_LABELS>).map((key) => {
          const { label, weight } = CATEGORY_LABELS[key];
          const val = score[key];
          const color = scoreColor(val);
          return (
            <div key={key} className="rounded-lg p-3"
              style={{ background: "var(--bg-subtle)" }}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                  {label}
                </span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{weight}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--border)" }}>
                  <div className="h-1.5 rounded-full" style={{ width: `${val}%`, background: color }} />
                </div>
                <span className="text-xs font-semibold metric-value" style={{ color, minWidth: 28 }}>
                  {val.toFixed(0)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Zone guide */}
      <div className="mt-4 pt-4 border-t flex flex-wrap gap-3" style={{ borderColor: "var(--border)" }}>
        {[
          { label: "80–100 Excellent", color: "#22c55e" },
          { label: "60–79 Good", color: "#eab308" },
          { label: "40–59 Caution", color: "#f97316" },
          { label: "0–39 Critical", color: "#ef4444" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5 text-xs"
            style={{ color: "var(--text-muted)" }}>
            <div className="w-2 h-2 rounded-full" style={{ background: color }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
