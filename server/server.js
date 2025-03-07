const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path'); 
const multer = require('multer');
const app = express();
const PORT = 5000;
const User = require('./models/User');
const Dentist = require('./models/Dentist');
const ChatConversation = require('./models/ChatConversation');
const Chatbot = require('./models/Chatbot');
const { appendFile } = require('fs/promises');
const Notification = require('./models/Notification');

// MongoDB Connection
const mongoURI = 'mongodb://127.0.0.1:27017/dental_diagnostic';
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Configuration de Multer pour l'upload de fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Générer un nom de chatbot unique
const generateUniqueChatbotName = (username) => `${username}_bot_${Date.now()}`;

// Créer une notification de bienvenue
const createWelcomeNotification = async (userId) => {
  const notification = new Notification({
    sender: null, // Notification système
    receiver: userId,
    message: 'Bienvenue sur notre plateforme !',
    status: 'read',
  });
  await notification.save();
  return notification;
};

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

    // Créer les données utilisateur
    const userData = {
      username,
      password: hashedPassword,
      email,
      firstname,
      lastname,
      city,
      image: req.file ? req.file.path : null,
    };

    let user;

    if (isDentist === 'true') {
      if (!phone || !address || !workDays || !workHours) {
        return res.status(400).json({ message: 'Missing required fields for dentist' });
      }
      user = new Dentist({
        ...userData,
        phone,
        address,
        workDays: JSON.parse(workDays),
        workHours: JSON.parse(workHours),
      });
    } else {
      user = new User(userData);
    }

    await user.save();

    // Créer un chatbot
    const chatbot = new Chatbot({
      name: generateUniqueChatbotName(user.username),
      description: `Chatbot personnel de ${user.username}`,
      createdBy: user._id,
      configuration: {},
    });
    await chatbot.save();

    user.chatbot = chatbot._id;
    await user.save();

    // Créer une conversation vide
    const conversation = new ChatConversation({
      creator: user._id,
      chatbot: chatbot._id,
      participants: [user._id],
      messages: [],
    });
    await conversation.save();

    chatbot.conversations.push(conversation._id);
    await chatbot.save();

    // Envoyer une notification de bienvenue
    const welcomeNotification = await createWelcomeNotification(user._id);
    user.notifications.push(welcomeNotification._id);
    await user.save();

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
});


const jwt = require('jsonwebtoken');
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Accès non autorisé' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretKey');
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Erreur de vérification du token :', error);
    res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

// Utilisation du middleware
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Erreur serveur :', error);
    res.status(500).json({ message: 'Erreur de serveur' });
  }
});
app.post('/api/signin', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Rechercher l'utilisateur
    const user = await User.findOne({ username }).populate('notifications'); // Populate les notifications

    // Vérifier si l'utilisateur existe et si le mot de passe est correct
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Incorrect username or password." });
    }

    // Définir le rôle
    const role = user.role || 'User';

    // **Générer le token JWT**
    const token = jwt.sign(
      { id: user._id, username: user.username, role: role },
      process.env.JWT_SECRET || 'secretKey', // Utilise une clé secrète stockée dans une variable d’environnement
      { expiresIn: '7d' } // Le token expire en 7 jours
    );

    // Renvoyer les infos de l'utilisateur avec le token, l'ID du chatbot et les notifications
    res.status(200).json({
      message: 'Connexion réussie',
      token, // Ajout du token ici
      user: {
        id: user._id,
        firstName: user.firstname,
        lastName: user.lastname,
        username: user.username,
        email: user.email,
        city: user.city,
        image: user.image,
        role: role,
        chatbotId: user.chatbot, // Ajout de l'ID du chatbot
        notifications: user.notifications, // Ajout des notifications
        ...(role === 'Dentist' && {
          phone: user.phone,
          address: user.address,
          workDays: user.workDays,
          workHours: user.workHours,
        }),
      },
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur de serveur lors de la connexion.', error: error.message });
  }
});


