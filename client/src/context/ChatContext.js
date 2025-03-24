import React, { createContext, useReducer, useCallback, useEffect } from 'react';
import * as api from '../utils/api';
import socket from '../utils/socket';

// Initial state
const initialState = {
  selectedChat: null,
  chats: [],
  notifications: [],
  loading: false,
  error: null,
};

// Create context
export const ChatContext = createContext(initialState);

// Action types
const SET_SELECTED_CHAT = 'SET_SELECTED_CHAT';
const SET_CHATS = 'SET_CHATS';
const ADD_CHAT = 'ADD_CHAT';
const UPDATE_CHAT = 'UPDATE_CHAT';
const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';
const CHAT_LOADING = 'CHAT_LOADING';
const CHAT_ERROR = 'CHAT_ERROR';
const CHAT_RESET = 'CHAT_RESET';

// Reducer function
const chatReducer = (state, action) => {
  switch (action.type) {
    case SET_SELECTED_CHAT:
      return { ...state, selectedChat: action.payload };
    case SET_CHATS:
      return { ...state, chats: action.payload };
    case ADD_CHAT:
      // Check if chat already exists to avoid duplicates
      if (state.chats.some(c => c._id === action.payload._id)) {
        return state;
      }
      return { ...state, chats: [action.payload, ...state.chats] };
    case UPDATE_CHAT:
      return {
        ...state,
        chats: state.chats.map((c) =>
          c._id === action.payload._id ? action.payload : c
        ),
      };
    case ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };
    case REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          (n) => n.chat._id !== action.payload
        ),
      };
    case CHAT_LOADING:
      return { ...state, loading: true };
    case CHAT_ERROR:
      return { ...state, loading: false, error: action.payload };
    case CHAT_RESET:
      return { ...state, loading: false, error: null };
    default:
      return state;
  }
};

// Provider component
export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Listen for socket events
  useEffect(() => {
    // Handle new chat creation
    socket.on('chat created', (newChat) => {
      console.log('New chat received:', newChat);
      dispatch({ type: ADD_CHAT, payload: newChat });
    });

    // Handle new group creation
    socket.on('group created', (newGroup) => {
      console.log('New group received:', newGroup);
      dispatch({ type: ADD_CHAT, payload: newGroup });
    });

    return () => {
      socket.off('chat created');
      socket.off('group created');
    };
  }, []);

  // Set selected chat
  const setSelectedChat = useCallback((chat) => {
    dispatch({ type: SET_SELECTED_CHAT, payload: chat });
  }, []);

  // Fetch all chats
  const fetchChats = useCallback(async (token) => {
    try {
      dispatch({ type: CHAT_LOADING });

      const data = await api.get('/api/chat', token);

      dispatch({ type: SET_CHATS, payload: data });
      dispatch({ type: CHAT_RESET });
      
      return data;
    } catch (error) {
      dispatch({ type: CHAT_ERROR, payload: error.message });
      throw error;
    }
  }, []);

  // Access or create a chat
  const accessChat = useCallback(async (userId, token) => {
    try {
      dispatch({ type: CHAT_LOADING });

      const data = await api.post('/api/chat', { userId }, token);

      // If the chat is not already in the list, add it
      if (!state.chats.find((c) => c._id === data._id)) {
        dispatch({ type: ADD_CHAT, payload: data });
        
        // Emit new chat event to socket
        socket.emit('new chat', data);
      }

      setSelectedChat(data);
      dispatch({ type: CHAT_RESET });
      
      return data;
    } catch (error) {
      dispatch({ type: CHAT_ERROR, payload: error.message });
      throw error;
    }
  }, [state.chats, setSelectedChat]);

  // Create a group chat
  const createGroupChat = useCallback(async (users, name, token) => {
    try {
      dispatch({ type: CHAT_LOADING });

      const data = await api.post(
        '/api/chat/group',
        { users: JSON.stringify(users), name },
        token
      );

      dispatch({ type: ADD_CHAT, payload: data });
      
      // Emit new group event to socket
      socket.emit('new group', data);
      
      dispatch({ type: CHAT_RESET });
      
      return data;
    } catch (error) {
      dispatch({ type: CHAT_ERROR, payload: error.message });
      throw error;
    }
  }, []);

  // Rename a group
  const renameGroup = useCallback(async (chatId, chatName, token) => {
    try {
      dispatch({ type: CHAT_LOADING });

      const data = await api.put(
        '/api/chat/rename',
        { chatId, chatName },
        token
      );

      dispatch({ type: UPDATE_CHAT, payload: data });
      
      // If this is the selected chat, update it
      if (state.selectedChat?._id === data._id) {
        setSelectedChat(data);
      }
      
      dispatch({ type: CHAT_RESET });
      
      return data;
    } catch (error) {
      dispatch({ type: CHAT_ERROR, payload: error.message });
      throw error;
    }
  }, [state.selectedChat, setSelectedChat]);

  // Add user to group
  const addToGroup = useCallback(async (chatId, userId, token) => {
    try {
      dispatch({ type: CHAT_LOADING });

      const data = await api.put(
        '/api/chat/groupadd',
        { chatId, userId },
        token
      );

      dispatch({ type: UPDATE_CHAT, payload: data });
      
      // If this is the selected chat, update it
      if (state.selectedChat?._id === data._id) {
        setSelectedChat(data);
      }
      
      dispatch({ type: CHAT_RESET });
      
      return data;
    } catch (error) {
      dispatch({ type: CHAT_ERROR, payload: error.message });
      throw error;
    }
  }, [state.selectedChat, setSelectedChat]);

  // Remove user from group
  const removeFromGroup = useCallback(async (chatId, userId, token) => {
    try {
      dispatch({ type: CHAT_LOADING });

      const data = await api.put(
        '/api/chat/groupremove',
        { chatId, userId },
        token
      );

      dispatch({ type: UPDATE_CHAT, payload: data });
      
      // If this is the selected chat, update it
      if (state.selectedChat?._id === data._id) {
        setSelectedChat(data);
      }
      
      dispatch({ type: CHAT_RESET });
      
      return data;
    } catch (error) {
      dispatch({ type: CHAT_ERROR, payload: error.message });
      throw error;
    }
  }, [state.selectedChat, setSelectedChat]);

  // Add notification
  const addNotification = useCallback((notification) => {
    dispatch({ type: ADD_NOTIFICATION, payload: notification });
  }, []);

  // Remove notification
  const removeNotification = useCallback((chatId) => {
    dispatch({ type: REMOVE_NOTIFICATION, payload: chatId });
  }, []);

  return (
    <ChatContext.Provider
      value={{
        selectedChat: state.selectedChat,
        chats: state.chats,
        notifications: state.notifications,
        loading: state.loading,
        error: state.error,
        setSelectedChat,
        fetchChats,
        accessChat,
        createGroupChat,
        renameGroup,
        addToGroup,
        removeFromGroup,
        addNotification,
        removeNotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};