import React from 'react';

export default function ProductCard({ product }) {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '1rem',
      width: '200px',
      boxShadow: '0 0 5px rgba(0,0,0,0.1)'
    }}>
      <img 
        src={product.image} 
        alt={product.name} 
        style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }} 
      />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
    </div>
  );
}
