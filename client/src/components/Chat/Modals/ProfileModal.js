import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import UserAvatar from '../../UserAvatar/UserAvatar';
import * as api from '../../../utils/api';
import './Modal.css';

const ProfileModal = ({ isOpen, onClose, profile }) => {
  const [username, setUsername] = useState(profile?.username || '');
  const [profilePic, setProfilePic] = useState(profile?.profilePic || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError('');
    setSuccess('');
    
    if (!username.trim()) {
      setError('Username cannot be empty');
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await api.put('/api/users/profile', 
        {
          username,
          profilePic
        }, 
        user.token
      );

      setSuccess('Profile updated successfully');
      
      // Update local storage with new user info
      const updatedUser = { ...user, username, profilePic };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      
      setLoading(false);
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        // Reload page to reflect changes
        window.location.reload();
      }, 2000);
    } catch (error) {
      setError('Failed to update profile: ' + error.message);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>My Profile</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="profile-container">
          <div className="profile-avatar">
            <UserAvatar user={profile} size="lg" />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label>Profile Picture URL</label>
              <input
                type="text"
                value={profilePic}
                onChange={(e) => setProfilePic(e.target.value)}
                placeholder="Enter image URL"
              />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={profile?.email || ''}
                disabled
                className="disabled-input"
              />
            </div>
            
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;