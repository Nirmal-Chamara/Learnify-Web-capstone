import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Camera } from "lucide-react"
import { useAuth } from "../../hooks/useAuth"
import ProfileDropdown from "./ProfileDropdown"
import ProfileImageUpload from "./ProfileImageUpload"
import Toast from "../common/Toast"
import api from "../../api/axiosInstance"

// localStorage key for persisting the uploaded image (base64)
const STORAGE_KEY = "admin_profile_image"

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return "A"
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// ── AdminProfile ──────────────────────────────────────────
// Self-contained profile section for admin users in the Navbar.
// Handles: avatar display, dropdown menu, image upload modal, toasts.

export default function AdminProfile() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const wrapperRef = useRef(null)

  const [user,         setUser]         = useState({ name: "", email: "", role: "admin" })
  const [profileImage, setProfileImage] = useState(() => localStorage.getItem(STORAGE_KEY) || null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showUpload,   setShowUpload]   = useState(false)
  const [uploading,    setUploading]    = useState(false)
  const [toasts,       setToasts]       = useState([])

  // ── Load user from API (falls back to JWT decode) ─────────
  useEffect(() => {
    async function loadUser() {
      try {
        const res  = await api.get("/auth/me")
        const data = res.data?.data || res.data
        if (data) setUser(data)
      } catch {
        try {
          const token = localStorage.getItem("access_token")
          if (!token) return
          const payload = JSON.parse(atob(token.split(".")[1]))
          setUser({
            name:  payload.name  || "Admin",
            email: payload.email || "",
            role:  payload.role  || "admin",
          })
        } catch {}
      }
    }
    loadUser()
  }, [])

  // ── Close dropdown on outside click ───────────────────────
  useEffect(() => {
    function onOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", onOutside)
    return () => document.removeEventListener("mousedown", onOutside)
  }, [])

  // ── Toast helpers ─────────────────────────────────────────
  function pushToast(message, type = "success") {
    const id = `${Date.now()}-${Math.random()}`
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4500)
  }

  function removeToast(id) {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  // ── Image upload handler ───────────────────────────────────
  async function handleUpload(file, previewUrl) {
    setUploading(true)
    try {
      // Attempt backend upload; silently continue if unavailable
      try {
        const fd = new FormData()
        fd.append("image", file)
        await api.post("/users/profile/image", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      } catch {
        // Backend unavailable — base64 local storage used as fallback
      }

      // Persist locally and update display immediately
      localStorage.setItem(STORAGE_KEY, previewUrl)
      setProfileImage(previewUrl)
      setShowUpload(false)
      pushToast("Profile picture updated successfully!", "success")
    } catch {
      pushToast("Upload failed. Please try again.", "error")
    } finally {
      setUploading(false)
    }
  }

  function handleLogout() {
    setShowDropdown(false)
    logout()
    navigate("/login")
  }

  const initials = getInitials(user.name || "Admin")

  return (
    <>
      {/* ── Toast stack (portal-like, fixed position) ──────── */}
      <Toast toasts={toasts} onRemove={removeToast} />

      {/* ── Avatar trigger button ─────────────────────────── */}
      <div className="relative" ref={wrapperRef}>
        <button
          onClick={() => setShowDropdown(p => !p)}
          aria-label="Open admin profile menu"
          className="group flex items-center gap-3 p-1.5 rounded-xl
            hover:bg-white/10 focus:outline-none transition-all duration-200"
        >
          {/* Name + role (hidden on mobile) */}
          <div className="hidden sm:block text-right select-none">
            <p className="font-body text-sm font-semibold text-white leading-tight">
              {user.name || "Admin"}
            </p>
            <p className="font-body text-[11px] text-[#B3CFE5] capitalize">
              {user.role || "admin"}
            </p>
          </div>

          {/* Avatar ring */}
          <div className="relative flex-shrink-0">
            <div
              className="w-10 h-10 rounded-full overflow-hidden shadow-md
                ring-2 ring-white/20 group-hover:ring-white/50
                transition-all duration-200"
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={user.name || "Admin"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#4A7FA7] to-[#1A3D63]
                  flex items-center justify-center">
                  <span className="font-heading font-bold text-white text-sm">
                    {initials}
                  </span>
                </div>
              )}
            </div>

            {/* Camera icon overlay on hover */}
            <div
              className="absolute inset-0 rounded-full bg-black/50
                flex items-center justify-center
                opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <Camera size={12} className="text-white" />
            </div>

            {/* Online dot */}
            <span
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3
                bg-green-400 rounded-full border-2 border-[#0A1931]"
            />
          </div>
        </button>

        {/* ── Dropdown menu ──────────────────────────────── */}
        {showDropdown && (
          <ProfileDropdown
            user={user}
            profileImage={profileImage}
            initials={initials}
            onViewProfile={() => { setShowDropdown(false); navigate("/admin/profile") }}
            onEditProfile={() => { setShowDropdown(false); navigate("/admin/profile/edit") }}
            onChangePassword={() => { setShowDropdown(false); navigate("/admin/change-password") }}
            onLogout={handleLogout}
          />
        )}
      </div>

      {/* ── Upload modal ───────────────────────────────────── */}
      {showUpload && (
        <ProfileImageUpload
          currentImage={profileImage}
          initials={initials}
          onUpload={handleUpload}
          onClose={() => setShowUpload(false)}
          uploading={uploading}
        />
      )}
    </>
  )
}
