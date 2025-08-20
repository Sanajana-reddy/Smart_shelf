import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - In a real app, you'd fetch this from an API
  const order = {
    id: 1,
    product: "Pizza",
    customer: "Sanjana",
    status: "Completed",
    date: "2025-08-19",
    price: "$12.99",
    quantity: 1,
    deliveryAddress: "123 Main St, City",
    paymentMethod: "Credit Card",
    notes: "Extra cheese"
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Order Details</h2>
        <button 
          onClick={() => navigate('/orders')}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          Back to Orders
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 flex justify-between items-center pb-4 border-b">
            <h3 className="text-xl font-semibold">Order #{id}</h3>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              {order.status}
            </span>
          </div>

          <div className="detail-group">
            <label className="font-medium text-gray-600">Customer</label>
            <p>{order.customer}</p>
          </div>

          <div className="detail-group">
            <label className="font-medium text-gray-600">Date</label>
            <p>{order.date}</p>
          </div>

          <div className="detail-group">
            <label className="font-medium text-gray-600">Product</label>
            <p>{order.product}</p>
          </div>

          <div className="detail-group">
            <label className="font-medium text-gray-600">Price</label>
            <p>{order.price}</p>
          </div>

          <div className="detail-group">
            <label className="font-medium text-gray-600">Quantity</label>
            <p>{order.quantity}</p>
          </div>

          <div className="detail-group">
            <label className="font-medium text-gray-600">Payment Method</label>
            <p>{order.paymentMethod}</p>
          </div>

          <div className="col-span-2">
            <label className="font-medium text-gray-600">Delivery Address</label>
            <p>{order.deliveryAddress}</p>
          </div>

          {order.notes && (
            <div className="col-span-2">
              <label className="font-medium text-gray-600">Notes</label>
              <p className="text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t flex justify-end gap-4">
          <button 
            onClick={() => navigate('/orders')}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={() => window.print()}
          >
            Print Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
