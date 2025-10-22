import LoginForm from "../components/auth/LoginForm"
import icon from "../../public/scan.png"

export default function LoginPage({ onLogin }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
            <img src={icon} alt="logo" />
          </div>
          {/* <h1 className="text-3xl font-bold text-white mb-2">Medical Imaging</h1> */}
          <p className="text-zinc-400">CT Scan & X-Ray Monitoring Dashboard</p>
        </div>
        <LoginForm onLogin={onLogin} />
      </div>
    </div>
  )
}
