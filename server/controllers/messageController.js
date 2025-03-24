const Message = require('../models/Message');
const User = require('../models/User');
const Chat = require('../models/Chat');

// @desc    Get all messages
// @route   GET /api/messages/:chatId
// @access  Private
exports.allMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "username profilePic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create new message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.status(400).json({ message: "Invalid data passed into request" });
  }

  try {
    // Create new message
    let message = await Message.create({
      sender: req.user._id,
      content: content,
      chat: chatId,
    });

    // Populate message with additional details
    message = await message.populate("sender", "username profilePic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "username profilePic email",
    });

    // Update latest message in chat
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};