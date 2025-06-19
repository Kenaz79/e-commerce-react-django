import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import './Products.css';

// Updated mock data with image URLs (replace with your actual images)
const mockProducts = [
  {
    id: 1,
    name: 'Product One',
    description: 'Description for product one',
    price: 19.99,
    image: 'https://via.placeholder.com/180x130.png?text=Product+One',
  },
  {
    id: 2,
    name: 'Product Two',
    description: 'Description for product two',
    price: 29.99,
    image: 'https://via.placeholder.com/180x130.png?text=Product+Two',
  },
  {
    id: 3,
    name: 'Product Three',
    description: 'Description for product three',
    price: 39.99,
    image: 'https://via.placeholder.com/180x130.png?text=Product+Three',
  },
  // Add more products with image URLs here
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    setProducts(mockProducts);
  }, []);

  return (
    <div className="products-container">
      <h2
        style={{
          width: '100%',
          textAlign: 'center',
          color: '#ff7f50',
          fontFamily: "'Comic Sans MS', cursive",
          marginBottom: '20px',
        }}
      >
        Products
      </h2>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
              loading="lazy"
            />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>
              <strong>Price:</strong> ${product.price.toFixed(2)}
            </p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}
