const mongoose = require('mongoose');

const ChatConversationSchema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  ], // ✅ Liste des participants (User et Dentist)
  messages: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ✅ Qui a envoyé le message
    message: { type: String, required: true }, // ✅ Contenu du message
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const ChatConversation = mongoose.model('ChatConversation', ChatConversationSchema);
module.exports = ChatConversation;
