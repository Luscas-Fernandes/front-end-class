import PropTypes from 'prop-types';
import './GalleryItem.css';

export default function GalleryItem({ imageData, index, onDelete }) {
  return (
    <div className="gallery-item">
      <img src={imageData} alt={`Gallery item ${index}`} />
      <button 
        className="delete-btn"
        onClick={() => onDelete(index)}
        aria-label="Delete image"
      >
        &times;
      </button>
    </div>
  );
}

GalleryItem.propTypes = {
  imageData: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired
};