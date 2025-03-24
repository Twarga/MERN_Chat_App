import React, { memo } from 'react';
import UserAvatar from '../UserAvatar/UserAvatar';
import './ChatList.css';

const ChatList = ({ chats, selectedChat, handleChatSelect, notifications }) => {
  // Function to get the other user in a 1-on-1 chat
  const getSenderDetails = (chat, loggedUserId) => {
    return chat.users.find(user => user._id !== loggedUserId);
  };

  // Function to get chat name for display
  const getChatName = (chat, loggedUserId) => {
    if (chat.isGroupChat) {
      return chat.chatName;
    }
    const sender = getSenderDetails(chat, loggedUserId);
    return sender?.username || "Unknown User";
  };

  // Function to get the latest message
  const getLatestMessage = (chat) => {
    if (chat.latestMessage) {
      // Check if it's an image message
      if (chat.latestMessage.content.startsWith('![Image]')) {
        return '📷 Image';
      }
      return chat.latestMessage.content.length > 20
        ? chat.latestMessage.content.substring(0, 20) + '...'
        : chat.latestMessage.content;
    }
    return "No messages yet";
  };

  // Check if chat has unread notifications
  const hasNotification = (chatId) => {
    return notifications.some(n => n.chat._id === chatId);
  };

  // Function to format time
  const formatTime = (date) => {
    if (!date) return '';
    
    const today = new Date();
    const messageDate = new Date(date);
    
    // If same day, show time
    if (today.toDateString() === messageDate.toDateString()) {
      return messageDate.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    
    // If within the last week, show day name
    const diffDays = Math.floor((today - messageDate) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return messageDate.toLocaleDateString([], { weekday: 'short' });
    }
    
    // Otherwise show date
    return messageDate.toLocaleDateString([], {
      month: 'short',
      day: 'numeric'
    });
  };

  if (chats.length === 0) {
    return (
      <div className="chat-list">
        <h2>Chats</h2>
        <div className="no-chats">
          <p>No chats yet</p>
          <p>Search for users to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-list">
      <h2>Chats</h2>
      {chats.map(chat => (
        <div
          key={chat._id}
          className={`chat-item ${selectedChat?._id === chat._id ? 'selected' : ''} ${hasNotification(chat._id) ? 'has-notification' : ''}`}
          onClick={() => handleChatSelect(chat)}
        >
          {chat.isGroupChat ? (
            <div className="chat-avatar group-avatar">
              <span>G</span>
            </div>
          ) : (
            <UserAvatar
              user={getSenderDetails(chat, localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo'))._id : '')}
            />
          )}
          
          <div className="chat-details">
            <div className="chat-title">
              {getChatName(
                chat,
                localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo'))._id : ''
              )}
            </div>
            <div className="chat-last-message">
              {getLatestMessage(chat)}
            </div>
          </div>
          
          {chat.latestMessage && (
            <div className="chat-time">
              {formatTime(chat.latestMessage.createdAt)}
            </div>
          )}
          
          {hasNotification(chat._id) && (
            <div className="notification-dot"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default memo(ChatList);