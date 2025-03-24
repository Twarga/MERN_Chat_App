import { io } from 'socket.io-client';

// Create socket instance with improved configuration
const socket = io('http://localhost:5000', {
  transports: ['websocket'], // Use WebSocket only for better performance
  reconnection: true,        // Enable reconnection
  reconnectionAttempts: 5,   // Try to reconnect 5 times
  reconnectionDelay: 1000,   // Start with 1s delay between reconnection attempts
  timeout: 10000,            // Connection timeout in ms
  autoConnect: true          // Connect automatically
});

// Add event listeners for debugging
socket.on('connect', () => {
  console.log('Socket connected successfully');
});

socket.on('disconnect', () => {
  console.log('Socket disconnected');
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error.message);
});

socket.on('reconnect', (attempt) => {
  console.log(`Socket reconnected after ${attempt} attempts`);
});

socket.on('reconnect_error', (error) => {
  console.error('Socket reconnection error:', error.message);
});

export default socket;