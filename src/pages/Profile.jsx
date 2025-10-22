"use client"

import { useState } from "react"
import { Moon, Sun, LogOut, User, Mail, Phone } from "lucide-react"

export default function Profile({ onLogout }) {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true")

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem("darkMode", newDarkMode)
    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Manage your account settings</p>
      </div>

      {/* User Information */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-700">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Account Information</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg">
            <User size={24} className="text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Name</p>
              <p className="font-semibold text-zinc-900 dark:text-white">Dr. Medical Professional</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg">
            <Mail size={24} className="text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Email</p>
              <p className="font-semibold text-zinc-900 dark:text-white">doctor@medical.com</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg">
            <Phone size={24} className="text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Phone</p>
              <p className="font-semibold text-zinc-900 dark:text-white">+1 (555) 123-4567</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-700">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon size={24} className="text-amber-500" /> : <Sun size={24} className="text-amber-500" />}
              <div>
                <p className="font-semibold text-zinc-900 dark:text-white">Dark Mode</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Toggle dark mode theme</p>
              </div>
            </div>
            <button
              onClick={handleDarkModeToggle}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                darkMode ? "bg-blue-600" : "bg-zinc-300"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  darkMode ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-700">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Session</h2>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  )
}
