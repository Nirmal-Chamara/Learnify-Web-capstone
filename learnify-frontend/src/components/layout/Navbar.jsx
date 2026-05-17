import { Menu, Bell } from "lucide-react"

function Navbar({ onToggleSidebar }) {
  // Replace this with real user data later from AuthContext
  const user = {
    name: "Nirmal Chamara",
    role: "Student"
  }

  return (
    <header className="flex items-center justify-between px-6 py-4
      bg-[#0A1931] border-b border-[#1A3D63] text-white">

      {/* Left — Hamburger */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-[#1A3D63] transition-colors duration-200"
        >
          <Menu size={20} />
        </button>
        <h1 className="font-semibold text-lg">Dashboard</h1>
      </div>

      {/* Right — Bell + User */}
      <div className="flex items-center gap-4">

        {/* Notification Bell */}
        <button className="relative p-2 rounded-lg
          hover:bg-[#1A3D63] transition-colors duration-200">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2
            bg-red-500 rounded-full" />
        </button>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-[#B3CFE5]">{user.role}</p>
          </div>
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-[#4A7FA7] flex items-center
            justify-center font-bold text-white text-sm">
            {user.name.charAt(0)}
          </div>
        </div>

      </div>
    </header>
  )
}

export default Navbar