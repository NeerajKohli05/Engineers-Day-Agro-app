// src/components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, Spinner } from "react-bootstrap";
import { db } from "../firebase";
import { ref, onValue, set } from "firebase/database";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const [sensors, setSensors] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const sensorsRef = ref(db, "sensors");
    const unsubscribe = onValue(
      sensorsRef,
      (snapshot) => {
        setSensors(snapshot.exists() ? snapshot.val() : {});
        setLoading(false);
      },
      (err) => {
        console.error("Realtime DB error:", err);
        setSensors({});
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const togglePump = async (pumpKey) => {
    if (!sensors) return;
    const newValue = !Boolean(sensors[pumpKey]);
    try {
      await set(ref(db, `sensors/${pumpKey}`), newValue);
    } catch (err) {
      console.error("togglePump error:", err);
    }
  };

  const setManualMode = async (state) => {
    try {
      await set(ref(db, "sensors/manual"), state);
    } catch (err) {
      console.error("setManualMode error:", err);
    }
  };

  if (loading) {
    return (
      <div className={`dashboard ${darkMode ? "dark" : "light"}`}>
        <section className="hero small-hero">
          <div className="hero-content">
            <Spinner animation="border" role="status" />
            <p style={{ marginTop: 12 }}>Loading farm data…</p>
          </div>
        </section>
      </div>
    );
  }

  const temp = sensors?.temperature ?? "N/A";
  const soil = sensors?.soilMoisture ?? "N/A";
  const tank =
    sensors?.tankLevel !== undefined
      ? Number(sensors.tankLevel).toFixed(1)
      : "N/A";
  const pump1 = Boolean(sensors?.pump1);
  const pump2 = Boolean(sensors?.pump2);
  const manual = Boolean(sensors?.manual);

  return (
    <div className={`dashboard ${darkMode ? "dark" : "light"}`}>
      {/* TOGGLE MODE */}
      <div className="theme-toggle">
        <label className="switch">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          <span className="slider"></span>
        </label>
        <span>{darkMode ? "Dark Mode 🌙" : "Light Mode ☀️"}</span>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1>Smart Agriculture Dashboard</h1>
          <p>
            Monitor soil, water, weather & pumps — all in one place for smarter
            farming decisions.
          </p>
          <div className="hero-cta">
            <Button
              className="btn-cta primary"
              onClick={() => navigate("/devices")}
            >
              🚜 Devices
            </Button>
            <Button
              className="btn-cta warning"
              onClick={() => navigate("/crop-presets")}
            >
              🌾 Crop Presets
            </Button>
            <Button
              className="btn-cta secondary"
              onClick={() => navigate("/knowledge")}
            >
              📚 Knowledge
            </Button>
          </div>
        </div>
      </section>

      {/* LIVE STATS */}
      <section className="stats">
        <Container>
          <h2 className="section-title">Live Farm Stats</h2>
          <Row className="stats-grid">
            <Col md={3} sm={6}>
              <Card className="stat-card">
                <div className="stat-value">{temp}°C</div>
                <div className="stat-label">Temperature</div>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="stat-card">
                <div className="stat-value">{soil}%</div>
                <div className="stat-label">Soil Moisture</div>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="stat-card">
                <div className="stat-value">{tank} L</div>
                <div className="stat-label">Tank Level</div>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="stat-card">
                <div className="stat-value">
                  {(pump1 ? 1 : 0) + (pump2 ? 1 : 0)}
                </div>
                <div className="stat-label">Pumps ON</div>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* IRRIGATION & PUMP CONTROL */}
      <section className="controls">
        <Container>
          <h2 className="section-title">Irrigation & Pump Control</h2>
          <Card className="controls-card">
            <div className="mode-row">
              <div>
                <div className="mode-label">Mode</div>
                <div className={`mode-pill ${manual ? "manual" : "auto"}`}>
                  {manual
                    ? "Manual — local control enabled"
                    : "Automatic — device control"}
                </div>
              </div>
              <div className="mode-actions">
                <Button
                  className="btn-mode manual"
                  onClick={() => setManualMode(true)}
                  disabled={manual}
                >
                  🌿 Manual
                </Button>
                <Button
                  className="btn-mode auto"
                  onClick={() => setManualMode(false)}
                  disabled={!manual}
                >
                  🤖 Automatic
                </Button>
              </div>
            </div>

            <Row className="pump-grid">
              <Col md={6}>
                <Card className="pump-card">
                  <div className="pump-title">🚰 Pump 1 — Rainwater</div>
                  <div className={`pump-status ${pump1 ? "on" : "off"}`}>
                    {pump1 ? "ON" : "OFF"}
                  </div>
                  <div className="pump-actions">
                    <label className={`switch ${!manual ? "disabled" : ""}`}>
                      <input
                        type="checkbox"
                        checked={pump1}
                        onChange={() => togglePump("pump1")}
                        disabled={!manual}
                      />
                      <span className="slider" />
                    </label>
                  </div>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="pump-card">
                  <div className="pump-title">🚰 Pump 2 — Groundwater</div>
                  <div className={`pump-status ${pump2 ? "on" : "off"}`}>
                    {pump2 ? "ON" : "OFF"}
                  </div>
                  <div className="pump-actions">
                    <label className={`switch ${!manual ? "disabled" : ""}`}>
                      <input
                        type="checkbox"
                        checked={pump2}
                        onChange={() => togglePump("pump2")}
                        disabled={!manual}
                      />
                      <span className="slider" />
                    </label>
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>
        </Container>
      </section>

      {/* WEATHER */}
      <section className="weather">
        <Container>
          <h2 className="section-title">Local Weather</h2>
          <Card className="weather-card">
            <div className="weather-left">
              <div className="weather-temp">26°C</div>
              <div className="weather-desc">Sunny • Light breeze</div>
            </div>
            <div className="weather-right">
              <div className="weather-note">
                Good conditions for irrigation today.
              </div>
            </div>
          </Card>
        </Container>
      </section>

   
     
      {/* KNOWLEDGE BASE */}
      <section className="knowledge">
        <Container>
          <h2 className="section-title">Knowledge & Tips</h2>
          <Row className="knowledge-grid">
            <Col md={4}>
              <Card className="knowledge-card">
                <div className="knowledge-title">🌱 Soil Management</div>
                <div className="knowledge-desc">
                  Keep fertility & moisture balanced with compost and cover
                  crops.
                </div>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="knowledge-card">
                <div className="knowledge-title">🔄 Crop Rotation</div>
                <div className="knowledge-desc">
                  Rotate crops to prevent soil exhaustion and pests.
                </div>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="knowledge-card">
                <div className="knowledge-title">💧 Water Efficiency</div>
                <div className="knowledge-desc">
                  Use rainwater harvesting + drip irrigation for savings.
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* SMART FARMING INFO */}
{/* SMART FARMING INFO */}
<section className="farming-info">
  <Container>
    <h2 className="section-title">Why Smart Farming?</h2>
    <p className="section-subtitle">
      Smarter techniques mean healthier crops, higher yields, and sustainable farming for the future. 🌱
    </p>

    <div className="farming-grid">
      <Card className="farming-card">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtxcLdXC9-jylDPgqdE3Y1TH5wbVMXgeKqYA&s"
          alt="Precision irrigation"
          className="farming-img"
        />
        <div className="farming-content">
          <h3>💧 Precision Irrigation</h3>
          <p>Deliver the right water at the right time, saving resources and boosting growth.</p>
        </div>
      </Card>

      <Card className="farming-card">
        <img
          src="https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/aa191794-d944-46b0-bc8c-25af78734ded.png"
          alt="Drone monitoring"
          className="farming-img"
        />
        <div className="farming-content">
          <h3>🚁 Crop Monitoring</h3>
          <p>Leverage drones & sensors to detect stress, track soil, and prevent disease early.</p>
        </div>
      </Card>

      <Card className="farming-card">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq6j934rtHkxknL_F3a-dfbnkZ1dUOpirhww&s"
          alt="Smart automation"
          className="farming-img"
        />
        <div className="farming-content">
          <h3>🤖 Smart Automation</h3>
          <p>Automate pumps & irrigation with AI-driven insights for higher efficiency.</p>
        </div>
      </Card>
    </div>
  </Container>
</section>

      
    </div>
  );
}
