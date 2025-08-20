import React from 'react';
import PropTypes from 'prop-types';

function StockAlerts({ lowStockItems, expiringSoonItems }) {
  return (
    <div className="stock-alerts" style={{
      background: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      padding: "20px"
    }}>
      <h3 style={{ margin: "0 0 15px 0", color: "#333" }}>Stock Alerts</h3>

      {/* Low Stock Items */}
      <div style={{ marginBottom: "20px" }}>
        <h4 style={{ color: "#666", marginBottom: "10px" }}>Low Stock Items</h4>
        {lowStockItems.length > 0 ? (
          <ul style={{ 
            listStyle: "none", 
            padding: 0, 
            margin: 0,
            maxHeight: "200px",
            overflowY: "auto"
          }}>
            {lowStockItems.map((item, index) => (
              <li key={item.id || index} style={{
                padding: "10px",
                borderBottom: "1px solid #eee",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span>{item.name}</span>
                <span style={{ 
                  color: "#ff4444",
                  fontWeight: "bold" 
                }}>
                  {item.quantity} left
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "#666" }}>No low stock items</p>
        )}
      </div>

      {/* Expiring Soon Items */}
      <div>
        <h4 style={{ color: "#666", marginBottom: "10px" }}>Expiring Soon</h4>
        {expiringSoonItems.length > 0 ? (
          <ul style={{ 
            listStyle: "none", 
            padding: 0, 
            margin: 0,
            maxHeight: "200px",
            overflowY: "auto"
          }}>
            {expiringSoonItems.map((item, index) => (
              <li key={item.id || index} style={{
                padding: "10px",
                borderBottom: "1px solid #eee",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span>{item.name}</span>
                <span style={{ 
                  color: "#ff8800",
                  fontWeight: "bold" 
                }}>
                  Expires {item.expiryDate}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "#666" }}>No items expiring soon</p>
        )}
      </div>
    </div>
  );
}

StockAlerts.propTypes = {
  lowStockItems: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired
  })).isRequired,
  expiringSoonItems: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string.isRequired,
    expiryDate: PropTypes.string.isRequired
  })).isRequired
};

export default StockAlerts;
