"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export interface ConsultationStatusData {
  label: string;
  value: number;
}

interface ConsultationStatusChartProps {
  data: ConsultationStatusData[];
}

const COLORS = ["#10b981", "#3b82f6", "#ef4444", "#f59e0b", "#8b5cf6"];

export default function ConsultationStatusChart({
  data,
}: ConsultationStatusChartProps) {
  if (!data || data.length === 0) {
    return (
      <p className="text-gray-500 text-sm mt-4">
        Nenhum dado encontrado para o período selecionado.
      </p>
    );
  }

  return (
    <div className="h-96 w-full mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={80}
            outerRadius={120}
            paddingAngle={5}
            dataKey="value"
            nameKey="label"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
