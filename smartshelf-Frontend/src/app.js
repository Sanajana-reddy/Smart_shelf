import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { InventoryProvider } from "./context/InventoryContext";
import Dashboard from "./Components/Dashboard";
import ProductList from "./Components/ProductList";
import ProductForm from "./Components/ProductForm";
import Orders from "./Components/Orders";
import OrderDetails from "./Components/OrderDetails";
import Reports from "./Components/Reports";
import Sales from "./Components/Sales";
import Stock from "./Components/Stock";
import Navbar from "./Components/Navbar";

function App() {
  return (
    <InventoryProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/add-product" element={<ProductForm />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/sales" element={<Sales />} />
        </Routes>
      </Router>
    </InventoryProvider>
  );
}

export default App;
