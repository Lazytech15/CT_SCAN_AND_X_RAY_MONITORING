import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

export default function MassEffectGauge() {
  const data = [
    { name: "Severe", value: 15, color: "#ef4444" },
    { name: "Moderate", value: 25, color: "#f59e0b" },
    { name: "Mild", value: 35, color: "#fbbf24" },
    { name: "None", value: 25, color: "#10b981" },
  ]

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-700">
      <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Mass Effect Severity Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
            <span className="text-zinc-600 dark:text-zinc-400">
              {item.name}: {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
