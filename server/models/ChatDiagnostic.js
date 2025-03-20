const mongoose = require('mongoose');

const ChatDiagnosticSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true }, // Référence vers User
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dentist' }], // Liste des dentistes ayant accès
  messages: [{
    image: { type: String, required: true }, // L'utilisateur envoie seulement des images
    response: { type: String, required: true }, // Réponse de l'IA
    timestamp: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

const ChatDiagnostic = mongoose.model('ChatDiagnostic', ChatDiagnosticSchema);
module.exports = ChatDiagnostic;