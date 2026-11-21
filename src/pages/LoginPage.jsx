import React, { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.code === "auth/invalid-credential" || err.code === "auth/user-not-found"
          ? "Invalid email or password. Please check your credentials."
          : err.message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e) => {
    e?.preventDefault();
    if (!email || !password) {
      setError("Please complete all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick fill with verified operator credentials
  const fillDemoAccount = () => {
    setEmail("neerajkohli472@gmail.com");
    setPassword("NeerajNeeraj");
    setIsLogin(true);
    setError("");
  };

  return (
    <div className="auth-viewport">
      {/* LEFT: Atmospheric Botanical Brand Panel */}
      <div className="auth-brand-side">
        <div className="brand-glow-circle"></div>
        
        <div className="brand-top-nav">
          <div className="brand-logo">
            <span className="brand-dot-leaf"></span>
            <span className="brand-name-text">AgroFlow</span>
          </div>
          <span className="platform-release-pill">v2.5 Platform</span>
        </div>

        <div className="brand-hero-content">
          <span className="editorial-eyebrow">PRECISION AGRONOMY & IOT</span>
          <h1 className="editorial-headline">
            Sustainable irrigation,<br />
            governed by soil science.
          </h1>
          <p className="editorial-subtext">
            Connecting capacitive field sensors and dual-relay pumps to an intelligent cloud engine. 
            Prioritizing rainwater reservoirs to protect groundwater reserves.
          </p>

          <div className="feature-proof-pills">
            <div className="proof-pill">
              <span className="proof-dot"></span>
              <span>Sub-Second Telemetry</span>
            </div>
            <div className="proof-pill">
              <span className="proof-dot"></span>
              <span>Dual-Pump Routing</span>
            </div>
            <div className="proof-pill">
              <span className="proof-dot"></span>
              <span>Aquifer Protection</span>
            </div>
          </div>
        </div>

        <div className="brand-footer-note">
          <span>Engineered with ESP32, Firebase RTDB & React 19</span>
        </div>
      </div>

      {/* RIGHT: Warm Linen Beige Form Panel */}
      <div className="auth-form-side">
        <div className="auth-form-card">
          {/* Header */}
          <div className="form-header-row">
            <div>
              <h2 className="form-main-title">{isLogin ? "Welcome back" : "Create operator account"}</h2>
              <p className="form-sub-title">
                {isLogin
                  ? "Access your live farm telemetry and pump relays"
                  : "Register as an authorized field operator"}
              </p>
            </div>
          </div>

          {/* Segmented Mode Switch */}
          <div className="auth-segmented-switch">
            <button
              type="button"
              className={`segmented-tab ${isLogin ? "active" : ""}`}
              onClick={() => { setIsLogin(true); setError(""); }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`segmented-tab ${!isLogin ? "active" : ""}`}
              onClick={() => { setIsLogin(false); setError(""); }}
            >
              Register
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="auth-alert-banner">
              <span className="alert-bullet">!</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={isLogin ? handleLogin : handleSignup} className="auth-form-elements">
            <div className="input-field-group">
              <label className="input-label" htmlFor="email-input">
                Operator Email
              </label>
              <input
                id="email-input"
                type="email"
                required
                className="minimal-input"
                placeholder="name@farm.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-field-group">
              <label className="input-label" htmlFor="password-input">
                Password
              </label>
              <input
                id="password-input"
                type="password"
                required
                className="minimal-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {!isLogin && (
              <div className="input-field-group">
                <label className="input-label" htmlFor="confirm-password-input">
                  Confirm Password
                </label>
                <input
                  id="confirm-password-input"
                  type="password"
                  required
                  className="minimal-input"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-submit-botanical"
            >
              {isSubmitting ? (
                <span className="btn-loading-flex">
                  <span className="tiny-spinner"></span>
                  <span>Authenticating...</span>
                </span>
              ) : isLogin ? (
                "Sign In to Dashboard →"
              ) : (
                "Create Account →"
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="demo-credentials-helper">
            <span className="helper-label">Verified Demo Operator:</span>
            <button
              type="button"
              className="btn-fill-demo"
              onClick={fillDemoAccount}
            >
              Auto-fill credentials
            </button>
          </div>

          <div className="auth-footer-caption">
            <span>Protected by Firebase Authentication SSL/TLS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
