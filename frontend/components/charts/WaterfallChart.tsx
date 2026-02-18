"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

interface WaterfallItem {
  name: string;
  value: number;
  isTotal?: boolean;
}

interface Props {
  items: WaterfallItem[];
  height?: number;
  formatter?: (v: number) => string;
}

const defaultFmt = (v: number) =>
  Math.abs(v) >= 100 ? `₹${(v / 100).toFixed(1)}Cr` : `₹${v.toFixed(1)}L`;

export function WaterfallChart({ items, height = 260, formatter = defaultFmt }: Props) {
  // Build waterfall data with running total and invisible bar for offset
  let running = 0;
  const chartData = items.map((item) => {
    if (item.isTotal) {
      return {
        name: item.name,
        invisible: 0,
        value: item.value,
        isTotal: true,
        color: item.value >= 0 ? "#22c55e" : "#ef4444",
      };
    }
    const prev = running;
    running += item.value;
    return {
      name: item.name,
      invisible: item.value >= 0 ? prev : running,
      value: Math.abs(item.value),
      raw: item.value,
      isTotal: false,
      color: item.value >= 0 ? "#6B9E78" : "#C17B5A",
    };
  });

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E4E2DC" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 10, fill: "#6B6560" }}
          axisLine={false}
          tickLine={false}
          interval={0}
          angle={-15}
          textAnchor="end"
          height={40}
        />
        <YAxis
          tickFormatter={formatter}
          tick={{ fontSize: 11, fill: "#6B6560" }}
          axisLine={false}
          tickLine={false}
          width={64}
        />
        <Tooltip
          formatter={(v: number, name: string, props: { payload?: { raw?: number; color?: string } }) => {
            if (name === "invisible") return null;
            const raw = props?.payload?.raw ?? v;
            return [formatter(raw), ""];
          }}
          contentStyle={{
            background: "#1C1917",
            border: "none",
            borderRadius: 8,
            color: "#fff",
            fontSize: 12,
          }}
        />
        {/* Invisible base bar */}
        <Bar dataKey="invisible" stackId="a" fill="transparent" legendType="none" />
        {/* Actual value bar */}
        <Bar dataKey="value" stackId="a" radius={[3, 3, 0, 0]} legendType="none">
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
