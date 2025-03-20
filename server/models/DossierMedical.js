const mongoose = require('mongoose');

const DossierMedicalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Champ user requis
  images: [{ type: String }], // URLs des images envoyées
  diagnosticText: { type: String }, // Résumé du diagnostic généré par l'IA
  createdAt: { type: Date, default: Date.now },
});

const DossierMedical = mongoose.model('DossierMedical', DossierMedicalSchema);
module.exports = DossierMedical; 