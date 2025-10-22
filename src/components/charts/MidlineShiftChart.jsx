import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

export default function MidlineShiftChart() {
  const data = [
    { date: "Oct 15", shift: 4, severity: "High" },
    { date: "Oct 16", shift: 3.5, severity: "High" },
    { date: "Oct 17", shift: 2.8, severity: "Medium" },
    { date: "Oct 18", shift: 1.5, severity: "Low" },
  ]

  const getColor = (value) => {
    if (value > 5) return "#ef4444"
    if (value > 3) return "#f59e0b"
    return "#10b981"
  }

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-700">
      <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Midline Shift Progress (mm)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
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
          <Bar dataKey="shift" name="Midline Shift (mm)">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.shift)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-zinc-600 dark:text-zinc-400">{"<3mm (Normal)"}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-amber-500 rounded"></div>
          <span className="text-zinc-600 dark:text-zinc-400">3-5mm (Moderate)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span className="text-zinc-600 dark:text-zinc-400">{">5mm (Severe)"}</span>
        </div>
      </div>
    </div>
  )
}
