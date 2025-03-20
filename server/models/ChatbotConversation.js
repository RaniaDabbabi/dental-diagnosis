const mongoose = require('mongoose');

const ChatbotConversationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  messages: [{
    sender: { type: String, required: true }, // 'user' ou 'bot'
    text: { type: String, required: true }, // Le message ou la réponse
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const ChatbotConversation = mongoose.model('ChatbotConversation', ChatbotConversationSchema);
module.exports = ChatbotConversation;