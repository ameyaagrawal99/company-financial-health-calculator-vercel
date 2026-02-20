"use client";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DataItem {
  name: string;
  value: number;
  color?: string;
}

interface Props {
  data: DataItem[];
  height?: number;
  formatter?: (v: number, total: number) => string;
  showLegend?: boolean;
}

const CHART_COLORS = ["#3D5A80", "#98C1D9", "#6B9E78", "#C17B5A", "#8B7BB5", "#B5A642", "#A0A0A0"];

export function DonutChartWrapper({ data, height = 240, formatter, showLegend = true }: Props) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const fmt = formatter || ((v: number) =>
    Math.abs(v) >= 100 ? `₹${(v / 100).toFixed(1)}Cr` : `₹${v.toFixed(0)}L`
  );

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius="55%"
          outerRadius="80%"
          dataKey="value"
          paddingAngle={2}>
          {data.map((entry, i) => (
            <Cell key={entry.name} fill={entry.color || CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(v: number, name: string) => [fmt(v, total), name]}
          contentStyle={{
            background: "#1C1917",
            border: "none",
            borderRadius: 8,
            color: "#fff",
            fontSize: 12,
          }}
        />
        {showLegend && (
          <Legend
            wrapperStyle={{ fontSize: 11, color: "#6B6560" }}
            formatter={(value) => <span style={{ color: "#6B6560" }}>{value}</span>}
          />
        )}
      </PieChart>
    </ResponsiveContainer>
  );
}
