import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import '../Modals/Modal.css';


const FileUploadModal = ({ isOpen, onClose, onFileUpload }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) {
      return;
    }
    
    // Check file size (limit to 1MB)
    if (selectedFile.size > 1000000) {
      setError('File size should be less than 1MB');
      return;
    }
    
    // Check file type (only images)
    const fileType = selectedFile.type;
    if (!fileType.match(/image.*/)) {
      setError('Only image files are allowed');
      return;
    }
    
    setFile(selectedFile);
    setError('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload file');
      }
      
      // Call the callback with file info
      onFileUpload(data.filePath);
      
      // Close the modal
      onClose();
      
    } catch (error) {
      setError('Failed to upload file: ' + error.message);
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Upload Image</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="file-input-container">
            <input 
              type="file"
              id="file"
              onChange={handleFileChange}
              accept="image/*"
              className="file-input"
            />
            <label htmlFor="file" className="file-label">
              {file ? file.name : 'Choose a file'}
            </label>
          </div>
          
          {file && (
            <div className="file-preview">
              <img 
                src={URL.createObjectURL(file)} 
                alt="Preview" 
                className="preview-image"
              />
            </div>
          )}
          
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading || !file}
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FileUploadModal;