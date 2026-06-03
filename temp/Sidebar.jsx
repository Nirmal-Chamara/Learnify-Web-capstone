// src/components/layout/Sidebar.jsx
// Dark navy sidebar matching the PNG screenshot exactly.
// Props:
//   activeItem  – string key of the active nav item (default "progress")
//   onNavigate  – (key) => void  callback when a nav item is clicked
//   collapsed   – bool  (passed by MainLayout on small screens)

import { useState } from "react";

const NAV_ITEMS = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    key: "scheduler",
    label: "Scheduler",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    key: "progress",
    label: "Progress",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    key: "ai",
    label: "AI Assistant",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
  {
    key: "materials",
    label: "Materials",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
  },
  {
    key: "help",
    label: "Help",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
];

const BOTTOM_ITEMS = [
  { key: "profile", label: "Profile", color: "text-[#B3CFE5]" },
  { key: "logout",  label: "Logout",  color: "text-red-400" },
];

export default function Sidebar({ activeItem = "progress", onNavigate, collapsed = false }) {
  const [active, setActive] = useState(activeItem);

  const handleClick = (key) => {
    setActive(key);
    onNavigate?.(key);
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen z-50 flex flex-col
        bg-[#0A1931] transition-all duration-300 overflow-hidden
        ${collapsed ? "w-16" : "w-[220px]"}
      `}
      style={{ boxShadow: "4px 0 24px rgba(10,25,49,0.25)" }}
    >
      {/* ── Logo ── */}
      <div className={`flex items-center gap-3 px-5 py-6 border-b border-white/[0.07] shrink-0`}>
        {/* Logo box with background image feel */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1A3D63, #4A7FA7)" }}
        >
          {/* Decorative glowing orb */}
          <div className="absolute inset-0 flex items-end justify-center pb-1">
            <div
              className="w-5 h-5 rounded-full opacity-80"
              style={{ background: "radial-gradient(circle, #f0c040 0%, #f59e0b 60%, transparent 100%)" }}
            />
          </div>
          {/* Stars */}
          <span className="relative z-10 text-white font-black text-[11px]" style={{ fontFamily: "Poppins, sans-serif" }}>LF</span>
        </div>
        {!collapsed && (
          <span
            className="text-white font-bold text-[17px] tracking-tight whitespace-nowrap"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Learn<span className="text-[#B3CFE5]">ify</span>
          </span>
        )}
      </div>

      {/* ── Nav items ── */}
      <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => handleClick(item.key)}
              className={`
                w-full flex items-center gap-3 px-5 py-[10px] text-left
                transition-all duration-150 border-l-[3px] group
                ${isActive
                  ? "bg-[#4A7FA7]/20 border-[#B3CFE5] text-white"
                  : "border-transparent text-white/50 hover:text-white hover:bg-white/5"
                }
              `}
            >
              <span className={`shrink-0 ${isActive ? "text-[#B3CFE5]" : "text-current"}`}>
                {item.icon}
              </span>
              {!collapsed && (
                <span
                  className="text-[13.5px] font-medium whitespace-nowrap"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Bottom links ── */}
      <div className="pb-5 border-t border-white/[0.07] pt-4">
        {BOTTOM_ITEMS.map((item) => (
          <button
            key={item.key}
            onClick={() => handleClick(item.key)}
            className={`
              w-full flex items-center gap-3 px-5 py-[9px] text-left
              transition-all duration-150 hover:bg-white/5
              ${item.color}
            `}
          >
            {item.key === "profile" ? (
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="shrink-0">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            ) : (
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="shrink-0">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            )}
            {!collapsed && (
              <span
                className="text-[13px] font-semibold"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {item.label}
              </span>
            )}
          </button>
        ))}
      </div>
    </aside>
  );
}
