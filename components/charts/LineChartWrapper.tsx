"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface DataItem {
  name: string;
  [key: string]: number | string;
}

interface Props {
  data: DataItem[];
  lines: { key: string; color: string; label?: string }[];
  height?: number;
  yFormatter?: (v: number) => string;
  showLegend?: boolean;
  referenceLine?: number;
}

const defaultFmt = (v: number) => `${v.toFixed(1)}%`;

export function LineChartWrapper({
  data,
  lines,
  height = 220,
  yFormatter = defaultFmt,
  showLegend = false,
  referenceLine,
}: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E4E2DC" />
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
          width={48}
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
        />
        {showLegend && <Legend wrapperStyle={{ fontSize: 11, color: "#6B6560" }} />}
        {referenceLine !== undefined && (
          <ReferenceLine y={referenceLine} stroke="#A0A0A0" strokeDasharray="4 2" />
        )}
        {lines.map(({ key, color, label }) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={color}
            name={label || key}
            strokeWidth={2}
            dot={{ fill: color, r: 3 }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
