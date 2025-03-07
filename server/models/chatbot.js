const mongoose = require('mongoose');

const ChatbotSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 3 },
  description: { type: String, default: '', trim: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  configuration: { type: mongoose.Schema.Types.Mixed, default: {} },
  conversations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ChatConversation' }],
}, { timestamps: true });

const Chatbot = mongoose.model('Chatbot', ChatbotSchema);
module.exports = Chatbot;
