import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Register from './pages/Register';
import EditProfile from './components/EditProfile';
import ChangePassword from './components/ChangePassword';
import SecurityPrivacy from './components/SecurityPrivacy';
import Login from './pages/Login';
import Home from './pages/Home';
import SellerUpload from './pages/SellerUpload';
import Products from './pages/Products';
import OtpPage from './pages/OtpPage';
import Settings from './pages/Settings';

function App() {
  const [products, setProducts] = useState([]);

  const addProduct = (product) => {
    setProducts((prev) => [...prev, product]);
  };

  return (
    <Routes>
      <Route path="/" element={<Home products={products} />} />
      <Route path="/seller" element={<SellerUpload onAddProduct={addProduct} />} />
      <Route path="/products" element={<Products products={products} />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/register" element={<Register />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/security-privacy" element={<SecurityPrivacy />} />
      <Route path="/login" element={<Login />} />
      <Route path="/otp" element={<OtpPage />} />
    </Routes>
  );
}

export default App;

