import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { adminLogin } from "../../services/api";
import { useState } from "react";

function AdminLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSuccess = async (credentialResponse) => {
    try {
      setError("");
      const response = await adminLogin(credentialResponse.credential);
      if (response.token) {
        localStorage.setItem("adminToken", response.token);
        navigate("/admin/dashboard");
      }
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError("Intrusion Denied: You are not the authorized Master Admin.");
      } else {
        setError("Authentication failed. Please try again.");
      }
    }
  };

  const handleError = () => {
    setError("Google Login failed to initialize.");
  };

  return (
    <div className="min-h-screen bg-brand-darker text-white flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-600/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-400/10 blur-[150px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="w-14 h-14 rounded-2xl bg-[#0b1421] border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)] flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-7 h-7 text-blue-500" strokeWidth={2.5} />
            </div>
          </Link>
          <h1 className="text-4xl font-bold tracking-tight mb-3">Master <span className="text-blue-500">Admin</span></h1>
          <p className="text-[#8a9bb3] text-sm font-medium">Verify credentials securely to continue.</p>
        </div>

        <div className="bg-[#0a111a] backdrop-blur-lg border border-[#1a2b42] rounded-3xl p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] pointer-events-none"></div>
          
          <div className="flex justify-center mb-2">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              theme="outline"
              size="large"
              width="300"
            />
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
              <p className="text-sm text-red-400 font-bold">{error}</p>
            </div>
          )}

          <p className="text-center text-[#4a5f7e] text-xs font-semibold mt-8 uppercase tracking-widest">
            Restricted Government / Admin Access Only
          </p>
        </div>

        <div className="text-center mt-8">
          <Link to="/" className="text-[#8a9bb3] hover:text-white text-sm font-semibold transition-colors group">
            <span className="inline-block group-hover:-translate-x-1 transition-transform mr-2">←</span> 
            Return to Public Portal
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
