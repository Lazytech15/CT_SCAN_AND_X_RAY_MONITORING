import { Brain, Bug as Lung } from "lucide-react"

export default function RecentActivity({ activities }) {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
      case "Moderate":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200"
      case "Stable":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
      default:
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
    }
  }

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-700 overflow-hidden">
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-700">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Recent Activity</h2>
      </div>
      <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
        {activities.map((activity) => (
          <div key={activity.id} className="p-6 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-zinc-100 dark:bg-zinc-700 rounded-lg">
                {activity.type === "ct-scan" ? (
                  <Brain size={20} className="text-blue-600 dark:text-blue-400" />
                ) : (
                  <Lung size={20} className="text-green-600 dark:text-green-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-zinc-900 dark:text-white">{activity.patient}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{activity.procedure}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">{activity.time}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(activity.severity)}`}>
                {activity.severity}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
