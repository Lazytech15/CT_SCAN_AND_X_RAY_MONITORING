// LoginForm.jsx
import { useState } from "react"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import apiService from "../../context/apiService"

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Use apiService to authenticate
      const result = await apiService.auth(email, password)
      
      if (result.success) {
        // Call onLogin callback with token and user data
        onLogin(result.data.token, result.data.user)
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-800 rounded-xl shadow-xl p-8 space-y-6">
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-zinc-200 mb-2">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 text-zinc-500" size={20} />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="w-full pl-10 pr-4 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-200 mb-2">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 text-zinc-500" size={20} />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full pl-10 pr-10 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="remember"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 bg-zinc-700 border-zinc-600 rounded-cursor-pointer"
          />
          <label htmlFor="remember" className="ml-2 text-sm text-zinc-400 cursor-pointer">
            Remember me
          </label>
        </div>
        <a href="#" className="text-sm text-blue-400 hover:text-blue-300">
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors duration-200"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>

      <p className="text-center text-sm text-zinc-400">
        Don't have an account?{" "}
        <a href="#" className="text-blue-400 hover:text-blue-300">
          Sign up
        </a>
      </p>
    </form>
  )
}