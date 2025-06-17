import React, { useState, useRef, useEffect } from 'react';
import './home.css';
import { FaBars, FaCog, FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef();

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleNavigation = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    // Optionally clear auth tokens, localStorage etc.
    alert('Logged out!');
    setMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="home-container">
      <div className="home-navbar">
        <FaBars className="hamburger-icon" onClick={toggleMenu} />
        <h2 className="logo">E-Commerce</h2>
      </div>

      {menuOpen && (
        <div className="side-menu" ref={menuRef}>
          <div className="menu-item" onClick={() => handleNavigation('/products')}>
            <FaShoppingCart className="menu-icon" /> Products
          </div>
          <div className="menu-item" onClick={() => handleNavigation('/settings')}>
            <FaCog className="menu-icon" /> Settings
          </div>
          <div className="menu-item logout" onClick={handleLogout}>
            <FaSignOutAlt className="menu-icon" /> Logout
          </div>
        </div>
      )}

      <div className="home-hero">
        <h1>Welcome to the E-commerce Store</h1>
        <p>Discover quality products at unbeatable prices.</p>
        <a href="/products">Browse Products</a>
      </div>
    </div>
  );
}
