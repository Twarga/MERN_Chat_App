import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useChat } from '../hooks/useChat';
import ChatList from '../components/Chat/ChatList';
import ChatBox from '../components/Chat/ChatBox';
import UserAvatar from '../components/UserAvatar/UserAvatar';
import GroupChatModal from '../components/Chat/Modals/GroupChatModal';
import ProfileModal from '../components/Chat/Modals/ProfileModal';
import NotificationBadge from '../components/Chat/Notifications/NotificationBadge';
import NotificationDropdown from '../components/Chat/Notifications/NotificationDropdown';
import socket from '../utils/socket';
import * as api from '../utils/api';
import './ChatPage.css';

const ChatPage = () => {
  const { user, logout } = useAuth();
  const { 
    chats, 
    selectedChat, 
    setSelectedChat, 
    fetchChats, 
    accessChat,
    notifications,
    removeNotification,
    addNotification
  } = useChat();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Verify user authentication on page load
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Connect to socket.io
    socket.emit('setup', user);
    
    // Fetch user's chats
    fetchChats(user.token).catch(err => {
      setError(`Failed to load chats: ${err.message}`);
    });

    return () => {
      // Cleanup socket listeners on unmount
    };
  }, [user, navigate, fetchChats]);

  // Handle socket.io message notifications
  useEffect(() => {
    // Function to handle new message notifications
    const handleNewMessage = (newMessage) => {
      console.log('New message received for notification:', newMessage);
      
      // If chat is not selected or doesn't match current chat
      if (!selectedChat || selectedChat._id !== newMessage.chat._id) {
        // Add notification
        addNotification({
          ...newMessage,
          createdAt: new Date(),
          sender: newMessage.sender,
          chat: newMessage.chat
        });
      }
    };

    socket.on('message received', handleNewMessage);

    return () => {
      socket.off('message received', handleNewMessage);
    };
  }, [selectedChat, addNotification]);

  // Handle user search
  const handleSearchUsers = useCallback(async () => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await api.get(`/api/users?search=${searchTerm}`, user.token);
      
      setSearchResults(data);
      setLoading(false);
    } catch (error) {
      setError(`Error searching users: ${error.message}`);
      setLoading(false);
    }
  }, [searchTerm, user?.token]);

  // Handle user selection from search results
  const handleUserSelect = useCallback(async (userId) => {
    try {
      setError(null);
      await accessChat(userId, user.token);
      setSearchTerm('');
      setSearchResults([]);
    } catch (error) {
      setError(`Error starting chat: ${error.message}`);
    }
  }, [accessChat, user?.token]);

  // Handle chat selection
  const handleChatSelect = useCallback((chat) => {
    setSelectedChat(chat);
    
    // Remove notifications for this chat
    if (notifications.some(n => n.chat._id === chat._id)) {
      removeNotification(chat._id);
    }
  }, [setSelectedChat, notifications, removeNotification]);

  // Handle logout
  const handleLogout = useCallback(() => {
    // Disconnect socket
    socket.disconnect();
    
    // Log out user
    logout();
    navigate('/login');
  }, [logout, navigate]);

  // Memoize the chat list to prevent unnecessary re-renders
  const memoizedChats = useMemo(() => chats, [chats]);

  return (
    <div className="chat-page">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="user-info" onClick={() => setShowProfileModal(true)}>
            <UserAvatar user={user} />
            <span className="username">{user?.username}</span>
          </div>
          <div className="header-actions">
            <NotificationBadge 
              count={notifications.length} 
              onClick={() => setShowNotifications(!showNotifications)} 
            />
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        <div className="search-container">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchUsers()}
          />
          <button onClick={handleSearchUsers} disabled={loading}>
            {loading ? <span className="loader-small"></span> : <i className="fas fa-search"></i>}
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map(user => (
              <div
                key={user._id}
                className="search-user-item"
                onClick={() => handleUserSelect(user._id)}
              >
                <UserAvatar user={user} />
                <div className="user-details">
                  <div className="user-name">{user.username}</div>
                  <div className="user-email">{user.email}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="sidebar-actions">
          <button 
            className="create-group-btn"
            onClick={() => setShowGroupModal(true)}
          >
            <i className="fas fa-plus"></i> Create Group Chat
          </button>
        </div>

        <ChatList
          chats={memoizedChats}
          selectedChat={selectedChat}
          handleChatSelect={handleChatSelect}
          notifications={notifications}
        />
      </div>

      <div className="chat-container">
        <ChatBox chat={selectedChat} />
      </div>

      {/* Modals */}
      <GroupChatModal 
        isOpen={showGroupModal} 
        onClose={() => setShowGroupModal(false)} 
      />
      
      <ProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
        profile={user}
      />

      {/* Notification Dropdown */}
      <NotificationDropdown 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
        notifications={notifications}
        onNotificationClick={(chat) => {
          setSelectedChat(chat);
          removeNotification(chat._id);
          setShowNotifications(false);
        }}
      />
    </div>
  );
};

export default ChatPage;