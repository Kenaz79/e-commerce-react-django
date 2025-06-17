import React, { useState } from 'react';
import './auth.css';
import { FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // ✅ Import icons

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleLogin = e => {
  e.preventDefault();

  if (!formData.username || !formData.password) {
    setMessage('Please enter both username and password');
    return;
  }

  setLoading(true); // Start loading
  setMessage('');

  // Simulate login
  setTimeout(() => {
    setLoading(false);
    setMessage('Login successful ✅');
    localStorage.setItem('access', 'dummy-access-token');
    localStorage.setItem('refresh', 'dummy-refresh-token');
    navigate('/dashboard');
  }, 1500);
};

  return (
    <div className="auth-form-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          required
        />

        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <span onClick={() => setShowPassword(!showPassword)} className="eye-icon">
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

       <button type="submit" disabled={loading}>
  {loading ? <FaSpinner className="spinner" /> : 'Login'}
</button>

      </form>
    </div>
  );
}
