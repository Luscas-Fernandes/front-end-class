export function checkAuthStatus() {
  return JSON.parse(localStorage.getItem('usuarioParthenogenesis'));
}

export function verifyAuth() {
  const user = checkAuthStatus();
  if (!user) {
    return null;
  }
  return user;
}

export function logout() {
  localStorage.removeItem('usuarioParthenogenesis');
  window.location.reload();
}

export function isAuthenticated() {
  return !!checkAuthStatus();
}