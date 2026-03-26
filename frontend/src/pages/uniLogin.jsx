import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { Shield, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function InstitutionLogin() {
  const navigate = useNavigate();

  const handleSuccess = (credentialResponse) => {
    localStorage.setItem("token", credentialResponse.credential);
    window.location.href = "/verify";
  };

  const handleError = () => {
    console.log("Login Failed");
  };

  return (
    <div className="min-h-screen bg-black text-white">

      <Navbar />

      {/* HERO */}
      <section className="pt-32 pb-24 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT SIDE */}
          <div className="space-y-8">

            <h1 className="text-5xl font-bold leading-tight">
              Institution Access.
              <br />
              <span className="text-green-400">
                Secure & Verified.
              </span>
            </h1>

            <p className="text-gray-400 text-lg max-w-xl">
              Sign in to issue certificates, manage records, and interact
              with blockchain-backed verification infrastructure.
            </p>

            <div className="flex gap-4">

              <Link to="/">
                <button className="
                  px-6 py-3
                  border border-gray-700
                  hover:border-green-400
                  rounded-lg
                ">
                  Back to Home
                </button>
              </Link>

            </div>

          </div>

          {/* RIGHT SIDE LOGIN CARD */}
          <div className="flex justify-center">

            <div className="
              w-full max-w-md
              border border-gray-800
              rounded-xl
              p-10
              bg-black
            ">

              {/* HEADER */}
              <div className="text-center mb-8">

                <div className="
                  w-12 h-12 mx-auto mb-4
                  rounded-xl
                  border border-gray-800
                  flex items-center justify-center
                ">
                  <Shield className="text-green-400" />
                </div>

                <h2 className="text-2xl font-semibold mb-2">
                  Institution Login
                </h2>

                <p className="text-gray-400 text-sm">
                  Only authorized institutions can issue certificates
                </p>

              </div>

              {/* GOOGLE LOGIN */}
              <div className="flex justify-center mb-6">
                <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={handleError}
                />
              </div>

              {/* SECURITY NOTE */}
              <div className="
                border border-gray-800
                rounded-lg
                p-4
                text-sm text-gray-400
                flex gap-3
              ">
                <Lock className="text-green-400" size={18} />
                Your authentication is secured using Google OAuth and
                blockchain identity verification.
              </div>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
}