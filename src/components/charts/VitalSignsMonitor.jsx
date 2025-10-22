import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function VitalSignsMonitor() {
  const data = [
    { time: "08:00", temp: 38.5, o2: 92, rr: 24 },
    { time: "10:00", temp: 38.2, o2: 93, rr: 23 },
    { time: "12:00", temp: 37.8, o2: 94, rr: 22 },
    { time: "14:00", temp: 37.5, o2: 95, rr: 20 },
    { time: "16:00", temp: 37.2, o2: 96, rr: 18 },
  ]

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-700">
      <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Vital Signs Monitor</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
          <XAxis dataKey="time" stroke="#71717a" />
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
          <Line type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={2} name="Temperature (°C)" />
          <Line type="monotone" dataKey="o2" stroke="#3b82f6" strokeWidth={2} name="O2 Saturation (%)" />
          <Line type="monotone" dataKey="rr" stroke="#10b981" strokeWidth={2} name="Respiratory Rate" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
