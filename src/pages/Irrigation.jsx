import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue, set } from "firebase/database";
import "./Irrigation.css";

export default function Irrigation() {
  const [sensors, setSensors] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sensorsRef = ref(db, "sensors");
    const unsubscribe = onValue(
      sensorsRef,
      (snapshot) => {
        setSensors(snapshot.exists() ? snapshot.val() : {});
        setLoading(false);
      },
      (err) => {
        console.error("Firebase read error:", err);
        setSensors({});
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const manual = Boolean(sensors?.manual);
  const pump1 = Boolean(sensors?.pump1);
  const pump2 = Boolean(sensors?.pump2);
  const soil = sensors?.soilMoisture ?? "--";
  const tank = sensors?.tankLevel ?? "--";

  const handleTogglePump = async (key, currentVal) => {
    if (!manual) return;
    try {
      await set(ref(db, `sensors/${key}`), !currentVal);
    } catch (err) {
      console.error(`Error toggling ${key}:`, err);
    }
  };

  const handleSetMode = async (isManual) => {
    try {
      await set(ref(db, "sensors/manual"), isManual);
    } catch (err) {
      console.error("Error setting mode:", err);
    }
  };

  if (loading) {
    return (
      <div className="minimal-loading">
        <span className="loading-dot"></span>
        <span>Loading irrigation controls...</span>
      </div>
    );
  }

  return (
    <div className="irrigation-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Irrigation</h1>
          <p className="page-subtitle">Dual-source water pump management</p>
        </div>

        {/* Mode Segmented Control */}
        <div className="mode-segmented-control">
          <button
            className={`segment-btn ${!manual ? "active" : ""}`}
            onClick={() => handleSetMode(false)}
          >
            Auto Mode
          </button>
          <button
            className={`segment-btn ${manual ? "active" : ""}`}
            onClick={() => handleSetMode(true)}
          >
            Manual Mode
          </button>
        </div>
      </div>

      {/* Mode Advisory Notice */}
      <div className={`mode-notice ${manual ? "notice-manual" : "notice-auto"}`}>
        {manual
          ? "Manual mode enabled. Physical relays respond directly to the toggles below."
          : "Auto mode active. Pumps cycle based on real-time soil moisture and reservoir thresholds."}
      </div>

      {/* Dual Pump Cards Grid */}
      <div className="pumps-grid">
        {/* Pump 1: Rainwater */}
        <div className={`pump-panel ${pump1 ? "panel-active" : ""}`}>
          <div className="pump-panel-top">
            <div>
              <span className="pump-priority-tag tag-primary">Priority 1</span>
              <h3 className="pump-title">Pump 1 — Rainwater</h3>
              <p className="pump-subtitle">Primary source from on-site rainwater tank</p>
            </div>
            <div className={`status-pill ${pump1 ? "pill-on" : "pill-off"}`}>
              {pump1 ? "Running" : "Off"}
            </div>
          </div>

          <div className="pump-panel-bottom">
            <div className="switch-row">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={pump1}
                  disabled={!manual}
                  onChange={() => handleTogglePump("pump1", pump1)}
                />
                <span className="slider round"></span>
              </label>
              <span className="switch-status-label">
                {manual ? (pump1 ? "Turn off" : "Turn on") : "Controlled by auto logic"}
              </span>
            </div>
            <div className="pump-meta-note">Relay pin: GPIO 26</div>
          </div>
        </div>

        {/* Pump 2: Groundwater */}
        <div className={`pump-panel ${pump2 ? "panel-active" : ""}`}>
          <div className="pump-panel-top">
            <div>
              <span className="pump-priority-tag tag-secondary">Priority 2</span>
              <h3 className="pump-title">Pump 2 — Groundwater</h3>
              <p className="pump-subtitle">Borewell fallback when rainwater is depleted</p>
            </div>
            <div className={`status-pill ${pump2 ? "pill-on" : "pill-off"}`}>
              {pump2 ? "Running" : "Off"}
            </div>
          </div>

          <div className="pump-panel-bottom">
            <div className="switch-row">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={pump2}
                  disabled={!manual}
                  onChange={() => handleTogglePump("pump2", pump2)}
                />
                <span className="slider round"></span>
              </label>
              <span className="switch-status-label">
                {manual ? (pump2 ? "Turn off" : "Turn on") : "Controlled by auto logic"}
              </span>
            </div>
            <div className="pump-meta-note">Relay pin: GPIO 27</div>
          </div>
        </div>
      </div>

      {/* Logic Card */}
      <div className="logic-panel">
        <h4 className="logic-title">Autonomous Irrigation Logic</h4>
        <div className="logic-steps">
          <div className="logic-step">
            <span className="step-num">01</span>
            <div>
              <strong>Moisture Check:</strong> If soil moisture falls below 40%, the system initiates an irrigation request.
            </div>
          </div>
          <div className="logic-step">
            <span className="step-num">02</span>
            <div>
              <strong>Water Source Routing:</strong> If the rainwater reservoir is above 15 cm, Pump 1 engages. If the reservoir is low, Pump 2 (groundwater) acts as the failover.
            </div>
          </div>
          <div className="logic-step">
            <span className="step-num">03</span>
            <div>
              <strong>Saturation Cutoff:</strong> Once soil reaches 65% moisture, all pumps disengage automatically to prevent root rot.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
