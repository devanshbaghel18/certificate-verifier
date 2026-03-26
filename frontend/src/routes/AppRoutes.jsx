import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Verify from "../pages/Verify";
import InstitutionLogin from "../pages/InstitutionLogin";
import About from "../pages/About";
import Docs from "../pages/Docs";
import ProtectedLanding from "../pages/ProtectedLanding";

function AppRoutes() {
  const token = localStorage.getItem("token");

  return (
    <Routes>

      {/* PUBLIC */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/docs" element={<Docs />} />
      <Route path="/institution/login" element={<InstitutionLogin />} />

      {/* 🔒 PROTECTED */}
      <Route
        path="/verify"
        element={token ? <Verify /> : <ProtectedLanding />}
      />

    </Routes>
  );
}

export default AppRoutes;