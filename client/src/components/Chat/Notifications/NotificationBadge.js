import React from 'react';
import './NotificationBadge.css';

const NotificationBadge = ({ count = 0, onClick }) => {
  return (
    <div className="notification-badge" onClick={onClick}>
      <i className="fas fa-bell"></i>
      {count > 0 && (
        <span className="badge">{count > 99 ? '99+' : count}</span>
      )}
    </div>
  );
};

export default NotificationBadge;