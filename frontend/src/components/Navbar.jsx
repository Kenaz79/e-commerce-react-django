import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';  // We'll create this CSS next

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">E-Shop</div>
      <div className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
          Home
        </NavLink>
        <NavLink to="/products" className={({ isActive }) => (isActive ? 'active' : '')}>
          Products
        </NavLink>
        <NavLink to="/cart" className={({ isActive }) => (isActive ? 'active' : '')}>
          Cart
        </NavLink>
        <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>
          Login
        </NavLink>
        

      </div>
    </nav>
  );
}
