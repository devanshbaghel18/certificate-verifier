import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const institutionToken = localStorage.getItem("token");
  const viewerToken = localStorage.getItem("viewerToken");
  const viewerUser = JSON.parse(localStorage.getItem("viewerUser") || "null");

  const handleInstitutionLogout = () => {
    localStorage.removeItem("token");
    navigate("/institution/login");
  };

  const handleViewerLogout = () => {
    localStorage.removeItem("viewerToken");
    localStorage.removeItem("viewerUser");
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-green-400 font-bold text-lg">CertiChain</Link>
      <div className="flex items-center gap-6 text-sm">
        <Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
        <Link to="/verify" className="text-gray-400 hover:text-white transition-colors">Verify</Link>
        <Link to="/about" className="text-gray-400 hover:text-white transition-colors">About</Link>

        {institutionToken && (
          <>
            <Link to="/university/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link>
            <button onClick={handleInstitutionLogout} className="text-red-400 hover:text-red-300 transition-colors">Logout</button>
          </>
        )}

        {!institutionToken && viewerToken && (
          <>
            {viewerUser?.picture && <img src={viewerUser.picture} className="w-7 h-7 rounded-full" alt="" />}
            <button onClick={handleViewerLogout} className="text-gray-500 hover:text-red-400 transition-colors">Sign out</button>
          </>
        )}

        {!institutionToken && !viewerToken && (
          <div className="flex items-center gap-3">
            <Link to="/viewer/login" className="text-gray-400 hover:text-white transition-colors">Sign in</Link>
            <Link to="/institution/login" className="px-4 py-1.5 border border-gray-700 hover:border-green-400 rounded-lg transition-colors">Institution</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
