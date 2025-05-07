document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const imageGallery = document.getElementById('imageGallery');
    
    loadImages();
    
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.match('image.*')) {
                alert('Please select an image type file.');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(event) {
                saveImageToLocalStorage(event.target.result);
                loadImages();
            };
            reader.readAsDataURL(file);
            
            fileInput.value = '';
        }
    });

    const usuarioSalvo = JSON.parse(localStorage.getItem('usuarioParthenogenesis'));
    const usernameElement = document.getElementById('username');

    let possessiveApostrophe = usuarioSalvo.nome[-1] = 's' ? "'" : "'s";
    
    if (usuarioSalvo && usuarioSalvo.nome) {
        usernameElement.textContent = usuarioSalvo.nome + possessiveApostrophe; 
    } else {
        window.location.href = "signin.html";
    }
    
    function saveImageToLocalStorage(imageData) {
        let images = JSON.parse(localStorage.getItem('savedImages') || '[]');
        
        try {
            images.push(imageData);
            localStorage.setItem('savedImages', JSON.stringify(images));
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                alert('Storage is full. Please, delete a few images before adding a new one.');
                return false;
            }
        }
        return true;
    }
    
    function loadImages() {
        const images = JSON.parse(localStorage.getItem('savedImages') || '[]');
        imageGallery.innerHTML = '';
        
        if (images.length === 0) {
            imageGallery.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">No image loaded still.</p>';
            return;
        }
        
        images.forEach((imageData, index) => {
            const imageItem = document.createElement('div');
            imageItem.className = 'image-item';
            
            const img = document.createElement('img');
            img.src = imageData;
            img.alt = 'Imagem salva';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '×';
            deleteBtn.addEventListener('click', function() {
                deleteImage(index);
            });
            
            imageItem.appendChild(img);
            imageItem.appendChild(deleteBtn);
            imageGallery.appendChild(imageItem);
        });
    }
    
    function deleteImage(index) {
        if (confirm('Are you sure you want to delete this image?')) {
            let images = JSON.parse(localStorage.getItem('savedImages') || '[]');
            images.splice(index, 1);
            localStorage.setItem('savedImages', JSON.stringify(images));
            loadImages();
        }
    }
});