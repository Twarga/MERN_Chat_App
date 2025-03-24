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

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const server = http.createServer(app);

// Configure Socket.io with permissive CORS
const io = socketio(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  },
  pingTimeout: 60000 // Increase timeout to avoid frequent disconnects
});

// Configure Express middleware
app.use(cors({
  origin: "*", // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('MERN Chat API is running');
});

// Map to store active user connections
const userSocketMap = {};

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`New socket connection: ${socket.id}`);

  // Handle user setup
  socket.on('setup', (userData) => {
    if (!userData || !userData._id) {
      console.log('Invalid user data for socket setup');
      return;
    }

    const userId = userData._id;

    // Store user's socket for later reference
    userSocketMap[userId] = socket.id;
    
    // Join a room named after the user ID
    socket.join(userId);
    
    // Store userId on socket object for easy reference on disconnect
    socket.userId = userId;
    
    // Emit confirmation
    socket.emit('connected');
    console.log(`User ${userId} connected with socket ${socket.id}`);
  });

  // Handle joining a specific chat room
  socket.on('join chat', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  // Handle typing indicators
  socket.on('typing', (roomId) => {
    socket.to(roomId).emit('typing');
  });

  socket.on('stop typing', (roomId) => {
    socket.to(roomId).emit('stop typing');
  });

  // Handle new messages
  socket.on('new message', (messageData) => {
    const chat = messageData.chat;

    if (!chat || !chat.users) {
      console.log('Invalid chat data in message:', messageData);
      return;
    }

    // Broadcast to all users in the chat except sender
    chat.users.forEach(user => {
      if (user._id === messageData.sender._id) return; // Skip sender
      
      // Send to user's personal room
      socket.to(user._id).emit('message received', messageData);
      console.log(`Message sent to user ${user._id}`);
    });
  });

  // Handle new chat creation event
  socket.on('new chat', (chatData) => {
    if (!chatData || !chatData.users) {
      console.log('Invalid chat data:', chatData);
      return;
    }

    // Broadcast new chat to all users involved except the creator
    chatData.users.forEach(user => {
      if (user._id === socket.userId) return; // Skip creator
      
      // Send to user's personal room
      socket.to(user._id).emit('chat created', chatData);
      console.log(`New chat notification sent to user ${user._id}`);
    });
  });

  // Handle group chat creation event
  socket.on('new group', (groupData) => {
    if (!groupData || !groupData.users) {
      console.log('Invalid group data:', groupData);
      return;
    }

    // Broadcast new group to all users involved except the creator
    groupData.users.forEach(user => {
      if (user._id === socket.userId) return; // Skip creator
      
      // Send to user's personal room
      socket.to(user._id).emit('group created', groupData);
      console.log(`New group notification sent to user ${user._id}`);
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
    
    // Clean up user mapping on disconnect
    if (socket.userId) {
      delete userSocketMap[socket.userId];
      console.log(`Removed user ${socket.userId} from socket map`);
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    message: 'Server error',
    error: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});