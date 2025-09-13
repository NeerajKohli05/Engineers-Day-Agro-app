import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Badge } from "react-bootstrap";
import { db } from "../firebase";
import { ref, onValue, set } from "firebase/database";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [devices, setDevices] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const devicesRef = ref(db, "devices");
    const unsubscribe = onValue(devicesRef, (snapshot) => {
      setDevices(snapshot.exists() ? snapshot.val() : {});
    });
    return () => unsubscribe();
  }, []);

  const deviceEntries = Object.entries(devices || {});
  const deviceCount = deviceEntries.length;
  const pumpsOn = deviceEntries.filter(
    ([, d]) => (d?.Pump ?? d?.pump) === "ON"
  ).length;

  const avgTemp =
    deviceEntries.length > 0
      ? (
          deviceEntries
            .map(([, d]) => Number(d?.temperature))
            .filter((n) => !isNaN(n))
            .reduce((a, b) => a + b, 0) / deviceEntries.length
        ).toFixed(1)
      : "N/A";

  const avgHumidity =
    deviceEntries.length > 0
      ? (
          deviceEntries
            .map(([, d]) => Number(d?.humidity))
            .filter((n) => !isNaN(n))
            .reduce((a, b) => a + b, 0) / deviceEntries.length
        ).toFixed(0)
      : "N/A";

  const togglePump = (deviceId, state) => {
    const sample = devices[deviceId] || {};
    const key = "Pump" in sample ? "Pump" : "pump";
    set(ref(db, `devices/${deviceId}/${key}`), state).catch((err) =>
      console.error("Pump toggle error:", err)
    );
  };

  return (
    <div>
      {/* 🌿 Hero Section */}
      <section
        style={{
          backgroundImage:
            'url(https://filerun.daviteq.com/wl/?id=ceV7ptHUxa9Z4v1Ls980bckoDvcxt88J)',
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          color: "#fff",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0, 60, 30, 0.6)",
          }}
        ></div>
        <div style={{ zIndex: 1, textAlign: "center", maxWidth: "700px" }}>
          <h1 style={{ fontSize: "3rem", fontWeight: "700" }}>
            🌱 Smart Hydroponic Dashboard
          </h1>
          <p style={{ fontSize: "1.2rem", margin: "20px 0" }}>
            Monitor devices, track conditions, and grow with confidence.
          </p>
          <Button
            size="lg"
            style={{
              backgroundColor: "#52b788",
              border: "none",
              marginRight: "10px",
            }}
            onClick={() => navigate("/devices")}
          >
            View Devices
          </Button>
          <Button
            size="lg"
            style={{ backgroundColor: "#2d6a4f", border: "none" }}
            onClick={() => navigate("/hydroponic")}
          >
            Crop Presets
          </Button>
        </div>
      </section>

      {/* 📊 Stats Section */}
      <section style={{ padding: "60px 0", backgroundColor: "#f9fafb" }}>
        <Container>
          <Row className="g-4 text-center">
            <Col md={3} sm={6}>
              <div className="stat-panel">
                <h2>{deviceCount}</h2>
                <p>Devices Connected</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="stat-panel">
                <h2>{pumpsOn}</h2>
                <p>Pumps ON</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="stat-panel">
                <h2>{avgTemp}°C</h2>
                <p>Average Temp</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="stat-panel">
                <h2>{avgHumidity}%</h2>
                <p>Average Humidity</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 🌤 Weather (placeholder, you can integrate API here) */}
      <section style={{ padding: "60px 0" }}>
        <Container>
          <Row>
            <Col md={12} className="text-center">
              <div className="weather-panel">
                <h3>🌤 Local Weather</h3>
                <p>
                  Live weather integration goes here (OpenWeather API or similar).
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 🔌 Devices Section */}
      <section style={{ padding: "60px 0", backgroundColor: "#f9fafb" }}>
        <Container>
          <h2 className="text-center mb-4">🔌 Connected Devices</h2>
          {deviceCount === 0 && (
            <p style={{ textAlign: "center" }}>No devices found.</p>
          )}
          <Row className="g-4">
            {deviceEntries.map(([deviceId, data]) => (
              <Col md={4} sm={6} key={deviceId}>
                <div className="device-panel">
                  <h5>
                    {deviceId}{" "}
                    {data?.alert && <Badge bg="danger">ALERT</Badge>}
                  </h5>
                  <p>🌡 Temp: {data?.temperature ?? "N/A"} °C</p>
                  <p>💧 Humidity: {data?.humidity ?? "N/A"} %</p>
                  <p>📏 Water Level: {data?.water_level_cm ?? "N/A"} cm</p>
                  <p>
                    🚰 Pump:{" "}
                    <strong
                      className={
                        (data?.Pump ?? data?.pump) === "ON"
                          ? "text-success"
                          : "text-danger"
                      }
                    >
                      {(data?.Pump ?? data?.pump) ?? "N/A"}
                    </strong>
                  </p>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <Button
                      size="sm"
                      style={{ backgroundColor: "#52b788", border: "none" }}
                      onClick={() => togglePump(deviceId, "ON")}
                    >
                      Turn ON
                    </Button>
                    <Button
                      size="sm"
                      style={{ backgroundColor: "#2d6a4f", border: "none" }}
                      onClick={() => togglePump(deviceId, "OFF")}
                    >
                      Turn OFF
                    </Button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 📘 Resources */}
      <section style={{ padding: "60px 0" }}>
        <Container>
          <Row>
            <Col md={6}>
              <div className="resource-panel">
                <h4>Hydroponic Presets</h4>
                <p>
                  Quick settings for Lettuce, Spinach, and Tomato — optimize your
                  farm instantly.
                </p>
                <Button
                  style={{ backgroundColor: "#2d6a4f", border: "none" }}
                  onClick={() => navigate("/hydroponic")}
                >
                  Explore Presets
                </Button>
              </div>
            </Col>
          
          </Row>
        </Container>
      </section>

      {/* 🌍 Footer */}
      
    </div>
  );
}
