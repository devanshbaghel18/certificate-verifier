import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

function InstitutionLogin() {
  const navigate = useNavigate();

  const handleSuccess = (credentialResponse) => {
    // Save Google JWT
    localStorage.setItem("token", credentialResponse.credential);

    // Redirect to home
    navigate("/");
  };

  const handleError = () => {
    console.log("Login Failed");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Institution Login</h1>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "40px" }}>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>
    </div>
  );
}

export default InstitutionLogin;