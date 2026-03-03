import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import InstitutionLogin from "../pages/InstitutionLogin";
import Verify from "../pages/Verify";
import About from "../pages/About";
import Docs from "../pages/Docs";
import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/institution/login" element={<InstitutionLogin />} />

      {/* Protected Routes Wrapper */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/about" element={<About />} />
        <Route path="/docs" element={<Docs />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;