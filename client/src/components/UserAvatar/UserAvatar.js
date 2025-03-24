import React from 'react';
import './UserAvatar.css';

const UserAvatar = ({ user, size = 'md' }) => {
  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  // Generate a consistent color based on username
  const getAvatarColor = (username) => {
    if (!username) return '#e0e0e0';
    
    // Simple hash function to generate color
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Convert to hex color
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
    }
    
    return color;
  };

  return (
    <div className={`avatar avatar-${size}`}>
      {user?.profilePic ? (
        <img 
          src={user.profilePic} 
          alt={user.username} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = 'none';
            e.target.parentNode.classList.add('avatar-fallback');
            e.target.parentNode.style.backgroundColor = getAvatarColor(user.username);
            e.target.parentNode.setAttribute('data-initials', getInitials(user.username));
          }}
        />
      ) : (
        <div 
          className="avatar-fallback" 
          style={{ backgroundColor: getAvatarColor(user?.username) }}
          data-initials={getInitials(user?.username)}
        ></div>
      )}
      {user?.isOnline && <span className="online-indicator"></span>}
    </div>
  );
};

export default UserAvatar;