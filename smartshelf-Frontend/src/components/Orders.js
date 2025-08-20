import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { useInventory } from "../context/InventoryContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../style.css";

function Orders() {
  const navigate = useNavigate();
  const { stockItems, orders, placeOrder, dispatch } = useInventory();
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [newOrder, setNewOrder] = useState({
    customerName: "",
    items: []
  });
  const ordersPerPage = 5;

  // Status options for dropdown
  const statusOptions = [
    { value: "Pending", label: "🟡 Pending" },
    { value: "Processing", label: "🔵 Processing" },
    { value: "Completed", label: "🟢 Completed" },
    { value: "Cancelled", label: "🔴 Cancelled" }
  ];

  const handleAddToOrder = (item, quantity) => {
    if (quantity <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    const stockItem = stockItems.find(stock => stock.id === item.id);
    if (!stockItem || stockItem.quantity < quantity) {
      toast.error(`Not enough stock for ${item.name} (only ${stockItem ? stockItem.quantity : 0} available)`);
      return;
    }

    setNewOrder(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: item.id,
          name: item.name,
          quantity: quantity,
          price: item.price
        }
      ]
    }));
  };

  const handlePlaceOrder = async () => {
    try {
      if (!newOrder.customerName.trim()) {
        toast.error("Please enter customer name");
        return;
      }

      if (newOrder.items.length === 0) {
        toast.error("Please add items to the order");
        return;
      }

      await placeOrder(newOrder);
      
      // Check for low stock after order placement
      newOrder.items.forEach(item => {
        const stockItem = stockItems.find(s => s.id === item.id);
        if (stockItem && stockItem.quantity <= stockItem.reorderLevel) {
          toast.warning(`⚠️ ${item.name} stock is running low (${stockItem.quantity} left)!`);
        }
      });
      
      toast.success("Order placed successfully");
      setNewOrder({ customerName: "", items: [] });
      
    } catch (error) {
      toast.error(error.message);
    }
  };
  // Toast is handled by react-toastify now

  // Sort function
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredOrders = sortedOrders.filter(
    (order) =>
      order.product?.toLowerCase().includes(search.toLowerCase()) ||
      order.customer?.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle status update
  const handleStatusUpdate = (orderId, newStatus) => {
    dispatch({
      type: 'UPDATE_ORDER_STATUS',
      payload: { orderId, status: newStatus }
    });
    toast.success(`Order #${orderId} updated to ${newStatus}`);
  };

  // Export to CSV
  const exportCSV = () => {
    // CSV Header
    const header = ['Order ID,Customer,Product,Amount,Date,Status\n'];
    
    // Convert orders to CSV format
    const csvData = orders.map(order => 
      `${order.id},${order.customer},${order.product},${order.amount},${order.date},${order.status}`
    ).join('\n');

    // Combine header and data
    const csvString = header + csvData;
    
    // Create blob and download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `orders_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Export to PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Orders Report', 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);

    // Prepare the data
    const headers = [['ID', 'Customer', 'Product', 'Amount', 'Date', 'Status']];
    const data = orders.map(order => [
      order.id,
      order.customer,
      order.product,
      `$${order.amount}`,
      order.date,
      order.status
    ]);

    // Generate the table
    autoTable(doc, {
      startY: 40,
      head: headers,
      body: data,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [71, 85, 105] },
      margin: { top: 40 }
    });

    // Save the PDF
    doc.save(`orders_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Enhanced status badge function with hover effects and transitions
  const getStatusBadge = (status) => {
    let baseClasses =
      "px-4 py-2 text-sm font-medium rounded-full inline-flex items-center gap-2 transition-all duration-300 ease-in-out cursor-default border backdrop-blur-sm";

    const statusConfig = {
      "Completed": {
        bg: "bg-green-50/80 hover:bg-green-100/90",
        text: "text-green-700",
        border: "border-green-200",
        icon: "✅",
        hover: "hover:scale-102 hover:shadow-lg hover:shadow-green-100",
        glow: "after:content-[''] after:absolute after:inset-0 after:rounded-full after:bg-green-400/20 after:animate-pulse after:filter after:blur-sm"
      },
      "Pending": {
        bg: "bg-amber-50/80 hover:bg-amber-100/90",
        text: "text-amber-600",
        border: "border-amber-200",
        icon: "⏳",
        hover: "hover:scale-102 hover:shadow-lg hover:shadow-amber-100",
        glow: "after:content-[''] after:absolute after:inset-0 after:rounded-full after:bg-amber-400/20 after:animate-pulse after:filter after:blur-sm"
      },
      "Processing": {
        bg: "bg-blue-50/80 hover:bg-blue-100/90",
        text: "text-blue-600",
        border: "border-blue-200",
        icon: "⚡",
        hover: "hover:scale-102 hover:shadow-lg hover:shadow-blue-100",
        glow: "after:content-[''] after:absolute after:inset-0 after:rounded-full after:bg-blue-400/20 after:animate-pulse after:filter after:blur-sm"
      },
      "Cancelled": {
        bg: "bg-red-50/80 hover:bg-red-100/90",
        text: "text-red-600",
        border: "border-red-200",
        icon: "❌",
        hover: "hover:scale-102 hover:shadow-lg hover:shadow-red-100"
      },
      "On Hold": {
        bg: "bg-purple-50/80 hover:bg-purple-100/90",
        text: "text-purple-600",
        border: "border-purple-200",
        icon: "⏸️",
        hover: "hover:scale-102 hover:shadow-lg hover:shadow-purple-100"
      },
      "Shipped": {
        bg: "bg-indigo-50/80 hover:bg-indigo-100/90",
        text: "text-indigo-600",
        border: "border-indigo-200",
        icon: "🚚",
        hover: "hover:scale-102 hover:shadow-lg hover:shadow-indigo-100",
        glow: "after:content-[''] after:absolute after:inset-0 after:rounded-full after:bg-indigo-400/20 after:animate-pulse after:filter after:blur-sm"
      },
      "In Transit": {
        bg: "bg-teal-50/80 hover:bg-teal-100/90",
        text: "text-teal-600",
        border: "border-teal-200",
        icon: "🔄",
        hover: "hover:scale-102 hover:shadow-lg hover:shadow-teal-100",
        glow: "after:content-[''] after:absolute after:inset-0 after:rounded-full after:bg-teal-400/20 after:animate-pulse after:filter after:blur-sm"
      },
      "Out for Delivery": {
        bg: "bg-emerald-50/80 hover:bg-emerald-100/90",
        text: "text-emerald-600",
        border: "border-emerald-200",
        icon: "�",
        hover: "hover:scale-102 hover:shadow-lg hover:shadow-emerald-100",
        glow: "after:content-[''] after:absolute after:inset-0 after:rounded-full after:bg-emerald-400/20 after:animate-pulse after:filter after:blur-sm"
      }
    };

    const config = statusConfig[status] || {
      bg: "bg-gray-50/80 hover:bg-gray-100/90",
      text: "text-gray-600",
      border: "border-gray-200",
      icon: "❔",
      hover: "hover:scale-102 hover:shadow-lg hover:shadow-gray-100"
    };

    return (
      <span 
        className={`relative ${baseClasses} ${config.bg} ${config.text} ${config.border} ${config.hover} ${config.glow || ''}`}
        title={`Order Status: ${status}`}
      >
        <span className="relative z-10 text-base filter drop-shadow-sm">{config.icon}</span>
        <span className="relative z-10 tracking-wide">{status}</span>
      </span>
    );
  };

  return (
    <div>
      <div className="header-container">
        <h1>Orders</h1>
        
        <div className="controls-container">
          <div className="new-order-section">
            <input
              type="text"
              placeholder="Customer Name"
              value={newOrder.customerName}
              onChange={(e) => setNewOrder(prev => ({ ...prev, customerName: e.target.value }))}
              className="customer-input"
            />
            <div className="stock-items-grid">
              {stockItems.map(item => (
                <div key={item.id} className="stock-item-card">
                  <h3>{item.name}</h3>
                  <p>Price: ${item.price}</p>
                  <p>Available: {item.quantity}</p>
                  <input
                    type="number"
                    min="1"
                    max={item.quantity}
                    placeholder="Qty"
                    onChange={(e) => handleAddToOrder(item, parseInt(e.target.value))}
                    className="quantity-input"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={handlePlaceOrder}
              className="place-order-btn"
              disabled={!newOrder.customerName || newOrder.items.length === 0}
            >
              Place Order
            </button>
          </div>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          
          {/* Export Buttons */}
          <div className="export-buttons">
            <button
              onClick={exportCSV}
              disabled={orders.length === 0}
              className="export-button export-csv"
              title="Export as CSV"
            >
              📊 Export CSV
            </button>
            <button
              onClick={exportPDF}
              disabled={orders.length === 0}
              className="export-button export-pdf"
              title="Export as PDF"
            >
              📄 Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <table>
        <thead>
          <tr>
            <th onClick={() => requestSort('id')} className="table-header">
              ID↕
            </th>
            <th onClick={() => requestSort('customer')} className="table-header">
              Customer↕
            </th>
            <th onClick={() => requestSort('total')} className="table-header">
              Total↕
            </th>
            <th onClick={() => requestSort('date')} className="table-header">
              Date↕
            </th>
            <th onClick={() => requestSort('status')} className="table-header">
              Status↕
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customerName}</td>
              <td>${order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)}</td>
              <td>{new Date(order.date).toLocaleDateString()}</td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                  className={`status-select status-${order.status.toLowerCase()}`}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="view-details-btn"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Simple Pagination */}
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span>{currentPage}</span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
      <div className="results-info">
        Showing {indexOfFirstOrder + 1} - {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} results
      </div>
    </div>
  );
}

export default Orders;


//