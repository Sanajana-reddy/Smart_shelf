import React, { useState } from 'react';
import '../style.css';

function StockImportModal({ show, onClose, onImport }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.name.match(/\.(csv|xlsx)$/)) {
      setError('Please upload a CSV or Excel file');
      return;
    }

    setFile(file);
    setError('');

    // Preview file contents
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rows = text.split('\n').slice(0, 6); // Show first 5 rows
      setPreview(rows);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      onImport(formData);
      onClose();
    } catch (error) {
      setError('Error uploading file: ' + error.message);
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Import Stock Data</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Upload CSV/Excel File:</label>
            <input
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileChange}
              className="form-control"
              required
            />
            {error && <div className="error-message">{error}</div>}
          </div>

          {preview.length > 0 && (
            <div className="preview-section">
              <h3>Preview:</h3>
              <div className="preview-content">
                {preview.map((row, index) => (
                  <div key={index} className="preview-row">
                    {row}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="download-template">
            <a href="/templates/stock_import_template.csv" download>
              Download Import Template
            </a>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-button"
              disabled={!file || error}
            >
              Import Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StockImportModal;
