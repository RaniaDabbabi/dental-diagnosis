const mongoose = require('mongoose');

// Schéma pour les dentistes
const DentistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  phone: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 10 },
});

const Dentist = mongoose.model('Dentist', DentistSchema);
module.exports = Dentist;