app.put('/api/users/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  let { password, workDays, workHours, ...updateData } = req.body;

  console.log("Données reçues :", req.body);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID invalide." });
  }

  try {
    // Vérifier si l'utilisateur existe
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Gérer la mise à jour du mot de passe
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // Gérer l'upload d'image
    if (req.file) {
      updateData.image = req.file.path; // Mettre à jour l'image de profil
    }

    // Vérifier si l'utilisateur est un dentiste et traiter les champs spécifiques
    if (existingUser.role === 'Dentist') {
      if (workDays) {
        try {
          updateData.workDays = JSON.parse(workDays); // Parser workDays
        } catch (err) {
          console.error("Erreur lors du parsing de workDays :", err);
          return res.status(400).json({ message: 'Format invalide pour workDays' });
        }
      }

      if (workHours) {
        try {
          updateData.workHours = JSON.parse(workHours); // Parser workHours
        } catch (err) {
          console.error("Erreur lors du parsing de workHours :", err);
          return res.status(400).json({ message: 'Format invalide pour workHours' });
        }
      }
    }

    console.log("Données à mettre à jour :", updateData);

    // Mise à jour de l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData }, // Utiliser $set pour écraser les anciennes valeurs
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    console.log("Utilisateur mis à jour :", updatedUser);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Erreur de serveur." });
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


/// Créer une nouvelle conversation
app.post("/api/conversations/create", async (req, res) => {
  try {
    const { userId, chatbotId } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Créer une nouvelle conversation
    const newConversation = new ChatConversation({
      creator: userId,
      chatbot: chatbotId,
      participants: [userId],
      messages: [],
    });

    await newConversation.save();

    res.status(201).json(newConversation);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la création de la conversation", error: error.message });
  }
});

// Récupérer les conversations d'un utilisateur
app.get("/api/conversations/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Vérifier si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    // Récupérer toutes les conversations de l'utilisateur
    const conversations = await ChatConversation.find({ creator: userId })
      .populate("participants", "username firstname lastname") // Inclure les détails des participants
      .populate("chatbot"); // Inclure les détails du chatbot

    res.json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

app.get("/api/conversations/:conversationId", authMiddleware, async (req, res) => {
  try {
    const conversation = await ChatConversation.findById(req.params.conversationId)
      .populate("messages.sender", "username firstname lastname");

    if (!conversation) {
      return res.status(404).json({ message: "Conversation non trouvée" });
    }

    // Vérifiez que l'utilisateur est un participant
    const userId = req.user.id; // Supposons que req.user est défini par le middleware d'authentification
    if (!conversation.participants.includes(userId)) {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    res.json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});
// Ajouter un message à une conversation
app.post("/api/conversations/:conversationId/message", async (req, res) => {
  try {
    const { sender, message } = req.body;
    const conversationId = req.params.conversationId;

    // Vérifier si la conversation existe
    const conversation = await ChatConversation.findById(conversationId);
    if (!conversation) return res.status(404).json({ message: "Conversation introuvable" });

    // Ajouter le message
    conversation.messages.push({ sender, message, timestamp: new Date() });
    await conversation.save();

    res.json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// Récupérer les messages d'une conversation
app.get("/api/conversations/:conversationId/messages", async (req, res) => {
  try {
    const conversationId = req.params.conversationId;

    // Vérifier si la conversation existe
    const conversation = await ChatConversation.findById(conversationId)
      .populate("messages.sender", "username firstname lastname");

    if (!conversation) return res.status(404).json({ message: "Conversation introuvable" });

    res.json(conversation.messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});




app.get("/api/notifications/user/:userId", async (req, res) => {
  try {
    const notifications = await Notification.find({ receiver: req.params.userId })
      .sort({ timestamp: -1 }); // Trier par date décroissante

    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});


app.get('/api/dentists', async (req, res) => {
  const { city } = req.query;

  try {
    // Construire la requête en fonction de la ville (si fournie)
    let query = { __t: 'Dentist' }; // Filtrer uniquement les documents de type "Dentist"

    // Récupérer les dentistes avec les informations du modèle User
    const dentists = await User.find(query)
      .select('name email city address phone workDays workHours') // Sélectionner les champs nécessaires
      .exec();

    // Formater la réponse
    const formattedDentists = dentists.map((dentist) => ({
      _id: dentist._id,
      name: dentist.name,
      email: dentist.email,
      city: dentist.city,
      address: dentist.address,
      phone: dentist.phone,
      workDays: dentist.workDays,
      workHours: dentist.workHours
    }));

    res.json(formattedDentists);
  } catch (error) {
    console.error('Erreur lors de la récupération des dentistes :', error);
    res.status(500).json({ message: "Erreur du serveur", error });
  }
});
/*
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
