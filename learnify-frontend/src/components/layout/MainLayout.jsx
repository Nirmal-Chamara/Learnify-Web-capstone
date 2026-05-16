import { useState } from "react"
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-background-dark overflow-hidden">
      
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        
        {/* Navbar */}
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#0f2744]">
          {children}
        </main>

      </div>
    </div>
  )
}

export default MainLayout