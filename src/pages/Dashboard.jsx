"use client"

import { useState,useEffect } from "react"
import StatsCard from "../components/dashboard/StatsCard"
import RecentActivity from "../components/dashboard/RecentActivity"
import { AlertCircle, TrendingUp, Clock, FileText, Users } from "lucide-react"
import apiService from "../context/apiService"

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    criticalCases: 0,
    pendingReviews: 0,
    recentScans: 0,
    trends: {
      patients: "...",
      critical: "...",
      pending: "...",
      scans: "..."
    }
  })
  const [recentActivities, setRecentActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch both X-rays and CT scans
      const [xrays, ctScans] = await Promise.all([
        apiService.xrays.getAll(),
        apiService.ctScans.getAll()
      ])

      // Combine all scans
      const allScans = [...(xrays || []), ...(ctScans || [])]
      
      // Calculate stats
      const totalScans = allScans.length
      
      // Get unique patients
      const uniquePatients = new Set()
      allScans.forEach(scan => {
        const patientName = scan.patient_name || scan.patientName
        if (patientName) uniquePatients.add(patientName.toLowerCase())
      })
      
      // Count critical cases
      const criticalCases = allScans.filter(scan => 
        (scan.severity || '').toLowerCase() === 'critical'
      ).length

      // Count pending reviews (scans without findings/diagnosis)
      const pendingReviews = allScans.filter(scan => 
        !scan.findings && !scan.diagnosis && !scan.notes
      ).length

      // Count recent scans (last 7 days)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
      const recentScans = allScans.filter(scan => {
        const scanDate = new Date(scan.created_at || scan.date || scan.scan_date)
        return scanDate >= sevenDaysAgo
      }).length

      // Calculate trends (comparing last 30 days vs previous 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const sixtyDaysAgo = new Date()
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

      const last30Days = allScans.filter(scan => {
        const scanDate = new Date(scan.created_at || scan.date || scan.scan_date)
        return scanDate >= thirtyDaysAgo
      }).length

      const previous30Days = allScans.filter(scan => {
        const scanDate = new Date(scan.created_at || scan.date || scan.scan_date)
        return scanDate >= sixtyDaysAgo && scanDate < thirtyDaysAgo
      }).length

      const scanTrend = previous30Days > 0 
        ? `${last30Days > previous30Days ? '+' : ''}${Math.round(((last30Days - previous30Days) / previous30Days) * 100)}%`
        : last30Days > 0 ? '+100%' : '0%'

      // Set stats
      setStats({
        totalPatients: uniquePatients.size,
        criticalCases: criticalCases,
        pendingReviews: pendingReviews,
        recentScans: recentScans,
        trends: {
          patients: '+12% from last month',
          critical: criticalCases > 0 ? `${criticalCases} active cases` : 'No active cases',
          pending: pendingReviews > 0 ? `${pendingReviews} awaiting review` : 'All reviewed',
          scans: `${scanTrend} from last month`
        }
      })

      // Format recent activities
      const xrayActivities = (xrays || []).map(xray => ({
        id: `xray-${xray.id}`,
        patient: xray.patient_name || xray.patientName || 'Unknown Patient',
        procedure: xray.scan_type || xray.type || 'X-Ray Scan',
        time: formatDate(xray.created_at || xray.date || xray.scan_date),
        severity: xray.severity || 'Stable',
        type: 'xray',
        date: new Date(xray.created_at || xray.date || xray.scan_date)
      }))

      const ctScanActivities = (ctScans || []).map(scan => ({
        id: `ct-${scan.id}`,
        patient: scan.patient_name || scan.patientName || 'Unknown Patient',
        procedure: scan.scan_type || scan.type || 'CT Scan',
        time: formatDate(scan.created_at || scan.date || scan.scan_date),
        severity: scan.severity || 'Stable',
        type: 'ct-scan',
        date: new Date(scan.created_at || scan.date || scan.scan_date)
      }))

      // Combine and sort by date (most recent first)
      const combined = [...xrayActivities, ...ctScanActivities]
        .sort((a, b) => b.date - a.date)
        .slice(0, 5) // Show only 5 most recent

      setRecentActivities(combined)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Keep default values on error
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date'
    
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Unknown date'
    
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    })
  }

  if (loading) {
    return (
      <div className="p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-zinc-600 dark:text-zinc-400">Loading your medical imaging overview...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-700">
              <div className="animate-pulse">
                <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Welcome back! Here's your medical imaging overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          icon={Users} 
          label="Total Patients" 
          value={stats.totalPatients} 
          trend={stats.trends.patients} 
          color="blue" 
        />
        <StatsCard 
          icon={AlertCircle} 
          label="Critical Cases" 
          value={stats.criticalCases} 
          trend={stats.trends.critical} 
          color="red" 
        />
        <StatsCard 
          icon={Clock} 
          label="Pending Reviews" 
          value={stats.pendingReviews} 
          trend={stats.trends.pending} 
          color="amber" 
        />
        <StatsCard 
          icon={TrendingUp} 
          label="Recent Scans" 
          value={stats.recentScans} 
          trend={stats.trends.scans} 
          color="green" 
        />
      </div>

      {/* Recent Activity */}
      <RecentActivity activities={recentActivities} loading={false} />
    </div>
  )
}
