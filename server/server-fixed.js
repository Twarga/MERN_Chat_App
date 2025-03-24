const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const { protect } = require('./middleware/authMiddleware');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  },
  pingTimeout: 60000 // Increase ping timeout
});

// Middleware
app.use(cors({
  origin: "*", // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Make uploads folder static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('MERN Chat API is running');
});

// Track socket connections by user ID
const userSockets = {};

// Set up Socket.io
io.on('connection', (socket) => {
  console.log('New socket connection:', socket.id);
  
  // Handle user setup
  socket.on('setup', (userData) => {
    if (!userData || !userData._id) {
      console.log('Invalid user data for socket setup');
      return;
    }
    
    const userId = userData._id;
    
    // Clear previous socket if it exists
    if (userSockets[userId]) {
      console.log(`Replacing existing socket for user ${userId}`);
      const oldSocketId = userSockets[userId];
      const oldSocket = io.sockets.sockets.get(oldSocketId);
      if (oldSocket) {
        oldSocket.leave(userId);
      }
    }
    
    // Join user's room and store the socket
    socket.join(userId);
    userSockets[userId] = socket.id;
    socket.userId = userId; // Store userId on socket for easy reference
    
    socket.emit('connected');
    console.log(`User ${userId} connected with socket ${socket.id}`);
  });

  // Join a chat room
  socket.on('join chat', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room: ${room}`);
  });
  
  // Handle typing indicator
  socket.on('typing', (room) => {
    socket.to(room).emit('typing');
  });
  
  socket.on('stop typing', (room) => {
    socket.to(room).emit('stop typing');
  });

  // Handle new messages
  socket.on('new message', (newMessageReceived) => {
    const chat = newMessageReceived.chat;

    if (!chat || !chat.users) {
      console.log('chat.users not defined in message');
      return;
    }

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) {
        return; // Skip sender
      }
      
      console.log(`Sending message to user ${user._id}`);
      socket.to(user._id).emit('message received', newMessageReceived);
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
    
    // Remove from userSockets
    if (socket.userId && userSockets[socket.userId] === socket.id) {
      delete userSockets[socket.userId];
      console.log(`Removed user ${socket.userId} from socket tracking`);
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});