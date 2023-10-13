const mongoose = require('mongoose');
const User = require('../models/userModel')

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  },
  attachments: [
    {
      type: String,
    }
  ],
  messageType: {
    type: String,
    enum: ['text', 'image', 'video'],
    default: 'text'
  },
  threadId: {
    type: String,
    required: true
  },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
