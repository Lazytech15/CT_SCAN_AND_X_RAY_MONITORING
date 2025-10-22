import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import CTScans from "./pages/CTScans"
import XRays from "./pages/XRays"
import AddScan from "./pages/AddScan"
import Profile from "./pages/Profile"
import DashboardLayout from "./components/layout/DashboardLayout"

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true"
  })

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode)
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const handleLogin = (token) => {
    localStorage.setItem("authToken", token)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <Router>
      <DashboardLayout darkMode={darkMode} onToggleDarkMode={setDarkMode} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ct-scans" element={<CTScans />} />
          <Route path="/xrays" element={<XRays />} />
          <Route path="/add-scan" element={<AddScan />} />
          <Route path="/profile" element={<Profile onLogout={handleLogout} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </DashboardLayout>
    </Router>
  )
}
