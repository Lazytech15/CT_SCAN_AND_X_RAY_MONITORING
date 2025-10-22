"use client"

import { Clock } from "lucide-react"

export default function CTScanList({ scans, selectedScan, onSelectScan }) {
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

  const formatDate = (dateString) => {
    if (!dateString) return 'No date'
    
    try {
      // Handle MySQL datetime format: "2025-10-18 09:15:00"
      // Replace space with 'T' to make it ISO 8601 compatible
      const isoDate = dateString.replace(' ', 'T')
      const date = new Date(isoDate)
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date'
      }
      
      // Format the date
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'Invalid date'
    }
  }

  const formatTime = (dateString) => {
    if (!dateString) return ''
    
    try {
      const isoDate = dateString.replace(' ', 'T')
      const date = new Date(isoDate)
      
      if (isNaN(date.getTime())) {
        return ''
      }
      
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return ''
    }
  }

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-700 overflow-hidden">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
        <h2 className="font-bold text-zinc-900 dark:text-white">CT Scans ({scans.length})</h2>
      </div>
      <div className="divide-y divide-zinc-200 dark:divide-zinc-700 max-h-96 overflow-y-auto">
        {scans.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">
            No CT scans found
          </div>
        ) : (
          scans.map((scan) => (
            <button
              key={scan.id}
              onClick={() => onSelectScan(scan)}
              className={`w-full text-left p-4 transition-colors ${
                selectedScan?.id === scan.id
                  ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
                  : "hover:bg-zinc-50 dark:hover:bg-zinc-700/50"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-semibold text-zinc-900 dark:text-white text-sm">
                    {scan.patientName || scan.patient_name || 'Unknown Patient'}
                  </p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                    {scan.procedure || scan.scan_type || scan.type || 'CT Scan'}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-zinc-500 dark:text-zinc-500">
                    <Clock size={12} />
                    <span>
                      {formatDate(scan.scanDate || scan.scan_date || scan.date || scan.created_at)}
                    </span>
                    {formatTime(scan.scanDate || scan.scan_date || scan.date || scan.created_at) && (
                      <span className="ml-1">
                        • {formatTime(scan.scanDate || scan.scan_date || scan.date || scan.created_at)}
                      </span>
                    )}
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap border ${getSeverityColor(scan.severity)}`}
                >
                  {scan.severity || 'Stable'}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}