// src/components/CropLibrary.jsx
import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

function CropLibrary() {
  const [search, setSearch] = useState("");
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCrops = async () => {
    if (!search.trim()) return;
    setLoading(true);
    setError("");

    try {
      const apiKey = import.meta.env.VITE_PERENUAL_KEY;
      const res = await fetch(
        `https://perenual.com/api/species-list?key=${apiKey}&q=${encodeURIComponent(
          search.trim()
        )}`
      );
      const data = await res.json();

      if (data && data.data) {
        setCrops(data.data);
      } else {
        setCrops([]);
        setError("No crops found.");
      }

      console.log("API Response:", data);
    } catch (err) {
      console.error("Error fetching crops:", err);
      setError("Failed to fetch crops. Please try again.");
      setCrops([]);
    }

    setLoading(false);
  };

  return (
    <Container fluid className="p-4">
      <h2 className="mb-4">🌿 Crop Library</h2>

      {/* Search Bar */}
      <Form
        className="d-flex mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          fetchCrops();
        }}
      >
        <Form.Control
          type="text"
          placeholder="Search a crop (e.g. Tomato, Lettuce)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="success" className="ms-2" onClick={fetchCrops}>
          Search
        </Button>
      </Form>

      {loading && <p>Loading crops...</p>}
      {error && <p className="text-danger">{error}</p>}

      {/* Results */}
      <Row>
        {crops.map((crop) => (
          <Col md={4} sm={6} className="mb-3" key={crop.id}>
            <Card className="h-100 shadow-sm">
              {crop.default_image?.original_url && (
                <Card.Img
                  variant="top"
                  src={crop.default_image.original_url}
                  alt={crop.common_name}
                  style={{ height: "180px", objectFit: "cover" }}
                />
              )}
              <Card.Body>
                <Card.Title>{crop.common_name || "Unknown"}</Card.Title>
                <Card.Text>
                  🌱 Scientific: {crop.scientific_name?.join(", ") || "N/A"}
                </Card.Text>
                <small>Family: {crop.family || "Unknown"}</small>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default CropLibrary;
