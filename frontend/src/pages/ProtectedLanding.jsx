import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function ProtectedLanding() {
  return (
    <div className="min-h-screen bg-black text-white">

      <Navbar />

      <div className="pt-32 text-center px-6">
        <h1 className="text-4xl font-bold mb-4">
          Login Required
        </h1>

        <p className="text-gray-400 mb-8">
          You must login to verify certificates.
        </p>

        <Link to="/institution/login">
          <button className="px-6 py-3 bg-green-500 rounded-lg">
            Go to Login
          </button>
        </Link>
      </div>

    </div>
  );
}