"use client"

import { useTheme } from "next-themes"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface DashboardChartProps {
  data: any[]
  type: "bar" | "line" | "pie"
  xField?: string
  yField?: string
  nameField?: string
  valueField?: string
  height?: number
}

export function DashboardChart({
  data,
  type,
  xField = "name",
  yField = "value",
  nameField = "name",
  valueField = "value",
  height = 300,
}: DashboardChartProps) {
  const { theme } = useTheme()

  const COLORS = [
    "#3b82f6", // blue-500
    "#10b981", // emerald-500
    "#f59e0b", // amber-500
    "#ef4444", // red-500
    "#8b5cf6", // violet-500
    "#ec4899", // pink-500
    "#06b6d4", // cyan-500
    "#f97316", // orange-500
  ]

  const isDark = theme === "dark"
  const textColor = isDark ? "#e5e7eb" : "#374151" // gray-200 : gray-700
  const gridColor = isDark ? "#374151" : "#e5e7eb" // gray-700 : gray-200

  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      {type === "bar" ? (
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey={xField} tick={{ fill: textColor }} angle={-45} textAnchor="end" height={60} />
          <YAxis tick={{ fill: textColor }} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#1f2937" : "#ffffff",
              borderColor: gridColor,
              color: textColor,
            }}
          />
          <Legend wrapperStyle={{ color: textColor }} />
          <Bar dataKey={yField} fill={COLORS[0]} />
        </BarChart>
      ) : type === "line" ? (
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey={xField} tick={{ fill: textColor }} angle={-45} textAnchor="end" height={60} />
          <YAxis tick={{ fill: textColor }} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#1f2937" : "#ffffff",
              borderColor: gridColor,
              color: textColor,
            }}
          />
          <Legend wrapperStyle={{ color: textColor }} />
          <Line type="monotone" dataKey={yField} stroke={COLORS[0]} strokeWidth={2} />
        </LineChart>
      ) : (
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={100}
            fill="#8884d8"
            dataKey={valueField}
            nameKey={nameField}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#1f2937" : "#ffffff",
              borderColor: gridColor,
              color: textColor,
            }}
          />
          <Legend wrapperStyle={{ color: textColor }} />
        </PieChart>
      )}
    </ResponsiveContainer>
  )
}
