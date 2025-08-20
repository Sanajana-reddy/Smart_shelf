import React, { useState, useEffect } from 'react';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import StockModal from './StockModal';
import BulkUpdateModal from './BulkUpdateModal';
import ExpiryTrackingModal from './ExpiryTrackingModal';
import StockImportModal from './StockImportModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useInventory } from '../context/InventoryContext';

function Stock() {
  // States and Context
  const { stockItems, dispatch } = useInventory();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState("all"); // all, low, out
  const [expiryFilter, setExpiryFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showExpiryModal, setShowExpiryModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Helper function to get stock status
  const getStockStatus = (item) => {
    if (item.quantity === 0) return 'out-of-stock';
    if (item.quantity <= item.reorderLevel) return 'low-stock';
    return 'normal';
  };

  // Helper function to check expiry status
  const getExpiryStatus = (item) => {
    if (!item.batches || item.batches.length === 0) return 'no-expiry';

    const today = new Date();
    const nearestExpiry = item.batches.reduce((nearest, batch) => {
      if (!nearest || new Date(batch.expiryDate) < new Date(nearest)) {
        return batch.expiryDate;
      }
      return nearest;
    }, null);

    if (!nearestExpiry) return 'no-expiry';

    const expiryDate = new Date(nearestExpiry);
    const daysUntilExpiry = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 7) return 'expiring-soon';
    if (daysUntilExpiry <= 30) return 'expiring-30';
    return 'ok';
  };

  const showToast = (message, type = 'success') => {
    toast[type](message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };
  
  // Get unique categories from stock items
  const categories = [...new Set(stockItems.map(item => item.category))];

  // Filter items based on search, category, stock level, and expiry status
  const filteredItems = stockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    
    // Stock level filter
    let matchesStockLevel = true;
    if (stockFilter !== 'all') {
      const status = getStockStatus(item);
      matchesStockLevel = stockFilter === status;
    }
    
    // Expiry filter
    let matchesExpiry = true;
    if (expiryFilter !== 'all') {
      const status = getExpiryStatus(item);
      matchesExpiry = status === expiryFilter;
    }

    return matchesSearch && matchesCategory && matchesStockLevel && matchesExpiry;
  });

  // Get stock status badge properties
  const getStockStatusBadge = (item) => {
    const status = getStockStatus(item);
    
    if (status === 'out-of-stock') {
      return {
        label: "❌ Out of Stock",
        className: "stock-status-out"
      };
    } else if (status === 'low-stock') {
      return {
        label: "⚠️ Low Stock",
        className: "stock-status-low",
      };
    } else {
      return {
        label: "✅ In Stock",
        className: "stock-status-normal"
      };
    }
    return {
      label: "✅ In Stock",
      className: "stock-status-ok"
    };
  };

  // Handle item deletion
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setStockItems(stockItems.filter(item => item.id !== id));
      showToast("Item deleted successfully", "success");
    }
  };

  // Handle save (add/edit) item
  const handleSave = (item) => {
    if (editingItem) {
      // Update existing item
      setStockItems(stockItems.map(i => 
        i.id === editingItem.id ? { ...item, id: editingItem.id } : i
      ));
      showToast("Item updated successfully", "success");
    } else {
      // Add new item
      setStockItems([...stockItems, { ...item, id: Date.now() }]);
      showToast("Item added successfully", "success");
    }
    setShowModal(false);
    setEditingItem(null);
  };

  // Export to PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Stock Inventory Report', 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);

    const headers = [['ID', 'Name', 'Category', 'Quantity', 'Unit', 'Reorder Level', 'Status']];
    const data = stockItems.map(item => [
      item.id,
      item.name,
      item.category,
      item.quantity,
      item.unit,
      item.reorderLevel,
      item.quantity <= item.reorderLevel ? 'Low Stock' : 'In Stock'
    ]);

    autoTable(doc, {
      startY: 40,
      head: headers,
      body: data,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [71, 85, 105] },
      margin: { top: 40 }
    });

    doc.save(`stock_report_${new Date().toISOString().split('T')[0]}.pdf`);
    showToast('PDF report exported successfully', 'success');
  };

  // Export to CSV
  const exportCSV = () => {
    const headers = ['ID,Name,Category,Quantity,Unit,Reorder Level,Status\n'];
    const csvData = stockItems.map(item => 
      `${item.id},${item.name},${item.category},${item.quantity},${item.unit},${item.reorderLevel},${item.quantity <= item.reorderLevel ? 'Low Stock' : 'In Stock'}`
    ).join('\n');

    const csvString = headers + csvData;
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `stock_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV report exported successfully', 'success');
  };

  // Bulk Update Handler
  const handleBulkUpdate = (updates, updateType) => {
    const updatedItems = [...stockItems];
    updates.forEach(update => {
      const itemIndex = updatedItems.findIndex(item => item.id === update.id);
      if (itemIndex !== -1) {
        const currentQuantity = updatedItems[itemIndex].quantity;
        let newQuantity;

        switch (updateType) {
          case 'set':
            newQuantity = update.quantity;
            break;
          case 'add':
            newQuantity = currentQuantity + parseInt(update.quantity);
            break;
          case 'subtract':
            newQuantity = currentQuantity - parseInt(update.quantity);
            break;
          default:
            newQuantity = currentQuantity;
        }

        // Ensure quantity doesn't go below 0
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          quantity: Math.max(0, newQuantity),
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
    });

    setStockItems(updatedItems);
    showToast(`Successfully updated ${updates.length} items`, 'success');
  };

  // Expiry Tracking Handler
  const handleBatchAdd = (updatedItem) => {
    const itemIndex = stockItems.findIndex(item => item.id === updatedItem.id);
    if (itemIndex !== -1) {
      const newItems = [...stockItems];
      newItems[itemIndex] = {
        ...newItems[itemIndex],
        batches: [...(newItems[itemIndex].batches || []), updatedItem.batch],
        quantity: (newItems[itemIndex].quantity || 0) + updatedItem.batch.quantity,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      setStockItems(newItems);
      showToast('Successfully added batch information', 'success');
    }
  };

  // Import Handler
  const handleImport = async (formData) => {
    try {
      // In a real application, you would send this to your backend
      // For now, we'll parse it client-side
      const file = formData.get('file');
      const text = await file.text();
      const rows = text.split('\n').slice(1); // Skip header row
      
      const importedItems = rows
        .filter(row => row.trim())
        .map(row => {
          const [name, category, quantity, unit, reorderLevel] = row.split(',');
          return {
            id: Date.now() + Math.random(), // Generate unique ID
            name: name.trim(),
            category: category.trim(),
            quantity: parseInt(quantity),
            unit: unit.trim(),
            reorderLevel: parseInt(reorderLevel),
            lastUpdated: new Date().toISOString().split('T')[0]
          };
        });

      setStockItems([...stockItems, ...importedItems]);
      showToast(`Successfully imported ${importedItems.length} items`, 'success');
    } catch (error) {
      showToast('Error importing data: ' + error.message, 'error');
    }
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="header-container">
        <h1 className="text-2xl font-bold">Stock Management</h1>
        
        <div className="controls-container">
          {/* Search and Filter */}
          <div className="filters">
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={expiryFilter}
              onChange={(e) => setExpiryFilter(e.target.value)}
              className="expiry-select"
            >
              <option value="all">All Expiry Status</option>
              <option value="expired">Expired</option>
              <option value="expiring-soon">Expiring Soon (7 days)</option>
              <option value="expiring-30">Expiring in 30 days</option>
              <option value="ok">Good Status</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              onClick={() => {
                setEditingItem(null);
                setShowModal(true);
              }}
              className="add-button"
            >
              + Add Item
            </button>
            <button
              onClick={() => setShowBulkModal(true)}
              className="feature-button"
            >
              🔄 Bulk Update
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="feature-button"
            >
              📥 Import Stock
            </button>
            <button onClick={exportCSV} className="export-button export-csv">
              📊 Export CSV
            </button>
            <button onClick={exportPDF} className="export-button export-pdf">
              📄 Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Feature Action Row */}
      <div className="feature-buttons">
        <button
          onClick={() => {
            const selectedItem = stockItems.find(item => 
              ["Meal", "Snack", "Drink"].includes(item.category)
            );
            if (selectedItem) {
              setEditingItem(selectedItem);
              setShowExpiryModal(true);
            }
          }}
          className="feature-button"
          title="Track expiry dates for food and beverage items"
        >
          📅 Add Batch & Expiry Info
        </button>
      </div>

      {/* Stock Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Reorder Level</th>
              <th>Status</th>
              <th>Expiry Info</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => {
              const stockStatus = getStockStatusBadge(item);
              const nearestExpiry = item.batches?.reduce((nearest, batch) => {
                if (!nearest || new Date(batch.expiryDate) < new Date(nearest)) {
                  return batch.expiryDate;
                }
                return nearest;
              }, null);
              
              return (
                <tr key={item.id} className={stockStatus.className.replace('stock-status-', 'tr-')}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>
                    {item.quantity}
                    {item.batches && (
                      <div className="batch-count">
                        ({item.batches.length} {item.batches.length === 1 ? 'batch' : 'batches'})
                      </div>
                    )}
                  </td>
                  <td>{item.unit}</td>
                  <td>{item.reorderLevel}</td>
                  <td>
                    <span className={`status-badge ${stockStatus.className}`}>
                      {stockStatus.label}
                    </span>
                  </td>
                  <td>
                    {(["Meal", "Snack", "Drink"].includes(item.category)) && (
                      <>
                        {nearestExpiry ? (
                          <div className="expiry-info">
                            <div className="expiry-details">
                              <span className="expiry-date">
                                Nearest Expiry: {new Date(nearestExpiry).toLocaleDateString()}
                              </span>
                              <span className={`expiry-badge ${getExpiryStatus(item)}`}>
                                {(() => {
                                  const status = getExpiryStatus(item);
                                  switch(status) {
                                    case 'expired': return 'Expired';
                                    case 'expiring-soon': return 'Expiring Soon';
                                    case 'expiring-30': return 'Expiring in 30 days';
                                    case 'ok': return 'Good Status';
                                    default: return '';
                                  }
                                })()}
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                setEditingItem(item);
                                setShowExpiryModal(true);
                              }}
                              className="small-button"
                              title="View Batch Details"
                            >
                              📦
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setShowExpiryModal(true);
                            }}
                            className="small-button"
                          >
                            Add Batch Info
                          </button>
                        )}
                      </>
                    )}
                  </td>
                  <td>{item.lastUpdated}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setShowModal(true);
                        }}
                        className="edit-button"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="delete-button"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Stock Filter Buttons */}
      <div className="flex gap-4 mt-4 mb-6">
        <button
          onClick={() => setStockFilter('all')}
          className={`px-4 py-2 rounded ${
            stockFilter === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Items
        </button>
        <button
          onClick={() => setStockFilter('low-stock')}
          className={`px-4 py-2 rounded ${
            stockFilter === 'low-stock'
              ? 'bg-amber-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Low Stock
        </button>
        <button
          onClick={() => setStockFilter('out-of-stock')}
          className={`px-4 py-2 rounded ${
            stockFilter === 'out-of-stock'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Out of Stock
        </button>
      </div>

      {/* Stock Modal */}
      <StockModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingItem(null);
        }}
        onSave={(item) => {
          if (editingItem) {
            dispatch({ type: 'UPDATE_STOCK_ITEM', payload: item });
            // Check if stock is now low after update
            if (item.quantity <= item.reorderLevel) {
              toast.warning(`⚠️ ${item.name} stock is running low (${item.quantity} left)!`);
            }
          } else {
            dispatch({ type: 'ADD_STOCK_ITEM', payload: { ...item, id: Date.now() } });
          }
          setShowModal(false);
          setEditingItem(null);
        }}
        editingItem={editingItem}
      />

      {/* Bulk Update Modal */}
      <BulkUpdateModal
        show={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        items={stockItems}
        onSave={(updatedItems) => {
          // Update items and check for low stock
          updatedItems.forEach(item => {
            dispatch({ type: 'UPDATE_STOCK_ITEM', payload: item });
            if (item.quantity <= item.reorderLevel) {
              toast.warning(`⚠️ ${item.name} stock is running low (${item.quantity} left)!`);
            }
          });
          setShowBulkModal(false);
        }}
      />

      {/* Expiry Tracking Modal */}
      <ExpiryTrackingModal
        show={showExpiryModal}
        onClose={() => {
          setShowExpiryModal(false);
          setEditingItem(null);
        }}
        item={editingItem}
        onSave={handleBatchAdd}
      />

      {/* Stock Import Modal */}
      <StockImportModal
        show={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={(items) => {
          items.forEach(item => {
            dispatch({ type: 'ADD_STOCK_ITEM', payload: { ...item, id: Date.now() } });
            if (item.quantity <= item.reorderLevel) {
              toast.warning(`⚠️ ${item.name} stock is running low (${item.quantity} left)!`);
            }
          });
          setShowImportModal(false);
        }}
      />

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}

export default Stock;
