import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GalleryItem from '../../components/GalleryItem';
import './Gallery.css';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('usuarioParthenogenesis'));
    if (!userData) {
      navigate('/signin');
    } else {
      setUser(userData);
      loadImages();
    }
  }, [navigate]);

  const loadImages = () => {
    const savedImages = localStorage.getItem('savedImages') ? JSON.parse(localStorage.getItem('savedImages')) : [];
    setImages(savedImages);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const newImages = [...images, event.target.result];
      localStorage.setItem('savedImages', JSON.stringify(newImages));
      setImages(newImages);
    };
    reader.readAsDataURL(file);
  };

  const deleteImage = (index) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      const newImages = images.filter((_, i) => i !== index);
      localStorage.setItem('savedImages', JSON.stringify(newImages));
      setImages(newImages);
    }
  };

  if (!user) return null;

  return (
    <main className="main">
      <h1 className="gallery-title">
        {user.nome + (user.nome.slice(-1) === 's' ? "'" : "'s")} Gallery
      </h1>
      
      <div className="upload-container">
        <label htmlFor="fileInput" className="upload-btn">Select Image</label>
        <input 
          type="file" 
          id="fileInput" 
          accept="image/*" 
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <p className="info">Images are saved in your browser's storage</p>
      </div>
      
      <div className="gallery-grid">
        {images.length === 0 ? (<p className="empty-gallery">No images uploaded yet</p>) : 
        (
            images.map((image, index) => (
            <GalleryItem 
                key={index}
                image={image}
                onDelete={() => deleteImage(index)}
            />
            ))
        )}
      </div>
    </main>
  );
};

export default Gallery;