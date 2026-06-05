import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import backgroundImage from "../../assets/images/background.jpg"
import { GraduationCap, Users } from "lucide-react"
import { registerUser } from "../../api/authApi"
import { useAuth } from "../../hooks/useAuth"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import ErrorMessage from "../../components/common/ErrorMessage"

function RegisterPage() {
  const navigate  = useNavigate()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    firstName:       "",
    lastName:        "",
    email:           "",
    password:        "",
    confirmPassword: "",
    role:            "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState("")

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  function handleRoleSelect(role) {
    setFormData({ ...formData, role })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")

    // Frontend validation
    if (!formData.firstName || !formData.lastName ||
        !formData.email || !formData.password ||
        !formData.confirmPassword) {
      setError("Please fill in all fields")
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (!formData.role) {
      setError("Please select a role")
      return
    }

    try {
      setLoading(true)

      // Combine first and last name for backend
      const fullName = `${formData.firstName} ${formData.lastName}`

      // Call backend register API
      const response = await registerUser(
        fullName,
        formData.email,
        formData.password,
        formData.role,
      )

      const { user, access_token, refresh_token } = response.data

      // Save tokens via AuthContext
      login(user, access_token, refresh_token)

      // Navigate to dashboard
      navigate("/dashboard")

    } catch (err) {
      const message = err.response?.data?.error?.message
        || "Registration failed. Please try again."
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-[#0A1931] opacity-60" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-3xl mx-6 flex
        rounded-2xl overflow-hidden
        shadow-[0_0_40px_rgba(0,0,0,0.8)]">

        {/* Left */}
        <div className="hidden md:flex flex-1 flex-col justify-center
          px-10 py-12 bg-transparent space-y-4">
          <h1 className="font-heading text-5xl font-bold text-white">
            Learnify
          </h1>
          <div className="font-heading text-2xl font-bold text-white space-y-1">
            <p>Plan better.</p>
            <p>Learn smarter.</p>
            <p>Achieve more.</p>
          </div>
          <p className="font-body text-white/60 text-sm leading-relaxed max-w-xs">
            Create your Learnify account to access personalized study
            schedules, AI-powered assistance, and collaborative learning.
          </p>
        </div>

        {/* Right — Register Form */}
        <div className="w-full md:w-96 bg-[#0A1931] bg-opacity-95
          backdrop-blur-md px-8 py-10 flex flex-col justify-center
          space-y-5 border border-[#4A7FA7] border-opacity-30 shadow-2xl">

          <h2 className="font-heading text-2xl font-semibold text-white
            text-center tracking-widest">
            REGISTER
          </h2>

          {/* Error Message */}
          {error && (
            <ErrorMessage
              message={error}
              onDismiss={() => setError("")}
            />
          )}

          <div className="space-y-3">

            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full bg-[#1A3D63] bg-opacity-60 text-white
                placeholder-[#B3CFE5] font-body text-sm px-4 py-3
                rounded-lg border border-[#4A7FA7] border-opacity-40
                focus:outline-none focus:border-[#4A7FA7]
                transition-colors duration-200"
            />

            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full bg-[#1A3D63] bg-opacity-60 text-white
                placeholder-[#B3CFE5] font-body text-sm px-4 py-3
                rounded-lg border border-[#4A7FA7] border-opacity-40
                focus:outline-none focus:border-[#4A7FA7]
                transition-colors duration-200"
            />

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

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-[#1A3D63] bg-opacity-60 text-white
                placeholder-[#B3CFE5] font-body text-sm px-4 py-3
                rounded-lg border border-[#4A7FA7] border-opacity-40
                focus:outline-none focus:border-[#4A7FA7]
                transition-colors duration-200"
            />

            {/* Role Selection */}
            <div className="space-y-2">
              <p className="font-body text-sm text-[#B3CFE5]">
                Choose your role
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleRoleSelect("student")}
                  className={`flex flex-col items-center gap-2 py-4
                    rounded-lg border transition-all duration-200
                    ${formData.role === "student"
                      ? "bg-[#4A7FA7] border-[#4A7FA7] text-white"
                      : "bg-[#1A3D63] bg-opacity-60 border-[#4A7FA7] border-opacity-40 text-[#B3CFE5] hover:border-[#4A7FA7]"
                    }`}
                >
                  <GraduationCap size={28} />
                  <span className="font-body text-sm font-medium">
                    Student
                  </span>
                </button>

                <button
                  onClick={() => handleRoleSelect("mentor")}
                  className={`flex flex-col items-center gap-2 py-4
                    rounded-lg border transition-all duration-200
                    ${formData.role === "mentor"
                      ? "bg-[#4A7FA7] border-[#4A7FA7] text-white"
                      : "bg-[#1A3D63] bg-opacity-60 border-[#4A7FA7] border-opacity-40 text-[#B3CFE5] hover:border-[#4A7FA7]"
                    }`}
                >
                  <Users size={28} />
                  <span className="font-body text-sm font-medium">
                    Mentor
                  </span>
                </button>
              </div>
            </div>

            {/* Register Button */}
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
                : "Register"
              }
            </button>

          </div>

          <p className="font-body text-xs text-[#B3CFE5] text-center">
            Already have an account?{" "}
            <Link to="/login"
              className="text-[#4A7FA7] font-bold hover:text-white
                transition-colors">
              Sign In
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default RegisterPage