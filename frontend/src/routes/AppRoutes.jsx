import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Verify from "../pages/Verify";
import InstitutionLogin from "../pages/InstitutionLogin";
import ViewerLogin from "../pages/ViewerLogin";
import About from "../pages/About";
import Docs from "../pages/Docs";
import Contact from "../pages/Contact";
import Terms from "../pages/Terms";
import Privacy from "../pages/Privacy";
import History from "../pages/History";
import ProtectedLanding from "../pages/ProtectedLanding";
import UniversityDashboard from "../pages/UniversityDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";

function AppRoutes() {
  const institutionToken = localStorage.getItem("token");

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/docs" element={<Docs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/history" element={<History />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/viewer/login" element={<ViewerLogin />} />
      <Route path="/institution/login" element={<InstitutionLogin />} />
      <Route path="/university/dashboard" element={institutionToken ? <UniversityDashboard /> : <ProtectedLanding />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

export default AppRoutes;
