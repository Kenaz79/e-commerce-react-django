import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './auth.css';

export default function OtpPage() {
  const { state } = useLocation();
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [verified, setVerified] = useState(false);

  const generatedOtp = state?.generatedOtp;

  const handleOtpSubmit = (e) => {
    e.preventDefault();

    if (otp === generatedOtp) {
      setMessage('OTP verified successfully!');
      setVerified(true);
    } else {
      setMessage('Invalid OTP');
      setVerified(false);
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
