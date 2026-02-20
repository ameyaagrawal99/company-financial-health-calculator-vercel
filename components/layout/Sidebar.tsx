"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  Receipt,
  Banknote,
  ArrowDownLeft,
  ArrowUpRight,
  Landmark,
  Droplets,
  Gauge,
  ShieldCheck,
  GitCompare,
  Lightbulb,
  HeartPulse,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/income", icon: TrendingUp, label: "Income & Profitability" },
  { href: "/dashboard/expenses", icon: Receipt, label: "Expenditure" },
  { href: "/dashboard/cashflow", icon: Banknote, label: "Cash Flow" },
  { href: "/dashboard/receivables", icon: ArrowDownLeft, label: "Receivables" },
  { href: "/dashboard/payables", icon: ArrowUpRight, label: "Payables" },
  { href: "/dashboard/debt", icon: Landmark, label: "Debt & Loans" },
  { href: "/dashboard/liquidity", icon: Droplets, label: "Liquidity" },
  { href: "/dashboard/efficiency", icon: Gauge, label: "Efficiency" },
  { href: "/dashboard/compliance", icon: ShieldCheck, label: "Compliance 🇮🇳" },
];

const BOTTOM_ITEMS = [
  { href: "/compare", icon: GitCompare, label: "Compare Years" },
  { href: "/recommendations", icon: Lightbulb, label: "Recommendations" },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  return (
    <aside className="fixed left-0 top-0 h-full w-56 flex flex-col border-r z-30"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-4 border-b"
        style={{ borderColor: "var(--border)" }}>
        <HeartPulse className="w-5 h-5 flex-shrink-0" style={{ color: "var(--accent)" }} />
        <div>
          <p className="font-semibold text-xs leading-tight" style={{ color: "var(--text-primary)" }}>
            Financial Health
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>India</p>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <p className="px-2 mb-2 text-xs font-medium uppercase tracking-wide"
          style={{ color: "var(--text-muted)" }}>Dashboard</p>
        <ul className="space-y-0.5">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
            <li key={href}>
              <Link href={href}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all"
                style={{
                  background: isActive(href) ? "var(--accent-light)" : "transparent",
                  color: isActive(href) ? "var(--accent)" : "var(--text-secondary)",
                  fontWeight: isActive(href) ? 600 : 400,
                }}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="px-2 mt-4 mb-2 text-xs font-medium uppercase tracking-wide"
          style={{ color: "var(--text-muted)" }}>Analysis</p>
        <ul className="space-y-0.5">
          {BOTTOM_ITEMS.map(({ href, icon: Icon, label }) => (
            <li key={href}>
              <Link href={href}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all"
                style={{
                  background: isActive(href) ? "var(--accent-light)" : "transparent",
                  color: isActive(href) ? "var(--accent)" : "var(--text-secondary)",
                  fontWeight: isActive(href) ? 600 : 400,
                }}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
