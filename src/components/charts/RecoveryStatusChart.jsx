import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

export default function RecoveryStatusChart() {
  const data = [
    { name: "Stable", value: 45, color: "#10b981" },
    { name: "Improving", value: 30, color: "#3b82f6" },
    { name: "Deteriorating", value: 15, color: "#f59e0b" },
    { name: "Critical", value: 10, color: "#ef4444" },
  ]

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-700">
      <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Patient Recovery Status</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#27272a",
              border: "1px solid #52525b",
              borderRadius: "8px",
              color: "#fafafa",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
