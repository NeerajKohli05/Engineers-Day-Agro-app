// src/components/HydroponicFarming.jsx
import React from "react";
import { Container, Row, Col, Card, Button, Table } from "react-bootstrap";

export default function HydroponicFarming() {
  const systems = [
    {
      name: "NFT (Nutrient Film Technique)",
      img: "https://newagriindia.com/wp-content/uploads/2024/11/The-Ultimate-Guide-to-Nutrient-Film-Technique-Hydroponics.png",
      desc: "A thin film of nutrient-rich water flows over plant roots in channels.",
      link: "https://hydroplanner.com/blog/hydroponic-nutrient-film-technique-nft"
    },
    {
      name: "DWC (Deep Water Culture)",
      img: "https://5.imimg.com/data5/SELLER/Default/2024/10/457435196/BG/QX/OK/67194700/deep-water-culture-hydroponics.jpg",
      desc: "Plants float on nutrient water with roots submerged for constant feeding.",
      link: "https://www.trees.com/gardening-and-landscaping/deep-water-culture"
    },
    {
      name: "Vertical Farming",
      img: "https://images.squarespace-cdn.com/content/v1/63064607eb816a4d50027fd1/bd985f3a-432e-4830-896f-4412eb797256/lettuce+vines.jpg?format=2500w",
      desc: "Maximize space with stacked layers of crops under controlled lighting.",
      link: "https://www.edengreen.com/blog-collection/what-is-vertical-farming"
    },
    {
      name: "Aeroponics",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPub8Xlne77YJs5eQalbgjR4vPFg4MiVnWig&s",
      desc: "Roots are suspended in air and misted with nutrient solutions.",
      link: "https://www.lettusgrow.com/aeroponic-technology"
    }
  ];

  return (
    <div>
      {/* HERO SECTION */}
      <section
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://risehydroponics.in/wp-content/uploads/2021/11/hydroponics-farm-india-1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "80px 5%",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <h1>💧 Hydroponic Farming</h1>
        <p>
          Grow more food with less water. Learn hydroponic systems, key parameters,
          and nutrient management for successful farming.
        </p>
      </section>

      <Container fluid className="p-5">
        {/* SYSTEM TYPES */}
        <h2 className="mb-4 text-center">Popular Hydroponic Systems</h2>
        <Row>
          {systems.map((sys, i) => (
            <Col md={3} sm={6} key={i} className="mb-4">
              <a
                href={sys.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Card className="h-100 shadow-sm hover-shadow">
                  <Card.Img
                    variant="top"
                    src={sys.img}
                    alt={sys.name}
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title>{sys.name}</Card.Title>
                    <Card.Text>{sys.desc}</Card.Text>
                  </Card.Body>
                </Card>
              </a>
            </Col>
          ))}
        </Row>

        {/* KEY PARAMETERS */}
        <h2 className="mt-5 mb-3 text-center">🌱 Key Parameters to Monitor</h2>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Recommended Range</th>
              <th>Why It Matters</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>pH</td>
              <td>5.5 – 6.5</td>
              <td>Affects nutrient absorption</td>
            </tr>
            <tr>
              <td>EC (Nutrient Strength)</td>
              <td>1.2 – 2.4 mS/cm</td>
              <td>Shows fertilizer concentration</td>
            </tr>
            <tr>
              <td>Water Temperature</td>
              <td>18 – 24 °C</td>
              <td>Prevents root stress</td>
            </tr>
            <tr>
              <td>Air Humidity</td>
              <td>50 – 70%</td>
              <td>Controls plant transpiration</td>
            </tr>
            <tr>
              <td>Light Duration</td>
              <td>12 – 16 hrs/day</td>
              <td>Ensures photosynthesis</td>
            </tr>
          </tbody>
        </Table>

        {/* NUTRIENT GUIDE */}
        <h2 className="mt-5 mb-3 text-center">🥦 Essential Nutrient Guide</h2>
        <Row>
          <Col md={6} className="mb-3">
            <Card className="p-3 h-100 shadow-sm">
              <h5>Macronutrients (Major)</h5>
              <ul>
                <li>Nitrogen (N) – Leafy growth</li>
                <li>Phosphorus (P) – Root & flower development</li>
                <li>Potassium (K) – Strength & fruiting</li>
              </ul>
            </Card>
          </Col>
          <Col md={6} className="mb-3">
            <Card className="p-3 h-100 shadow-sm">
              <h5>Micronutrients (Trace)</h5>
              <ul>
                <li>Calcium (Ca) – Strong cell walls</li>
                <li>Magnesium (Mg) – Key for photosynthesis</li>
                <li>Iron (Fe), Zinc (Zn), Copper (Cu) – Enzyme activity</li>
              </ul>
            </Card>
          </Col>
        </Row>

        {/* AUTOMATION & MONITORING */}
        <h2 className="mt-5 mb-3 text-center">⚡ Automation & Monitoring</h2>
        <Row>
          <Col md={4} className="mb-3">
            <Card className="p-3 h-100 shadow-sm text-center">
              <h5>📊 Sensors</h5>
              <p>Monitor pH, EC, temperature, and humidity live.</p>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="p-3 h-100 shadow-sm text-center">
              <h5>🤖 Automated Control</h5>
              <p>Automate pumps, lights, and nutrient dosing.</p>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="p-3 h-100 shadow-sm text-center">
              <h5>📱 Dashboard</h5>
              <p>Track data & manage remotely from your app.</p>
            </Card>
          </Col>
        </Row>

        {/* CALL TO ACTION */}
        <div className="text-center mt-5">
          <h3>🚀 Ready to Start Hydroponics?</h3>
          <p>
            Access crop presets, smart devices, and learning resources to grow
            better, faster, and smarter.
          </p>
          <Button variant="success">Go to Dashboard</Button>
        </div>
      </Container>
    </div>
  );
}
