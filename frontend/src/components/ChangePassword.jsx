import React, { useState } from 'react';
import './ChangePassword.css'; // Optional: for styling

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Example validation
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match.');
      setMessage('');
      return;
    }

    // Simulate password update
    setMessage('Password changed successfully!');
    setError('');
    setFormData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="page">
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit} className="change-form">
        <label>
          Old Password:
          <input
            type="password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          New Password:
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Confirm New Password:
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Update Password</button>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
      </form>
    </div>
  );
}
