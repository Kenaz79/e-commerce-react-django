import React, { useState } from 'react';
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
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      setMessageType('error');
      return;
    }

    // Simulate successful registration
    setMessage("Registration successful! Check your email.");
    setMessageType('success');

    // Generate a random 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    console.log('Generated OTP (simulated email):', generatedOtp); // For testing

    // Save email before clearing form
    const emailToSend = formData.email;

    // Reset form
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });

    // Navigate to OTP page with the generated OTP
    setTimeout(() => {
      navigate('/otp', {
        state: {
          email: emailToSend,
          generatedOtp: generatedOtp,
        }
      });
    }, 1000);
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