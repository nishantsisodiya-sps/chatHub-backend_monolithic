const Message = require('../models/messageModel');
const User = require('../models/userModel');

// Send a new message
exports.sendMessage = async (req, res) => {
  try {
    const { senderId, recipientId, content, attachments, messageType, threadId } = req.body;

    // Check if both the sender and recipient exist
    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);

    if (!sender || !recipient) {
      return res.status(404).json({ error: 'Sender or recipient not found.' });
    }

    const newMessage = new Message({
      sender: senderId,
      recipient: recipientId,
      content,
      attachments,
      messageType,
      threadId
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message', error.message);
    res.status(500).json({ error: 'Error sending message' });
  }
};

// Retrieve messages between two users
exports.getMessages = async (req, res) => {
  try {
    const { senderId, recipientId, threadId } = req.params;

    const messages = await Message.find({
      sender: { $in: [senderId, recipientId] },
      recipient: { $in: [senderId, recipientId] },
      threadId
    })
      .sort({ timestamp: 1 })
      .exec();

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error retrieving messages', error.message);
    res.status(500).json({ error: 'Error retrieving messages' });
  }
};

// Update message status (e.g., mark as delivered or read)
exports.updateMessageStatus = async (req, res) => {
  try {
    const { messageId, status } = req.body;

    const message = await Message.findByIdAndUpdate(messageId, { status }, { new: true });

    if (!message) {
      return res.status(404).json({ error: 'Message not found.' });
    }

    res.status(200).json(message);
  } catch (error) {
    console.error('Error updating message status', error.message);
    res.status(500).json({ error: 'Error updating message status' });
  }
};
