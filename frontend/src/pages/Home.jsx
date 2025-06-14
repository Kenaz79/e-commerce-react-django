import React from 'react';
import './Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-hero">
        <h1>Welcome to the E-commerce Store</h1>
        <p>Discover quality products at unbeatable prices.</p>
        <a href="/products">Browse Products</a>
      </div>
    </div>
  );
}
