"use client";
import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";

interface KeyMetric {
  label: string;
  value: string;
  color?: "green" | "yellow" | "orange" | "red";
}

interface Props {
  href: string;
  icon: LucideIcon;
  title: string;
  heroValue: string;
  heroLabel?: string;
  metrics: KeyMetric[];
  alert?: string;
}

const STATUS_DOTS = {
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  orange: "bg-orange-500",
  red: "bg-red-500",
};

export function SectionCard({ href, icon: Icon, title, heroValue, heroLabel, metrics, alert }: Props) {
  return (
    <Link href={href} className="block section-card">
      <div
        className="rounded-xl border p-5 h-full flex flex-col cursor-pointer transition-all duration-150"
        style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--accent-light)" }}>
            <Icon className="w-4 h-4" style={{ color: "var(--accent)" }} />
          </div>
          <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{title}</p>
        </div>

        {/* Hero */}
        <div className="mb-4">
          <p className="font-bold text-2xl metric-value" style={{ color: "var(--text-primary)" }}>
            {heroValue}
          </p>
          {heroLabel && (
            <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{heroLabel}</p>
          )}
        </div>

        {/* Key metrics */}
        <div className="space-y-2 flex-1">
          {metrics.map(({ label, value, color }) => (
            <div key={label} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {color && (
                  <div className={`w-2 h-2 rounded-full ${STATUS_DOTS[color]}`} />
                )}
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{label}</span>
              </div>
              <span className="text-xs font-semibold metric-value" style={{ color: "var(--text-primary)" }}>
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Alert */}
        {alert && (
          <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
            <p className="text-xs" style={{ color: "#9A3412" }}>⚠ {alert}</p>
          </div>
        )}

        {/* Link */}
        <div className="mt-4 flex items-center gap-1 text-xs font-medium"
          style={{ color: "var(--accent)" }}>
          View Details <ChevronRight className="w-3 h-3" />
        </div>
      </div>
    </Link>
  );
}
