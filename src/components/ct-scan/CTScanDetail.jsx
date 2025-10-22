// CTScanDetail.jsx
import { CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"
import HematomaChart from "./HematomaChart"
import apiService from "../../context/apiService"

export default function CTScanDetail({ scan }) {
  const [imageUrl, setImageUrl] = useState(scan.imageUrl || scan.image_url || null)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    // Update image URL when scan changes
    setImageUrl(scan.imageUrl || scan.image_url || null)
    setImageError(false)
  }, [scan])

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
      case "Urgent":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200"
      case "Stable":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
      default:
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-700">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{scan.patientName || scan.patient_name}</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">ID: {scan.patientId || scan.patient_id}</p>
          </div>
          <span className={`px-4 py-2 rounded-lg font-semibold ${getSeverityColor(scan.severity)}`}>
            {scan.severity}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
          <div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Age</p>
            <p className="font-semibold text-zinc-900 dark:text-white">{scan.age} years</p>
          </div>
          <div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Gender</p>
            <p className="font-semibold text-zinc-900 dark:text-white">{scan.gender}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Procedure</p>
            <p className="font-semibold text-zinc-900 dark:text-white text-sm">{scan.procedure}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Status</p>
            <p className="font-semibold text-zinc-900 dark:text-white">{scan.status}</p>
          </div>
        </div>
      </div>

      {/* Image */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-700">
        <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Scan Image</h3>
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt="CT Scan"
            className="w-full h-64 object-cover rounded-lg bg-zinc-100 dark:bg-zinc-700"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-64 rounded-lg bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center">
            <p className="text-zinc-500 dark:text-zinc-400">No image available</p>
          </div>
        )}
      </div>

      {/* Clinical Information */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-700">
        <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Clinical Information</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Clinical History</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{scan.clinicalHistory || scan.clinical_history}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Findings</p>
            <div className="bg-zinc-50 dark:bg-zinc-700/50 rounded p-3 text-sm text-zinc-700 dark:text-zinc-300">
              <p>
                <strong>Type:</strong> {scan.findings?.type || scan.findings_type}
              </p>
              <p>
                <strong>Location:</strong> {scan.findings?.location || scan.location}
              </p>
              {scan.findings?.dimensions && (scan.findings.dimensions.length > 0 || scan.dimension_length > 0) && (
                <p>
                  <strong>Dimensions:</strong> {scan.findings.dimensions?.length || scan.dimension_length} x {scan.findings.dimensions?.width || scan.dimension_width} x{" "}
                  {scan.findings.dimensions?.thickness || scan.dimension_thickness} cm
                </p>
              )}
              {(scan.findings?.midlineShift > 0 || scan.midline_shift > 0) && (
                <p>
                  <strong>Midline Shift:</strong> {scan.findings?.midlineShift || scan.midline_shift} mm
                </p>
              )}
              {(scan.findings?.massEffect || scan.mass_effect) && (
                <p>
                  <strong>Mass Effect:</strong> {scan.findings?.massEffect || scan.mass_effect}
                </p>
              )}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Impression</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{scan.impression}</p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-700">
        <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Recommendations</h3>
        <ul className="space-y-2">
          {scan.recommendations?.map((rec, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <CheckCircle size={18} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-zinc-700 dark:text-zinc-300">{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Chart */}
      <HematomaChart />
    </div>
  )
}