import React from 'react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cartItems, removeFromCart, clearCart } = useCart();

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cartItems.map(item => (
              <li key={item.id}>
                {item.name} x {item.quantity} - ${item.price * item.quantity}
                <button onClick={() => removeFromCart(item.id)} style={{ marginLeft: '1rem' }}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <h4>
            Total: $
            {cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}
          </h4>
          <button onClick={clearCart}>Clear Cart</button>
        </>
      )}
    </div>
  );
}
