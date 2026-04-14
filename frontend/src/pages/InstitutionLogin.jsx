import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { Shield, Clock, XCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { institutionLogin } from "../services/api";
import { useState } from "react";

function InstitutionLogin() {
  const navigate = useNavigate();
  const [status, setStatus] = useState(null); // null | "loading" | "pending" | "rejected" | "error"
  const [errorMsg, setErrorMsg] = useState("");

  const handleSuccess = async (credentialResponse) => {
    try {
      setStatus("loading");
      setErrorMsg("");
      const response = await institutionLogin(credentialResponse.credential);

      if (response.status === "approved") {
        localStorage.setItem("token", response.token);
        navigate("/university/dashboard");
      } else if (response.status === "pending") {
        setStatus("pending");
      }
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setStatus("rejected");
      } else {
        setStatus("error");
        setErrorMsg(err.response?.data?.error || "Authentication failed. Please try again.");
      }
    }
  };

  const handleError = () => {
    setStatus("error");
    setErrorMsg("Google Login failed to initialize.");
  };

  return (
    <div className="min-h-screen bg-brand-darker text-white flex items-center justify-center px-6 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-brand-green/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-emerald-400/10 blur-[150px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="w-14 h-14 rounded-2xl bg-[#0c1610] border border-brand-green/30 shadow-[0_0_15px_rgba(0,209,90,0.1)] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Shield className="w-7 h-7 text-brand-green" />
            </div>
          </Link>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Institution <span className="text-brand-green drop-shadow-[0_0_20px_rgba(0,209,90,0.3)]">Login</span>
          </h1>
          <p className="text-[#a3b3a7] text-sm font-medium">
            Sign in with your institution Google account to request access.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#0c1610] backdrop-blur-lg border border-[#1a2c1f] rounded-3xl p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/10 rounded-full blur-[40px] pointer-events-none"></div>

          {/* DEFAULT: Show Google Login */}
          {status === null && (
            <div className="flex justify-center mb-2">
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                theme="outline"
                size="large"
                width="300"
              />
            </div>
          )}

          {/* LOADING */}
          {status === "loading" && (
            <div className="flex flex-col items-center gap-4 py-4">
              <Loader2 size={40} className="text-brand-green animate-spin" />
              <p className="text-[#a3b3a7] text-sm font-semibold">Verifying credentials with the network...</p>
            </div>
          )}

          {/* PENDING APPROVAL */}
          {status === "pending" && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
                <Clock size={32} className="text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Approval Pending</h3>
              <p className="text-[#a3b3a7] text-sm leading-relaxed max-w-xs">
                Your request to join the CertiChain Institutional Network has been securely forwarded to the Master Admin for review. You will be able to sign in once approved.
              </p>
              <button
                onClick={() => setStatus(null)}
                className="mt-4 px-6 py-2.5 border border-brand-green/30 text-brand-green rounded-xl text-sm font-bold hover:bg-brand-green/10 transition-all"
              >
                Try Again
              </button>
            </div>
          )}

          {/* REJECTED */}
          {status === "rejected" && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                <XCircle size={32} className="text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Access Denied</h3>
              <p className="text-[#a3b3a7] text-sm leading-relaxed max-w-xs">
                Your institution has been denied network access by the platform administrator. Contact support if you believe this is an error.
              </p>
              <button
                onClick={() => setStatus(null)}
                className="mt-4 px-6 py-2.5 border border-red-500/30 text-red-400 rounded-xl text-sm font-bold hover:bg-red-500/10 transition-all"
              >
                Try Different Account
              </button>
            </div>
          )}

          {/* GENERIC ERROR */}
          {status === "error" && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="mt-2 p-4 bg-red-500/10 border border-red-500/30 rounded-xl w-full">
                <p className="text-sm text-red-400 font-bold">{errorMsg}</p>
              </div>
              <button
                onClick={() => setStatus(null)}
                className="mt-2 px-6 py-2.5 border border-[#1a2c1f] text-[#a3b3a7] rounded-xl text-sm font-bold hover:bg-[#1a2c1f] transition-all"
              >
                Retry Login
              </button>
            </div>
          )}

          {status === null && (
            <p className="text-center text-[#4a6b53] text-xs font-semibold mt-8 uppercase tracking-widest">
              Only Pre-Authorized Institutions Can Issue Certificates
            </p>
          )}
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <Link to="/" className="text-[#a3b3a7] hover:text-white text-sm font-semibold transition-colors group">
            <span className="inline-block group-hover:-translate-x-1 transition-transform mr-2">←</span>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default InstitutionLogin;