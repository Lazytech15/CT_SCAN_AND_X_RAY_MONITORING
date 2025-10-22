// XRayDetail.jsx
import { CheckCircle, Thermometer, Wind, Zap } from "lucide-react"
import { useState, useEffect } from "react"
import LungOpacityChart from "./LungOpacityChart"
import apiService from "../../context/apiService"

export default function XRayDetail({ xray }) {
  const [imageUrl, setImageUrl] = useState(xray.imageUrl || xray.image_url || null)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    // Update image URL when xray changes
    setImageUrl(xray.imageUrl || xray.image_url || null)
    setImageError(false)
  }, [xray])

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
      case "Urgent":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200"
      case "Moderate":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200"
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
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{xray.patientName || xray.patient_name}</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">ID: {xray.patientId || xray.patient_id}</p>
          </div>
          <span className={`px-4 py-2 rounded-lg font-semibold ${getSeverityColor(xray.severity)}`}>
            {xray.severity}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
          <div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Age</p>
            <p className="font-semibold text-zinc-900 dark:text-white">{xray.age} years</p>
          </div>
          <div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Gender</p>
            <p className="font-semibold text-zinc-900 dark:text-white">{xray.gender}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Procedure</p>
            <p className="font-semibold text-zinc-900 dark:text-white text-sm">{xray.procedure}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Status</p>
            <p className="font-semibold text-zinc-900 dark:text-white">{xray.status}</p>
          </div>
        </div>
      </div>

      {/* Image */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-700">
        <h3 className="font-bold text-zinc-900 dark:text-white mb-4">X-Ray Image</h3>
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt="X-Ray"
            className="w-full h-64 object-cover rounded-lg bg-zinc-100 dark:bg-zinc-700"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-64 rounded-lg bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center">
            <p className="text-zinc-500 dark:text-zinc-400">No image available</p>
          </div>
        )}
      </div>

      {/* Vital Signs */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-700">
        <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Vital Signs</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-zinc-50 dark:bg-zinc-700/50 rounded-lg p-4 text-center">
            <div className="flex justify-center mb-2">
              <Thermometer size={24} className="text-red-500" />
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">
              {xray.vitalSigns?.temperature || xray.temperature}°C
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">Temperature</p>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-700/50 rounded-lg p-4 text-center">
            <div className="flex justify-center mb-2">
              <Zap size={24} className="text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">
              {xray.vitalSigns?.o2Saturation || xray.o2_saturation}%
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">O2 Saturation</p>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-700/50 rounded-lg p-4 text-center">
            <div className="flex justify-center mb-2">
              <Wind size={24} className="text-green-500" />
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">
              {xray.vitalSigns?.respiratoryRate || xray.respiratory_rate}
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">Resp. Rate</p>
          </div>
        </div>
      </div>

      {/* Clinical Information */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-700">
        <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Clinical Information</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Clinical History</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{xray.clinicalHistory || xray.clinical_history}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Findings</p>
            <div className="bg-zinc-50 dark:bg-zinc-700/50 rounded p-3 text-sm text-zinc-700 dark:text-zinc-300">
              <p>
                <strong>Type:</strong> {xray.findings?.type || xray.findings_type}
              </p>
              {(xray.findings?.affectedAreas?.length > 0 || xray.affected_areas?.length > 0) && (
                <p>
                  <strong>Affected Areas:</strong> {(xray.findings?.affectedAreas || xray.affected_areas)?.join(", ")}
                </p>
              )}
              <p>
                <strong>Opacity:</strong> {xray.findings?.opacity || xray.opacity}
              </p>
              {(xray.findings?.additionalFindings || xray.additional_findings) && (
                <p>
                  <strong>Additional Findings:</strong> {xray.findings?.additionalFindings || xray.additional_findings}
                </p>
              )}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Impression</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{xray.impression}</p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-700">
        <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Recommendations</h3>
        <ul className="space-y-2">
          {xray.recommendations?.map((rec, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <CheckCircle size={18} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-zinc-700 dark:text-zinc-300">{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Chart */}
      <LungOpacityChart />
    </div>
  )
}