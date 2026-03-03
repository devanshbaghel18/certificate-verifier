import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

function InstitutionLogin() {
  const navigate = useNavigate();

  const handleSuccess = (credentialResponse) => {
    localStorage.setItem("token", credentialResponse.credential);
    navigate("/");
  };

  const handleError = () => {
    console.log("Login Failed");
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md border border-white p-10 rounded-lg">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Institution Login
        </h1>

        <p className="text-gray-400 text-sm text-center mb-10">
          Sign in with your institution Google account to continue.
        </p>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            theme="outline"
            size="large"
            width="300"
          />
        </div>

      </div>
    </div>
  );
}

export default InstitutionLogin;