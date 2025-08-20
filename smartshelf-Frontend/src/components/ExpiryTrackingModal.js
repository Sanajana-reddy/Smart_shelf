import React, { useState } from 'react';
import '../style.css';

function ExpiryTrackingModal({ show, onClose, item, onSave }) {
  const [batchDetails, setBatchDetails] = useState({
    batchNumber: '',
    quantity: '',
    manufacturingDate: '',
    expiryDate: '',
    storageLocation: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...item,
      batch: {
        ...batchDetails,
        quantity: parseInt(batchDetails.quantity)
      }
    });
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBatchDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Batch Details for {item?.name}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Batch Number:</label>
            <input
              type="text"
              name="batchNumber"
              value={batchDetails.batchNumber}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label>Quantity:</label>
            <input
              type="number"
              name="quantity"
              min="1"
              value={batchDetails.quantity}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label>Manufacturing Date:</label>
            <input
              type="date"
              name="manufacturingDate"
              value={batchDetails.manufacturingDate}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label>Expiry Date:</label>
            <input
              type="date"
              name="expiryDate"
              value={batchDetails.expiryDate}
              onChange={handleChange}
              min={batchDetails.manufacturingDate}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label>Storage Location:</label>
            <input
              type="text"
              name="storageLocation"
              value={batchDetails.storageLocation}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="save-button">
              Add Batch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ExpiryTrackingModal;
