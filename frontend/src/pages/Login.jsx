import React, { useState } from 'react';
import axios from 'axios';
import './auth.css';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // for redirection

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/token/', formData);

      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);

      setMessage('Login successful ✅');

      // Optional: fetch user profile or role
      // const userRes = await axios.get('http://localhost:8000/api/profile/', {
      //   headers: { Authorization: `Bearer ${res.data.access}` },
      // });
      // const role = userRes.data.role;
      // if (role === 'student') navigate('/student-dashboard');
      // else if (role === 'lecturer') navigate('/lecturer-dashboard');

      // For now, redirect to home or dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        setMessage('❌ Invalid username or password.');
      } else {
        setMessage('❌ Server error. Please try again.');
      }
    }
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
