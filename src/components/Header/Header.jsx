import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { checkAuthStatus, logout } from '../../utils/auth';
import './Header.css';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = checkAuthStatus();
    if (user) {
      setIsLoggedIn(true);
      setUserName(user.nome.split(' ')[0]);
    }
  }, []);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <header className="header">
      <h1 className="h1">
        <Link to="/">P<span style={{ color: '#35bff5' }}>art</span>henogenesis</Link>
      </h1>
      
      <h2 className="slogan underline">Protecting your art from AI</h2>

      <ul className="header-options">
        {isLoggedIn ? (
          <>
            <li><span>Hi, {userName}</span></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><button onClick={handleLogout}>Sign out</button></li>
          </>
        ) : (
          <>
            <li><Link to="/signin">Sign in</Link></li>
            <li><Link to="/signup">Sign up</Link></li>
          </>
        )}
      </ul>
    </header>
  );
}