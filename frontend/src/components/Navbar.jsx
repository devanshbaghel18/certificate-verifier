import { Link, useLocation, useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("home");
  
  const institutionToken = localStorage.getItem("token");
  const viewerToken = localStorage.getItem("viewerToken");
  const viewerUser = JSON.parse(localStorage.getItem("viewerUser") || "null");

  // All section IDs in order (must match Landing.jsx)
  const sectionIds = ["home", "verify", "docs", "about", "contact", "terms", "privacy", "disclaimer"];

  // Scroll Spy: uses a scroll listener to find which section is closest to the top
  useEffect(() => {
    if (location.pathname !== "/") return;

    const handleScroll = () => {
      const scrollY = window.scrollY + 120;

      let current = "home";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) {
          current = id;
        }
      }
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const handleInstitutionLogout = () => {
    localStorage.removeItem("token");
    navigate("/institution/login");
  };

  const handleViewerLogout = () => {
    localStorage.removeItem("viewerToken");
    localStorage.removeItem("viewerUser");
    navigate("/");
  };

  // Smooth scroll to a section on the landing page
  const scrollToSection = useCallback((e, sectionId) => {
    e.preventDefault();
    if (location.pathname === "/") {
      // Already on landing — scroll directly
      if (sectionId === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // On a different page — navigate first, then scroll after render
      navigate("/");
      setTimeout(() => {
        if (sectionId === "home") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    }
  }, [location.pathname, navigate]);

  // All links are now hash-scroll links
  const navLinks = [
    { name: "Home", id: "home" },
    { name: "Verify", id: "verify" },
    { name: "Documentation", id: "docs" },
    { name: "About", id: "about" },
    { name: "Contact", id: "contact" },
    { name: "Terms", id: "terms" },
    { name: "Privacy", id: "privacy" },
    { name: "Disclaimer", id: "disclaimer" }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-dark/90 backdrop-blur-md px-8 py-5 flex items-center justify-between border-b border-white/5 shadow-sm">
      <a href="/" onClick={(e) => scrollToSection(e, "home")} className="flex items-center gap-3 text-white font-bold text-xl tracking-wide">
        <div className="bg-[#0c1810] p-1.5 rounded-lg border border-brand-green/30 shadow-[0_0_10px_rgba(0,209,90,0.1)]">
          <Shield className="text-brand-green w-5 h-5" strokeWidth={2.5} />
        </div>
        CertiChain
      </a>
      
      <div className="hidden md:flex items-center gap-10 text-sm font-medium">
        {navLinks.map((link) => {
          const isActive = location.pathname === "/" && activeSection === link.id;
          return (
            <a 
              key={link.name} 
              href={`/#${link.id}`}
              onClick={(e) => scrollToSection(e, link.id)}
              className={`relative pb-1 tracking-wider transition-colors duration-200 ${isActive ? 'text-brand-green' : 'text-[#a3b3a7] hover:text-white'}`}
            >
              {link.name}
              {isActive && (
                <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-brand-green rounded-full shadow-[0_0_8px_rgba(0,209,90,0.8)]"></span>
              )}
            </a>
          );
        })}
      </div>

      <div className="flex items-center gap-8 text-sm font-medium">
        {institutionToken ? (
           <>
             <Link to="/university/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
             <button onClick={handleInstitutionLogout} className="px-6 py-2.5 bg-brand-green hover:bg-brand-greenHover text-brand-darker font-bold rounded-lg shadow-[0_4px_14px_rgba(0,209,90,0.4)] transition-all tracking-wide">Logout</button>
           </>
        ) : (!institutionToken && viewerToken) ? (
          <>
            {viewerUser?.picture && <img src={viewerUser.picture} className="w-8 h-8 rounded-full border border-gray-700" alt="" />}
            <button onClick={handleViewerLogout} className="text-[#a3b3a7] hover:text-white transition-colors tracking-wide">Sign out</button>
            <Link to="/history" className="text-[#a3b3a7] hover:text-white transition-colors tracking-wide font-medium">History</Link>
            <a href="/#verify" onClick={(e) => scrollToSection(e, "verify")} className="px-6 py-2.5 bg-brand-green hover:bg-brand-greenHover text-brand-darker font-bold rounded-lg shadow-[0_4px_14px_rgba(0,209,90,0.4)] transition-all tracking-wide">Verify</a>
          </>
        ) : (
          <>
            <Link to="/viewer/login" className="text-[#a3b3a7] hover:text-white transition-colors font-medium tracking-wide">Login</Link>
            <Link to="/institution/login" className="px-7 py-2.5 bg-brand-green hover:bg-brand-greenHover text-brand-darker font-bold rounded-lg shadow-[0_4px_20px_rgba(0,209,90,0.3)] transition-all tracking-wide">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
