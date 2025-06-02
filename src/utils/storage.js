export const saveImage = (imageData) => {
  try {
    const images = JSON.parse(localStorage.getItem('savedImages') || []);
    images.push(imageData);
    localStorage.setItem('savedImages', JSON.stringify(images));
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      alert('Storage is full. Please delete some images first.');
      return false;
    }
    return false;
  }
};

export const loadImages = () => {
  return JSON.parse(localStorage.getItem('savedImages')) || [];
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