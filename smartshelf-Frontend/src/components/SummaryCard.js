import React from 'react';
import PropTypes from 'prop-types';

function SummaryCard({ icon: Icon, title, value, onClick }) {
  return (
    <div
      className={`summary-card ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s ease"
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
        }
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
        {Icon && <Icon style={{ marginRight: "10px", fontSize: "24px", color: "#666" }} />}
        <h3 style={{ margin: 0, color: "#666", fontSize: "16px" }}>{title}</h3>
      </div>
      <p style={{ margin: 0, fontSize: "24px", fontWeight: "bold", color: "#333" }}>{value}</p>
    </div>
  );
}

SummaryCard.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onClick: PropTypes.func
};

export default SummaryCard;
