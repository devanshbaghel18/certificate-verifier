import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

function InstitutionLogin() {
  const navigate = useNavigate();

const handleSuccess = (credentialResponse) => {
  console.log("Login Success:", credentialResponse);

  localStorage.setItem("token", credentialResponse.credential);

  
  navigate("/university/dashboard");
};

  const handleError = () => {
    console.log("Login Failed");
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-green-500/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-emerald-400/10 blur-3xl rounded-full"></div>
      </div>

      <div className="w-full max-w-md relative z-10">

        {/* Logo */}
        <div className="text-center mb-10">

          <Link to="/" className="inline-flex items-center gap-3 mb-6">

            <div className="
              w-12 h-12 rounded-xl
              bg-neutral-900 border border-neutral-700
              flex items-center justify-center
            ">
              <Shield className="w-6 h-6 text-green-400" />
            </div>

            <span className="text-xl font-semibold">
              CertiChain
            </span>

          </Link>

          <h1 className="text-3xl font-bold mb-2">
            Institution Login
          </h1>

          <p className="text-gray-400 text-sm">
            Sign in with your institution Google account
          </p>

        </div>

        {/* Login Card */}
        <div className="
          bg-neutral-900/80
          backdrop-blur-lg
          border border-neutral-800
          rounded-xl
          p-8
          shadow-xl
        ">

          <div className="flex justify-center">

            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              theme="outline"
              size="large"
              width="300"
            />

          </div>

          <p className="text-center text-gray-500 text-sm mt-6">
            Only authorized institutions can issue certificates.
          </p>

        </div>

        {/* Back Button */}
        <div className="text-center mt-6">

          <Link
            to="/"
            className="text-gray-400 hover:text-white text-sm transition"
          >
            ← Back to Home
          </Link>

        </div>

      </div>

    </div>
  );
}

export default InstitutionLogin;