import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import './../../assets/styles/global.css';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <h1 className="h1">
        <Link to="/">P<span style={{ color: '#35bff5' }}>art</span>henogenesis</Link>
      </h1>
      
      <h2 className="slogan underline">Protecting your art from AI</h2>

      <ul className="header-options">
        {user ? (
          <>
            <span>Hi, {(user.nome && user.nome.split(' ')[0]) || 'User'}</span>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/services">Services</Link></li>
            <a href="#" className="logout-link" onClick={(e) => { e.preventDefault(); logout(); }}>
  Logout
</a>

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
};

export default Header;