function checkAuthStatus() {
    const authOptions = document.getElementById('auth-options');
    const user = JSON.parse(localStorage.getItem('usuarioParthenogenesis'));

    if (user) {
        authOptions.innerHTML = `
            <li><a href="gallery.html">Hi, ${user.nome.split(' ')[0]}</a></li>
            <li><a href="#" id="logout-link">Logout</a></li>
            <li><a href="gallery.html">Your gallery</a></li>
        `;
        
        document.getElementById('logout-link').addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    } else {
        authOptions.innerHTML = `
            <li><a href="./signin.html">Sign in</a></li>
            <li><a href="./signup.html">Sign up</a></li>
        `;
    }
}

function logout() {
    localStorage.removeItem('usuarioParthenogenesis');
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', checkAuthStatus);

function verifyAuth() {
    const user = JSON.parse(localStorage.getItem('usuarioParthenogenesis'));
    if (!user) {
        window.location.href = 'signin.html';
    }
    return user;
}