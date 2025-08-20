import React from "react";
import { Link } from "react-router-dom";
import { useInventory } from "../context/InventoryContext";

function ProductList() {
  const { stockItems: products, dispatch } = useInventory();
  
  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_STOCK_ITEM', payload: { id } });
  };
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Product List</h2>
      {products.length === 0 ? (
        <p>No products available. Add some!</p>
      ) : (
        <table className="table-auto border-collapse border border-gray-400 w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-400 px-4 py-2">Name</th>
              <th className="border border-gray-400 px-4 py-2">Price</th>
              <th className="border border-gray-400 px-4 py-2">Quantity</th>
              <th className="border border-gray-400 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="border border-gray-400 px-4 py-2">{product.name}</td>
                <td className="border border-gray-400 px-4 py-2">{product.price}</td>
                <td className="border border-gray-400 px-4 py-2">{product.quantity}</td>
                <td className="border border-gray-400 px-4 py-2 space-x-2">
                  {/* Edit -> Pass product to ProductForm */}
                  <Link
                    to="/add-product"
                    state={{ product }}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="mt-4">
        <Link
          to="/add-product"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
        >
          Add New Product
        </Link>
      </div>
    </div>
  );
}

export default ProductList;
