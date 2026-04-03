import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Verify from "../pages/Verify";
import InstitutionLogin from "../pages/InstitutionLogin";
import ViewerLogin from "../pages/ViewerLogin";
import About from "../pages/About";
import Docs from "../pages/Docs";
import ProtectedLanding from "../pages/ProtectedLanding";
import UniversityDashboard from "../pages/UniversityDashboard";

function AppRoutes() {
  const institutionToken = localStorage.getItem("token");

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/docs" element={<Docs />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/viewer/login" element={<ViewerLogin />} />
      <Route path="/institution/login" element={<InstitutionLogin />} />
      <Route path="/university/dashboard" element={institutionToken ? <UniversityDashboard /> : <ProtectedLanding />} />
    </Routes>
  );
}

export default AppRoutes;
