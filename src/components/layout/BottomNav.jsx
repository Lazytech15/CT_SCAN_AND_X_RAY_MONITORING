import { Link } from "react-router-dom"
import { Home, Brain, Bug as Lung, Plus, User } from "lucide-react"

export default function BottomNav({ currentPath, darkMode }) {
  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/ct-scans", icon: Brain, label: "CT Scans" },
    { path: "/xrays", icon: Lung, label: "X-Rays" },
    { path: "/add-scan", icon: Plus, label: "Add New" },
    { path: "/profile", icon: User, label: "Profile" },
  ]

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 border-t ${
        darkMode ? "bg-zinc-900 border-zinc-800 shadow-2xl" : "bg-white border-zinc-200 shadow-2xl"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around items-center h-20">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = currentPath === path
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-all duration-200 ${
                  isActive
                    ? darkMode
                      ? "bg-blue-600 text-white"
                      : "bg-blue-500 text-white"
                    : darkMode
                      ? "text-zinc-400 hover:text-zinc-200"
                      : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                <Icon size={24} />
                <span className="text-xs mt-1 font-medium">{label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
