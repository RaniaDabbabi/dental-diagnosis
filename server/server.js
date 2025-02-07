const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path'); // Import du module path
const multer = require('multer');
const app = express();
const PORT = 5000;
const User = require('./models/User');
const Dentist = require('./models/Dentist');

// MongoDB Connection
const mongoURI = 'mongodb://127.0.0.1:27017/dental_diagnostic';
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Configuration de Multer pour l'upload de fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route pour l'inscription
app.post('/api/signup', upload.single('image'), async (req, res) => {
  const { username, password, email, firstname, lastname, city, isDentist, phone, address, workDays, workHours } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const userData = {
      username,
      password: hashedPassword,
      email,
      firstname,
      lastname,
      city,
      image: req.file ? req.file.path : null, // Chemin de l'image si elle existe
    };

    if (isDentist === 'true') {
      // Vérifier que les champs spécifiques au dentiste sont fournis
      if (!phone || !address || !workDays || !workHours) {
        return res.status(400).json({ message: 'Missing required fields for dentist' });
      }

      // Parser workDays et workHours en objets JavaScript
      const parsedWorkDays = JSON.parse(workDays);
      const parsedWorkHours = JSON.parse(workHours);

      // Créer un dentiste
      const dentist = new Dentist({
        ...userData,
        address,
        phone,
        workDays: parsedWorkDays, // Tableau d'objets
        workHours: parsedWorkHours, // Objet
      });

      await dentist.save();
      return res.status(201).json({ message: 'Dentist registered successfully' });
    } else {
      // Créer un utilisateur normal
      const user = new User(userData);
      await user.save();
      return res.status(201).json({ message: 'User registered successfully' });
    }
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
});

// Sign In Route
app.post('/api/signin', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Rechercher l'utilisateur dans la collection User
    let user = await User.findOne({ username });

    // Si l'utilisateur n'est pas trouvé, rechercher dans la collection Dentist
    if (!user) {
      user = await Dentist.findOne({ username });
    }

    // Si l'utilisateur n'existe pas
    if (!user) {
      return res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect.' });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect.' });
    }

    // Renvoyer une réponse réussie
    res.status(200).json({
      message: 'Connexion réussie',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role || 'User', // Si vous utilisez des discriminateurs
      },
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur de serveur lors de la connexion.', error: error.message });
  }
});

/*
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

*/
// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
