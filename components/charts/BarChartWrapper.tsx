"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface DataItem {
  name: string;
  [key: string]: number | string;
}

interface Props {
  data: DataItem[];
  bars: { key: string; color: string; label?: string }[];
  height?: number;
  yFormatter?: (v: number) => string;
  showLegend?: boolean;
}

const defaultFmt = (v: number) =>
  Math.abs(v) >= 100
    ? `₹${(v / 100).toFixed(1)}Cr`
    : `₹${v.toFixed(0)}L`;

export function BarChartWrapper({
  data,
  bars,
  height = 250,
  yFormatter = defaultFmt,
  showLegend = false,
}: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E4E2DC" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "#6B6560" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={yFormatter}
          tick={{ fontSize: 11, fill: "#6B6560" }}
          axisLine={false}
          tickLine={false}
          width={64}
        />
        <Tooltip
          formatter={(v: number, name: string) => [yFormatter(v), name]}
          contentStyle={{
            background: "#1C1917",
            border: "none",
            borderRadius: 8,
            color: "#fff",
            fontSize: 12,
          }}
          labelStyle={{ color: "#A8A29E", marginBottom: 4 }}
        />
        {showLegend && <Legend wrapperStyle={{ fontSize: 11, color: "#6B6560" }} />}
        {bars.map(({ key, color, label }) => (
          <Bar key={key} dataKey={key} fill={color} name={label || key} radius={[3, 3, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
