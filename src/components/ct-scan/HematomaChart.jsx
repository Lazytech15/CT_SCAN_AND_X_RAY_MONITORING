import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function HematomaChart() {
  const data = [
    { date: "Oct 15", length: 4.2, width: 2.8, thickness: 1.5 },
    { date: "Oct 16", length: 4.1, width: 2.7, thickness: 1.4 },
    { date: "Oct 17", length: 3.9, width: 2.5, thickness: 1.3 },
    { date: "Oct 18", length: 3.7, width: 2.3, thickness: 1.2 },
  ]

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-700">
      <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Hematoma Size Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
          <XAxis dataKey="date" stroke="#71717a" />
          <YAxis stroke="#71717a" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#27272a",
              border: "1px solid #52525b",
              borderRadius: "8px",
              color: "#fafafa",
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="length" stroke="#3b82f6" strokeWidth={2} name="Length (cm)" />
          <Line type="monotone" dataKey="width" stroke="#10b981" strokeWidth={2} name="Width (cm)" />
          <Line type="monotone" dataKey="thickness" stroke="#f59e0b" strokeWidth={2} name="Thickness (cm)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
