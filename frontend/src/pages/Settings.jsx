import React, { useEffect, useState } from 'react';
import './Settings.css';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const [settings, setSettings] = useState({
    pushNotifications: true,
    promotions: false,
    appUpdates: true,
  });

  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        localStorage.setItem('profileImage', base64String);
        setProfileImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };
  const navigate = useNavigate();

  const removeImage = () => {
    localStorage.removeItem('profileImage');
    setProfileImage(null);
  };

  return (
    <div className="settings-container">
      <div className="header">
        <span className="back-arrow">&larr;</span>
        <h2>Settings</h2>
      </div>

      <div className="profile-section">
        <label htmlFor="profile-upload" className="profile-upload-label">
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="profile-pic" />
          ) : (
            <FaUserCircle className="profile-icon" />
          )}
        </label>
        <input
          type="file"
          id="profile-upload"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
        <h3>@username</h3>

        {profileImage && (
          <button className="remove-button" onClick={removeImage}>
            Remove Image
          </button>
        )}
      </div>

    <div className="section">
      <h4>Account Settings</h4>
      <div className="item" onClick={() => navigate('/edit-profile')}>Edit Profile</div>
      <div className="item" onClick={() => navigate('/change-password')}>Change your password</div>
      <div className="item" onClick={() => navigate('/security-privacy')}>Security & Privacy</div>
</div>

      <div className="section">
        <h4>Notification Settings</h4>
        <div className="toggle-item">
          <span>Push Notification</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={() => toggleSetting('pushNotifications')}
            />
            <span className="slider"></span>
          </label>
        </div>
        <div className="toggle-item">
          <span>Promotions</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.promotions}
              onChange={() => toggleSetting('promotions')}
            />
            <span className="slider"></span>
          </label>
        </div>
        <div className="toggle-item">
          <span>App Updates</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.appUpdates}
              onChange={() => toggleSetting('appUpdates')}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );
}
