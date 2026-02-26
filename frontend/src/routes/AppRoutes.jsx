import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import InstitutionLogin from "../pages/InstitutionLogin";
import Verify from "../pages/Verify";
import About from "../pages/About";
import Docs from "../pages/Docs";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/institution/login" element={<InstitutionLogin />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/about" element={<About />} />
      <Route path="/docs" element={<Docs />} />
    </Routes>
  );
}

export default AppRoutes;