// src/components/layout/MainLayout.jsx
// Composes Sidebar + Navbar + scrollable content area.
// Handles sidebar collapse on mobile via overlay drawer.
// Props:
//   children    – page content
//   activeNav   – string  passed to Sidebar
//   navbarTitle – string  passed to Navbar
//   activeTab   – string  passed to Navbar
//   onTabChange – fn      passed to Navbar
//   userName    – string  passed to Navbar

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar  from "./Navbar";

export default function MainLayout({
  children,
  activeNav   = "progress",
  navbarTitle = "Progress & Analytics",
  activeTab   = "month",
  onTabChange,
  userName    = "Nayana Chandupa",
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed,   setCollapsed]   = useState(false);

  // Collapse sidebar to icon-only below 1100 px, hide on mobile
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1100px)");
    const handle = (e) => setCollapsed(e.matches);
    handle(mq);
    mq.addEventListener("change", handle);
    return () => mq.removeEventListener("change", handle);
  }, []);

  // Close overlay on wider screens
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 769px)");
    const handle = (e) => { if (e.matches) setSidebarOpen(false); };
    mq.addEventListener("change", handle);
    return () => mq.removeEventListener("change", handle);
  }, []);

  const sidebarW = collapsed ? 64 : 220; // px

  return (
    <div className="min-h-screen bg-[#EEF4FA]">

      {/* ── Mobile overlay backdrop ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      {/* On mobile: absolute slide-in; on desktop: fixed */}
      <div
        className={`
          fixed top-0 left-0 h-screen z-50
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <Sidebar
          activeItem={activeNav}
          collapsed={collapsed}
        />
      </div>

      {/* ── Topbar ── */}
      <div
        style={{
          "--sidebar-w": `${sidebarW}px`,
        }}
      >
        <Navbar
          title={navbarTitle}
          activeTab={activeTab}
          onTabChange={onTabChange}
          userName={userName}
          onMenuClick={() => setSidebarOpen(true)}
        />
      </div>

      {/* ── Main content ── */}
      <main
        className="transition-all duration-300 min-h-screen"
        style={{
          marginLeft: `${sidebarW}px`,
          paddingTop: "62px",
        }}
      >
        <div className="px-4 sm:px-6 lg:px-8 py-7 pb-16">
          {children}
        </div>
      </main>
    </div>
  );
}
