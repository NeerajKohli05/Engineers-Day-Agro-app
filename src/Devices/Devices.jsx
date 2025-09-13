import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
import DeviceControl from "./DeviceControl";

export default function Devices() {
  const [devices, setDevices] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const devicesRef = ref(db, "devices");
    const unsubscribe = onValue(
      devicesRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setDevices(snapshot.val());
        } else {
          setDevices({});
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

  if (loading) return <div>Loading devices...</div>;
  if (Object.keys(devices).length === 0) return <div>No devices found.</div>;

  return (
    <div className="container-custom p-4">
      <h2 className="mb-4">All Devices</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {Object.entries(devices).map(([deviceId]) => (
          <div className="card-custom p-3" key={deviceId}>
            <h5 className="mb-3">Device: {deviceId}</h5>
            <DeviceControl deviceId={deviceId} />
          </div>
        ))}
      </div>
    </div>
  );
}
