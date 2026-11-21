import React from "react";
import "./Hydroponic.css";

export default function HydroponicFarming() {
  const systems = [
    {
      name: "NFT (Nutrient Film Technique)",
      tag: "Recirculating",
      desc: "A continuous, shallow stream of nutrient solution flows over root tips inside sloping gullies. Ideal for fast-growing greens."
    },
    {
      name: "DWC (Deep Water Culture)",
      tag: "Submerged",
      desc: "Plant roots hang directly suspended in an oxygenated, highly buffered nutrient reservoir. High stability and ease of operation."
    },
    {
      name: "Aeroponics",
      tag: "Atomized Mist",
      desc: "Roots are suspended in air and misted intermittently with fine nutrient droplets. Provides maximum root aeration and rapid growth."
    },
    {
      name: "Vertical Farming",
      tag: "Stacked Tier",
      desc: "Multi-layer vertical towers maximize cultivation density per square meter under controlled artificial LED spectrums."
    }
  ];

  const parameters = [
    { name: "pH Level", target: "5.5 – 6.5", why: "Ensures optimal nutrient ionization and uptake" },
    { name: "Electrical Conductivity (EC)", target: "1.2 – 2.4 mS/cm", why: "Measures dissolved fertilizer salt concentration" },
    { name: "Water Temperature", target: "18 – 22 °C", why: "Maintains dissolved oxygen saturation; prevents Pythium root rot" },
    { name: "Ambient Humidity", target: "55 – 65 %", why: "Balances transpiration rate and calcium absorption" },
    { name: "Photoperiod", target: "14 – 16 hrs / day", why: "Drives vegetative photosynthetic accumulation" }
  ];

  return (
    <div className="hydro-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Hydroponics</h1>
          <p className="page-subtitle">Soilless cultivation architectures and target parameter matrices</p>
        </div>
      </div>

      {/* Systems Grid */}
      <section>
        <h3 className="section-title">Core Systems</h3>
        <div className="systems-grid">
          {systems.map((sys, idx) => (
            <div key={idx} className="system-card">
              <span className="system-tag">{sys.tag}</span>
              <h4 className="system-name">{sys.name}</h4>
              <p className="system-desc">{sys.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Parameter Table */}
      <section className="mt-4">
        <h3 className="section-title">Target Operational Parameters</h3>
        <div className="table-wrapper">
          <table className="param-table">
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Recommended Range</th>
                <th>Agronomic Function</th>
              </tr>
            </thead>
            <tbody>
              {parameters.map((p, idx) => (
                <tr key={idx}>
                  <td className="param-name">{p.name}</td>
                  <td className="param-target">{p.target}</td>
                  <td className="param-why">{p.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Nutrient Ratios */}
      <section className="mt-4">
        <h3 className="section-title">Nutrient Guidelines</h3>
        <div className="nutrients-grid">
          <div className="nutrient-card">
            <h5 className="nutrient-heading">Macronutrients (Primary)</h5>
            <ul className="nutrient-list">
              <li><strong>Nitrogen (N):</strong> Vegetative tissue and chlorophyll synthesis.</li>
              <li><strong>Phosphorus (P):</strong> Root elongation, ATP energy transfer, and bloom.</li>
              <li><strong>Potassium (K):</strong> Stomatal regulation and osmotic pressure balance.</li>
            </ul>
          </div>
          <div className="nutrient-card">
            <h5 className="nutrient-heading">Secondary & Micronutrients</h5>
            <ul className="nutrient-list">
              <li><strong>Calcium (Ca) & Magnesium (Mg):</strong> Cell wall stability and chlorophyll core.</li>
              <li><strong>Iron (Fe) & Zinc (Zn):</strong> Cheated enzymes preventing leaf interveinal chlorosis.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
