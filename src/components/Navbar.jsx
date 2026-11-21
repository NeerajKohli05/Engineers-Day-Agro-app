import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function NavigationBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <header className="minimal-nav">
      <div className="nav-container">
        {/* Brand */}
        <Link to="/dashboard" className="nav-brand">
          <span className="brand-dot"></span>
          <span>Agro</span>
        </Link>

        {/* Clean Nav Links */}
        <nav className="nav-links">
          <Link
            to="/dashboard"
            className={`nav-link-item ${location.pathname === "/dashboard" ? "active" : ""}`}
          >
            Overview
          </Link>
          <Link
            to="/irrigation"
            className={`nav-link-item ${location.pathname === "/irrigation" ? "active" : ""}`}
          >
            Irrigation
          </Link>
          <Link
            to="/hydroponic"
            className={`nav-link-item ${location.pathname === "/hydroponic" ? "active" : ""}`}
          >
            Hydroponics
          </Link>
        </nav>

        {/* Status & Session */}
        <div className="nav-right">
          <div className="nav-status">
            <span className="pulse-dot"></span>
            <span>Live</span>
          </div>

          {user && (
            <button className="btn-signout" onClick={handleLogout}>
              Sign out
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
