import React, { useState } from 'react';
import { useChat } from '../../../hooks/useChat';
import { useAuth } from '../../../hooks/useAuth';
import UserAvatar from '../../UserAvatar/UserAvatar';
import * as api from '../../../utils/api';
import './Modal.css';

const GroupChatModal = ({ isOpen, onClose }) => {
  const [groupName, setGroupName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { createGroupChat } = useChat();
  const { user } = useAuth();

  const handleSearch = async () => {
    if (!searchTerm) {
      return;
    }

    try {
      setLoading(true);
      setError('');

      const data = await api.get(`/api/users?search=${searchTerm}`, user.token);
      
      setSearchResults(data);
      setLoading(false);
    } catch (error) {
      setError('Error searching for users: ' + error.message);
      setLoading(false);
    }
  };

  const handleUserSelect = (selectedUser) => {
    // Check if user is already selected
    if (selectedUsers.some(u => u._id === selectedUser._id)) {
      return;
    }
    
    setSelectedUsers([...selectedUsers, selectedUser]);
    setSearchResults([]);
    setSearchTerm('');
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter(user => user._id !== userId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!groupName.trim()) {
      setError('Please enter a group name');
      return;
    }
    
    if (selectedUsers.length < 2) {
      setError('Please select at least 2 users');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Extract user IDs
      const userIds = selectedUsers.map(user => user._id);
      
      await createGroupChat(userIds, groupName.trim(), user.token);
      
      // Reset form and close modal
      setGroupName('');
      setSelectedUsers([]);
      onClose();
    } catch (error) {
      setError('Failed to create group chat: ' + error.message);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create Group Chat</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Group Name</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
            />
          </div>
          
          <div className="form-group">
            <label>Add Users</label>
            <div className="search-input-container">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users to add"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                type="button"
                onClick={handleSearch}
                disabled={loading}
                className="search-btn"
              >
                {loading ? <span className="loader-small"></span> : 'Search'}
              </button>
            </div>
          </div>
          
          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="selected-users">
              {selectedUsers.map(user => (
                <div key={user._id} className="selected-user-badge">
                  <span>{user.username}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveUser(user._id)}
                    className="remove-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="search-results-container">
              {searchResults.map(user => (
                <div
                  key={user._id}
                  className="search-user-item"
                  onClick={() => handleUserSelect(user)}
                >
                  <UserAvatar user={user} size="sm" />
                  <div className="user-details">
                    <div className="user-name">{user.username}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading || selectedUsers.length < 2 || !groupName.trim()}
          >
            {loading ? 'Creating...' : 'Create Group'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GroupChatModal;