import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Loader } from "lucide-react";

// Lazy-loaded components for performance
const Landing = React.lazy(() => import("../pages/Landing"));
const InstitutionLogin = React.lazy(() => import("../pages/InstitutionLogin"));
const ViewerLogin = React.lazy(() => import("../pages/ViewerLogin"));
const History = React.lazy(() => import("../pages/History"));
const ProtectedLanding = React.lazy(() => import("../pages/ProtectedLanding"));
const UniversityDashboard = React.lazy(() => import("../pages/UniversityDashboard"));
const AdminDashboard = React.lazy(() => import("../pages/admin/AdminDashboard"));
const AdminLogin = React.lazy(() => import("../pages/admin/AdminLogin"));

// Global fallback loader while bundles are fetching
const PageLoader = () => (
  <div className="min-h-screen bg-brand-darker flex items-center justify-center">
    <Loader size={40} className="text-brand-green animate-spin" />
  </div>
);

function AppRoutes() {
  const institutionToken = localStorage.getItem("token");

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/history" element={<History />} />
        <Route path="/viewer/login" element={<ViewerLogin />} />
        <Route path="/institution/login" element={<InstitutionLogin />} />
        <Route path="/university/dashboard" element={institutionToken ? <UniversityDashboard /> : <ProtectedLanding />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
