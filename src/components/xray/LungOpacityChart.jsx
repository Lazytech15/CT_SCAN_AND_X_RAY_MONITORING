import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function LungOpacityChart() {
  const data = [
    { date: "Oct 16", rightLobe: 45, leftLobe: 35 },
    { date: "Oct 17", rightLobe: 42, leftLobe: 32 },
    { date: "Oct 18", rightLobe: 38, leftLobe: 28 },
    { date: "Oct 19", rightLobe: 32, leftLobe: 22 },
  ]

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-700">
      <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Lung Opacity Coverage (%)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorLeft" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
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
          <Area
            type="monotone"
            dataKey="rightLobe"
            stackId="1"
            stroke="#ef4444"
            fillOpacity={1}
            fill="url(#colorRight)"
            name="Right Lobe (%)"
          />
          <Area
            type="monotone"
            dataKey="leftLobe"
            stackId="1"
            stroke="#f59e0b"
            fillOpacity={1}
            fill="url(#colorLeft)"
            name="Left Lobe (%)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
