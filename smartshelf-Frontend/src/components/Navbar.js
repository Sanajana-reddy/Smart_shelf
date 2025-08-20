import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{
      background: "#333",
      color: "#fff",
      padding: "10px 20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <h2>SmartShelf</h2>
      <div style={{ display: "flex", gap: "15px" }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>Dashboard</Link>
        <Link to="/products" style={{ color: "#fff", textDecoration: "none" }}>Products</Link>
        <Link to="/stock" style={{ color: "#fff", textDecoration: "none" }}>Stock</Link>
      </div>
    </nav>
  );
}

export default Navbar;
