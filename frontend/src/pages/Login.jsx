import React, { useState } from 'react';
import './auth.css';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = e => {
    e.preventDefault();

    // Simple frontend validation
    if (!formData.username || !formData.password) {
      setMessage('Please enter both username and password');
      return;
    }

    // Simulate a successful login after 1 second
    setMessage('Login successful ✅');

    // Optionally, you could store dummy tokens here
    localStorage.setItem('access', 'dummy-access-token');
    localStorage.setItem('refresh', 'dummy-refresh-token');

    // Redirect to dashboard after a short delay to show the message
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
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
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="toggle-password"
        >
          {showPassword ? 'Hide Password' : 'Show Password'}
        </button>
        <button type="submit">Login</button>
        {message && <p className="login-message">{message}</p>}
      </form>
    </div>
  );
}
