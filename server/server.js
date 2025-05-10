const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();
const fs = require('fs');
const app = express();
const PORT = 5000;
const http = require('http');
const { Server } = require('socket.io');
app.use(cors());
const server = http.createServer(app);
const User = require('./models/User');
const Dentist = require('./models/Dentist');
const Conversation = require('./models/ChatConversation');
const ChatbotConversation = require('./models/ChatbotConversation');
const ChatDiagnostic = require('./models/ChatDiagnostic');
const Notification = require('./models/Notification');
const DossierMedical = require('./models/DossierMedical');

const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Stocker io dans l'app pour y accéder dans les routes
app.set('socketio', io);

io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Gestion des rooms de conversation
  socket.on('join_conversation', (conversationId) => {
    socket.join(conversationId);
  });

  socket.on('leave_conversation', (conversationId) => {
    socket.leave(conversationId);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

mongoose.connect('mongodb://127.0.0.1:27017/dental_diagnostic', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('✅ MongoDB connecté'))
  .catch(err => console.error('❌ Erreur de connexion MongoDB:', err));


const uploadDir = 'uploads';

// Vérifier et créer le dossier s'il n'existe pas
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}  
// Configuration de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Dossier de destination pour les fichiers uploadés
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nom du fichier
  }
});

// Filtre pour accepter uniquement les images JPG, JPEG et PNG
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accepter le fichier
  } else {
    cb(new Error('Seules les images JPG, JPEG et PNG sont autorisées.'), false); // Rejeter le fichier
  }
};

