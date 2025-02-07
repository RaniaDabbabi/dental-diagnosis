const mongoose = require('mongoose');
const User = require('./User'); // Importer le modèle User

const DentistSchema = new mongoose.Schema({
  address: { type: String, required: true },
  phone: { type: String, required: true },
  workDays: [{
    start: { type: String }, // Jour de début
    end: { type: String }    // Jour de fin
  }],
  workHours: {
    open: { type: String }, // Heure d'ouverture
    close: { type: String } // Heure de fermeture
  },
}, { _id: false });
// Création du modèle Dentist en héritant de User
const Dentist = User.discriminator('Dentist', DentistSchema);

module.exports = Dentist;
