import { useState } from "react"
import CTScanForm from "../components/ct-scan/CTScanForm"
import XRayForm from "../components/xray/XRayForm"

export default function AddScan() {
  const [scanType, setScanType] = useState("ct")

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Add New Scan</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Create a new patient scan record</p>
      </div>

      {/* Scan Type Selector */}
      <div className="flex gap-4">
        <button
          onClick={() => setScanType("ct")}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            scanType === "ct"
              ? "bg-blue-600 text-white"
              : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700"
          }`}
        >
          CT Scan
        </button>
        <button
          onClick={() => setScanType("xray")}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            scanType === "xray"
              ? "bg-blue-600 text-white"
              : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700"
          }`}
        >
          X-Ray
        </button>
      </div>

      {/* Forms */}
      {scanType === "ct" ? <CTScanForm /> : <XRayForm />}
    </div>
  )
}
