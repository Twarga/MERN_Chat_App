const Chat = require('../models/Chat');
const User = require('../models/User');

// @desc    Create or fetch One to One Chat
// @route   POST /api/chat
// @access  Private
exports.accessChat = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log("Access chat request received for userId:", userId);
    console.log("Current user:", req.user._id);

    if (!userId) {
      console.log("UserId param not sent with request");
      return res.status(400).json({ message: "UserId param not sent with request" });
    }

    // Check if chat exists with current user and requested user
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
      console.log("Existing chat found");
      res.json(isChat[0]);
    } else {
      console.log("Creating new chat");
      // Create new chat
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
      console.log("New chat created:", fullChat._id);
      res.status(200).json(fullChat);
    }
  } catch (error) {
    console.error("Error in accessChat:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Fetch all chats for a user
// @route   GET /api/chat
// @access  Private
exports.fetchChats = async (req, res) => {
  try {
    console.log("Fetch chats request from user:", req.user._id);
    // Find all chats where the user is part of
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
        console.log("Chats found:", results.length);
        res.status(200).json(results);
      });
  } catch (error) {
    console.error("Error in fetchChats:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create New Group Chat
// @route   POST /api/chat/group
// @access  Private
exports.createGroupChat = async (req, res) => {
  try {
    if (!req.body.users || !req.body.name) {
      return res.status(400).json({ message: "Please Fill all the fields" });
    }

    let users = JSON.parse(req.body.users);

    if (users.length < 2) {
      return res
        .status(400)
        .json({ message: "More than 2 users are required to form a group chat" });
    }

    // Add current user to group
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
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Rename Group
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
      res.status(404).json({ message: "Chat Not Found" });
    } else {
      res.json(updatedChat);
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Add user to Group
// @route   PUT /api/chat/groupadd
// @access  Private
exports.addToGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    // Check if the requester is admin
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (chat.groupAdmin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only admins can add users" });
    }

    const added = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!added) {
      res.status(404).json({ message: "Chat Not Found" });
    } else {
      res.json(added);
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Remove user from Group
// @route   PUT /api/chat/groupremove
// @access  Private
exports.removeFromGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    // Check if the requester is admin
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (chat.groupAdmin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only admins can remove users" });
    }

    const removed = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!removed) {
      res.status(404).json({ message: "Chat Not Found" });
    } else {
      res.json(removed);
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};