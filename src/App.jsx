import React, { useState, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { auth } from "./firebase";

import LoginPage from "./pages/LoginPage";
import Dashboard from "./components/Dashboard";
import Irrigation from "./pages/Irrigation";
import HydroponicFarming from "./components/HydroponicFarming";
import NavigationBar from "./components/Navbar";

// Minimal Layout Wrapper with Dark Tree Green Header & Footer
function Layout({ children }) {
  return (
    <div className="app-layout">
      <NavigationBar />
      <main className="app-content">{children}</main>
      <footer className="minimal-footer">
        <div>🌱 Agro • IoT Precision Irrigation Platform</div>
        <div className="footer-tagline">Engineered with Sustainable Dual-Source Water Conservation</div>
      </footer>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="app-layout">
        <div className="minimal-loading">
          <span className="loading-dot"></span>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Login Route */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />

        {/* Protected Page 1: Overview */}
        <Route
          path="/dashboard"
          element={
            user ? (
              <Layout>
                <Dashboard />
              </Layout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Protected Page 2: Irrigation Control */}
        <Route
          path="/irrigation"
          element={
            user ? (
              <Layout>
                <Irrigation />
              </Layout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Backward-compatible redirect for /devices */}
        <Route path="/devices" element={<Navigate to="/irrigation" replace />} />

        {/* Protected Page 3: Hydroponics */}
        <Route
          path="/hydroponic"
          element={
            user ? (
              <Layout>
                <HydroponicFarming />
              </Layout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
