import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('usuarioParthenogenesis'));
    setUser(userData);
  }, []);

  const login = (email, password) => {
    const userData = JSON.parse(localStorage.getItem('usuarioParthenogenesis'));
    
    if (!userData) {
      throw new Error('No registered user found. Please sign up first.');
    }
    
    if (email === userData.email && password === userData.senha) {
      setUser(userData);
      return userData;
    } else {
      throw new Error('Incorrect email or password.');
    }
  };

  const logout = () => {
    localStorage.removeItem('usuarioParthenogenesis');
    setUser(null);
    navigate('/');
  };

  const signup = (userData) => {
    localStorage.setItem('usuarioParthenogenesis', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  return { user, login, logout, signup };
};

export default useAuth;