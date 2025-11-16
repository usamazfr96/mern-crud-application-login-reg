import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Posts from "./pages/Posts";
import CreatePost from "./pages/CreatePost";
import "./App.css";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // Optional: auto-logout when token expires if you add exp to token payload
  useEffect(() => {
    // you can decode and check expiry here if desired
  }, [token]);

  return (
    <BrowserRouter>
      <Navbar token={token} onLogout={logout} />
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/create-post"
          element={token ? <CreatePost /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/posts"
          element={token ? <Posts /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to="/posts" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
