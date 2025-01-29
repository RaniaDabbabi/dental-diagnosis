const mongoose = require('mongoose');
const Dentist = require('./models/Dentist'); 

const mongoURI = 'mongodb://127.0.0.1:27017/dental_diagnostic';

// Connexion à MongoDB
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    seedDentists();
  })
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Fonction pour insérer des données initiales
async function seedDentists() {
  const dentists = [
    {
      name: "Dr. Alice Johnson",
      specialization: "Orthodontist",
      address: "123 Main St, City Center",
      city: "New York",
      phone: "555-1234",
      rating: 4.5,
    },
    {
      name: "Dr. Bob Smith",
      specialization: "Periodontist",
      address: "456 Elm St, Uptown",
      city: "Chicago",
      phone: "555-5678",
      rating: 4.0,
    },
  ];

  try {
    await Dentist.insertMany(dentists);
    console.log("Dentists seeded!");
    mongoose.connection.close(); // Fermer la connexion une fois terminé
  } catch (error) {
    console.error('Error seeding dentists:', error);
  }
}
