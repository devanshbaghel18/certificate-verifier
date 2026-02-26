import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ display: "flex", gap: "20px", padding: "20px" }}>
      <Link to="/">Home</Link>
      <Link to="/verify">Verify</Link>
      <Link to="/institution/login">For Institution</Link>
      <Link to="/about">About</Link>
      <Link to="/docs">Docs</Link>
    </nav>
  );
}

export default Navbar;