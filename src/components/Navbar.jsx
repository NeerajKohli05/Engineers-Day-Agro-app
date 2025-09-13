import React, { useEffect, useState } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { auth } from "../firebase";
import { useNavigate, Link, useLocation } from "react-router-dom";

function NavigationBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  // Track Firebase auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/"); // redirect to login page
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  return (
    <Navbar expand="lg" className="navbar-custom mb-4">
      <Container fluid className="container-custom">
        {/* Brand */}
        <Navbar.Brand as={Link} to="/dashboard" className="fw-bold text-white">
          🌱 Agro Dashboard
        </Navbar.Brand>

        {/* Mobile toggle */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="bg-light" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Nav links */}
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to="/dashboard"
              className={location.pathname === "/dashboard" ? "active" : ""}
            >
              Dashboard
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/hydroponic"
              className={location.pathname === "/hydroponic" ? "active" : ""}
            >
              Hydroponic Farming
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/crops"
              className={location.pathname === "/crops" ? "active" : ""}
            >
              Crop Library
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/devices"
              className={location.pathname === "/devices" ? "active" : ""}
            >
              Devices
            </Nav.Link>
          </Nav>

          {/* Right Side Buttons */}
          {user ? (
            <Button
              style={{ backgroundColor: "#2d6a4f", border: "none", color: "#fff" }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <Button
              style={{ backgroundColor: "#52b788", border: "none", color: "#fff" }}
              onClick={() => navigate("/")}
            >
              Login
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
