const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const axios = require('axios'); 
const fs = require('fs');
const FormData = require('form-data');
const app = express();
const multer = require('multer');  
const upload = multer(); 
const PORT = 5000;
const User = require('./models/User'); 
const Dentist = require('./models/Dentist');
const { body, validationResult } = require('express-validator');
const validateDentist = [
  body('name').notEmpty().withMessage('Name is required'),
  body('specialization').notEmpty().withMessage('Specialization is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('phone').notEmpty().withMessage('Phone is required').isMobilePhone(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// MongoDB Connection
const mongoURI = 'mongodb://127.0.0.1:27017/dental_diagnostic';
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));


// Route d'inscription
app.post('/api/signup', async (req, res) => {
  try {
    const { username, password, email, firstname, lastname, gender, city,role } = req.body;

    // Vérifiez si l'utilisateur existe déjà
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Générez le hash pour le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créez un nouvel utilisateur
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      firstname,
      lastname,
      gender,
      city,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during signup:', error.message);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

// Sign In Route
app.post('/api/signin', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Incorrect username or password." });
    }

    res.status(200).json({
      message: "Login successful",
      firstName: user.firstname,
      username: user.username,
      role:user.role,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: "Server error." });
  }
});

app.post('/api/diagnostic', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    // Préparer l'image pour l'envoyer à l'API Flask
    const formData = new FormData();
    formData.append('image', req.file.buffer, req.file.originalname);

    // Appel à l'API Flask pour obtenir le diagnostic
    const flaskResponse = await axios.post('http://127.0.0.1:5000/diagnostic', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const { data } = flaskResponse;
    res.status(200).json(data); // Renvoyer la réponse de Flask
  } catch (error) {
    console.error('Error during diagnostic:', error);
    res.status(500).json({ message: 'Error in diagnostic process' });
  }
});

// Route pour récupérer tous les dentistes
// Exemple avec Express et MongoDB
app.get('/api/dentists', (req, res) => {
  const { city } = req.query;

  let query = {};
  if (city) {
    query.city = city; // Assurez-vous que le champ "city" existe dans votre base de données
  }

  Dentist.find(query)
    .then((dentists) => res.json(dentists))
    .catch((error) => res.status(500).json({ message: "Erreur du serveur", error }));
});




// Route pour ajouter un dentiste
app.post('/api/dentists', validateDentist, async (req, res) => {
  try {
    const { name, specialization, address, city, phone, rating } = req.body;

    // Création d'un nouveau dentiste
    const newDentist = new Dentist({
      name,
      specialization,
      address,
      city,
      phone,
      rating: rating || 0, 
    });

    const savedDentist = await newDentist.save();
    res.status(201).json({ message: 'Dentiste ajouté avec succès', dentist: savedDentist });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du dentiste:', error.message);
    res.status(500).json({ message: 'Erreur interne du serveur', error: error.message });
  }
});

// Route pour modifier un dentiste
app.put('/api/dentists/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, specialization, address, city, phone, rating } = req.body;

    // Validation basique
    if (!name || !specialization || !address || !city || !phone) {
      return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis' });
    }

    // Mettre à jour le dentiste
    const updatedDentist = await Dentist.findByIdAndUpdate(
      id,
      { name, specialization, address, city, phone, rating },
      { new: true } // Retourne le document mis à jour
    );

    if (!updatedDentist) {
      return res.status(404).json({ message: 'Dentiste introuvable' });
    }

    res.status(200).json({ message: 'Dentiste mis à jour avec succès', dentist: updatedDentist });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du dentiste:', error.message);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

// Route pour supprimer un dentiste
app.delete('/api/dentists/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Supprimer le dentiste
    const deletedDentist = await Dentist.findByIdAndDelete(id);

    if (!deletedDentist) {
      return res.status(404).json({ message: 'Dentiste introuvable' });
    }

    res.status(200).json({ message: 'Dentiste supprimé avec succès', dentist: deletedDentist });
  } catch (error) {
    console.error('Erreur lors de la suppression du dentiste:', error.message);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});


// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
