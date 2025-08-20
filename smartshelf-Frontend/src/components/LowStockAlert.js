import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useInventory } from '../context/InventoryContext';
import { useNavigate } from 'react-router-dom';

function LowStockAlert() {
  const { stockItems } = useInventory();
  const navigate = useNavigate();

  // Filter items that are low in stock or out of stock
  const lowStockItems = stockItems.filter(item => 
    item.quantity <= item.reorderLevel
  );

  if (lowStockItems.length === 0) return null;

  return (
    <div className="low-stock-alert">
      <h3>
        <FaExclamationTriangle className="inline-block mr-2 text-amber-500" />
        Low Stock Alert
      </h3>
      <div className="alert-items">
        {lowStockItems.map(item => (
          <div 
            key={item.id} 
            className={`alert-item ${item.quantity === 0 ? 'out-of-stock' : 'low-stock'}`}
          >
            <div className="item-info">
              <span className="item-name">{item.name}</span>
              <span className={`item-quantity ${
                item.quantity === 0 ? 'text-red-600' : 'text-amber-600'
              }`}>
                {item.quantity === 0 
                  ? 'Out of Stock!' 
                  : `${item.quantity} units remaining`
                }
              </span>
            </div>
            <div className="reorder-level">
              Reorder Level: {item.reorderLevel} units
            </div>
          </div>
        ))}
      </div>
      <button 
        onClick={() => navigate('/stock')}
        className="view-stock-button bg-amber-500 hover:bg-amber-600"
      >
        View Stock Management
      </button>
    </div>
  );
}

export default LowStockAlert;
