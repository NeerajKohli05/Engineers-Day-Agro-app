import React, { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
// <-- We'll use this for styles

function LoginPage() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignup = async () => {
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      {/* Left Section with Image + Gradient */}
      <div className="left-section"></div>

      {/* Right Section with Card */}
      <div className="right-section">
        <div className="login-card shadow-lg p-4">
          <h2 className="text-center mb-4 fw-bold text-success">
            {isLogin ? "Welcome Back 🌱" : "Join Us 🌾"}
          </h2>

          {/* Toggle Buttons */}
          <div className="d-flex justify-content-center mb-4">
            <button
              className={`btn me-2 ${
                isLogin ? "btn-success" : "btn-outline-success"
              }`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`btn ${
                !isLogin ? "btn-success" : "btn-outline-success"
              }`}
              onClick={() => setIsLogin(false)}
            >
              Signup
            </button>
          </div>

          {/* Form Inputs */}
          <input
            type="email"
            className="form-control mb-3"
            placeholder="📧 Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="form-control mb-3"
            placeholder="🔑 Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {!isLogin && (
            <input
              type="password"
              className="form-control mb-3"
              placeholder="🔒 Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}

          {/* Error Message */}
          {error && <p className="text-danger">{error}</p>}

          {/* Submit Button */}
          <button
            className="btn btn-success w-100 fw-bold"
            style={{ padding: "10px", fontSize: "16px", borderRadius: "10px" }}
            onClick={isLogin ? handleLogin : handleSignup}
          >
            {isLogin ? "Login" : "Signup"}
          </button>

          {/* Toggle Form Link */}
          <p className="mt-3 text-center">
            {isLogin ? "Not a member? " : "Already have an account? "}
            <span
              className="text-success fw-bold"
              style={{ cursor: "pointer" }}
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Signup now" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
