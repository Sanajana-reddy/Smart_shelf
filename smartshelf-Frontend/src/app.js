import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import ProductForm from "./Components/ProductForm";
import ProductList from "./Components/ProductList";
import Products from "./Components/Products";
import Navbar from "./Components/Navbar"; // ✅ import navbar

function App() {
  return (
    <Router>
      <Navbar /> {/* ✅ show navbar on all pages */}
      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/add" element={<ProductForm />} />
          <Route path="/products/list" element={<ProductList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
