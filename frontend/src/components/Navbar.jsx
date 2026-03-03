import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/institution/login");
  };

  return (
    <nav style={{ display: "flex", gap: "20px", padding: "20px" }}>
      {token && (
        <>
          <Link to="/">Home</Link>
          <Link to="/verify">Verify</Link>
          <Link to="/about">About</Link>
          <Link to="/docs">Docs</Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}

      {!token && (
        <Link to="/institution/login">Login</Link>
      )}
    </nav>
  );
}

export default Navbar;