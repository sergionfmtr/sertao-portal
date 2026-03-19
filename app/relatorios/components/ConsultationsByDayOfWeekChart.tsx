"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface ConsultationsByDayOfWeekData {
  label: string;
  value: number;
}

interface ConsultationsByDayOfWeekChartProps {
  data: ConsultationsByDayOfWeekData[];
}

export default function ConsultationsByDayOfWeekChart({
  data,
}: ConsultationsByDayOfWeekChartProps) {
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
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={true}
            vertical={false}
          />
          <XAxis dataKey="label" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: "#f3f4f6" }}
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Bar
            dataKey="value"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
            name="Consultas"
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
