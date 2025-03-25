# MERN Chat Application

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![License](https://img.shields.io/badge/License-MIT-blue)
![Version](https://img.shields.io/badge/Version-1.0.0-orange)

<p align="center">
  <img src="https://i.imgur.com/8rDMrAs.png" alt="MERN Chat Logo" width="250"/>
</p>

A full-featured real-time chat application built with the MERN (MongoDB, Express, React, Node.js) stack. This application provides a seamless chatting experience with features like real-time messaging, group chats, typing indicators, and media sharing.

## ✨ Features

- **User Authentication** — Secure signup and login with JWT
- **Real-time Messaging** — Instant message delivery using Socket.io
- **Personal & Group Chats** — Create one-on-one or group conversations
- **Typing Indicators** — See when others are typing
- **Message Notifications** — Get notified of new messages
- **User Status** — See online/offline status of users
- **Image Sharing** — Upload and share images in conversations
- **Responsive Design** — Works on desktops, tablets, and mobile devices

## 📸 Screenshots

<p align="center">
  <img src="https://i.imgur.com/VxZo71j.png" alt="Chat Interface" width="80%"/>
</p>

<p align="center">
  <img src="https://i.imgur.com/LmcRRF7.png" alt="Mobile Responsive" width="30%"/>
  <img src="https://i.imgur.com/w2XcQc4.png" alt="Chat Features" width="30%"/>
  <img src="https://i.imgur.com/rH8QjzC.png" alt="Login Screen" width="30%"/>
</p>

## 🛠️ Technologies Used

### Frontend
- **React** — A JavaScript library for building user interfaces
- **Context API** — For state management
- **React Router** — For navigation between pages
- **Socket.io Client** — For real-time communication with the server
- **Axios** — For making HTTP requests
- **CSS3** — For styling components

### Backend
- **Node.js** — JavaScript runtime built on Chrome's V8 JavaScript engine
- **Express** — Fast, unopinionated, minimalist web framework for Node.js
- **MongoDB** — NoSQL database for storing application data
- **Mongoose** — MongoDB object modeling for Node.js
- **Socket.io** — For real-time bidirectional event-based communication
- **JSON Web Token** — For secure authentication
- **Bcrypt** — For password hashing
- **Multer** — For handling file uploads

## 🚀 Installation and Setup

### Prerequisites
- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- MongoDB (v4.0.0 or later)

### Clone the Repository
```bash
git clone https://github.com/yourusername/mern-chat-app.git
cd mern-chat-app
```

### Setting up the Backend
1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory with the following variables:
```
MONGO_URI=mongodb://localhost:27017/mern-chat
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

4. Start the server:
```bash
npm run dev
```

### Setting up the Frontend
1. Navigate to the client directory:
```bash
cd ../client
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

4. The application should now be running on `http://localhost:3000`

## 📝 API Documentation

The API provides the following endpoints:

### Authentication Routes
- `POST /api/users` - Register a new user
- `POST /api/users/login` - Login a user

### User Routes
- `GET /api/users` - Search for users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Chat Routes
- `GET /api/chat` - Get all chats for a user
- `POST /api/chat` - Access or create a one-on-one chat
- `POST /api/chat/group` - Create a group chat
- `PUT /api/chat/rename` - Rename a group chat
- `PUT /api/chat/groupadd` - Add a user to a group
- `PUT /api/chat/groupremove` - Remove a user from a group

### Message Routes
- `GET /api/messages/:chatId` - Get all messages for a chat
- `POST /api/messages` - Send a message

### Upload Route
- `POST /api/upload` - Upload an image

## 🔌 Socket.io Events

The application uses the following Socket.io events for real-time communication:

- `setup` - Establish a user connection
- `join chat` - Join a specific chat room
- `typing` - Indicate that a user is typing
- `stop typing` - Indicate that a user has stopped typing
- `new message` - Send a new message
- `message received` - Receive a new message

## 🧪 Testing

To run tests for the frontend:
```bash
cd client
npm test
```

To run tests for the backend:
```bash
cd server
npm test
```

## 📱 Responsive Design

The application is fully responsive and works on devices of all sizes:
- Desktop (1024px and above)
- Tablet (768px to 1023px)
- Mobile (below 768px)

## 🛣️ Roadmap

Future enhancements planned for the application:

- [ ] End-to-end encryption for messages
- [ ] Voice and video calling features
- [ ] Message reactions and replies
- [ ] Read receipts
- [ ] Dark/Light theme toggle
- [ ] Progressive Web App (PWA) support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

- **Your Name** - [GitHub Profile](https://github.com/Twarga)

## 🙏 Acknowledgements

- [Socket.io Documentation](https://socket.io/docs/v4)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express Documentation](https://expressjs.com/)
- [Node.js Documentation](https://nodejs.org/en/docs/)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/Twarga">Your Name</a>
</p>
