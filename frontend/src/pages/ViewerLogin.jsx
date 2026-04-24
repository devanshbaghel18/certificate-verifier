import { GoogleLogin } from "@react-oauth/google";
import { useNavigate, Link } from "react-router-dom";
import { FileCheck } from "lucide-react";
import { viewerLogin } from "../services/api";

export default function ViewerLogin() {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const { user } = await viewerLogin(credentialResponse.credential);
      localStorage.setItem("viewerToken", credentialResponse.credential);
      localStorage.setItem("viewerUser", JSON.stringify(user));
      navigate("/#verify");
    } catch (err) {
      console.error("Viewer login failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center">
              <FileCheck className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-xl font-semibold">CertiChain</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Viewer Login</h1>
          <p className="text-gray-400 text-sm">
            Sign in to verify certificates and track your verification history.
          </p>
        </div>
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-8 space-y-6">
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => console.log("Login Failed")}
              theme="outline"
              size="large"
              width="300"
            />
          </div>
          <div className="border-t border-gray-800 pt-4 text-center text-sm text-gray-500">
            Just want to verify without saving history?{" "}
            <a href="/#verify" className="text-green-400 hover:underline">
              Continue without login
            </a>
          </div>
        </div>
        <div className="flex justify-between mt-6 text-sm text-gray-500">
          <Link to="/" className="hover:text-white transition">← Back to Home</Link>
          <Link to="/institution/login" className="hover:text-white transition">Institution Login →</Link>
        </div>
      </div>
    </div>
  );
}
