import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue, set } from "firebase/database";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";

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

  if (loading) return <div className="text-center p-4">Loading sensors...</div>;
  if (!sensors) return <div className="text-center p-4">No sensor data found.</div>;

  return (
    <Container className="py-5">
      <h2 className="text-center mb-5">🌿 Sensors & Pump Control</h2>

      <Row className="g-4">
        {/* 🌡 Environment Card */}
        <Col md={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <Card.Title className="mb-4">🌍 Environment Data</Card.Title>
              <p>
                🌡 Temperature:{" "}
                <Badge bg="info" pill>
                  {sensors.temperature ?? "N/A"} °C
                </Badge>
              </p>
              <p>
                🌱 Soil Moisture:{" "}
                <Badge bg="success" pill>
                  {sensors.soilMoisture ?? "N/A"} %
                </Badge>
              </p>
              <p>
                📏 Tank Level:{" "}
                <Badge bg="primary" pill>
                  {sensors.tankLevel?.toFixed(1) ?? "N/A"} L
                </Badge>
              </p>

              {/* Mode */}
              <p className="mt-4">
                ⚙ Mode:{" "}
                <Badge bg={sensors.manual ? "success" : "warning"} pill>
                  {sensors.manual ? "Manual" : "Automatic"}
                </Badge>
              </p>
              <div className="d-flex gap-2 mt-2">
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => set(ref(db, "sensors/manual"), true)}
                >
                  Manual
                </Button>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => set(ref(db, "sensors/manual"), false)}
                >
                  Automatic
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* 🚰 Pump Control */}
        <Col md={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <Card.Title className="mb-4">🚰 Pump Control</Card.Title>

              {/* Pump1 */}
              <p>
                Pump1 (Rainwater):{" "}
                <Badge bg={sensors.pump1 ? "success" : "danger"} pill>
                  {sensors.pump1 ? "ON" : "OFF"}
                </Badge>
              </p>
              <div className="d-flex gap-2 mb-3">
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => set(ref(db, "sensors/pump1"), true)}
                  disabled={!sensors.manual}
                >
                  Turn ON
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => set(ref(db, "sensors/pump1"), false)}
                  disabled={!sensors.manual}
                >
                  Turn OFF
                </Button>
              </div>

              {/* Pump2 */}
              <p>
                Pump2 (Groundwater):{" "}
                <Badge bg={sensors.pump2 ? "success" : "danger"} pill>
                  {sensors.pump2 ? "ON" : "OFF"}
                </Badge>
              </p>
              <div className="d-flex gap-2">
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => set(ref(db, "sensors/pump2"), true)}
                  disabled={!sensors.manual}
                >
                  Turn ON
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => set(ref(db, "sensors/pump2"), false)}
                  disabled={!sensors.manual}
                >
                  Turn OFF
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
