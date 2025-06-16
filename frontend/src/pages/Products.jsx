import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const mockProducts = [
  { id: 1, name: 'Product One', description: 'Description for product one', price: 19.99 },
  { id: 2, name: 'Product Two', description: 'Description for product two', price: 29.99 },
  { id: 3, name: 'Product Three', description: 'Description for product three', price: 39.99 },
  // Add more mock products as needed
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    // Instead of fetching from backend, load mock data
    setProducts(mockProducts);
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Products</h2>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {products.map(product => (
          <div key={product.id} style={{ border: '1px solid #ccc', padding: '1rem' }}>
            <h4>{product.name}</h4>
            <p>{product.description}</p>
            <p>Price: ${product.price.toFixed(2)}</p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}
