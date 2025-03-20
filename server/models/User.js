const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const options = { discriminatorKey: 'role', timestamps: true };

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  city: { type: String },
  image: { type: String },
  chatbot: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatbotConversation' },
  chatDiagnostic: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatDiagnostic' }, // ✅ Ajout de la conversation avec l'IA
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],
  dossierMedical: { type: mongoose.Schema.Types.ObjectId, ref: 'DossierMedical' },

}, options);

// Méthode pour comparer les mots de passe
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
