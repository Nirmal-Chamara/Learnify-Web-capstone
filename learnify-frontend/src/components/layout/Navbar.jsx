import { useState, useRef, useEffect } from "react"
import { useNavigate,useLocation } from "react-router-dom"
import { Menu, Bell, CheckCheck, Clock, BookOpen, AlertCircle } from "lucide-react"

// ── Dummy Notifications ───────────────────────────────────
const initialNotifications = [
  {
    id: 1,
    type: "deadline",
    title: "Mathematics Mock Exam",
    message: "Due in 3 days — Chapter 7: Statistics",
    time: "2 min ago",
    read: false,
  },
  {
    id: 2,
    type: "session",
    title: "Study Session Starting",
    message: "Physics — Thermodynamics starts in 30 minutes",
    time: "25 min ago",
    read: false,
  },
  {
    id: 3,
    type: "resource",
    title: "New Resource Uploaded",
    message: "Mr. Fernando uploaded Organic Chemistry notes",
    time: "1 hr ago",
    read: false,
  },
  {
    id: 4,
    type: "system",
    title: "Schedule Generated",
    message: "Your weekly timetable has been auto-generated",
    time: "3 hrs ago",
    read: true,
  },
  {
    id: 5,
    type: "deadline",
    title: "Physics Assignment",
    message: "Due in 5 days — Thermodynamics report",
    time: "5 hrs ago",
    read: true,
  },
]

// ── Page Title Map ────────────────────────────────────────
const pageTitles = {
  "/dashboard":          "Dashboard",
  "/scheduler":          "Study Scheduler",
  "/progress":           "Progress",
  "/ai-chat":            "AI Assistant",
  "/resources":          "Study Materials",
  "/feedback":           "Feedback",
  "/profile":            "Profile",
  "/notifications":      "Notifications",
  "/mentor/resources":   "My Resources",
  "/mentor/profile":     "My Profile",
}

// ── Notification Icon by Type ─────────────────────────────
function NotificationIcon({ type }) {
  const config = {
    deadline: { icon: Clock, bg: "bg-red-100", color: "text-red-500" },
    session: { icon: BookOpen, bg: "bg-blue-100", color: "text-blue-500" },
    resource: { icon: BookOpen, bg: "bg-green-100", color: "text-green-500" },
    system: { icon: AlertCircle, bg: "bg-purple-100", color: "text-purple-500" },
  }
  const { icon: Icon, bg, color } = config[type] || config.system
  return (
    <div className={`w-8 h-8 rounded-full ${bg} flex items-center
      justify-center flex-shrink-0`}>
      <Icon size={14} className={color} />
    </div>
  )
}

// ── Main Navbar ───────────────────────────────────────────
function Navbar({ onToggleSidebar }) {
  const user = { name: "Nirmal Chamara", role: "Student" }
  const location = useLocation()
  const navigate = useNavigate()

  const pageTitle = pageTitles[location.pathname] || "Dashboard"

  const [notifications, setNotifications] = useState(initialNotifications)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  const unreadCount = notifications.filter(n => !n.read).length

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleMarkAllRead() {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  function handleMarkRead(id) {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ))
  }

  return (
    <header className="flex items-center justify-between px-6 py-4
      bg-[#0A1931] border-b border-white/10 text-white">

      {/* Left — Hamburger + Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-white/10
            transition-colors duration-200"
        >
          <Menu size={20} />
        </button>
        <h1 className="font-heading font-semibold text-lg text-white">
          {pageTitle}
        </h1>
      </div>

      {/* Right — Bell + User */}
      <div className="flex items-center gap-4">

        {/* ── Notification Bell ── */}
        <div className="relative" ref={dropdownRef}>

          {/* Bell Button */}
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative p-2 rounded-lg hover:bg-white/10
              transition-colors duration-200"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4
                bg-red-500 rounded-full flex items-center justify-center
                font-body text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* ── Dropdown ── */}
          {showDropdown && (
            <div className="absolute right-0 top-12 w-80 bg-white
              rounded-2xl shadow-2xl border border-gray-100 z-50
              overflow-hidden">

              {/* Dropdown Header */}
              <div className="flex items-center justify-between
                px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-sm font-semibold
                    text-[#0A1931]">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white font-body
                      text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1 font-body text-xs
                      text-[#4A7FA7] hover:text-[#1A3D63] transition-colors"
                  >
                    <CheckCheck size={13} />
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center">
                    <Bell size={24} className="text-gray-200 mx-auto mb-2" />
                    <p className="font-body text-xs text-gray-300">
                      No notifications
                    </p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleMarkRead(notification.id)}
                      className={`flex items-start gap-3 px-4 py-3
                        border-b border-gray-50 cursor-pointer
                        transition-colors hover:bg-gray-50
                        ${!notification.read ? "bg-blue-50/50" : "bg-white"}`}
                    >
                      {/* Icon */}
                      <NotificationIcon type={notification.type} />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`font-body text-xs leading-tight
                            ${!notification.read
                              ? "font-semibold text-[#0A1931]"
                              : "font-medium text-gray-600"
                            }`}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="w-1.5 h-1.5 rounded-full
                              bg-blue-500 flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="font-body text-[11px] text-gray-400
                          mt-0.5 leading-tight">
                          {notification.message}
                        </p>
                        <p className="font-body text-[10px] text-gray-300 mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Dropdown Footer */}
              <div className="px-4 py-2.5 border-t border-gray-100
                text-center">
                <button
                  onClick={() => {
                    setShowDropdown(false)
                    navigate("/notifications")
                  }}
                  className="font-body text-xs text-[#4A7FA7]
                  hover:text-[#1A3D63] transition-colors font-medium">
                  View all notifications
                </button>
              </div>

            </div>
          )}
        </div>

        {/* ── User Info ── */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-body text-sm font-medium text-white">
              {user.name}
            </p>
            <p className="font-body text-xs text-[#B3CFE5]">
              {user.role}
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#4A7FA7] flex
            items-center justify-center font-heading font-bold
            text-white text-sm">
            {user.name.charAt(0)}
          </div>
        </div>

      </div>
    </header>
  )
}

export default Navbar