"use client"

import { useState, useEffect } from "react"
import CTScanList from "../components/ct-scan/CTScanList"
import CTScanDetail from "../components/ct-scan/CTScanDetail"
import { Search, Filter, AlertCircle } from "lucide-react"
import apiService from "../context/apiService"

export default function CTScans() {
  const [selectedScan, setSelectedScan] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSeverity, setFilterSeverity] = useState("all")
  const [ctScans, setCtScans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch CT scans from API
  useEffect(() => {
    fetchCTScans()
  }, [])

  const fetchCTScans = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiService.ctScans.getAll()
      setCtScans(data)
    } catch (err) {
      setError(err.message || 'Failed to load CT scans')
      console.error('Error fetching CT scans:', err)
    } finally {
      setLoading(false)
    }
  }

  // Filter CT scans based on search and severity
  const filteredScans = ctScans.filter((scan) => {
    const matchesSearch =
      scan.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scan.patient_id?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = filterSeverity === "all" || scan.severity === filterSeverity

    return matchesSearch && matchesSeverity
  })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">CT Scans</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Monitor and manage CT scan records</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-zinc-400" size={20} />
          <input
            type="text"
            placeholder="Search by patient name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-zinc-600 dark:text-zinc-400" />
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="Urgent">Urgent</option>
            <option value="Stable">Stable</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 text-center border border-zinc-200 dark:border-zinc-700">
          <p className="text-zinc-600 dark:text-zinc-400">Loading CT scans...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="text-red-600 dark:text-red-400" size={20} />
          <div className="flex-1">
            <p className="text-red-800 dark:text-red-200 font-medium">Error loading CT scans</p>
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
          <button
            onClick={fetchCTScans}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="lg:col-span-1">
            <CTScanList scans={filteredScans} selectedScan={selectedScan} onSelectScan={setSelectedScan} />
          </div>

          {/* Detail */}
          <div className="lg:col-span-2">
            {selectedScan ? (
              <CTScanDetail scan={selectedScan} />
            ) : (
              <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 text-center border border-zinc-200 dark:border-zinc-700">
                <p className="text-zinc-600 dark:text-zinc-400">Select a CT scan to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}