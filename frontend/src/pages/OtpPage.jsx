import React, { useState } from 'react';
import axios from 'axios';
import './auth.css';

export default function OtpPage({ email }) {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [verified, setVerified] = useState(false);

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/verify-otp/', {
        email,
        otp,
      });
      setMessage(res.data.message || 'Verified!');
      setVerified(true);
    } catch (err) {
      setMessage('Invalid OTP');
    }
  };

  return (
    <div className="auth-form-container">
      <form className="auth-form" onSubmit={handleOtpSubmit}>
        <h2>Verify OTP</h2>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          placeholder="Enter 6-digit OTP"
          required
        />
        <button type="submit">Verify</button>
        <p style={{ color: verified ? 'green' : 'red' }}>{message}</p>
      </form>
    </div>
  );
}
