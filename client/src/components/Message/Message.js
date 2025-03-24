import React from 'react';
import UserAvatar from '../UserAvatar/UserAvatar';
import './Message.css';

const Message = ({ message, isSender = false }) => {
  // Check if message contains an image
  const isImageMessage = message.content && message.content.startsWith('![Image]');
  
  // Extract image URL if it's an image message
  const getImageUrl = () => {
    if (!isImageMessage) return null;
    
    const regex = /!\[Image]\((.*?)\)/;
    const match = message.content.match(regex);
    return match ? match[1] : null;
  };
  
  // Format time for display
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className={`message ${isSender ? 'message-sender' : 'message-receiver'}`}>
      {!isSender && (
        <div className="message-avatar">
          <UserAvatar user={message.sender} size="sm" />
        </div>
      )}
      
      <div className={`message-content ${isImageMessage ? 'message-image' : ''}`}>
        {!isSender && (
          <div className="message-sender-name">{message.sender?.username || 'User'}</div>
        )}
        
        {isImageMessage ? (
          <img 
            src={getImageUrl()} 
            alt="Shared" 
            className="message-img" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/200?text=Image+Not+Found';
            }}
          />
        ) : (
          <div className="message-text">{message.content}</div>
        )}
        
        <div className="message-time">
          {formatTime(message.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default Message;