import React, { useState, useEffect } from 'react';
import './Settings.css';

export default function Settings() {
  const [profilePic, setProfilePic] = useState(null);
  const [theme, setTheme] = useState('light');

  // Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.body.className = savedTheme;
  }, []);

  const handlePicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgURL = URL.createObjectURL(file);
      setProfilePic(imgURL);
      localStorage.setItem('profilePic', imgURL); // optional
    }
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.className = newTheme;
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>

      <div className="section">
        <label>Profile Picture:</label>
        <input type="file" accept="image/*" onChange={handlePicUpload} />
        {profilePic && <img src={profilePic} alt="Profile" className="preview-img" />}
      </div>

      <div className="section">
        <label>Theme:</label>
        <button onClick={handleThemeToggle}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </div>
    </div>
  );
}
