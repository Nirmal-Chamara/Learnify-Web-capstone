import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import backgroundImage from "../../assets/images/background.jpg"
import { loginUser } from "../../api/authApi"
import { useAuth } from "../../hooks/useAuth"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import ErrorMessage from "../../components/common/ErrorMessage"

function LoginPage() {
  const navigate    = useNavigate()
  const { login }   = useAuth()

  const [formData, setFormData] = useState({
    email:    "",
    password: "",
  })

  // loading — true while waiting for backend response
  const [loading, setLoading] = useState(false)

  // error — stores error message from backend
  const [error, setError]     = useState("")

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")

    // Basic frontend validation before calling backend
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      return
    }

    try {
      // Show loading spinner while waiting
      setLoading(true)

      // Call backend login API
      const response = await loginUser(formData.email, formData.password)

      // response.data contains { user, access_token, refresh_token }
      const { user, access_token, refresh_token } = response.data

      // Save tokens and user data via AuthContext
      // This stores tokens in localStorage automatically
      login(user, access_token, refresh_token)

      // Navigate to dashboard on success
      navigate("/dashboard")

    } catch (err) {
      // err.response.data contains error from Flask
      const message = err.response?.data?.error?.message
        || "Login failed. Please try again."
      setError(message)
    } finally {
      // Always hide loading spinner when done
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-[#0A1931] opacity-60" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl mx-6 flex
        rounded-2xl overflow-hidden
        shadow-[0_0_40px_rgba(0,0,0,0.8)]">

        {/* Left — Welcome Text */}
        <div className="hidden md:flex flex-1 flex-col justify-center
          px-10 py-12 bg-transparent space-y-4">
          <p className="font-body text-[#B3CFE5] text-sm mb-2 font-bold">
            Welcome Back To
          </p>
          <h1 className="font-heading text-4xl font-bold text-white mb-4">
            Learnify
          </h1>
          <p className="font-body text-white/60 text-sm leading-relaxed">
            Login to continue your learning journey.
          </p>
        </div>

        {/* Right — Login Form */}
        <div className="w-full md:w-96 bg-[#0A1931] bg-opacity-95
          backdrop-blur-md px-10 py-12 flex flex-col justify-center
          space-y-6 border border-[#4A7FA7] border-opacity-30 shadow-2xl">

          {/* Title */}
          <h2 className="font-heading text-2xl font-semibold text-white
            text-center tracking-widest">
            LOGIN
          </h2>

          {/* Error Message — shows if login fails */}
          {error && (
            <ErrorMessage
              message={error}
              onDismiss={() => setError("")}
            />
          )}

          {/* Form */}
          <div className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-[#1A3D63] bg-opacity-60 text-white
                placeholder-[#B3CFE5] font-body text-sm px-4 py-3
                rounded-lg border border-[#4A7FA7] border-opacity-40
                focus:outline-none focus:border-[#4A7FA7]
                transition-colors duration-200"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-[#1A3D63] bg-opacity-60 text-white
                placeholder-[#B3CFE5] font-body text-sm px-4 py-3
                rounded-lg border border-[#4A7FA7] border-opacity-40
                focus:outline-none focus:border-[#4A7FA7]
                transition-colors duration-200"
            />

            <div className="text-right">
              <Link to="/forgot-password"
                className="font-body text-xs text-[#B3CFE5]
                  hover:text-white transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Login Button — shows spinner when loading */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#4A7FA7] hover:bg-[#1A3D63] text-white
                font-body text-sm font-medium py-3 rounded-lg
                transition-colors duration-200 flex items-center
                justify-center gap-2 disabled:opacity-50
                disabled:cursor-not-allowed"
            >
              {loading
                ? <LoadingSpinner size="sm" color="white" />
                : "Login"
              }
            </button>
          </div>

          <p className="font-body text-xs text-[#B3CFE5] text-center">
            Do Not have an account?{" "}
            <Link to="/register"
              className="text-[#4A7FA7] font-medium hover:text-white
                transition-colors">
              Get Started
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default LoginPage