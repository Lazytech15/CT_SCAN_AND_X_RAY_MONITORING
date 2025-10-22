"use client"

import { useState } from "react"
import StatsCard from "../components/dashboard/StatsCard"
import RecentActivity from "../components/dashboard/RecentActivity"
import { AlertCircle, TrendingUp, Clock, FileText } from "lucide-react"

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPatients: 156,
    criticalCases: 8,
    pendingReviews: 23,
    recentScans: 42,
  })

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: "ct-scan",
      patient: "MACARIO CABRIGAS MING",
      procedure: "CT Scan Cranium - Plain",
      severity: "Critical",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "xray",
      patient: "LAURA ARAGONES REZ",
      procedure: "Chest X-Ray",
      severity: "Moderate",
      time: "4 hours ago",
    },
    {
      id: 3,
      type: "ct-scan",
      patient: "JUAN DELA CRUZ",
      procedure: "CT Scan Abdomen - Contrast",
      severity: "Stable",
      time: "6 hours ago",
    },
  ])

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Welcome back! Here's your medical imaging overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={FileText} label="Total Patients" value={stats.totalPatients} trend="+12%" color="blue" />
        <StatsCard icon={AlertCircle} label="Critical Cases" value={stats.criticalCases} trend="-2%" color="red" />
        <StatsCard icon={Clock} label="Pending Reviews" value={stats.pendingReviews} trend="+5%" color="amber" />
        <StatsCard icon={TrendingUp} label="Recent Scans" value={stats.recentScans} trend="+8%" color="green" />
      </div>

      {/* Recent Activity */}
      <RecentActivity activities={recentActivities} />
    </div>
  )
}
