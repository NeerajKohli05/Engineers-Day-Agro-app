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

import HydroponicFarming from "./components/HydroponicFarming";
import Devices from "./Devices/Devices";
import CropLibrary from "./components/CropLibrary";


import NavigationBar from "./components/Navbar";

// 🔹 Layout wrapper (Navbar + Footer)
function Layout({ children }) {
  return (
    <div>
      <NavigationBar />
      {children}
      <footer className="footer">
        <p>
          © 2025 Agro Dashboard | Built with 🌱 IoT + React |{" "}
          <a href="#">About</a> | <a href="#">Contact</a>
        </p>
      </footer>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 🔹 handle initial auth check

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <LoginPage />}
        />

        {/* Protected Routes inside Layout */}
        <Route
          path="/dashboard"
          element={
            user ? (
              <Layout>
                <Dashboard />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        
        <Route
          path="/hydroponic"
          element={
            user ? (
              <Layout>
                <HydroponicFarming />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/devices"
          element={
            user ? (
              <Layout>
                <Devices />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
    path="/crops"
    element={
      user ? (
        <Layout>
          <CropLibrary />
        </Layout>
      ) : (
        <Navigate to="/" />
      )
    }
  />

      </Routes>
    </Router>
  );
}

export default App;
