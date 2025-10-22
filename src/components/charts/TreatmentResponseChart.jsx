import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function TreatmentResponseChart() {
  const data = [
    { day: "Day 1", symptomScore: 8, improvementScore: 20 },
    { day: "Day 2", symptomScore: 7, improvementScore: 35 },
    { day: "Day 3", symptomScore: 6, improvementScore: 50 },
    { day: "Day 4", symptomScore: 4, improvementScore: 70 },
    { day: "Day 5", symptomScore: 2, improvementScore: 85 },
  ]

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-700">
      <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Treatment Response</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
          <XAxis dataKey="day" stroke="#71717a" />
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
          <Bar dataKey="symptomScore" fill="#ef4444" name="Symptom Score" />
          <Line type="monotone" dataKey="improvementScore" stroke="#10b981" strokeWidth={2} name="Improvement %" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
