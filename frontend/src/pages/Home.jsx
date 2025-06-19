import React, { useState, useRef, useEffect } from 'react';
import './home.css';
import { FaBars, FaCog, FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Products from './Products';

export default function Home({ products }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef();

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleNavigation = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    alert('Logged out!');
    setMenuOpen(false);
  };

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
    <div className="home-wrapper no-sidebar">
      {/* Main content area */}
      <div className="main-content">
        <nav className="home-navbar">
          {/* Hamburger menu */}
          <FaBars className="hamburger-icon" onClick={toggleMenu} />

          {/* Title */}
          <h1 className="navbar-title">ONLINE MALL</h1>

          {/* Search bar */}
          <input type="text" placeholder="Search product" className="search-bar" />

          {/* User info and cart */}
          <div className="user-actions">
            <span>Diego Morata</span>
            <FaShoppingCart />
            <span>Orders</span>
          </div>

          {/* Dropdown menu */}
          {menuOpen && (
            <div className="side-menu" ref={menuRef}>
              <div className="menu-item" onClick={() => handleNavigation('/products')}>
                <FaShoppingCart className="menu-icon" /> Products
              </div>
              <div className="menu-item" onClick={() => handleNavigation('/seller')}>
                <FaCog className="menu-icon" /> Seller Upload
              </div>
              <div className="menu-item logout" onClick={handleLogout}>
                <FaSignOutAlt className="menu-icon" /> Logout
              </div>
            </div>
          )}
        </nav>

        {/* Banner */}
        <section className="banner">
          <h2>Biggest Offer Revealed</h2>
          <p>MORE DEALS INSIDE UP TO 50% OFF</p>
        </section>

        {/* Promo cards */}
        <section className="mini-deals">
          <div>UP TO 30% OFF – AVAKEN</div>
          <div>Iconic – The Biggest Discount</div>
          <div>Don't Miss The Year-End Sale</div>
        </section>

        {/* Deals of the day */}
        <section className="deals-section">
          <div className="deals-header">
            <h3>Deals of the Day</h3>
            <span>20:45:12 Left</span>
          </div>
          <div className="product-grid">
            <div className="product-card">Red Leather GUCCI</div>
            <div className="product-card">XRXR Face Cream</div>
            <div className="product-card">Fujifilm DSLR</div>
            <div className="product-card">Sky Blue Shoes</div>
            <div className="product-card">Brown Wallet</div>
          </div>
        </section>

        {/* Render actual uploaded products */}
        <Products products={products} />
      </div>

      {/* Right Panel */}
      <aside className="right-panel">
        <div className="recently-viewed">
          <h4>Recently Viewed</h4>
          <div>👜 Orange Bag</div>
        </div>
        <div className="suggestions">
          <h4>Suggestions for You</h4>
          <div>🎒 Black Backpack</div>
        </div>
      </aside>
    </div>
  );
}
