import React, { useRef, useEffect } from 'react';
import UserAvatar from '../../UserAvatar/UserAvatar';
import './NotificationDropdown.css';

const NotificationDropdown = ({ isOpen, onClose, notifications, onNotificationClick }) => {
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // Format time for notification display
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // Less than a minute
    if (diff < 60000) {
      return 'just now';
    }
    
    // Less than an hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    }
    
    // Less than a day
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    
    // Otherwise show date
    return date.toLocaleDateString();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="notification-dropdown" ref={dropdownRef}>
      <div className="dropdown-header">
        <h3>Notifications</h3>
      </div>
      
      <div className="dropdown-content">
        {notifications.length === 0 ? (
          <div className="no-notifications">No new notifications</div>
        ) : (
          notifications.map((notification, index) => (
            <div 
              key={index}
              className="notification-item"
              onClick={() => onNotificationClick(notification.chat)}
            >
              <UserAvatar user={notification.sender} size="sm" />
              <div className="notification-content">
                <div className="notification-message">
                  <strong>{notification.sender.username}</strong> sent you a message in{' '}
                  <strong>
                    {notification.chat.isGroupChat
                      ? notification.chat.chatName
                      : 'your chat'}
                  </strong>
                </div>
                <div className="notification-text">
                  {notification.content.startsWith('![Image]') 
                    ? '📷 Image'
                    : notification.content.length > 30
                      ? `${notification.content.substring(0, 30)}...`
                      : notification.content
                  }
                </div>
                <div className="notification-time">
                  {formatTime(notification.createdAt)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;