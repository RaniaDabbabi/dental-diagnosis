const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Schéma de l'utilisateur
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  gender: { type: String },
  city: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, 
});

// Ajouter une méthode pour comparer les mots de passe
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Exporter le modèle
const User = mongoose.model('User', UserSchema);
module.exports = User;
