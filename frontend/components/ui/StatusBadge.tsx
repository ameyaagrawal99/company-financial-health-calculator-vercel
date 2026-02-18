import type { ComplianceStatus } from "@/lib/types";

type StatusColor = "green" | "yellow" | "orange" | "red";

interface Props {
  color: StatusColor;
  children: React.ReactNode;
  size?: "sm" | "md";
}

const colorMap: Record<StatusColor, { bg: string; text: string; border: string }> = {
  green: { bg: "#F0FDF4", text: "#166534", border: "#BBF7D0" },
  yellow: { bg: "#FEFCE8", text: "#854D0E", border: "#FEF08A" },
  orange: { bg: "#FFF7ED", text: "#9A3412", border: "#FED7AA" },
  red: { bg: "#FFF1F2", text: "#9F1239", border: "#FECDD3" },
};

export function StatusBadge({ color, children, size = "md" }: Props) {
  const c = colorMap[color];
  return (
    <span
      className="inline-flex items-center gap-1 rounded font-semibold border"
      style={{
        background: c.bg,
        color: c.text,
        borderColor: c.border,
        fontSize: size === "sm" ? 11 : 12,
        padding: size === "sm" ? "1px 6px" : "2px 8px",
      }}>
      {children}
    </span>
  );
}

export function ComplianceBadge({ status }: { status: ComplianceStatus }) {
  const map: Record<ComplianceStatus, { color: StatusColor; label: string; icon: string }> = {
    OK: { color: "green", label: "OK", icon: "✅" },
    WARNING: { color: "yellow", label: "Warning", icon: "⚠️" },
    CRITICAL: { color: "red", label: "Critical", icon: "🔴" },
    UNKNOWN: { color: "yellow", label: "Unknown", icon: "?" },
  };
  const { color, label, icon } = map[status];
  return <StatusBadge color={color}>{icon} {label}</StatusBadge>;
}

export function DeltaBadge({
  value,
  label,
  positiveIsGood = true,
}: {
  value: number | null | undefined;
  label: string;
  positiveIsGood?: boolean;
}) {
  if (value == null) return null;
  const isPositive = value >= 0;
  const isGood = positiveIsGood ? isPositive : !isPositive;
  const color: StatusColor = Math.abs(value) < 0.05 ? "yellow" : isGood ? "green" : "red";
  const arrow = value > 0.005 ? "▲" : value < -0.005 ? "▼" : "→";

  return (
    <StatusBadge color={color} size="sm">
      {arrow} {label}
    </StatusBadge>
  );
}
