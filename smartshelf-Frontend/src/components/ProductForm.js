import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useInventory } from "../context/InventoryContext";
import { toast } from 'react-toastify';

function ProductForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const editingProduct = location.state?.product || null;
  const { dispatch } = useInventory();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reorderLevel, setReorderLevel] = useState("");

  // Prefill form if editing
  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setPrice(editingProduct.price);
      setQuantity(editingProduct.quantity);
    }
  }, [editingProduct]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const productData = {
      id: editingProduct ? editingProduct.id : Date.now(),
      name,
      price: Number(price),
      quantity: Number(quantity),
      reorderLevel: Number(reorderLevel),
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      if (editingProduct) {
        dispatch({ type: 'UPDATE_STOCK_ITEM', payload: productData });
        toast.success('Product updated successfully!');
      } else {
        dispatch({ type: 'ADD_STOCK_ITEM', payload: productData });
        toast.success('Product added successfully!');
      }
      navigate("/products");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {editingProduct ? "Edit Product" : "Add New Product"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium text-gray-700 mb-2">Product Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter product name"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-2">Price:</label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">$</span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0"
              step="0.01"
              className="w-full pl-8 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
            />
          </div>
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-2">Initial Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            min="0"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter quantity"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-2">Reorder Level:</label>
          <input
            type="number"
            value={reorderLevel}
            onChange={(e) => setReorderLevel(e.target.value)}
            required
            min="0"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter reorder level"
          />
          <p className="mt-1 text-sm text-gray-500">
            The quantity at which you'll be notified to reorder this product
          </p>
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {editingProduct ? "Update Product" : "Add Product"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
