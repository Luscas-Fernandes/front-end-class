import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import GalleryItem from '../../components/GalleryItem/GalleryItem';
import { verifyAuth } from '../../utils/auth';
import { loadImages, saveImage, deleteImage } from '../../utils/storage';
import './Gallery.css';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = verifyAuth();
    if (!user) {
      navigate('/signin');
    } else {
      setUserName(user.nome);
      setImages(loadImages());
    }
  }, [navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (saveImage(event.target.result)) {
          setImages(loadImages());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = (index) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      const updatedImages = deleteImage(index);
      setImages(updatedImages);
    }
  };

  return (
    <>
      <Header />
      <main className="gallery-page">
        <h1 className="gallery-title">{userName}'s Gallery</h1>
        
        <div className="upload-container">
          <label htmlFor="file-upload" className="upload-btn">
            Select Image
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <p className="upload-info">
            Images are saved in your browser's local storage.
          </p>
          <p className="upload-info">
            Storage limit: ~5MB (varies by browser).
          </p>
        </div>
        
        <div className="gallery-grid">
          {images.length === 0 ? (
            <p className="empty-gallery">No images uploaded yet.</p>
          ) : (
            images.map((imageData, index) => (
              <GalleryItem
                key={index}
                imageData={imageData}
                index={index}
                onDelete={handleDeleteImage}
              />
            ))
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}