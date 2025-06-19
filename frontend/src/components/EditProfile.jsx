import React, { useState } from 'react';
import './EditProfile.css'; // Optional: create if you want styling

export default function EditProfile() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you'd send data to the backend via API (optional)
    setMessage('Profile updated successfully!');
  };

  return (
    <div className="page">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} className="edit-form">
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Save Changes</button>
        {message && <p className="success-message">{message}</p>}
      </form>
    </div>
  );
}
