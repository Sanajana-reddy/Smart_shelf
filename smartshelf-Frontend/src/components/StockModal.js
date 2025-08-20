import React, { useState, useEffect } from 'react';

function StockModal({ show, onClose, onSave, editingItem }) {
  const initialState = {
    name: '',
    category: 'Meal',
    quantity: 0,
    unit: 'plates',
    reorderLevel: 0
  };

  const [formData, setFormData] = useState(initialState);
  const units = ['plates', 'packets', 'bottles', 'pieces', 'boxes'];

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
    } else {
      setFormData(initialState);
    }
  }, [editingItem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      lastUpdated: new Date().toISOString().split('T')[0]
    });
    setFormData(initialState);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">Item Name</label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter item name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Meal">Meal</option>
              <option value="Snack">Snack</option>
              <option value="Drink">Drink</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                required
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="unit">Unit</label>
              <select
                id="unit"
                required
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              >
                {units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reorderLevel">Reorder Level</label>
            <input
              type="number"
              id="reorderLevel"
              required
              min="0"
              value={formData.reorderLevel}
              onChange={(e) => setFormData({ ...formData, reorderLevel: parseInt(e.target.value) })}
              placeholder="Minimum stock level"
            />
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="save-button">
              {editingItem ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StockModal;
