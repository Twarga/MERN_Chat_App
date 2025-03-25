# Tutoriel: Application de Chat MERN Stack
![MERN Stack](/home/twarga/Documents/MERN/mern-chat-app/mern-chat-architecture.png)
## Table des matières

1. [Introduction](#introduction)
2. [Configuration de l'environnement](#configuration-de-lenvironnement)
   - [Prérequis](#prérequis)
   - [Installation de Node.js](#installation-de-nodejs)
   - [Installation de MongoDB](#installation-de-mongodb)
   - [Configuration de l'IDE](#configuration-de-lide)
3. [Structure du projet](#structure-du-projet)
4. [Backend (Serveur)](#backend-serveur)
   - [Configuration initiale](#configuration-initiale)
   - [Modèles de données](#modèles-de-données)
   - [Contrôleurs](#contrôleurs)
   - [Routes](#routes)
   - [Middleware d'authentification](#middleware-dauthentification)
   - [Configuration de Socket.io](#configuration-de-socketio)
5. [Frontend (Client)](#frontend-client)
   - [Création de l'application React](#création-de-lapplication-react)
   - [Contextes et Hooks](#contextes-et-hooks)
   - [Composants](#composants)
   - [Pages](#pages)
   - [Utilitaires](#utilitaires)
6. [Connexion du Frontend et du Backend](#connexion-du-frontend-et-du-backend)
7. [Fonctionnalités avancées](#fonctionnalités-avancées)
   - [Authentification](#authentification)
   - [Chat en temps réel](#chat-en-temps-réel)
   - [Téléchargement de fichiers](#téléchargement-de-fichiers)
8. [Déploiement](#déploiement)
9. [Dépannage](#dépannage)
10. [Conclusion](#conclusion)

## Introduction

Bienvenue dans ce tutoriel détaillé pour créer une application de chat en temps réel utilisant la stack MERN (MongoDB, Express, React, Node.js). Cette application permettra aux utilisateurs de s'inscrire, de se connecter, de discuter en privé ou en groupe, et même de partager des images.

Dans ce tutoriel, nous allons examiner chaque partie du code, expliquer les concepts importants et vous guider pas à pas dans le processus de développement. Que vous soyez débutant ou que vous ayez déjà une certaine expérience, ce tutoriel vous aidera à comprendre comment tous les éléments s'assemblent pour créer une application de chat fonctionnelle.

Voici quelques fonctionnalités que notre application comportera:
- Authentification des utilisateurs (inscription et connexion)
- Chats individuels et groupés
- Indicateurs de frappe en temps réel
- Notifications de nouveaux messages
- Téléchargement et partage d'images
- Interface utilisateur réactive

Commençons par configurer notre environnement de développement!

## Configuration de l'environnement

### Prérequis

Avant de commencer, assurons-nous que vous disposez de tout ce dont vous avez besoin sur votre machine Windows:

1. Un ordinateur fonctionnant sous Windows 10 ou 11
2. Une connexion Internet stable
3. Droits d'administrateur sur votre ordinateur (pour installer des logiciels)

### Installation de Node.js

Node.js est l'environnement d'exécution JavaScript que nous utiliserons pour notre serveur backend.

1. Visitez [nodejs.org](https://nodejs.org/)
2. Téléchargez la version LTS (Long Term Support) - recommandée pour la plupart des utilisateurs
3. Exécutez le programme d'installation et suivez les instructions à l'écran
4. Acceptez les termes du contrat de licence
5. Laissez les paramètres d'installation par défaut et cliquez sur "Suivant"
6. Cliquez sur "Installer"
7. Une fois l'installation terminée, cliquez sur "Terminer"

Pour vérifier que Node.js est correctement installé, ouvrez l'invite de commande (cmd) en tapant "cmd" dans la barre de recherche Windows, puis exécutez:

```bash
node --version
npm --version
```

Ces commandes devraient afficher les versions installées de Node.js et npm (le gestionnaire de paquets de Node.js).

### Installation de MongoDB

MongoDB est notre base de données NoSQL qui stockera toutes les données de notre application.

1. Visitez [mongodb.com](https://www.mongodb.com/try/download/community)
2. Téléchargez MongoDB Community Server pour Windows
3. Exécutez le programme d'installation
4. Cliquez sur "Suivant" et acceptez les conditions d'utilisation
5. Choisissez "Complete" comme type d'installation
6. Assurez-vous que l'option "Install MongoDB as a Service" est cochée
7. Conservez les autres paramètres par défaut et cliquez sur "Suivant"
8. Cliquez sur "Installer"

Pour vérifier que MongoDB est correctement installé, ouvrez l'invite de commande et exécutez:

```bash
mongod --version
```

### Configuration de l'IDE

Nous allons utiliser Visual Studio Code (VS Code) comme éditeur de code pour ce projet.

1. Visitez [code.visualstudio.com](https://code.visualstudio.com/)
2. Téléchargez VS Code pour Windows
3. Exécutez le programme d'installation et suivez les instructions
4. Une fois installé, ouvrez VS Code

Extensions recommandées pour VS Code:
- ESLint (pour la vérification syntaxique)
- Prettier (pour le formatage du code)
- JavaScript (ES6) code snippets
- MongoDB for VS Code
- Thunder Client (pour tester les API)

Pour installer ces extensions:
1. Cliquez sur l'icône Extensions dans la barre latérale (ou appuyez sur Ctrl+Shift+X)
2. Recherchez chaque extension mentionnée ci-dessus
3. Cliquez sur "Installer" pour chacune d'elles

## Structure du projet

Notre projet est divisé en deux parties principales: le backend (serveur) et le frontend (client). Voici à quoi ressemble la structure de notre projet:

```
mern-chat/
├── client/                  # Frontend React
│   ├── public/              # Fichiers statiques
│   └── src/                 # Code source React
│       ├── components/      # Composants réutilisables
│       ├── context/         # Contextes React (état global)
│       ├── hooks/           # Hooks personnalisés
│       ├── pages/           # Pages de l'application
│       └── utils/           # Utilitaires et helpers
├── server/                  # Backend Node.js
│   ├── controllers/         # Logique métier
│   ├── middleware/          # Middlewares Express
│   ├── models/              # Modèles Mongoose
│   ├── routes/              # Routes API
│   └── server.js            # Point d'entrée du serveur
└── uploads/                 # Dossier pour les fichiers téléchargés
```

Commençons par créer cette structure. Ouvrez l'invite de commande et exécutez:

```bash
mkdir mern-chat
cd mern-chat
mkdir server
mkdir uploads
```

## Backend (Serveur)

### Configuration initiale

Commençons par configurer notre serveur Node.js avec Express.

1. Naviguez vers le dossier server:
```bash
cd server
```

2. Initialisez un nouveau projet Node.js:
```bash
npm init -y
```

3. Installez les dépendances nécessaires:
```bash
npm install express mongoose dotenv cors jsonwebtoken bcryptjs socket.io multer
npm install --save-dev nodemon
```

Voici à quoi servent ces packages:
- **express**: Framework web pour Node.js
- **mongoose**: ODM (Object Data Modeling) pour MongoDB
- **dotenv**: Pour charger les variables d'environnement
- **cors**: Middleware pour activer CORS (Cross-Origin Resource Sharing)
- **jsonwebtoken**: Pour l'authentification basée sur les tokens
- **bcryptjs**: Pour hacher les mots de passe
- **socket.io**: Pour la communication en temps réel
- **multer**: Pour gérer les téléchargements de fichiers
- **nodemon**: Pour redémarrer automatiquement le serveur lors des modifications (dépendance de développement)

4. Créez un fichier `.env` à la racine du dossier server pour stocker les variables d'environnement:

```bash
touch .env
```

Ouvrez ce fichier dans VS Code et ajoutez les lignes suivantes:

```
MONGO_URI=mongodb://localhost:27017/mern-chat
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

5. Créez la structure de dossiers pour notre serveur:

```bash
mkdir controllers middleware models routes
```

6. Créez le fichier principal du serveur:

```bash
touch server.js
```

Maintenant, ouvrons server.js dans VS Code et ajoutons le code suivant:

```javascript
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

// Charger les variables d'environnement
dotenv.config();

// Initialiser l'application express
const app = express();
const server = http.createServer(app);

// Configurer Socket.io avec CORS permissif
const io = socketio(server, {
  cors: {
    origin: "*", // Autoriser toutes les origines
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  },
  pingTimeout: 60000 // Augmenter le timeout pour éviter les déconnexions fréquentes
});

// Configurer les middlewares Express
app.use(cors({
  origin: "*", // Autoriser toutes les origines
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Servir les fichiers statiques du dossier uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connecté avec succès'))
  .catch(err => console.error('Erreur de connexion MongoDB:', err));

// Routes API
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);

// Route de vérification
app.get('/', (req, res) => {
  res.send('L\'API MERN Chat fonctionne');
});

// Map pour stocker les connexions utilisateur actives
const userSocketMap = {};

// Gestion des connexions Socket.io
io.on('connection', (socket) => {
  console.log(`Nouvelle connexion socket: ${socket.id}`);

  // Gérer la configuration utilisateur
  socket.on('setup', (userData) => {
    if (!userData || !userData._id) {
      console.log('Données utilisateur invalides pour la configuration socket');
      return;
    }

    const userId = userData._id;

    // Stocker le socket de l'utilisateur pour référence ultérieure
    userSocketMap[userId] = socket.id;
    
    // Rejoindre une salle nommée d'après l'ID utilisateur
    socket.join(userId);
    
    // Stocker l'userId sur l'objet socket pour faciliter la référence lors de la déconnexion
    socket.userId = userId;
    
    // Émettre une confirmation
    socket.emit('connected');
    console.log(`Utilisateur ${userId} connecté avec socket ${socket.id}`);
  });

  // Gérer la participation à une salle de chat spécifique
  socket.on('join chat', (roomId) => {
    socket.join(roomId);
    console.log(`Utilisateur a rejoint la salle: ${roomId}`);
  });

  // Gérer les indicateurs de frappe
  socket.on('typing', (roomId) => {
    socket.to(roomId).emit('typing');
  });

  socket.on('stop typing', (roomId) => {
    socket.to(roomId).emit('stop typing');
  });

  // Gérer les nouveaux messages
  socket.on('new message', (messageData) => {
    const chat = messageData.chat;

    if (!chat || !chat.users) {
      console.log('Données de chat invalides dans le message:', messageData);
      return;
    }

    // Diffuser à tous les utilisateurs du chat sauf l'expéditeur
    chat.users.forEach(user => {
      if (user._id === messageData.sender._id) return; // Ignorer l'expéditeur
      
      // Envoyer à la salle personnelle de l'utilisateur
      socket.to(user._id).emit('message received', messageData);
      console.log(`Message envoyé à l'utilisateur ${user._id}`);
    });
  });

  // Gérer l'événement de création d'un nouveau chat
  socket.on('new chat', (chatData) => {
    if (!chatData || !chatData.users) {
      console.log('Données de chat invalides:', chatData);
      return;
    }

    // Diffuser le nouveau chat à tous les utilisateurs impliqués sauf le créateur
    chatData.users.forEach(user => {
      if (user._id === socket.userId) return; // Ignorer le créateur
      
      // Envoyer à la salle personnelle de l'utilisateur
      socket.to(user._id).emit('chat created', chatData);
      console.log(`Notification de nouveau chat envoyée à l'utilisateur ${user._id}`);
    });
  });

  // Gérer l'événement de création d'un groupe de chat
  socket.on('new group', (groupData) => {
    if (!groupData || !groupData.users) {
      console.log('Données de groupe invalides:', groupData);
      return;
    }

    // Diffuser le nouveau groupe à tous les utilisateurs impliqués sauf le créateur
    groupData.users.forEach(user => {
      if (user._id === socket.userId) return; // Ignorer le créateur
      
      // Envoyer à la salle personnelle de l'utilisateur
      socket.to(user._id).emit('group created', groupData);
      console.log(`Notification de nouveau groupe envoyée à l'utilisateur ${user._id}`);
    });
  });

  // Gérer la déconnexion
  socket.on('disconnect', () => {
    console.log(`Socket déconnecté: ${socket.id}`);
    
    // Nettoyer le mappage utilisateur lors de la déconnexion
    if (socket.userId) {
      delete userSocketMap[socket.userId];
      console.log(`Utilisateur ${socket.userId} supprimé du mappage socket`);
    }
  });
});

// Gestionnaire d'erreur global
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({
    message: 'Erreur serveur',
    error: process.env.NODE_ENV === 'production' ? 'Une erreur est survenue' : err.message
  });
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
```

### Modèles de données

Maintenant, créons nos modèles de données MongoDB. Commençons par le modèle User:

1. Créez le fichier pour le modèle User:
```bash
touch models/User.js
```

2. Ajoutez le code suivant à User.js:

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    profilePic: {
      type: String,
      default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },
    isOnline: {
      type: Boolean,
      default: false
    },
    lastSeen: {
      type: Date
    }
  },
  { timestamps: true }
);

// Hacher le mot de passe avant l'enregistrement
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer les mots de passe
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
```

3. Créez le fichier pour le modèle Chat:
```bash
touch models/Chat.js
```

4. Ajoutez le code suivant à Chat.js:

```javascript
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
      required: true
    },
    isGroupChat: {
      type: Boolean,
      default: false
    },
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
```

5. Créez le fichier pour le modèle Message:
```bash
touch models/Message.js
```

6. Ajoutez le code suivant à Message.js:

```javascript
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      trim: true,
      required: true
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: true
    },
    readBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
```

### Contrôleurs

Maintenant, créons les contrôleurs qui contiendront la logique de notre application.

1. Créez le fichier pour le contrôleur d'utilisateur:
```bash
touch controllers/userController.js
```

2. Ajoutez le code suivant à userController.js:

```javascript
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Générer un token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Enregistrer un nouvel utilisateur
// @route   POST /api/users
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ 
        message: 'L\'utilisateur existe déjà' 
      });
    }

    // Créer un nouvel utilisateur
    const user = await User.create({
      username,
      email,
      password
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        isOnline: user.isOnline,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ 
        message: 'Données utilisateur invalides' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

// @desc    Authentifier l'utilisateur et obtenir un token
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur par email
    const user = await User.findOne({ email });

    // Vérifier si l'utilisateur existe et si le mot de passe correspond
    if (user && (await user.matchPassword(password))) {
      // Mettre à jour le statut en ligne
      user.isOnline = true;
      await user.save();

      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        isOnline: user.isOnline,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ 
        message: 'Email ou mot de passe invalide' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

// @desc    Obtenir le profil de l'utilisateur
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ 
        message: 'Utilisateur non trouvé' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

// @desc    Mettre à jour le profil de l'utilisateur
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user) {
      user.username = req.body.username || user.username;
      
      if (req.body.profilePic) {
        user.profilePic = req.body.profilePic;
      }
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        profilePic: updatedUser.profilePic,
        isOnline: updatedUser.isOnline,
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404).json({ 
        message: 'Utilisateur non trouvé' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

// @desc    Obtenir tous les utilisateurs
// @route   GET /api/users
// @access  Private
exports.getUsers = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { username: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } }
          ]
        }
      : {};

    // Trouver tous les utilisateurs sauf l'utilisateur actuel
    const users = await User.find(keyword)
      .find({ _id: { $ne: req.user._id } })
      .select('-password');
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};
```

3. Créez le fichier pour le contrôleur de chat:
```bash
touch controllers/chatController.js
```

4. Ajoutez le code suivant à chatController.js:

```javascript
const Chat = require('../models/Chat');
const User = require('../models/User');

// @desc    Créer ou récupérer un chat individuel
// @route   POST /api/chat
// @access  Private
exports.accessChat = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log("Demande d'accès au chat reçue pour userId:", userId);
    console.log("Utilisateur actuel:", req.user._id);

    if (!userId) {
      console.log("Paramètre userId non envoyé avec la requête");
      return res.status(400).json({ message: "Paramètre userId non envoyé avec la requête" });
    }

    // Vérifier si le chat existe avec l'utilisateur actuel et l'utilisateur demandé
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "username profilePic email",
    });

    if (isChat.length > 0) {
      console.log("Chat existant trouvé");
      res.json(isChat[0]);
    } else {
      console.log("Création d'un nouveau chat");
      // Créer un nouveau chat
      const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };

      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      console.log("Nouveau chat créé:", fullChat._id);
      res.status(200).json(fullChat);
    }
  } catch (error) {
    console.error("Erreur dans accessChat:", error.message);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// @desc    Récupérer tous les chats d'un utilisateur
// @route   GET /api/chat
// @access  Private
exports.fetchChats = async (req, res) => {
  try {
    console.log("Demande de récupération des chats de l'utilisateur:", req.user._id);
    // Trouver tous les chats où l'utilisateur est présent
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "username profilePic email",
        });
        console.log("Chats trouvés:", results.length);
        res.status(200).json(results);
      });
  } catch (error) {
    console.error("Erreur dans fetchChats:", error.message);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// @desc    Créer un nouveau groupe de chat
// @route   POST /api/chat/group
// @access  Private
exports.createGroupChat = async (req, res) => {
  try {
    if (!req.body.users || !req.body.name) {
      return res.status(400).json({ message: "Veuillez remplir tous les champs" });
    }

    let users = JSON.parse(req.body.users);

    if (users.length < 2) {
      return res
        .status(400)
        .json({ message: "Plus de 2 utilisateurs sont nécessaires pour former un groupe de chat" });
    }

    // Ajouter l'utilisateur actuel au groupe
    users.push(req.user);

    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// @desc    Renommer un groupe
// @route   PUT /api/chat/rename
// @access  Private
exports.renameGroup = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      res.status(404).json({ message: "Chat non trouvé" });
    } else {
      res.json(updatedChat);
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// @desc    Ajouter un utilisateur au groupe
// @route   PUT /api/chat/groupadd
// @access  Private
exports.addToGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    // Vérifier si le demandeur est administrateur
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat non trouvé" });
    }

    if (chat.groupAdmin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Seuls les administrateurs peuvent ajouter des utilisateurs" });
    }

    const added = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!added) {
      res.status(404).json({ message: "Chat non trouvé" });
    } else {
      res.json(added);
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// @desc    Supprimer un utilisateur du groupe
// @route   PUT /api/chat/groupremove
// @access  Private
exports.removeFromGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    // Vérifier si le demandeur est administrateur
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat non trouvé" });
    }

    if (chat.groupAdmin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Seuls les administrateurs peuvent supprimer des utilisateurs" });
    }

    const removed = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!removed) {
      res.status(404).json({ message: "Chat non trouvé" });
    } else {
      res.json(removed);
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

5. Créez le fichier pour le contrôleur de messages:
```bash
touch controllers/messageController.js
```

6. Ajoutez le code suivant à messageController.js:

```javascript
const Message = require('../models/Message');
const User = require('../models/User');
const Chat = require('../models/Chat');

// @desc    Obtenir tous les messages
// @route   GET /api/messages/:chatId
// @access  Private
exports.allMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "username profilePic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// @desc    Créer un nouveau message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.status(400).json({ message: "Données invalides passées dans la requête" });
  }

  try {
    // Créer un nouveau message
    let message = await Message.create({
      sender: req.user._id,
      content: content,
      chat: chatId,
    });

    // Peupler le message avec des détails supplémentaires
    message = await message.populate("sender", "username profilePic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "username profilePic email",
    });

    // Mettre à jour le dernier message dans le chat
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
```

### Middleware d'authentification

Maintenant, créons notre middleware d'authentification:

1. Créez le fichier pour le middleware d'authentification:
```bash
touch middleware/authMiddleware.js
```

2. Ajoutez le code suivant à authMiddleware.js:

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Obtenir le token de l'en-tête
      token = req.headers.authorization.split(' ')[1];

      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Obtenir l'utilisateur à partir du token
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Non autorisé, token invalide' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Non autorisé, aucun token' });
  }
};

module.exports = { protect };
```

3. Créez le fichier pour le middleware de téléchargement:
```bash
touch middleware/uploadMiddleware.js
```

4. Ajoutez le code suivant à uploadMiddleware.js:

```javascript
const multer = require('multer');
const path = require('path');

// Configurer le moteur de stockage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, '../uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Vérifier le type de fichier
function checkFileType(file, cb) {
  // Extensions de fichier autorisées
  const filetypes = /jpeg|jpg|png|gif/;
  // Vérifier l'extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Vérifier le type MIME
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Erreur: Images uniquement!');
  }
}

// Initialiser le téléchargement
const upload = multer({
    storage,
    limits: { fileSize: 1000000 }, // limite de 1MB
    fileFilter: function(req, file, cb) {
      checkFileType(file, cb);
    }
  });
  
module.exports = upload;
```

### Routes

Maintenant, configurons les routes de notre API:

1. Créez le fichier pour les routes utilisateur:
```bash
touch routes/userRoutes.js
```

2. Ajoutez le code suivant à userRoutes.js:

```javascript
const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  getUsers,
  updateUserProfile
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(registerUser).get(protect, getUsers);
router.post('/login', loginUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

module.exports = router;
```

3. Créez le fichier pour les routes de chat:
```bash
touch routes/chatRoutes.js
```

4. Ajoutez le code suivant à chatRoutes.js:

```javascript
const express = require('express');
const router = express.Router();
const { 
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, accessChat).get(protect, fetchChats);
router.route('/group').post(protect, createGroupChat);
router.route('/rename').put(protect, renameGroup);
router.route('/groupadd').put(protect, addToGroup);
router.route('/groupremove').put(protect, removeFromGroup);

module.exports = router;
```

5. Créez le fichier pour les routes de messages:
```bash
touch routes/messageRoutes.js
```

6. Ajoutez le code suivant à messageRoutes.js:

```javascript
const express = require('express');
const router = express.Router();
const { allMessages, sendMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, sendMessage);
router.route('/:chatId').get(protect, allMessages);

module.exports = router;
```

7. Créez le fichier pour les routes de téléchargement:
```bash
touch routes/uploadRoutes.js
```

8. Ajoutez le code suivant à uploadRoutes.js:

```javascript
const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/upload
// @desc    Télécharger un fichier
// @access  Private
router.post('/', protect, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier téléchargé' });
    }
    
    // Retourner le chemin du fichier
    res.json({
      fileName: req.file.filename,
      filePath: `/uploads/${req.file.filename}`
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;
```

### Démarrage du serveur

Maintenant, nous pouvons configurer notre serveur pour qu'il puisse être démarré facilement:

1. Ouvrez package.json et ajoutez les scripts suivants:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

2. Pour tester le serveur, exécutez:
```bash
npm run dev
```

Vous devriez voir un message indiquant que le serveur est en cours d'exécution sur le port 5000 et que MongoDB est connecté.

## Frontend (Client)

Maintenant que notre backend est configuré, passons au frontend avec React. Nous allons créer une application React qui se connectera à notre API et affichera une interface utilisateur agréable pour nos utilisateurs.

### Création de l'application React

1. Retournez dans le dossier principal du projet:
```bash
cd ..
```

2. Créez une nouvelle application React:
```bash
npx create-react-app client
```

3. Une fois l'application créée, naviguez vers le dossier client:
```bash
cd client
```

4. Installez les dépendances nécessaires:
```bash
npm install axios react-router-dom socket.io-client react-icons
```

5. Ouvrez le fichier package.json et ajoutez la ligne suivante pour configurer le proxy vers notre serveur backend:
```json
"proxy": "http://localhost:5000"
```

### Structure des dossiers

Organisez votre structure de dossiers comme suit:

```bash
mkdir -p src/components/Chat/Modals src/components/Chat/Notifications src/components/Chat/FileUpload src/components/Message src/components/Spinner src/components/UserAvatar src/context src/hooks src/pages src/utils
```

### Contextes et Hooks

Commençons par créer les contextes et hooks nécessaires pour gérer l'état global de notre application:

1. Créez le contexte d'authentification:
```bash
touch src/context/AuthContext.js
```

2. Ajoutez le code suivant à AuthContext.js:

```javascript
import React, { createContext, useReducer } from 'react';
import * as api from '../utils/api';

// État initial
const initialState = {
  user: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
  loading: false,
  error: null,
};

// Créer le contexte
export const AuthContext = createContext(initialState);

// Types d'actions
const LOGIN_REQUEST = 'LOGIN_REQUEST';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAIL = 'LOGIN_FAIL';
const LOGOUT = 'LOGOUT';
const CLEAR_ERROR = 'CLEAR_ERROR';

// Fonction de réduction
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

// Composant Provider
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Action de connexion
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

  // Action d'enregistrement
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

  // Action de déconnexion
  const logout = () => {
    localStorage.removeItem('userInfo');
    dispatch({ type: LOGOUT });
  };

  // Effacer l'erreur
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

3. Créez le hook Auth:
```bash
touch src/hooks/useAuth.js
```

4. Ajoutez le code suivant à useAuth.js:

```javascript
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  return useContext(AuthContext);
};
```

5. Créez le contexte de chat:
```bash
touch src/context/ChatContext.js
```

6. Ajoutez le code suivant à ChatContext.js:

```javascript
import React, { createContext, useReducer, useCallback, useEffect } from 'react';
import * as api from '../utils/api';
import socket from '../utils/socket';

// État initial
const initialState = {
  selectedChat: null,
  chats: [],
  notifications: [],
  loading: false,
  error: null,
};

// Créer le contexte
export const ChatContext = createContext(initialState);

// Types d'actions
const SET_SELECTED_CHAT = 'SET_SELECTED_CHAT';
const SET_CHATS = 'SET_CHATS';
const ADD_CHAT = 'ADD_CHAT';
const UPDATE_CHAT = 'UPDATE_CHAT';
const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';
const CHAT_LOADING = 'CHAT_LOADING';
const CHAT_ERROR = 'CHAT_ERROR';
const CHAT_RESET = 'CHAT_RESET';

// Fonction de réduction
const chatReducer = (state, action) => {
  switch (action.type) {
    case SET_SELECTED_CHAT:
      return { ...state, selectedChat: action.payload };
    case SET_CHATS:
      return { ...state, chats: action.payload };
    case ADD_CHAT:
      // Vérifier si le chat existe déjà pour éviter les doublons
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

// Composant Provider
export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Écouter les événements socket
  useEffect(() => {
    // Gérer la création d'un nouveau chat
    socket.on('chat created', (newChat) => {
      console.log('Nouveau chat reçu:', newChat);
      dispatch({ type: ADD_CHAT, payload: newChat });
    });

    // Gérer la création d'un nouveau groupe
    socket.on('group created', (newGroup) => {
      console.log('Nouveau groupe reçu:', newGroup);
      dispatch({ type: ADD_CHAT, payload: newGroup });
    });

    return () => {
      socket.off('chat created');
      socket.off('group created');
    };
  }, []);

  // Définir le chat sélectionné
  const setSelectedChat = useCallback((chat) => {
    dispatch({ type: SET_SELECTED_CHAT, payload: chat });
  }, []);

  // Récupérer tous les chats
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

  // Accéder ou créer un chat
  const accessChat = useCallback(async (userId, token) => {
    try {
      dispatch({ type: CHAT_LOADING });

      const data = await api.post('/api/chat', { userId }, token);

      // Si le chat n'est pas déjà dans la liste, l'ajouter
      if (!state.chats.find((c) => c._id === data._id)) {
        dispatch({ type: ADD_CHAT, payload: data });
        
        // Émettre un événement de nouveau chat au socket
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

  // Créer un groupe de chat
  const createGroupChat = useCallback(async (users, name, token) => {
    try {
      dispatch({ type: CHAT_LOADING });

      const data = await api.post(
        '/api/chat/group',
        { users: JSON.stringify(users), name },
        token
      );

      dispatch({ type: ADD_CHAT, payload: data });
      
      // Émettre un événement de nouveau groupe au socket
      socket.emit('new group', data);
      
      dispatch({ type: CHAT_RESET });
      
      return data;
    } catch (error) {
      dispatch({ type: CHAT_ERROR, payload: error.message });
      throw error;
    }
  }, []);

  // Renommer un groupe
  const renameGroup = useCallback(async (chatId, chatName, token) => {
    try {
      dispatch({ type: CHAT_LOADING });

      const data = await api.put(
        '/api/chat/rename',
        { chatId, chatName },
        token
      );

      dispatch({ type: UPDATE_CHAT, payload: data });
      
      // Si c'est le chat sélectionné, le mettre à jour
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

  // Ajouter un utilisateur au groupe
  const addToGroup = useCallback(async (chatId, userId, token) => {
    try {
      dispatch({ type: CHAT_LOADING });

      const data = await api.put(
        '/api/chat/groupadd',
        { chatId, userId },
        token
      );

      dispatch({ type: UPDATE_CHAT, payload: data });
      
      // Si c'est le chat sélectionné, le mettre à jour
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

  // Supprimer un utilisateur du groupe
  const removeFromGroup = useCallback(async (chatId, userId, token) => {
    try {
      dispatch({ type: CHAT_LOADING });

      const data = await api.put(
        '/api/chat/groupremove',
        { chatId, userId },
        token
      );

      dispatch({ type: UPDATE_CHAT, payload: data });
      
      // Si c'est le chat sélectionné, le mettre à jour
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

  // Ajouter une notification
  const addNotification = useCallback((notification) => {
    dispatch({ type: ADD_NOTIFICATION, payload: notification });
  }, []);

  // Supprimer une notification
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
```

7. Créez le hook Chat:
```bash
touch src/hooks/useChat.js
```

8. Ajoutez le code suivant à useChat.js:

```javascript
import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';

export const useChat = () => {
  return useContext(ChatContext);
};
```

### Utilitaires

Créons maintenant les utilitaires nécessaires pour communiquer avec notre API et configurer Socket.io:

1. Créez le fichier pour les utilitaires d'API:
```bash
touch src/utils/api.js
```

2. Ajoutez le code suivant à api.js:

```javascript
// Utilitaire API pour effectuer des requêtes fetch avec une gestion d'erreur fiable
const API_URL = 'http://localhost:5000';

/**
 * Effectuer une requête API avec une gestion d'erreur améliorée
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  try {
    console.log(`Requête API: ${options.method || 'GET'} ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    // Essayer de parser en JSON d'abord
    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    // Vérifier le statut d'erreur
    if (!response.ok) {
      const errorMessage = typeof data === 'object' && data.message
        ? data.message
        : `La requête a échoué avec le statut: ${response.status}`;
      
      throw new Error(errorMessage);
    }
    
    return data;
  } catch (error) {
    console.error(`Erreur API (${endpoint}):`, error);
    throw error;
  }
};

/**
 * Requête GET
 */
export const get = (endpoint, token) => {
  return apiRequest(endpoint, {
    method: 'GET',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
};

/**
 * Requête POST
 */
export const post = (endpoint, data, token) => {
  return apiRequest(endpoint, {
    method: 'POST',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    body: JSON.stringify(data)
  });
};

/**
 * Requête PUT
 */
export const put = (endpoint, data, token) => {
  return apiRequest(endpoint, {
    method: 'PUT',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    body: JSON.stringify(data)
  });
};

/**
 * Requête DELETE
 */
export const del = (endpoint, token) => {
  return apiRequest(endpoint, {
    method: 'DELETE',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
};
```

3. Créez le fichier pour la configuration Socket.io:
```bash
touch src/utils/socket.js
```

4. Ajoutez le code suivant à socket.js:

```javascript
import { io } from 'socket.io-client';

// Créer une instance socket avec une configuration améliorée
const socket = io('http://localhost:5000', {
  transports: ['websocket'], // Utiliser uniquement WebSocket pour de meilleures performances
  reconnection: true,        // Activer la reconnexion
  reconnectionAttempts: 5,   // Essayer de se reconnecter 5 fois
  reconnectionDelay: 1000,   // Commencer avec un délai de 1s entre les tentatives de reconnexion
  timeout: 10000,            // Délai d'expiration de connexion en ms
  autoConnect: true          // Se connecter automatiquement
});

// Ajouter des écouteurs d'événements pour le débogage
socket.on('connect', () => {
  console.log('Socket connecté avec succès');
});

socket.on('disconnect', () => {
  console.log('Socket déconnecté');
});

socket.on('connect_error', (error) => {
  console.error('Erreur de connexion Socket:', error.message);
});

socket.on('reconnect', (attempt) => {
  console.log(`Socket reconnecté après ${attempt} tentatives`);
});

socket.on('reconnect_error', (error) => {
  console.error('Erreur de reconnexion Socket:', error.message);
});

export default socket;
```

### Composants

Maintenant, commençons à créer les composants pour notre interface utilisateur. Nous allons uniquement détailler certains composants clés pour ce tutoriel, car il y en a beaucoup.

1. Commençons par le composant d'avatar utilisateur:
```bash
touch src/components/UserAvatar/UserAvatar.js
touch src/components/UserAvatar/UserAvatar.css
```

2. Ajoutez le code suivant à UserAvatar.js:

```javascript
import React from 'react';
import './UserAvatar.css';

const UserAvatar = ({ user, size = 'md' }) => {
  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  // Générer une couleur cohérente basée sur le nom d'utilisateur
  const getAvatarColor = (username) => {
    if (!username) return '#e0e0e0';
    
    // Simple fonction de hachage pour générer de la couleur
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Convertir en couleur hex
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
    }
    
    return color;
  };

  return (
    <div className={`avatar avatar-${size}`}>
      {user?.profilePic ? (
        <img 
          src={user.profilePic} 
          alt={user.username} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = 'none';
            e.target.parentNode.classList.add('avatar-fallback');
            e.target.parentNode.style.backgroundColor = getAvatarColor(user.username);
            e.target.parentNode.setAttribute('data-initials', getInitials(user.username));
          }}
        />
      ) : (
        <div 
          className="avatar-fallback" 
          style={{ backgroundColor: getAvatarColor(user?.username) }}
          data-initials={getInitials(user?.username)}
        ></div>
      )}
      {user?.isOnline && <span className="online-indicator"></span>}
    </div>
  );
};

export default UserAvatar;
```

3. Ajoutez le CSS associé dans UserAvatar.css:

```css
.avatar {
  position: relative;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.avatar-sm {
  width: 30px;
  height: 30px;
  font-size: 14px;
}

.avatar-md {
  width: 40px;
  height: 40px;
  font-size: 18px;
}

.avatar-lg {
  width: 80px;
  height: 80px;
  font-size: 32px;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
}

.avatar-fallback::after {
  content: attr(data-initials);
}

.online-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #4CAF50;
  border: 2px solid white;
}

.avatar-sm .online-indicator {
  width: 8px;
  height: 8px;
  border-width: 1px;
}

.avatar-lg .online-indicator {
  width: 12px;
  height: 12px;
  border-width: 2px;
}

@media (max-width: 480px) {
  .avatar-md {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
  
  .avatar-lg {
    width: 70px;
    height: 70px;
    font-size: 28px;
  }
}
```

4. Créez un composant de message:
```bash
touch src/components/Message/Message.js
touch src/components/Message/Message.css
```

5. Ajoutez le code suivant à Message.js:

```javascript
import React from 'react';
import UserAvatar from '../UserAvatar/UserAvatar';
import './Message.css';

const Message = ({ message, isSender = false }) => {
  // Vérifier si le message contient une image
  const isImageMessage = message.content && message.content.startsWith('![Image]');
  
  // Extraire l'URL de l'image si c'est un message d'image
  const getImageUrl = () => {
    if (!isImageMessage) return null;
    
    const regex = /!\[Image]\((.*?)\)/;
    const match = message.content.match(regex);
    return match ? match[1] : null;
  };
  
  // Formater l'heure pour l'affichage
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className={`message ${isSender ? 'message-sender' : 'message-receiver'}`}>
      {!isSender && (
        <div className="message-avatar">
          <UserAvatar user={message.sender} size="sm" />
        </div>
      )}
      
      <div className={`message-content ${isImageMessage ? 'message-image' : ''}`}>
        {!isSender && (
          <div className="message-sender-name">{message.sender?.username || 'Utilisateur'}</div>
        )}
        
        {isImageMessage ? (
          <img 
            src={getImageUrl()} 
            alt="Partagé" 
            className="message-img" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/200?text=Image+Non+Trouvée';
            }}
          />
        ) : (
          <div className="message-text">{message.content}</div>
        )}
        
        <div className="message-time">
          {formatTime(message.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default Message;
```

6. Ajoutez le CSS associé dans Message.css:

```css
.message {
  display: flex;
  margin: 8px 0;
  max-width: 80%;
}

.message-sender {
  margin-left: auto;
  flex-direction: row-reverse;
}

.message-receiver {
  margin-right: auto;
}

.message-avatar {
  margin: 0 8px;
  align-self: flex-end;
}

.message-content {
  padding: 8px 12px;
  border-radius: 16px;
  position: relative;
  word-break: break-word;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.message-sender .message-content {
  background-color: #dcf8c6;
  border-top-right-radius: 4px;
}

.message-receiver .message-content {
  background-color: #ffffff;
  border-top-left-radius: 4px;
}

.message-sender-name {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #7e57c2;
}

.message-text {
  font-size: 14px;
  line-height: 1.4;
}

.message-time {
  font-size: 10px;
  color: #9e9e9e;
  text-align: right;
  margin-top: 2px;
}

.message-image {
  padding: 4px;
  max-width: 320px;
}

.message-img {
  max-width: 100%;
  border-radius: 8px;
  display: block;
  cursor: pointer;
  transition: transform 0.2s;
}

.message-img:hover {
  transform: scale(1.02);
}

/* Styles responsifs */
@media (max-width: 768px) {
  .message {
    max-width: 85%;
  }
  
  .message-img {
    max-width: 250px;
  }
  
  .message-text {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .message {
    max-width: 90%;
  }
  
  .message-img {
    max-width: 200px;
  }
  
  .message-content {
    padding: 6px 10px;
  }
  
  .message-text {
    font-size: 13px;
  }
}
```

7. Créons une boîte de chat (ChatBox):
```bash
touch src/components/Chat/ChatBox.js
touch src/components/Chat/ChatBox.css
```

8. Ajoutez le code suivant à ChatBox.js:

```javascript
import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import Message from '../Message/Message';
import UserAvatar from '../UserAvatar/UserAvatar';
import Spinner from '../Spinner/Spinner';
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
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Fonction pour récupérer les messages d'un chat
  const fetchMessages = useCallback(async () => {
    if (!chat || !chat._id) return;

    try {
      setLoading(true);
      setError(null);
      
      const data = await api.get(`/api/messages/${chat._id}`, user.token);
      
      setMessages(data);
      setLoading(false);

      // Rejoindre la salle socket
      socket.emit('join chat', chat._id);
    } catch (error) {
      setError(`Erreur lors du chargement des messages: ${error.message}`);
      setLoading(false);
    }
  }, [chat, user?.token]);

  // Récupérer les messages quand le chat change
  useEffect(() => {
    if (chat && chat._id) {
      fetchMessages();
      socket.emit('join chat', chat._id);
    }
    return () => {
      // Nettoyer le timeout de frappe
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [chat, fetchMessages]);

  // Configurer les écouteurs socket
  useEffect(() => {
    const handleNewMessage = (newMessageReceived) => {
      // S'assurer que le chat est défini
      if (!chat || !chat._id) return;
      
      // Vérifier si le message appartient au chat actuel
      if (chat._id === newMessageReceived.chat._id) {
        console.log('Nouveau message reçu dans le chat actuel:', newMessageReceived);
        
        // Ajouter le message au chat actuel
        setMessages(prevMessages => {
          // Vérifier si le message existe déjà pour éviter les doublons
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

  // Faire défiler jusqu'en bas lorsque les messages changent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Gérer la frappe dans l'entrée de message
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // Logique d'indicateur de frappe
    if (!typing && chat) {
      setTyping(true);
      socket.emit('typing', chat._id);
    }

    // Effacer le timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Arrêter la frappe après 3 secondes d'inactivité
    typingTimeoutRef.current = setTimeout(() => {
      if (chat) {
        socket.emit('stop typing', chat._id);
        setTyping(false);
      }
    }, 3000);
  };

  // Envoyer un message
  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !chat) return;
    
    // Arrêter la frappe et effacer l'entrée immédiatement pour une meilleure UX
    if (chat) socket.emit('stop typing', chat._id);
    const messageContent = newMessage.trim();
    setNewMessage('');
    
    try {
      const messageData = {
        content: messageContent,
        chatId: chat._id,
      };
      
      const data = await api.post('/api/messages', messageData, user.token);
      
      console.log('Message envoyé:', data);
      
      // Mettre à jour l'état local immédiatement
      setMessages(prevMessages => [...prevMessages, data]);
      
      // Émettre au socket
      socket.emit('new message', data);
    } catch (error) {
      setError(`Échec de l'envoi du message: ${error.message}`);
      // Restaurer le message si l'envoi échoue
      setNewMessage(messageContent);
    }
  };

  // Obtenir le nom du chat pour l'affichage
  const getChatName = () => {
    if (!chat) return "Chat";
    
    if (chat.isGroupChat) {
      return chat.chatName;
    }
    
    return chat.users.find(u => u._id !== user._id)?.username || "Chat";
  };

  // Obtenir le texte de statut (en ligne/hors ligne)
  const getStatusText = () => {
    if (!chat) return "";
    
    if (chat.isGroupChat) {
      return `${chat.users.length} membres`;
    }
    
    const chatUser = chat.users.find(u => u._id !== user._id);
    return chatUser?.isOnline ? 'En ligne' : 'Hors ligne';
  };

  if (!chat) {
    return (
      <div className="chat-box chat-box-empty">
        <div>
          <h3>Sélectionnez un chat pour commencer à messagere</h3>
          <p>Recherchez des utilisateurs ou sélectionnez un chat existant</p>
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
          <button onClick={() => setError(null)}>Fermer</button>
        </div>
      )}

      <div className="messages-container">
        {loading ? (
          <Spinner />
        ) : (
          <div className="messages">
            {messages.length === 0 ? (
              <div className="no-messages">Pas encore de messages. Dites bonjour!</div>
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
        <input
          type="text"
          placeholder="Tapez un message..."
          value={newMessage}
          onChange={typingHandler}
        />
        <button type="submit" disabled={!newMessage.trim()}>
          <i className="fas fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
};

export default memo(ChatBox);
```

9. Ajoutez le CSS associé dans ChatBox.css:

```css
.chat-box {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f5f5f5;
}

.chat-box-empty {
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #9e9e9e;
}

.chat-box-empty h3 {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 10px;
}

.chat-box-empty p {
  font-size: 14px;
  color: #757575;
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
}

.chat-info {
  margin-left: 15px;
  flex: 1;
}

.chat-info h3 {
  margin: 0;
  font-size: 18px;
}

.status-text {
  margin: 0;
  font-size: 12px;
  color: #757575;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  background-color: #e5ddd5;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.messages {
  display: flex;
  flex-direction: column;
}

.no-messages {
  text-align: center;
  padding: 30px 15px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  color: #757575;
  margin: 20px 0;
  font-style: italic;
}

.message-input-container {
  display: flex;
  padding: 10px 15px;
  background-color: #fff;
  border-top: 1px solid #e0e0e0;
  align-items: center;
}

.message-input-container input {
  flex: 1;
  border: 1px solid #e0e0e0;
  outline: none;
  padding: 10px 15px;
  border-radius: 20px;
  background-color: #f5f5f5;
  font-size: 14px;
}

.message-input-container button[type="submit"] {
  margin-left: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s;
}

.message-input-container button[type="submit"]:hover {
  background-color: #45a049;
}

.message-input-container button[type="submit"]:disabled {
  background-color: #9e9e9e;
  cursor: not-allowed;
}

.typing-indicator {
  display: flex;
  padding: 10px;
  max-width: 65px;
  margin: 10px 0;
  background-color: #f5f5f5;
  border-radius: 18px;
  align-self: flex-start;
}

.typing-indicator .dot {
  width: 8px;
  height: 8px;
  margin: 0 2px;
  background-color: #757575;
  border-radius: 50%;
  animation: typing-animation 1.4s infinite ease-in-out both;
}

.typing-indicator .dot:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator .dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing-animation {
  0%, 80%, 100% {
    transform: scale(0.7);
  }
  40% {
    transform: scale(1);
  }
}

.error-message {
  padding: 10px 15px;
  background-color: #ffebee;
  color: #c62828;
  margin: 10px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.error-message button {
  background: none;
  border: none;
  color: #c62828;
  font-weight: bold;
  font-size: 18px;
  cursor: pointer;
  margin-left: 10px;
}

.group-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #7e57c2;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}

/* Styles responsifs */
@media (max-width: 768px) {
  .chat-header {
    padding: 10px;
  }
  
  .chat-info h3 {
    font-size: 16px;
  }
  
  .status-text {
    font-size: 11px;
  }
  
  .messages-container {
    padding: 10px;
  }
  
  .message-input-container {
    padding: 8px 10px;
  }
  
  .message-input-container input {
    padding: 8px 12px;
    font-size: 13px;
  }
  
  .message-input-container button[type="submit"] {
    width: 36px;
    height: 36px;
  }
}

@media (max-width: 480px) {
  .chat-header {
    padding: 8px;
  }
  
  .chat-info h3 {
    font-size: 15px;
  }
  
  .message-input-container {
    padding: 6px 8px;
  }
  
  .message-input-container button[type="submit"] {
    width: 32px;
    height: 32px;
  }
}
```

### Pages

Maintenant, créons les pages principales de notre application:

1. Page de connexion:
```bash
touch src/pages/LoginPage.js
touch src/pages/AuthPages.css
```

2. Ajoutez le code suivant à LoginPage.js:

```javascript
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './AuthPages.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, user, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Si l'utilisateur est déjà connecté, rediriger vers la page de chat
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    await login(email, password);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Connexion à ChatApp</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={loading}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>
        
        <p className="auth-link">
          Nouvel utilisateur? <Link to="/register">S'inscrire ici</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
```

3. Ajoutez le CSS associé dans AuthPages.css:

```css
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%234caf50' fill-opacity='0.05'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.auth-card {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: fade-in 0.5s ease-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-card h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #555;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-group input:focus {
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  outline: none;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #4CAF50;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #45a049;
}

.submit-btn:disabled {
  background-color: #92D394;
  cursor: not-allowed;
}

.error-message {
  padding: 10px;
  background-color: #ffebee;
  color: #c62828;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 14px;
}

.auth-link {
  margin-top: 20px;
  text-align: center;
  color: #666;
  font-size: 14px;
}

.auth-link a {
  color: #4CAF50;
  text-decoration: none;
  font-weight: 500;
}

.auth-link a:hover {
  text-decoration: underline;
}

/* Styles responsifs */
@media (max-width: 768px) {
  .auth-card {
    max-width: 90%;
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .auth-card {
    max-width: 95%;
    padding: 15px;
  }
  
  .auth-card h2 {
    font-size: 20px;
    margin-bottom: 20px;
  }
  
  .form-group input {
    font-size: 14px;
  }
  
  .submit-btn {
    padding: 10px;
    font-size: 14px;
  }
}
```

4. Page d'inscription:
```bash
touch src/pages/RegisterPage.js
```

5. Ajoutez le code suivant à RegisterPage.js:

```javascript
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './AuthPages.css';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const { register, user, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Si l'utilisateur est déjà connecté, rediriger vers la page de chat
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setFormError('');
    
    // Valider le formulaire
    if (password !== confirmPassword) {
      setFormError('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (password.length < 6) {
      setFormError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    await register(username, email, password);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Inscription à ChatApp</h2>
        
        {(error || formError) && (
          <div className="error-message">{formError || error}</div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={loading}
          >
            {loading ? 'Inscription en cours...' : 'S\'inscrire'}
          </button>
        </form>
        
        <p className="auth-link">
          Déjà un compte? <Link to="/login">Se connecter ici</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
```

6. Page de chat principale:
```bash
touch src/pages/ChatPage.js
touch src/pages/ChatPage.css
```

7. Ajoutez le code suivant à ChatPage.js:

```javascript
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useChat } from '../hooks/useChat';
import ChatList from '../components/Chat/ChatList';
import ChatBox from '../components/Chat/ChatBox';
import UserAvatar from '../components/UserAvatar/UserAvatar';
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
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Vérifier l'authentification de l'utilisateur au chargement de la page
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Se connecter à socket.io
    socket.emit('setup', user);
    
    // Récupérer les chats de l'utilisateur
    fetchChats(user.token).catch(err => {
      setError(`Échec du chargement des chats: ${err.message}`);
    });

    return () => {
      // Nettoyage des écouteurs socket lors du démontage
    };
  }, [user, navigate, fetchChats]);

  // Gérer les notifications de messages socket.io
  useEffect(() => {
    // Fonction pour gérer les nouvelles notifications de messages
    const handleNewMessage = (newMessage) => {
      console.log('Nouveau message reçu pour notification:', newMessage);
      
      // Si le chat n'est pas sélectionné ou ne correspond pas au chat actuel
      if (!selectedChat || selectedChat._id !== newMessage.chat._id) {
        // Ajouter une notification
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

  // Gérer la recherche d'utilisateurs
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
      setError(`Erreur lors de la recherche d'utilisateurs: ${error.message}`);
      setLoading(false);
    }
  }, [searchTerm, user?.token]);

  // Gérer la sélection d'un utilisateur à partir des résultats de recherche
  const handleUserSelect = useCallback(async (userId) => {
    try {
      setError(null);
      await accessChat(userId, user.token);
      setSearchTerm('');
      setSearchResults([]);
    } catch (error) {
      setError(`Erreur lors du démarrage du chat: ${error.message}`);
    }
  }, [accessChat, user?.token]);

  // Gérer la sélection d'un chat
  const handleChatSelect = useCallback((chat) => {
    setSelectedChat(chat);
    
    // Supprimer les notifications pour ce chat
    if (notifications.some(n => n.chat._id === chat._id)) {
      removeNotification(chat._id);
    }
  }, [setSelectedChat, notifications, removeNotification]);

  // Gérer la déconnexion
  const handleLogout = useCallback(() => {
    // Déconnecter le socket
    socket.disconnect();
    
    // Déconnecter l'utilisateur
    logout();
    navigate('/login');
  }, [logout, navigate]);

  // Mémoriser la liste de chats pour éviter les re-rendus inutiles
  const memoizedChats = useMemo(() => chats, [chats]);

  return (
    <div className="chat-page">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="user-info">
            <UserAvatar user={user} />
            <span className="username">{user?.username}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Déconnexion
          </button>
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
            placeholder="Rechercher des utilisateurs..."
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
    </div>
  );
};

export default ChatPage;
```

8. Ajoutez le CSS associé dans ChatPage.css:

```css
.chat-page {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: #f5f5f5;
}

.sidebar {
  width: 350px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e0e0e0;
  background-color: #fff;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f9f9f9;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.user-info:hover {
  background-color: #f0f0f0;
}

.username {
  margin-left: 10px;
  font-weight: 500;
}

.logout-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background-color: #d32f2f;
}

.search-container {
  display: flex;
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
}

.search-container input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  outline: none;
  font-size: 14px;
}

.search-container button {
  padding: 10px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-container button:hover {
  background-color: #45a049;
}

.search-container button:disabled {
  background-color: #9e9e9e;
  cursor: not-allowed;
}

.search-results {
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  max-height: 300px;
  overflow-y: auto;
}

.search-user-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f0f0f0;
}

.search-user-item:hover {
  background-color: #f5f5f5;
}

.search-user-item:last-child {
  border-bottom: none;
}

.user-details {
  margin-left: 10px;
  overflow: hidden;
}

.user-name {
  font-weight: 500;
  margin-bottom: 2px;
}

.user-email {
  font-size: 12px;
  color: #777;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.error-message {
  padding: 10px 15px;
  background-color: #ffebee;
  color: #c62828;
  margin: 10px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.error-message button {
  background: none;
  border: none;
  color: #c62828;
  font-weight: bold;
  font-size: 18px;
  cursor: pointer;
  margin-left: 10px;
}

.loader-small {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Styles responsifs */
@media (max-width: 992px) {
  .sidebar {
    width: 300px;
  }
}

@media (max-width: 768px) {
  .chat-page {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: 50vh;
    order: 2;
    border-right: none;
    border-top: 1px solid #e0e0e0;
  }
  
  .chat-container {
    width: 100%;
    height: 50vh;
    order: 1;
  }
  
  .sidebar-header,
  .search-container {
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .sidebar {
    height: 40vh;
  }
  
  .chat-container {
    height: 60vh;
  }
  
  .sidebar-header {
    padding: 8px;
  }
  
  .username {
    font-size: 14px;
  }
  
  .logout-btn {
    padding: 6px 10px;
    font-size: 12px;
  }
  
  .search-container input {
    font-size: 13px;
    padding: 8px 10px;
  }
  
  .search-container button {
    padding: 8px 10px;
  }
}
```

### Configuration principale de l'application

Pour finir, configurons le fichier principal App.js:

```bash
touch src/App.js
touch src/App.css
```

Ajoutez le code suivant à App.js:

```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { useAuth } from './hooks/useAuth';
import './App.css';

// Composant Route protégée
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function AppContent() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ChatProvider>
          <AppContent />
        </ChatProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
```

Ajoutez quelques styles globaux dans App.css:

```css
/* Styles globaux pour l'application */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

html, body, #root {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

body {
  background-color: #f5f5f5;
  color: #333;
}

/* Scrollbar personnalisée */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Ajouter Font Awesome */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
```

Modifiez enfin le fichier index.js pour utiliser l'application:

```bash
nano src/index.js
```

Remplacez le contenu par:

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## Connexion du Frontend et du Backend

Maintenant que nous avons configuré notre frontend et notre backend, nous devons les relier pour qu'ils puissent communiquer. Notre configuration actuelle avec le proxy dans package.json du client permettra déjà cette communication en développement.

### Exécution du projet

Pour exécuter le projet complet, nous devons démarrer à la fois le serveur backend et l'application frontend:

1. Démarrer le serveur backend:
```bash
cd server
npm run dev
```

2. Dans un autre terminal, démarrer l'application frontend:
```bash
cd client
npm start
```

Le serveur backend fonctionnera sur http://localhost:5000 et l'application frontend sur http://localhost:3000.

## Fonctionnalités avancées

### Authentification

Notre système d'authentification utilise JSON Web Tokens (JWT) pour sécuriser les routes. Voici comment cela fonctionne:

1. Lorsqu'un utilisateur s'inscrit ou se connecte, le serveur génère un token JWT qui contient l'ID de l'utilisateur.
2. Ce token est renvoyé au client, qui le stocke dans le localStorage.
3. Pour chaque requête à une route protégée, le client envoie le token dans l'en-tête d'autorisation.
4. Le middleware d'authentification du serveur valide le token et extrait l'ID de l'utilisateur.
5. Si le token est valide, la requête est autorisée à continuer, sinon elle est rejetée.

### Chat en temps réel

Notre application utilise Socket.io pour permettre les communications en temps réel. Voici comment cela fonctionne:

1. Lorsqu'un utilisateur se connecte, le client établit une connexion WebSocket avec le serveur.
2. L'utilisateur rejoint une salle socket unique basée sur son ID utilisateur.
3. Lorsqu'un message est envoyé, il est d'abord enregistré dans la base de données, puis émis via Socket.io aux destinataires.
4. Les clients reçoivent les messages en temps réel sans avoir à actualiser la page.
5. Les indicateurs de frappe et les notifications sont également gérés par Socket.io.

### Téléchargement de fichiers

Notre application permet également aux utilisateurs de partager des images:

1. Nous utilisons Multer pour gérer les téléchargements de fichiers côté serveur.
2. Les fichiers téléchargés sont stockés dans un dossier "uploads" sur le serveur.
3. Le chemin du fichier est ensuite renvoyé au client, qui peut l'utiliser pour afficher l'image.
4. Les messages d'image sont formatés avec une syntaxe spéciale: `![Image](chemin/vers/fichier)`.

## Exemple d'utilisation

Voici un scénario d'utilisation typique de notre application:

1. Alice s'inscrit sur l'application en fournissant un nom d'utilisateur, une adresse e-mail et un mot de passe.
2. Une fois connectée, elle recherche son ami Bob en utilisant la barre de recherche.
3. Elle clique sur le résultat de recherche pour démarrer un nouveau chat avec Bob.
4. Elle commence à taper un message à Bob, et Bob voit un indicateur de frappe en temps réel.
5. Alice envoie un message à Bob, qui le reçoit instantanément.
6. Bob est hors ligne à ce moment-là, mais lorsqu'il se connecte plus tard, il voit une notification indiquant qu'Alice lui a envoyé un message.
7. Bob peut cliquer sur la notification pour accéder directement à leur conversation.

## Dépannage

Voici quelques problèmes courants que vous pourriez rencontrer et comment les résoudre:

### Le serveur n'arrive pas à se connecter à MongoDB

- Vérifiez que MongoDB est en cours d'exécution sur votre machine.
- Vérifiez l'URL de connexion dans le fichier .env.
- Assurez-vous que votre pare-feu n'empêche pas la connexion.

### Les messages ne sont pas envoyés en temps réel

- Vérifiez la connexion Socket.io dans la console du navigateur.
- Assurez-vous que le serveur Socket.io est en cours d'exécution.
- Vérifiez que les ID de salle sont correctement configurés.

### Les images ne s'affichent pas

- Vérifiez que le dossier "uploads" a été créé et que le serveur y a accès en écriture.
- Assurez-vous que le chemin d'accès aux images est correct.
- Vérifiez que le middleware Express pour servir des fichiers statiques est correctement configuré.

## Conclusion

Félicitations! Vous avez maintenant créé une application de chat complète avec des fonctionnalités avancées comme l'authentification, les messages en temps réel et le partage d'images. Cette application utilise la stack MERN (MongoDB, Express, React, Node.js) ainsi que Socket.io pour les communications en temps réel.

Récapitulons ce que nous avons appris:

1. **Backend (Node.js + Express)**
   - Configuration d'un serveur API RESTful
   - Modèles de données MongoDB avec Mongoose
   - Middleware d'authentification avec JWT
   - Configuration de Socket.io pour la communication en temps réel
   - Gestion des téléchargements de fichiers avec Multer

2. **Frontend (React)**
   - Création d'une application React moderne avec des hooks
   - Gestion de l'état global avec Context API
   - Communication avec le backend via des API REST
   - Intégration de Socket.io pour les mises à jour en temps réel
   - Création d'une interface utilisateur responsive et intuitive

3. **Fonctionnalités**
   - Authentification sécurisée
   - Chats individuels et de groupe
   - Messages en temps réel
   - Indicateurs de frappe
   - Notifications
   - Téléchargement et partage d'images

Cette application peut être encore améliorée de nombreuses façons:

1. Ajout de réactions aux messages
2. Implémentation de messages vocaux
3. Ajout de fonctionnalités de recherche dans les messages
4. Ajout d'un système de statuts et de présence plus avancé
5. Intégration d'un système de cryptage de bout en bout pour une sécurité accrue

N'hésitez pas à explorer ces améliorations et à personnaliser l'application selon vos besoins!

## Ressources supplémentaires

Voici quelques ressources qui pourraient vous être utiles pour approfondir vos connaissances:

- [Documentation officielle de MongoDB](https://docs.mongodb.com/)
- [Documentation officielle d'Express](https://expressjs.com/)
- [Documentation officielle de React](https://reactjs.org/docs/getting-started.html)
- [Documentation officielle de Node.js](https://nodejs.org/en/docs/)
- [Documentation officielle de Socket.io](https://socket.io/docs/)
- [Tutoriels MERN Stack](https://www.mongodb.com/mern-stack)

Bon codage!# Tutoriel Complet: Application de Chat MERN Stack


