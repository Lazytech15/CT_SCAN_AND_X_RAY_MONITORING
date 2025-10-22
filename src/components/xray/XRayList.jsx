"use client"

import { Clock } from "lucide-react"

export default function XRayList({ xrays, selectedXRay, onSelectXRay }) {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700"
      case "Urgent":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700"
      case "Moderate":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 border-orange-300 dark:border-orange-700"
      case "Stable":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700"
      default:
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700"
    }
  }

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-700 overflow-hidden">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
        <h2 className="font-bold text-zinc-900 dark:text-white">X-Rays ({xrays.length})</h2>
      </div>
      <div className="divide-y divide-zinc-200 dark:divide-zinc-700 max-h-96 overflow-y-auto">
        {xrays.map((xray) => (
          <button
            key={xray.id}
            onClick={() => onSelectXRay(xray)}
            className={`w-full text-left p-4 transition-colors ${
              selectedXRay?.id === xray.id
                ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
                : "hover:bg-zinc-50 dark:hover:bg-zinc-700/50"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="font-semibold text-zinc-900 dark:text-white text-sm">{xray.patientName}</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{xray.procedure}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-zinc-500 dark:text-zinc-500">
                  <Clock size={12} />
                  {new Date(xray.scanDate).toLocaleDateString()}
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap border ${getSeverityColor(xray.severity)}`}
              >
                {xray.severity}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
