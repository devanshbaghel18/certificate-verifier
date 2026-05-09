import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { adminLogin, quickAdminLogin } from "../../services/api";
import { useState } from "react";

function AdminLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleQuickLogin = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      const response = await quickAdminLogin(email, password);
      if (response.token) {
        localStorage.setItem("adminToken", response.token);
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
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

          {/* Quick Login Form */}
          <form onSubmit={handleQuickLogin} className="space-y-4 mb-6 relative z-10">
            <div>
              <label className="block text-xs font-semibold text-[#8a9bb3] mb-2 uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@certichain.com"
                required
                className="w-full px-4 py-3 bg-[#060a0f] border border-[#1a2b42] rounded-xl text-sm text-white placeholder:text-[#2a3d55] focus:border-blue-500/50 focus:outline-none focus:shadow-[0_0_10px_rgba(59,130,246,0.1)] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#8a9bb3] mb-2 uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-[#060a0f] border border-[#1a2b42] rounded-xl text-sm text-white placeholder:text-[#2a3d55] focus:border-blue-500/50 focus:outline-none focus:shadow-[0_0_10px_rgba(59,130,246,0.1)] transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_20px_rgba(59,130,246,0.4)] disabled:opacity-50 disabled:cursor-wait"
            >
              <LogIn size={16} />
              {loading ? "Authenticating..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[#1a2b42]"></div>
            <span className="text-xs text-[#4a5f7e] font-semibold uppercase">or continue with</span>
            <div className="flex-1 h-px bg-[#1a2b42]"></div>
          </div>

          {/* Google Login */}
          <div className="flex justify-center">
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
