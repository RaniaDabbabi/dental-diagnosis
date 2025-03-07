const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Chatbot = require('./Chatbot');

const options = { discriminatorKey: 'role', timestamps: true };

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  city: { type: String },
  image: { type: String },
  chatbot: { type: mongoose.Schema.Types.ObjectId, ref: 'Chatbot' }, // Correction de la référence
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],
}, options);

// Méthode pour comparer les mots de passe
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Middleware post-save pour créer un chatbot après la création de l'utilisateur
UserSchema.post('save', async function (doc, next) {
  try {
    if (!doc.chatbot) {
      const chatbot = new Chatbot({
        name: `${doc.username}_bot`,
        description: `Chatbot personnel de ${doc.username}`,
        createdBy: doc._id,
        configuration: {},
      });

      await chatbot.save();
      await User.findByIdAndUpdate(doc._id, { chatbot: chatbot._id });
    }
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
