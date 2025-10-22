export default function StatsCard({ icon: Icon, label, value, trend, color }) {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    red: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    amber: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
    green: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
  }

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-700">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">{label}</p>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white">{value}</p>
          <p
            className={`text-xs mt-2 font-semibold ${trend.startsWith("+") ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
          >
            {trend} from last month
          </p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  )
}
