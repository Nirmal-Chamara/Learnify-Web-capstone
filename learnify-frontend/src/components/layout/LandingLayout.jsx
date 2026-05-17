import LandingNavbar from "./LandingNavbar"
import Footer from "./Footer"

function LandingLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#F6FAFD]">

      {/* Navbar */}
      <LandingNavbar />

      {/* Page Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <Footer />

    </div>
  )
}

export default LandingLayout