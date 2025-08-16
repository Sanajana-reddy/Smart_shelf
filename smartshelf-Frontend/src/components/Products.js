import React from "react";
import { Link } from "react-router-dom";

function Products() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Products</h1>
      <p>Manage your products here.</p>

      <div style={{ marginTop: "20px" }}>
        <Link to="/products/add" style={{ marginRight: "10px" }}>
          Add Product
        </Link>
        <Link to="/products/list">
          View Product List
        </Link>
      </div>
    </div>
  );
}

export default Products;
