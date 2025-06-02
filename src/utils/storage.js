export const saveImage = (imageData) => {
  try {
    const images = JSON.parse(localStorage.getItem('savedImages') || '[]');
    images.push(imageData);
    localStorage.setItem('savedImages', JSON.stringify(images));
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      alert('Storage is full. Please delete some images first.');
    } else {
      console.error('Error saving image:', e);
      alert('Failed to save image');
    }
    return false;
  }
};

export const loadImages = () => {
  try {
    return JSON.parse(localStorage.getItem('savedImages')) || [];
  } catch (e) {
    console.error('Error loading images:', e);
    clearImages(); // Limpa dados corrompidos
    return [];
  }
};

export const deleteImage = (index) => {
  const images = JSON.parse(localStorage.getItem('savedImages')) || [];
  images.splice(index, 1);
  localStorage.setItem('savedImages', JSON.stringify(images));
  return images;
};

export const clearImages = () => {
  localStorage.removeItem('savedImages');
};