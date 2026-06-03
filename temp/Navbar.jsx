// src/components/layout/Navbar.jsx
// Top bar: page title left | Day/Week/Month/Semester tabs center | user right
// Props:
//   title       – string  page title shown in top bar (default "Progress & Analytics")
//   activeTab   – string  "day" | "week" | "month" | "semester"
//   onTabChange – (tab) => void
//   userName    – string  (default "Nayana Chandupa")
//   onMenuClick – () => void  hamburger callback on mobile

const TABS = ["Day", "Week", "Month", "Semester"];

export default function Navbar({
  title = "Progress & Analytics",
  activeTab = "month",
  onTabChange,
  userName = "Nayana Chandupa",
  onMenuClick,
}) {
  return (
    <header
      className="fixed top-0 right-0 z-40 flex items-center px-6 gap-4 bg-white border-b border-[#D0E3F0]"
      style={{
        left: "var(--sidebar-w, 220px)",
        height: "62px",
        boxShadow: "0 2px 8px rgba(10,25,49,0.07)",
        transition: "left 0.3s",
      }}
    >
      {/* Mobile hamburger */}
      <button
        className="lg:hidden p-1.5 rounded-lg border border-[#D0E3F0] text-[#4A6880] hover:text-[#0A1931] hover:border-[#4A7FA7] transition-colors mr-1"
        onClick={onMenuClick}
      >
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <line x1="3" y1="6"  x2="21" y2="6"  />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Page title */}
      <span
        className="text-[15px] font-bold text-[#0A1931] whitespace-nowrap mr-2 hidden sm:block"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        {title}
      </span>

      {/* Filter tabs – centred */}
      <div className="flex-1 flex justify-center">
        <div
          className="flex gap-0.5 rounded-[10px] p-[3px] border border-[#D0E3F0]"
          style={{ background: "#E4EEF7" }}
        >
          {TABS.map((tab) => {
            const key = tab.toLowerCase();
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => onTabChange?.(key)}
                className={`
                  px-4 py-1.5 rounded-[7px] text-[12.5px] font-medium transition-all duration-150
                  ${isActive
                    ? "bg-white text-[#0A1931] font-semibold shadow-sm"
                    : "text-[#4A6880] hover:text-[#0A1931]"
                  }
                `}
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* User info + bell */}
      <div className="flex items-center gap-3">
        {/* User name */}
        <span
          className="text-[13px] font-semibold text-[#0A1931] hidden md:block whitespace-nowrap"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {userName}
        </span>

        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[#0A1931] text-[11px] font-bold cursor-pointer"
          style={{ background: "linear-gradient(135deg, #4A7FA7, #B3CFE5)" }}
        >
          {userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
        </div>

        {/* Bell */}
        <button
          className="relative w-8 h-8 rounded-[8px] border border-[#D0E3F0] flex items-center justify-center text-[#4A6880] hover:border-[#4A7FA7] hover:text-[#4A7FA7] transition-all"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          {/* red dot */}
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500 border border-white" />
        </button>
      </div>
    </header>
  );
}
