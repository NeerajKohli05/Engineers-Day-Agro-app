// src/Devices/DeviceControl.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue, set } from "firebase/database";
import "./DeviceControl.css";

export default function DeviceControl({ deviceId }) {
  const [controls, setControls] = useState({});

  useEffect(() => {
    if (!deviceId) return;

    const controlsRef = ref(db, `devices/${deviceId}`);
    const unsubscribe = onValue(controlsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        // We assume "Pump" and possibly more controls
        setControls({
          Pump: data.Pump ?? "OFF",
        });
      } else {
        setControls({});
      }
    });

    return () => unsubscribe();
  }, [deviceId]);

  const toggleControl = (controlName, value) => {
    set(ref(db, `devices/${deviceId}/${controlName}`), value).catch((err) =>
      console.error("Failed to update control:", err)
    );
  };

  if (!controls || Object.keys(controls).length === 0)
    return <div>No controls available.</div>;

  return (
    <div className="device-grid">
      {Object.entries(controls).map(([name, value]) => (
        <div
          key={name}
          className={`device-card ${value === "ON" ? "on" : "off"} ${
            name.toLowerCase()
          }`}
        >
          <div className="device-icon">⚙️</div>
          <div className="device-name">{name}</div>
          <div className="device-status">
            {value === "ON" ? "Active" : "Inactive"}
          </div>
          <button
            onClick={() => toggleControl(name, value === "ON" ? "OFF" : "ON")}
            className="btn-accent mt-2"
          >
            {value === "ON" ? "Turn OFF" : "Turn ON"}
          </button>
        </div>
      ))}
    </div>
  );
}
