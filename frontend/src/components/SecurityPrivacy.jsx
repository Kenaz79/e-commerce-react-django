import React, { useState } from 'react';
import './SecurityPrivacy.css'; // Optional styling

export default function SecurityPrivacy() {
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [profilePrivate, setProfilePrivate] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(true);
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate saving settings
    setMessage('Security & privacy settings updated successfully!');
  };

  return (
    <div className="page">
      <h2>Security & Privacy</h2>
      <form onSubmit={handleSubmit} className="security-form">
        <label>
          <input
            type="checkbox"
            checked={twoFAEnabled}
            onChange={() => setTwoFAEnabled(!twoFAEnabled)}
          />
          Enable Two-Factor Authentication (2FA)
        </label>

        <label>
          <input
            type="checkbox"
            checked={profilePrivate}
            onChange={() => setProfilePrivate(!profilePrivate)}
          />
          Make my profile private
        </label>

        <label>
          <input
            type="checkbox"
            checked={marketingEmails}
            onChange={() => setMarketingEmails(!marketingEmails)}
          />
          Receive marketing emails
        </label>

        <button type="submit">Save Preferences</button>

        {message && <p className="success-message">{message}</p>}
      </form>
    </div>
  );
}
