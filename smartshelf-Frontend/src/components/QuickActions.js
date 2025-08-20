import React from 'react';
import PropTypes from 'prop-types';

function QuickActions({ onAddStock, onViewOrders, onExport }) {
  const buttonStyle = {
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#4a90e2",
    color: "white",
    transition: "background-color 0.2s"
  };

  return (
    <div style={{
      display: "flex",
      gap: "15px",
      flexWrap: "wrap"
    }}>
      <button
        onClick={onAddStock}
        style={buttonStyle}
        onMouseOver={e => e.currentTarget.style.backgroundColor = "#357abd"}
        onMouseOut={e => e.currentTarget.style.backgroundColor = "#4a90e2"}
      >
        Add Stock
      </button>

      <button
        onClick={onViewOrders}
        style={buttonStyle}
        onMouseOver={e => e.currentTarget.style.backgroundColor = "#357abd"}
        onMouseOut={e => e.currentTarget.style.backgroundColor = "#4a90e2"}
      >
        View Orders
      </button>

      <button
        onClick={onExport}
        style={buttonStyle}
        onMouseOver={e => e.currentTarget.style.backgroundColor = "#357abd"}
        onMouseOut={e => e.currentTarget.style.backgroundColor = "#4a90e2"}
      >
        Export Reports
      </button>
    </div>
  );
}

QuickActions.propTypes = {
  onAddStock: PropTypes.func.isRequired,
  onViewOrders: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired
};

export default QuickActions;