const upload = multer({ storage, fileFilter });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🔒 Middleware JWT pour l'authentification
const authMiddleware = (req, res, next) => {
  // Récupérer le token de l'en-tête Authorization
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
  }
  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretKey');
    req.user = decoded; // Ajouter l'utilisateur décodé à la requête
    next();
  } catch (error) {
    console.error('Erreur de vérification du token:', error);
    res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

// 🆕 Route d'inscription
app.post('/api/signup', upload.single('image'), async (req, res) => {
  try {
    const { username, password, email, firstname, lastname, city, isDentist, phone, address, workDays, workHours } = req.body;

    // Vérifier si l'utilisateur existe déjà
    if (await User.findOne({ $or: [{ username }, { email }] })) {
      return res.status(400).json({ message: 'Nom d’utilisateur ou email déjà existant.' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
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
    if (JSON.parse(isDentist)) {
      if (!phone || !address || !workDays || !workHours) {
        return res.status(400).json({ message: 'Champs obligatoires manquants pour un dentiste.' });
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

    // Enregistrement de l'utilisateur
    const savedUser = await user.save();

    res.status(201).json({ message: 'Utilisateur enregistré avec succès', user: savedUser });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// **Route de connexion**
app.post('/api/signin', async (req, res) => {
  const { username, password } = req.body;

  // Validation des entrées
  if (!username || !password) {
    return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
  }

  try {
    // Rechercher l'utilisateur dans la base de données
    const user = await User.findOne({ username }).populate('notifications');
    if (!user) {
      console.error('Utilisateur non trouvé:', username);
      return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.error('Mot de passe incorrect pour l\'utilisateur:', username);
      return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role || 'User' },
      process.env.JWT_SECRET || 'secretKey',
      { expiresIn: '7d' }
    );

    // Retourner une réponse sécurisée
    const userResponse = {
      _id: user._id,
      firstname:user.firstname,
      lastname:user.lastname,
      username: user.username,
      email: user.email,
      role: user.role,
      image:user.image,
      phone:user.phone,
      city:user.city,
      address:user.address,
      workDays:user.workDays,
      workHours:user.workHours,
      notifications: user.notifications,
    };

    res.status(200).json({ message: 'Connexion réussie', token, user: userResponse });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});


/**Route pour envoyer une image à l'API Flask et obtenir un diagnostic**
app.post('/api/diagnostic', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Image requise' });

    const imageBuffer = fs.readFileSync(req.file.path);
    const formData = new FormData();
    formData.append('image', imageBuffer, req.file.originalname);

    const flaskResponse = await axios.post('http://127.0.0.1:5000/diagnostic', formData, {
      headers: formData.getHeaders(),
    });

    res.status(200).json(flaskResponse.data);
  } catch (error) {
    console.error('Erreur lors du diagnostic:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});*/

// **Route pour récupérer les notifications d'un utilisateur**
app.get('/api/notifications/user/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({ receiver: req.params.userId }).sort({ timestamp: -1 });
    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
});


// Route pour créer un ChatDiagnostic
app.post('/api/chatdiagnostic', async (req, res) => {
  try {
    const { user } = req.body;

    // Valider l'ID utilisateur
    if (!user || !mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({ success: false, message: 'ID utilisateur invalide.' });
    }

    // Vérifier si l'utilisateur existe dans la base de données
    const userExists = await User.findById(user);
    if (!userExists) {
      return res.status(404).json({ success: false, message: `Utilisateur non trouvé: ${user}` });
    }

    // Vérifier si un ChatDiagnostic existe déjà pour l'utilisateur
    let chatDiagnostic = await ChatDiagnostic.findOne({ user });

    if (!chatDiagnostic) {
      // Créer un nouveau ChatDiagnostic si aucun n'existe
      chatDiagnostic = new ChatDiagnostic({
        user,
        sharedWith: [],
        messages: [],
      });

      await chatDiagnostic.save();

      // Créer un nouveau DossierMedical pour l'utilisateur
      const dossierMedical = new DossierMedical({
        user,
        images: [], // Initialiser avec un tableau vide pour les images
        diagnosticText: '', // Initialiser avec une chaîne vide pour le résumé
      });

      await dossierMedical.save();
    }

    // Envoyer la réponse avec l'objet chatDiagnostic
    res.status(200).json({
      success: true,
      message: 'Chat diagnostic récupéré ou créé avec succès',
      chatDiagnostic, // Inclure le chatDiagnostic dans la réponse
    });
  } catch (error) {
    console.error('Erreur lors de la création ou de la récupération du chat diagnostic:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur.',
      error: error.message, // Inclure le message d'erreur pour le débogage
    });
  }
});

app.post('/api/diagnostic', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    console.log('Début de la route /api/diagnostic');
    console.log('Fichier reçu:', req.file);

    // Vérifier que l'utilisateur est authentifié
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Utilisateur non authentifié.' });
    }

    const userId = req.user.id;

    if (!req.file) {
      console.error('Aucun fichier reçu');
      return res.status(400).json({ message: 'Aucun fichier reçu.' });
    }

    // Valider le type de fichier
    const allowedMimeTypes = ['image/jpeg', 'image/png'];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Type de fichier invalide. Seuls JPEG et PNG sont autorisés.' });
    }

    const imageName = req.file.filename; // Utilisez uniquement le nom du fichier

    // Envoyer l'image à l'API Flask pour le diagnostic
    const imageBuffer = fs.readFileSync(req.file.path);
    const formData = new FormData();
    formData.append('image', imageBuffer, req.file.originalname);

    const flaskResponse = await axios.post('http://127.0.0.1:5000/diagnostic', formData, {
      headers: formData.getHeaders(),
    });

    const diagnosticData = flaskResponse.data;

    // Récupérer ou créer un ChatDiagnostic pour l'utilisateur
    let chatDiagnostic = await ChatDiagnostic.findOne({ user: userId });

    if (!chatDiagnostic) {
      chatDiagnostic = new ChatDiagnostic({
        user: userId,
        sharedWith: [],
        messages: [],
      });
    }

    // Ajouter le nouveau message (image et réponse) au ChatDiagnostic
    chatDiagnostic.messages.push({
      image: imageName, // Stockez uniquement le nom du fichier
      response: diagnosticData.diagnostic[0].description,
    });

    await chatDiagnostic.save();

    // Récupérer ou créer un DossierMedical pour l'utilisateur
    let dossierMedical = await DossierMedical.findOne({ user: userId });

    if (!dossierMedical) {
      dossierMedical = new DossierMedical({
        user: userId,
        images: [],
        diagnosticText: '',
      });
    }

    // Ajouter l'image et le diagnostic au DossierMedical
    dossierMedical.images.push(imageName); // Stockez uniquement le nom du fichier
    dossierMedical.diagnosticText = diagnosticData.diagnostic[0].description;
    await dossierMedical.save();

    res.status(200).json({
      message: 'Diagnostic sauvegardé avec succès.',
      diagnostic: diagnosticData,
      chatDiagnostic,
    });
  } catch (error) {
    console.error('Erreur lors du diagnostic:', error.stack);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Erreur lors du diagnostic. Veuillez réessayer.', error: error.message });
  }
});

// Route pour récupérer les messages de ChatDiagnostic
app.get('/api/chatdiagnostic', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id.toString();
    let chatDiagnostic = await ChatDiagnostic.findOne({ user: userId });

    // Si aucun chat diagnostic n'existe, en créer un automatiquement
    if (!chatDiagnostic) {
      chatDiagnostic = new ChatDiagnostic({
        user: userId,
        sharedWith: [],
        messages: [],
      });
      await chatDiagnostic.save();
    }

    // Transformer les messages en format adapté
    const messages = chatDiagnostic.messages.flatMap((msg) => {
      if (msg.image) {
        return [
          { type: 'user', content: `http://localhost:5000/uploads/${msg.image.replace(/\\/g, '/')}` },
          { type: 'bot', content: msg.response },
        ];
      }
      return [{ type: 'bot', content: msg.response }];
    });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});



// Route pour Sauvegarder dans le DossierMedical
app.post('/api/dossierMedical', async (req, res) => {
  try {
    const { image, diagnosticText } = req.body;
    const dossierMedical = new DossierMedical({
      user: req.user._id, // Supposons que l'utilisateur est authentifié
      images: [image],
      diagnosticText,
    });
    await dossierMedical.save();
    res.status(201).json({ message: 'Dossier médical mis à jour.' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Route pour Partager le chat avec un dentiste
app.post('/api/shareChat', async (req, res) => {
  try {
    const { dentistId, chatHistory } = req.body;
    const chatDiagnostic = new ChatDiagnostic({
      user: req.user._id, // Supposons que l'utilisateur est authentifié
      sharedWith: [dentistId],
      messages: chatHistory,
    });
    await chatDiagnostic.save();
    res.status(201).json({ message: 'Chat partagé avec succès.' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});



app.get('/api/dentists', async (req, res) => {
  try {
    const dentists = await Dentist.find().select('username firstname lastname image city address phone workDays workHours');
    res.json(dentists);
  } catch (error) {
    console.error('Erreur lors de la récupération des dentistes :', error);
    res.status(500).json({ message: "Erreur du serveur", error });
  }
});


// Route : PUT /api/users/:id
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 1. Mettre à jour les champs de base dans User
    const userUpdate = {
      firstname: req.body.firstname,
      lastname: req.body.lastname
    };

    await User.findByIdAndUpdate(id, userUpdate);

    // 2. Mettre à jour les champs spécifiques au dentiste
    const dentistUpdate = {
      address: req.body.address,
      phone: req.body.phone,
      workDays: req.body.workDays,
      workHours: {
        open: req.body.workHours?.start || req.body.workHours?.open,
        close: req.body.workHours?.end || req.body.workHours?.close
      }
    };

    await Dentist.findOneAndUpdate(
      { user: id },
      { $set: dentistUpdate },
      { new: true, runValidators: true }
    );

    // 3. Récupérer l'utilisateur complet avec les infos dentiste
    const updatedUser = await User.findById(id)
      .populate({
        path: 'dentistInfo',
        model: 'Dentist'
      });

    res.json({
      success: true,
      user: updatedUser
    });

  } catch (error) {
    console.error('Erreur de mise à jour:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
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


// Récupérer la conversation de l'utilisateur
app.get('/api/chatbot/conversation', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Vérifie que l'ID est bien récupéré
    console.log('ID utilisateur:', userId);

    const user = await User.findById(userId).populate('chatbot');
    console.log('Utilisateur trouvé:', user);

    if (!user || !user.chatbot) {
      console.log('Aucune conversation trouvée pour cet utilisateur.');
      return res.status(404).json({ message: 'Aucune conversation trouvée' });
    }

    res.json(user.chatbot.messages);
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


// Ajouter un message à la conversation
app.post('/api/chatbot/conversation', authMiddleware, async (req, res) => {
  const { sender, text } = req.body;
  try {
    const userId = req.user.id.toString(); // Convertir en chaîne si nécessaire
    let user = await User.findById(userId).populate('chatbot');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Créer une nouvelle conversation si elle n'existe pas
    if (!user.chatbot) {
      const newConversation = new ChatbotConversation({ user: userId, messages: [] });
      await newConversation.save();
      user.chatbot = newConversation._id;
      await user.save();
    }

    // Ajouter le message à la conversation
    const conversation = await ChatbotConversation.findById(user.chatbot._id);
    conversation.messages.push({ sender, text });
    await conversation.save();

    res.json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Supprimer la conversation de l'utilisateur
app.delete('/api/chatbot/conversation', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id.toString(); // Convertir en chaîne si nécessaire
    const user = await User.findById(userId).populate('chatbot');
    if (!user || !user.chatbot) {
      return res.status(404).json({ message: 'Conversation non trouvée' });
    }

    // Supprimer la conversation
    await ChatbotConversation.findByIdAndDelete(user.chatbot._id);
    user.chatbot = null;
    await user.save();

    res.json({ message: 'Conversation supprimée avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


// Route pour vérifier l'existence d'une conversation
app.get('/api/conversations/check', authMiddleware, async (req, res) => {
  const { participant1, participant2 } = req.query;

  try {
    const conversation = await Conversation.findOne({
      participants: { $all: [participant1, participant2] }
    });

    res.json({
      exists: !!conversation,
      conversationId: conversation?._id || null
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// Route pour envoyer un message (avec Socket.io intégré)
app.post('/api/conversations/:id/messages', authMiddleware, async (req, res) => {
  try {
    const { sender, message } = req.body;
    
    const updatedConversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          messages: {
            sender,
            message
          }
        }
      },
      { new: true }
    );

    // Émettre l'événement Socket.io
    const io = req.app.get('socketio');
    io.to(req.params.id).emit('receive_message', {
      conversationId: req.params.id,
      sender,
      message
    });

    res.json(updatedConversation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Créer une nouvelle conversation
app.post('/api/conversations/', authMiddleware, async (req, res) => {
  try {
    const { participants } = req.body;
    
    const newConversation = new Conversation({
      participants
    });

    const savedConversation = await newConversation.save();
    res.status(201).json(savedConversation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route pour obtenir une conversation spécifique (à garder)
app.get('/api/conversations/:id', authMiddleware, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate('participants', 'firstName lastName image')
      .populate('messages.sender', 'firstName lastName');

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation non trouvée' });
    }
    
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route pour obtenir les conversations d'un utilisateur
app.get('/api/conversations/user/:userId', authMiddleware, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId);

    const conversations = await Conversation.find({
      participants: { $in: [userId] }
    })
    .populate('participants', 'firstname lastname image') // Modifié ici
    .populate('messages.sender', 'firstname lastname')   // Modifié ici
    .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
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



*/

// Start Server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
