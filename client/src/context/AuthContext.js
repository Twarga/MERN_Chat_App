import React, { createContext, useReducer } from 'react';
import * as api from '../utils/api';

// Initial state
const initialState = {
  user: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
  loading: false,
  error: null,
};

// Create context
export const AuthContext = createContext(initialState);

// Action types
const LOGIN_REQUEST = 'LOGIN_REQUEST';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAIL = 'LOGIN_FAIL';
const LOGOUT = 'LOGOUT';
const CLEAR_ERROR = 'CLEAR_ERROR';

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { ...state, loading: true, error: null };
    case LOGIN_SUCCESS:
      return { ...state, loading: false, user: action.payload, error: null };
    case LOGIN_FAIL:
      return { ...state, loading: false, error: action.payload };
    case LOGOUT:
      return { ...state, user: null };
    case CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Login action
  const login = async (email, password) => {
    try {
      dispatch({ type: LOGIN_REQUEST });

      const data = await api.post('/api/users/login', { email, password });

      localStorage.setItem('userInfo', JSON.stringify(data));

      dispatch({
        type: LOGIN_SUCCESS,
        payload: data,
      });

      return data;
    } catch (error) {
      dispatch({
        type: LOGIN_FAIL,
        payload: error.message,
      });
      throw error;
    }
  };

  // Register action
  const register = async (username, email, password) => {
    try {
      dispatch({ type: LOGIN_REQUEST });

      const data = await api.post('/api/users', { username, email, password });

      localStorage.setItem('userInfo', JSON.stringify(data));

      dispatch({
        type: LOGIN_SUCCESS,
        payload: data,
      });

      return data;
    } catch (error) {
      dispatch({
        type: LOGIN_FAIL,
        payload: error.message,
      });
      throw error;
    }
  };

  // Logout action
  const logout = () => {
    localStorage.removeItem('userInfo');
    dispatch({ type: LOGOUT });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: CLEAR_ERROR });
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};