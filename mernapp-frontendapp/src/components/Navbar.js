import { Link } from "react-router-dom";

export default function Navbar({ token, onLogout }) {
  return (
    <nav className="navbar">
      <span>My Blog</span>
      <div>
        {token ? (
          <button onClick={onLogout}>Logout</button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
