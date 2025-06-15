import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './auth.css';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const navigate = useNavigate(); // ✅ initialize navigation

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      setMessageType('error');
      return;
    }
    try {
      const res = await axios.post('http://localhost:8000/api/register/', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      await axios.post('http://localhost:8000/api/send-otp/', {
        email: formData.email,
      });

      setMessage(res.data.message || "Registration successful!");
      setMessageType('success');

      // Optional: clear form fields
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });

      // ✅ Redirect to OTP page with email
      navigate('/otp', { state: { email: formData.email } });

    } catch (err) {
      setMessage(err.response?.data?.error || 'Error occurred');
      setMessageType('error');
    }
  };

  return (
    <div className="auth-form-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
          type="email"
        />
        <input
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          type={showPasswords ? "text" : "password"}
          required
        />
        <input
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          type={showPasswords ? "text" : "password"}
          required
        />
        <button
          type="button"
          onClick={() => setShowPasswords(!showPasswords)}
          style={{
            marginBottom: '1rem',
            background: 'none',
            border: 'none',
            color: '#007bff',
            cursor: 'pointer',
            textDecoration: 'underline',
            fontSize: '0.9rem',
          }}
        >
          {showPasswords ? 'Hide Passwords' : 'Show Passwords'}
        </button>
        <button type="submit">Register</button>
        {message && (
          <p style={{ color: messageType === 'success' ? 'green' : 'red' }}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
