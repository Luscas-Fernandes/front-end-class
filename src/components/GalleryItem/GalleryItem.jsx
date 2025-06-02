import React from 'react';
import './GalleryItem.css';

const GalleryItem = ({ image, onDelete }) => {
  return (
    <div className="gallery-item">
      <div className="image-container">
        <img src={image} alt="User uploaded" className="gallery-image" />
        <button 
          className="delete-btn"
          onClick={onDelete}
          aria-label="Delete image"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default GalleryItem;