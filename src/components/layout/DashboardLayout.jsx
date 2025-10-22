import { useLocation } from "react-router-dom"
import BottomNav from "./BottomNav"

export default function DashboardLayout({ children, darkMode, onToggleDarkMode, onLogout }) {
  const location = useLocation()

  return (
    <div
      className={`min-h-screen flex flex-col ${darkMode ? "dark bg-zinc-950 text-zinc-50" : "bg-zinc-50 text-zinc-950"}`}
    >
      {/* Main Content */}
      <main className="flex-1 pb-24 overflow-y-auto">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav currentPath={location.pathname} darkMode={darkMode} />
    </div>
  )
}
