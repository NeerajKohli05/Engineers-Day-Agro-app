import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue, set } from "firebase/database";
import { Container, Row, Col, Card, Button, Badge, ProgressBar } from "react-bootstrap";
import "./DeviceControl.css";

export default function Devices() {
  const [sensors, setSensors] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sensorsRef = ref(db, "sensors");
    const unsubscribe = onValue(
      sensorsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setSensors(snapshot.val());
        } else {
          setSensors(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Realtime DB error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-success" role="status"></div>
        <p className="mt-3 text-muted">Reading connected IoT devices...</p>
      </Container>
    );
  }

  const temp = sensors?.temperature ?? "22.5";
  const soil = sensors?.soilMoisture ?? 28;
  const tank = sensors?.tankLevel ?? 0;
  const manual = Boolean(sensors?.manual);
  const pump1 = Boolean(sensors?.pump1);
  const pump2 = Boolean(sensors?.pump2);

  return (
    <Container className="py-4">
      {/* Top Header */}
      <div className="mb-4">
        <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill fw-bold">
          HARDWARE DEVICE INTERFACE
        </span>
        <h2 className="fw-bold mt-2 text-dark">🚜 Connected Devices & Relay Actuators</h2>
        <p className="text-muted">
          Direct hardware status, pin mappings, and manual control overrides for ESP32 relays.
        </p>
      </div>

      <Row className="g-4">
        {/* Environment Telemetry */}
        <Col lg={6}>
          <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden">
            <Card.Header className="bg-light border-0 py-3 px-4">
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold text-dark">🌍 Telemetry Sensors (ESP32)</span>
                <Badge bg="success" pill>Streaming Active</Badge>
              </div>
            </Card.Header>
            <Card.Body className="p-4">
              {/* Temp */}
              <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                <div>
                  <div className="fw-bold text-dark">🌡 Ambient Temperature</div>
                  <small className="text-muted">DHT11 Sensor • GPIO 4</small>
                </div>
                <h4 className="fw-bold text-warning mb-0">{temp} °C</h4>
              </div>

              {/* Soil */}
              <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                <div>
                  <div className="fw-bold text-dark">🌱 Root-Zone Soil Moisture</div>
                  <small className="text-muted">Capacitive Probe • ADC1 Pin 34</small>
                </div>
                <h4 className="fw-bold text-success mb-0">{soil} %</h4>
              </div>

              {/* Tank */}
              <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                <div>
                  <div className="fw-bold text-dark">📏 Rainwater Reservoir Depth</div>
                  <small className="text-muted">HC-SR04 Ultrasonic • TRIG: 12, ECHO: 14</small>
                </div>
                <h4 className="fw-bold text-primary mb-0">{tank} cm</h4>
              </div>

              {/* Mode Control */}
              <div className="p-3 bg-light rounded-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-bold text-dark">Operating State</span>
                  <Badge bg={manual ? "danger" : "success"} pill className="px-3 py-2">
                    {manual ? "Manual Web Override" : "Autonomous Mode"}
                  </Badge>
                </div>
                <p className="text-muted small mb-3">
                  {manual
                    ? "Local edge automation is paused. You can manually toggle relays below."
                    : "ESP32 micro-controller manages pump triggers based on real-time soil and tank level."}
                </p>
                <div className="d-flex gap-2">
                  <Button
                    variant={!manual ? "success" : "outline-success"}
                    size="sm"
                    className="w-50 fw-bold py-2 rounded-3"
                    onClick={() => set(ref(db, "sensors/manual"), false)}
                  >
                    🤖 Set Automatic
                  </Button>
                  <Button
                    variant={manual ? "danger" : "outline-danger"}
                    size="sm"
                    className="w-50 fw-bold py-2 rounded-3"
                    onClick={() => set(ref(db, "sensors/manual"), true)}
                  >
                    🌿 Set Manual
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Pump Relays */}
        <Col lg={6}>
          <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden">
            <Card.Header className="bg-light border-0 py-3 px-4">
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold text-dark">⚡ Dual-Pump Relay Channels</span>
                <Badge bg="primary" pill>5V Optocoupler</Badge>
              </div>
            </Card.Header>
            <Card.Body className="p-4 d-flex flex-column gap-3">
              {/* Pump 1 */}
              <div className={`p-4 rounded-4 border transition-all ${pump1 ? "border-success bg-success-subtle" : "border-light bg-light"}`}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <h5 className="fw-bold mb-1">🚰 Pump 1 — Rainwater Harvesting</h5>
                    <small className="text-muted">Relay Pin: GPIO 26 • Primary Priority</small>
                  </div>
                  <Badge bg={pump1 ? "success" : "secondary"} className="px-3 py-2 fw-bold">
                    {pump1 ? "ACTIVE (ON)" : "STANDBY (OFF)"}
                  </Badge>
                </div>
                <div className="d-flex gap-2 mt-3">
                  <Button
                    variant="success"
                    size="sm"
                    className="w-50 fw-bold py-2 rounded-3"
                    onClick={() => set(ref(db, "sensors/pump1"), true)}
                    disabled={!manual}
                  >
                    Turn ON
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="w-50 fw-bold py-2 rounded-3"
                    onClick={() => set(ref(db, "sensors/pump1"), false)}
                    disabled={!manual}
                  >
                    Turn OFF
                  </Button>
                </div>
              </div>

              {/* Pump 2 */}
              <div className={`p-4 rounded-4 border transition-all ${pump2 ? "border-primary bg-primary-subtle" : "border-light bg-light"}`}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <h5 className="fw-bold mb-1">💧 Pump 2 — Groundwater / Well</h5>
                    <small className="text-muted">Relay Pin: GPIO 27 • Backup Priority</small>
                  </div>
                  <Badge bg={pump2 ? "primary" : "secondary"} className="px-3 py-2 fw-bold">
                    {pump2 ? "ACTIVE (ON)" : "STANDBY (OFF)"}
                  </Badge>
                </div>
                <div className="d-flex gap-2 mt-3">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-50 fw-bold py-2 rounded-3"
                    onClick={() => set(ref(db, "sensors/pump2"), true)}
                    disabled={!manual}
                  >
                    Turn ON
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="w-50 fw-bold py-2 rounded-3"
                    onClick={() => set(ref(db, "sensors/pump2"), false)}
                    disabled={!manual}
                  >
                    Turn OFF
                  </Button>
                </div>
              </div>

              {!manual && (
                <div className="text-center text-muted small mt-2">
                  🔒 Relays are currently managed automatically by edge sensor thresholds. Switch to <strong>Manual Mode</strong> to enable buttons.
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
