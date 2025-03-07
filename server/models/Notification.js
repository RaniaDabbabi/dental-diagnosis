const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Peut être `null` pour une notification système
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatConversation' },
  message: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'read'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware pour mettre à jour `updatedAt` avant chaque modification
NotificationSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Notification = mongoose.model('Notification', NotificationSchema);
module.exports = Notification;
