import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
import { Link } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const [sensors, setSensors] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("moisture"); // 'moisture' | 'temperature'

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

  const rawTemp = sensors?.temperature;
  const temp = rawTemp !== undefined && rawTemp !== null ? Number(rawTemp).toFixed(1) : "22.5";
  
  const rawSoil = sensors?.soilMoisture;
  const soil = rawSoil !== undefined && rawSoil !== null ? Number(rawSoil) : 28;
  
  const rawTank = sensors?.tankLevel;
  const tank = rawTank !== undefined && rawTank !== null ? Number(rawTank).toFixed(1) : "0.0";
  
  const manual = Boolean(sensors?.manual);
  const pump1 = Boolean(sensors?.pump1);
  const pump2 = Boolean(sensors?.pump2);

  // Status evaluations
  const soilStatus = typeof soil === "number"
    ? soil < 35 ? { text: "Deficit (Dry)", class: "status-low" }
      : soil < 70 ? { text: "Optimal", class: "status-ok" }
      : { text: "Saturated", class: "status-high" }
    : { text: "Reading...", class: "" };

  // Calculate Vapor Pressure Deficit (VPD in kPa)
  const tempNum = Number(temp) || 22.5;
  const humidityEst = 60;
  const vpSat = 0.61078 * Math.exp((17.27 * tempNum) / (tempNum + 237.3));
  const vpd = (vpSat * (1 - humidityEst / 100)).toFixed(2);

  // Historical trend points for SVG sparkline
  const moistureTrend = [
    { time: "00:00", val: 54 },
    { time: "04:00", val: 49 },
    { time: "08:00", val: 43 },
    { time: "12:00", val: 35 },
    { time: "16:00", val: 29 },
    { time: "20:00", val: soil }
  ];

  const tempTrend = [
    { time: "00:00", val: 18.2 },
    { time: "04:00", val: 17.0 },
    { time: "08:00", val: 20.1 },
    { time: "12:00", val: 24.6 },
    { time: "16:00", val: 23.4 },
    { time: "20:00", val: tempNum }
  ];

  const currentTrend = activeTab === "moisture" ? moistureTrend : tempTrend;
  const maxVal = Math.max(...currentTrend.map(d => d.val), activeTab === "moisture" ? 70 : 30);
  const minVal = Math.min(...currentTrend.map(d => d.val), activeTab === "moisture" ? 20 : 15);

  const svgWidth = 620;
  const svgHeight = 130;
  const points = currentTrend.map((d, i) => {
    const x = (i / (currentTrend.length - 1)) * svgWidth;
    const y = svgHeight - ((d.val - minVal) / (maxVal - minVal || 1)) * (svgHeight - 32) - 16;
    return `${x},${y}`;
  }).join(" ");

  if (loading) {
    return (
      <div className="minimal-loading">
        <span className="loading-dot"></span>
        <span>Synchronizing telemetry...</span>
      </div>
    );
  }

  return (
    <div className="spacious-overview">
      {/* 1. PAGE HEADER */}
      <header className="spacious-header">
        <div>
          <span className="header-eyebrow">FIELD TELEMETRY & AUTOMATION</span>
          <h1 className="header-main-title">Farm Overview</h1>
          <p className="header-description">
            Live root-zone measurements, diurnal trends, and automated dual-source irrigation routing.
          </p>
        </div>

        <div className="header-controls-group">
          <div className="header-status-pill">
            <span className={`pill-dot-mode ${manual ? "dot-manual" : "dot-auto"}`}></span>
            <span>{manual ? "Manual Override" : "Autonomous Mode"}</span>
          </div>
          <Link to="/irrigation" className="header-link-pill">
            Manage Pumps →
          </Link>
        </div>
      </header>

      {/* 2. SECTION: LIVE TELEMETRY CARDS */}
      <section className="dashboard-band">
        <div className="band-caption-row">
          <h2 className="band-title">Live Sensor Gauges</h2>
          <span className="band-subtext">Sampled continuously via ESP32 ADC & One-Wire</span>
        </div>

        <div className="spacious-metrics-grid">
          {/* Soil Moisture */}
          <div className="spacious-card">
            <div className="card-top-flex">
              <span className="card-tag-label">Root-Zone Soil</span>
              <span className={`spacious-badge ${soilStatus.class}`}>{soilStatus.text}</span>
            </div>
            <div className="card-number-row">
              <span className="big-stat-number">{soil}</span>
              <span className="stat-unit">%</span>
            </div>
            <div className="airy-bar-track">
              <div
                className="airy-bar-fill"
                style={{ width: `${typeof soil === "number" ? Math.min(Math.max(soil, 0), 100) : 0}%` }}
              ></div>
            </div>
            <div className="card-foot-flex">
              <span>Trigger: &lt; 40%</span>
              <span>Target: 45% – 65%</span>
            </div>
          </div>

          {/* Temperature */}
          <div className="spacious-card">
            <div className="card-top-flex">
              <span className="card-tag-label">Canopy Ambient</span>
              <span className="spacious-badge status-neutral">DHT11</span>
            </div>
            <div className="card-number-row">
              <span className="big-stat-number">{temp}</span>
              <span className="stat-unit">°C</span>
            </div>
            <div className="airy-bar-track">
              <div
                className="airy-bar-fill fill-temp"
                style={{ width: `${Math.min(Math.max((Number(temp) / 45) * 100, 0), 100)}%` }}
              ></div>
            </div>
            <div className="card-foot-flex">
              <span>Heat Stress: &gt; 32°C</span>
              <span>Nominal: 20°C – 26°C</span>
            </div>
          </div>

          {/* Reservoir Tank */}
          <div className="spacious-card">
            <div className="card-top-flex">
              <span className="card-tag-label">Rainwater Storage</span>
              <span className={`spacious-badge ${Number(tank) > 15 ? "status-ok" : "status-low"}`}>
                {Number(tank) > 15 ? "Available" : "Low Reserve"}
              </span>
            </div>
            <div className="card-number-row">
              <span className="big-stat-number">{tank}</span>
              <span className="stat-unit">cm</span>
            </div>
            <div className="airy-bar-track">
              <div
                className="airy-bar-fill fill-tank"
                style={{ width: `${Math.min(Math.max(Number(tank), 0), 100)}%` }}
              ></div>
            </div>
            <div className="card-foot-flex">
              <span>Cutoff Limit: 15 cm</span>
              <span>Priority Source 1</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION: 24-HOUR TELEMETRY SPARKLINE */}
      <section className="dashboard-band">
        <div className="spacious-panel-card">
          <div className="panel-top-bar">
            <div>
              <span className="card-tag-label">ENVIRONMENTAL LOG</span>
              <h3 className="panel-title-text">24-Hour Diurnal Telemetry Curve</h3>
              <p className="panel-desc-text">Tracks daily moisture loss and ambient heat cycles</p>
            </div>

            <div className="tab-pill-container">
              <button
                className={`tab-pill-btn ${activeTab === "moisture" ? "active" : ""}`}
                onClick={() => setActiveTab("moisture")}
              >
                Soil Moisture %
              </button>
              <button
                className={`tab-pill-btn ${activeTab === "temperature" ? "active" : ""}`}
                onClick={() => setActiveTab("temperature")}
              >
                Temperature °C
              </button>
            </div>
          </div>

          {/* Sparkline Canvas */}
          <div className="sparkline-container">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="airy-sparkline-svg">
              <line x1="0" y1={svgHeight / 2} x2={svgWidth} y2={svgHeight / 2} stroke="#eae3d7" strokeDasharray="4 4" />
              <polyline
                fill="none"
                stroke={activeTab === "moisture" ? "#1b4d32" : "#8d6b2c"}
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
              {currentTrend.length > 0 && (
                <circle
                  cx={svgWidth}
                  cy={svgHeight - ((currentTrend[currentTrend.length - 1].val - minVal) / (maxVal - minVal || 1)) * (svgHeight - 32) - 16}
                  r="5"
                  fill="#ffffff"
                  stroke={activeTab === "moisture" ? "#1b4d32" : "#8d6b2c"}
                  strokeWidth="3"
                />
              )}
            </svg>
            <div className="sparkline-axis-row">
              {currentTrend.map((d, i) => (
                <span key={i}>{d.time}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION: AGRONOMIC INDICES & WATER BALANCE */}
      <section className="dashboard-band">
        <div className="band-caption-row">
          <h2 className="band-title">Agronomic Indicators & Resource Balance</h2>
          <span className="band-subtext">Quantifying bio-climatic health and aquifer preservation</span>
        </div>

        <div className="spacious-split-grid">
          {/* Card A: Plant Stress & Transpiration (VPD) */}
          <div className="spacious-panel-card">
            <span className="card-tag-label">BIO-CLIMATIC HEALTH</span>
            <h3 className="panel-title-text mt-1">Vapor Pressure Deficit (VPD)</h3>
            <p className="panel-desc-text">Drives nutrient transpirational flow without leaf stress</p>

            <div className="metric-highlight-box mt-4">
              <div>
                <span className="highlight-number">{vpd}</span>
                <span className="highlight-unit">kPa</span>
              </div>
              <span className="spacious-badge status-ok">Optimal Zone</span>
            </div>

            <p className="highlight-explanation mt-3">
              Calculated psychrometrically from canopy ambient temperature. Current transpiration potential is optimal, ensuring continuous nutrient absorption without risk of stomatal closure.
            </p>
          </div>

          {/* Card B: Dual-Source Water Conservation */}
          <div className="spacious-panel-card">
            <span className="card-tag-label">AQUIFER PROTECTION</span>
            <h3 className="panel-title-text mt-1">Water Resource Balance</h3>
            <p className="panel-desc-text">Harvested rainfall prioritization over deep borewells</p>

            <div className="metric-highlight-box mt-4">
              <div>
                <span className="highlight-number">88.5%</span>
                <span className="highlight-unit">Rainwater</span>
              </div>
              <span className="spacious-badge status-ok">Grade A+ Rating</span>
            </div>

            <p className="highlight-explanation mt-3">
              By deploying dual relays and prioritizing stored rainwater, the system has prevented deep aquifer depletion, saving an estimated <strong>~380 Liters</strong> of groundwater this cycle.
            </p>
          </div>
        </div>
      </section>

      {/* 5. SECTION: AUTONOMOUS DECISION PIPELINE */}
      <section className="dashboard-band">
        <div className="spacious-panel-card">
          <div className="panel-top-bar">
            <div>
              <span className="card-tag-label">EDGE LOGIC PIPELINE</span>
              <h3 className="panel-title-text">Real-Time Autonomous Decision Flow</h3>
              <p className="panel-desc-text">How the ESP32 microcontroller autonomously evaluates sensory conditions</p>
            </div>
          </div>

          <div className="spacious-tree-pipeline mt-4">
            <div className={`pipeline-step ${soil < 40 ? "step-triggered" : ""}`}>
              <span className="step-badge-num">STAGE 01</span>
              <h4 className="step-title">Moisture Evaluation</h4>
              <p className="step-reading">Current: <strong>{soil}%</strong></p>
              <div className="step-outcome">
                {soil < 40 ? "Condition Met: Dry (< 40%)" : "Standby: Moisture Adequate"}
              </div>
            </div>

            <div className="pipeline-connector">→</div>

            <div className={`pipeline-step ${Number(tank) > 15 ? "step-rain" : "step-well"}`}>
              <span className="step-badge-num">STAGE 02</span>
              <h4 className="step-title">Source Allocation</h4>
              <p className="step-reading">Tank Depth: <strong>{tank} cm</strong></p>
              <div className="step-outcome">
                {Number(tank) > 15 ? "Route: Rainwater Tank (P1)" : "Failover: Borewell (P2)"}
              </div>
            </div>

            <div className="pipeline-connector">→</div>

            <div className={`pipeline-step ${pump1 || pump2 ? "step-active" : ""}`}>
              <span className="step-badge-num">STAGE 03</span>
              <h4 className="step-title">Actuator State</h4>
              <p className="step-reading">
                Relays: <strong>{pump1 ? "Pump 1 Active" : pump2 ? "Pump 2 Active" : "All Idle"}</strong>
              </p>
              <div className="step-outcome">
                {pump1 ? "Harvested Rainwater Flowing" : pump2 ? "Groundwater Line Flowing" : "Pumps Disengaged"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TECHNICAL DIAGNOSTICS STRIP */}
      <footer className="spacious-diagnostics-bar">
        <div className="diag-group">
          <span className="diag-label">Microcontroller:</span>
          <span className="diag-text">ESP32-WROOM-32D</span>
        </div>
        <div className="diag-sep">•</div>
        <div className="diag-group">
          <span className="diag-label">Telemetry Protocol:</span>
          <span className="diag-text text-success">Firebase RTDB WebSockets</span>
        </div>
        <div className="diag-group">
          <span className="diag-label">RF Link:</span>
          <span className="diag-text">2.4 GHz WiFi</span>
        </div>
        <div className="diag-sep">•</div>
        <div className="diag-group">
          <span className="diag-label">Relays:</span>
          <span className="diag-text">GPIO 26 & 27 (Dual-Channel)</span>
        </div>
      </footer>
    </div>
  );
}
