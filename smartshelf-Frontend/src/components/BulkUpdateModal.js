import React, { useState } from 'react';
import '../style.css';

function BulkUpdateModal({ show, onClose, items, onSave }) {
  const [selectedItems, setSelectedItems] = useState({});
  const [updateQuantity, setUpdateQuantity] = useState('');
  const [updateType, setUpdateType] = useState('set'); // 'set', 'add', or 'subtract'

  const handleSubmit = (e) => {
    e.preventDefault();
    const updates = Object.entries(selectedItems)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => ({
        id,
        quantity: updateType === 'set' 
          ? parseInt(updateQuantity)
          : updateType === 'add'
            ? `+${updateQuantity}`
            : `-${updateQuantity}`
      }));
    
    onSave(updates, updateType);
    onClose();
  };

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      const allSelected = items.reduce((acc, item) => ({
        ...acc,
        [item.id]: true
      }), {});
      setSelectedItems(allSelected);
    } else {
      setSelectedItems({});
    }
  };

  const toggleItem = (id) => {
    setSelectedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Bulk Update Stock</h2>
        <form onSubmit={handleSubmit}>
          {/* Update Type Selection */}
          <div className="form-group">
            <label>Update Type:</label>
            <select 
              value={updateType}
              onChange={(e) => setUpdateType(e.target.value)}
              className="form-control"
            >
              <option value="set">Set to value</option>
              <option value="add">Add quantity</option>
              <option value="subtract">Subtract quantity</option>
            </select>
          </div>

          {/* Quantity Input */}
          <div className="form-group">
            <label>Quantity:</label>
            <input
              type="number"
              min="0"
              value={updateQuantity}
              onChange={(e) => setUpdateQuantity(e.target.value)}
              className="form-control"
              required
            />
          </div>

          {/* Item Selection */}
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                onChange={toggleSelectAll}
                checked={Object.keys(selectedItems).length === items.length}
              />
              Select All
            </label>
            
            <div className="items-list">
              {items.map(item => (
                <label key={item.id} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={!!selectedItems[item.id]}
                    onChange={() => toggleItem(item.id)}
                  />
                  {item.name} (Current: {item.quantity} {item.unit})
                </label>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-button"
              disabled={!updateQuantity || !Object.values(selectedItems).some(v => v)}
            >
              Update Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BulkUpdateModal;
