const mongoose = require('mongoose');

const ChatConversationSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chatbot: { type: mongoose.Schema.Types.ObjectId, ref: 'Chatbot', required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const ChatConversation = mongoose.model('ChatConversation', ChatConversationSchema);
module.exports = ChatConversation;
