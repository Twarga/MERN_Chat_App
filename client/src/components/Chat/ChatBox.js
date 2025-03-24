import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import Message from '../Message/Message';
import UserAvatar from '../UserAvatar/UserAvatar';
import Spinner from '../Spinner/Spinner';
import FileUploadModal from './FileUpload/FileUploadModal';
import { useAuth } from '../../hooks/useAuth';
import socket from '../../utils/socket';
import * as api from '../../utils/api';
import './ChatBox.css';

const ChatBox = ({ chat }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Function to fetch messages for a chat
  const fetchMessages = useCallback(async () => {
    if (!chat || !chat._id) return;

    try {
      setLoading(true);
      setError(null);
      
      const data = await api.get(`/api/messages/${chat._id}`, user.token);
      
      setMessages(data);
      setLoading(false);

      // Join socket room
      socket.emit('join chat', chat._id);
    } catch (error) {
      setError(`Error loading messages: ${error.message}`);
      setLoading(false);
    }
  }, [chat, user?.token]);

  // Fetch messages when chat changes
  useEffect(() => {
    if (chat && chat._id) {
      fetchMessages();
      socket.emit('join chat', chat._id);
    }
    return () => {
      // Clean up typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [chat, fetchMessages]);

  // Set up socket listeners
  useEffect(() => {
    const handleNewMessage = (newMessageReceived) => {
      // Ensure chat is defined
      if (!chat || !chat._id) return;
      
      // Check if message belongs to current chat
      if (chat._id === newMessageReceived.chat._id) {
        console.log('New message received in current chat:', newMessageReceived);
        
        // Add message to current chat
        setMessages(prevMessages => {
          // Check if message already exists to avoid duplicates
          if (!prevMessages.some(m => m._id === newMessageReceived._id)) {
            return [...prevMessages, newMessageReceived];
          }
          return prevMessages;
        });
      }
    };

    socket.on('message received', handleNewMessage);
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));

    return () => {
      socket.off('message received', handleNewMessage);
      socket.off('typing');
      socket.off('stop typing');
    };
  }, [chat]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle typing in the message input
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // Typing indicator logic
    if (!typing && chat) {
      setTyping(true);
      socket.emit('typing', chat._id);
    }

    // Clear timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (chat) {
        socket.emit('stop typing', chat._id);
        setTyping(false);
      }
    }, 3000);
  };

  // Send a message
  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !chat) return;
    
    // Stop typing and clear input right away for better UX
    if (chat) socket.emit('stop typing', chat._id);
    const messageContent = newMessage.trim();
    setNewMessage('');
    
    try {
      const messageData = {
        content: messageContent,
        chatId: chat._id,
      };
      
      const data = await api.post('/api/messages', messageData, user.token);
      
      console.log('Message sent:', data);
      
      // Update local state immediately
      setMessages(prevMessages => [...prevMessages, data]);
      
      // Emit to socket
      socket.emit('new message', data);
    } catch (error) {
      setError(`Failed to send message: ${error.message}`);
      // Restore message if sending fails
      setNewMessage(messageContent);
    }
  };

  // Send an image message
  const handleFileUpload = async (filePath) => {
    if (!chat) return;
    
    try {
      // Create message with image URL
      const imageMessage = `![Image](${filePath})`;
      
      const data = await api.post(
        '/api/messages',
        {
          content: imageMessage,
          chatId: chat._id,
        },
        user.token
      );

      console.log('Image message sent:', data);
      
      // Update local state immediately
      setMessages(prevMessages => [...prevMessages, data]);
      
      // Emit to socket for real-time update
      socket.emit('new message', data);
    } catch (error) {
      setError(`Failed to send image: ${error.message}`);
    }
  };

  // Get chat name for display
  const getChatName = () => {
    if (!chat) return "Chat";
    
    if (chat.isGroupChat) {
      return chat.chatName;
    }
    
    return chat.users.find(u => u._id !== user._id)?.username || "Chat";
  };

  // Get status text (online/offline)
  const getStatusText = () => {
    if (!chat) return "";
    
    if (chat.isGroupChat) {
      return `${chat.users.length} members`;
    }
    
    const chatUser = chat.users.find(u => u._id !== user._id);
    return chatUser?.isOnline ? 'Online' : 'Offline';
  };

  if (!chat) {
    return (
      <div className="chat-box chat-box-empty">
        <div>
          <h3>Select a chat to start messaging</h3>
          <p>Search for users or select an existing chat</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-box">
      <div className="chat-header">
        {chat.isGroupChat ? (
          <div className="avatar group-avatar">
            <span>G</span>
          </div>
        ) : (
          <UserAvatar
            user={chat.users.find(u => u._id !== user._id)}
            size="md"
          />
        )}
        
        <div className="chat-info">
          <h3>{getChatName()}</h3>
          <p className="status-text">{getStatusText()}</p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <div className="messages-container">
        {loading ? (
          <Spinner />
        ) : (
          <div className="messages">
            {messages.length === 0 ? (
              <div className="no-messages">No messages yet. Say hello!</div>
            ) : (
              messages.map((message, index) => (
                <Message
                  key={message._id || index}
                  message={message}
                  isSender={message.sender._id === user._id}
                />
              ))
            )}
            <div ref={messagesEndRef} />
            
            {isTyping && (
              <div className="typing-indicator">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            )}
          </div>
        )}
      </div>

      <form className="message-input-container" onSubmit={sendMessage}>
        <button 
          type="button" 
          className="upload-btn"
          onClick={() => setShowUploadModal(true)}
        >
          <i className="fas fa-image"></i>
        </button>
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={typingHandler}
        />
        <button type="submit" disabled={!newMessage.trim()}>
          <i className="fas fa-paper-plane"></i>
        </button>
      </form>
      
      <FileUploadModal 
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onFileUpload={handleFileUpload}
      />
    </div>
  );
};

export default memo(ChatBox);