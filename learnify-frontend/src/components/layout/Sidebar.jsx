import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  CalendarDays,
  TrendingUp,
  Bot,
  BookOpen,
  HelpCircle,
  User,
  LogOut
} from "lucide-react"

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Scheduler",  icon: CalendarDays,   path: "/scheduler"  },
  { label: "Progress",   icon: TrendingUp,     path: "/progress"   },
  { label: "AI Assistant", icon: Bot,          path: "/ai-chat"    },
  { label: "Materials",  icon: BookOpen,       path: "/resources"  },
  { label: "Help",       icon: HelpCircle,     path: "/help"       },
]

function Sidebar({ isOpen }) {
  return (
    <div
      className={`flex flex-col h-screen bg-[#0A1931] text-white
        transition-all duration-300 ease-in-out
        ${isOpen ? "w-56" : "w-0 overflow-hidden"}`}
    >

      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-[#1A3D63]">
        <div className="w-8 h-8 bg-[#4A7FA7] rounded-lg flex items-center
          justify-center font-bold text-white">
          L
        </div>
        {isOpen && (
          <span className="font-semibold text-lg">Learnify</span>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
              transition-all duration-200
              ${isActive
                ? "bg-[#1A3D63] text-white font-medium"
                : "text-[#B3CFE5] hover:bg-[#1A3D63] hover:text-white"
              }`
            }
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom — Profile & Logout */}
      <div className="px-3 py-4 border-t border-[#1A3D63] space-y-1">

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
            transition-all duration-200
            ${isActive
              ? "bg-[#1A3D63] text-white font-medium"
              : "text-[#B3CFE5] hover:bg-[#1A3D63] hover:text-white"
            }`
          }
        >
          <User size={18} />
          <span>Profile</span>
        </NavLink>

        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
            text-sm text-red-400 hover:bg-[#1A3D63] hover:text-red-300
            transition-all duration-200"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>

      </div>
    </div>
  )
}

export default Sidebar