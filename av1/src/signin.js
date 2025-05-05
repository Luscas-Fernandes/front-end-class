document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('senha').value;
    
    const user = JSON.parse(localStorage.getItem('usuarioParthenogenesis'));
    
    if (!user) {
        alert('No registered user found. Please sign up first.');
        return;
    }
    
    if (email === user.email && password === user.senha) {
        alert('Login successful!');
        window.location.href = 'gallery.html';
    } else {
        alert('Incorrect email or password.');
    }
});