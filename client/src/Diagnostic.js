import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './styles.css';
import { useParams, useNavigate } from 'react-router-dom'; 

const Chatbot = () => {
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [user, setUser] = useState(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dentists, setDentists] = useState([]);
  const [filteredDentists, setFilteredDentists] = useState([]);
  const [selectedDentistId, setSelectedDentistId] = useState(null);
  const [selectedDentistName, setSelectedDentistName] = useState('');
  const { chatbotId, conversationId } = useParams(); // Récupère l'ID du chatbot et de la conversation depuis l'URL
  const navigate = useNavigate(); // Utilisez useNavigate
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      console.log("Token récupéré :", token); // Vérifiez si le token est présent
  
      if (!token) {
        console.log("Token manquant, redirection vers /signin");
        return (window.location.href = '/signin');
      }
  
      try {
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        console.log("Réponse API :", response.data); // Vérifiez la réponse de l'API
  
        if (response.data?.user) {
          setUser(response.data.user);
          fetchConversations(response.data.user._id);
        } else {
          console.log("Utilisateur non trouvé, suppression du token et redirection...");
          localStorage.removeItem('token');
          window.location.href = '/signin';
        }
      } catch (error) {
        console.error('Erreur utilisateur:', error);
        localStorage.removeItem('token');
        window.location.href = '/signin';
      }
    };
  
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchDentists = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/dentists');
        setDentists(response.data);
        setFilteredDentists(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des dentistes :', error);
      }
    };
  
    fetchDentists();
  }, []);

  useEffect(() => {
    if (conversationId && user?.chatbot) {
      loadConversation(conversationId);
    }
  }, [conversationId, user?.chatbot]);

  useEffect(() => {
    const filtered = dentists.filter((dentist) =>
      dentist.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDentists(filtered);
  }, [searchQuery, dentists]);

  useEffect(() => {
    if (conversationId && user?.chatbot) {
      loadConversation(conversationId);
    }
  }, [conversationId, user?.chatbot]);

  const fetchConversations = useCallback(async (userId) => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/conversations/user/${userId}`);
      setConversations(response.data || []);
    } catch (error) {
      console.error('Erreur conversations:', error);
      alert('Erreur lors du chargement des conversations.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDentistShare = (dentistId) => {
    const selectedDentist = dentists.find((dentist) => dentist._id === dentistId);
    if (selectedDentist) {
      setSelectedDentistId(dentistId);
      setSelectedDentistName(selectedDentist.name);
      setIsConfirmationDialogOpen(true);
    }
  };

  const confirmShare = async () => {
    try {
      await axios.post('http://localhost:5000/api/conversations/share', {
        conversationId: conversationId,
        dentistId: selectedDentistId,
      });
      alert('Conversation partagée avec succès !');
      setIsConfirmationDialogOpen(false);
      setIsShareDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors du partage :', error);
      alert('Erreur lors du partage de la conversation.');
    }
  };

  const startNewConversation = async () => {
    if (!user || !user.chatbot) return;
    try {
      const response = await axios.post('http://localhost:5000/api/conversations/create', {
        userId: user._id,
        chatbotId: user.chatbot,
      });
      if (response.data) {
        setIsChatStarted(true);
        setMessages([]);
        setConversations([...conversations, response.data]);
        // Rediriger vers l'URL de la nouvelle conversation
        navigate(`/diagnostic/${user.chatbot}/${response.data._id}`);
      }
    } catch (error) {
      console.error('Erreur création conversation:', error);
    }
  };

  const loadConversation = async (conversationId) => {
    console.log("Chargement de la conversation avec l'ID :", conversationId);
    try {
      const response = await axios.get(`http://localhost:5000/api/conversations/${conversationId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      console.log("Réponse du serveur :", response.data);
      setMessages(response.data.messages || []);
      setIsChatStarted(true);
  
      // Mettre à jour l'URL
      if (window.location.pathname !== `/diagnostic/${user.chatbot}/${conversationId}`) {
        navigate(`/diagnostic/${user.chatbot}/${conversationId}`);
      }
    } catch (error) {
      console.error('Erreur chargement conversation:', error);
      alert('Erreur lors du chargement de la conversation. Veuillez réessayer.');
    }
  };
  const sendMessage = async () => {
    if (!userMessage.trim() && !selectedImage) return;

    if (conversations.length === 0) return;
    const activeConversation = conversations[conversations.length - 1];
    if (!activeConversation) return;

    try {
      const response = await axios.post(
        `http://localhost:5000/api/conversations/${activeConversation._id}/message`,
        { sender: user._id, message: userMessage }
      );
      setMessages([...messages, response.data.message]);
    } catch (error) {
      console.error('Erreur envoi message:', error);
    }

    setUserMessage('');
    if (selectedImage) setSelectedImage(null);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) setSelectedImage(file);
  };

  const handleShareConversation = () => {
    if (conversations.length === 0) return;
    const activeConversation = conversations[conversations.length - 1];
    if (!activeConversation) return;

    const conversationLink = `http://localhost:3000/conversation/${activeConversation._id}`;
    navigator.clipboard.writeText(conversationLink)
      .then(() => {
        alert("Lien de la conversation copié dans le presse-papiers !");
      })
      .catch((error) => {
        console.error("Erreur lors de la copie du lien :", error);
      });
    setIsShareDialogOpen(true);
  };


return (
    <div id="app-container">
      <div id="sidebar">
        <div id="sidebar-header">Conversations</div>
        <button id="new-chat-btn" onClick={startNewConversation}>Nouvelle Conversation</button>
        <ul id="conversation-list">
          {conversations.map((conv) => (
            <li key={conv._id} className="conversation-item" onClick={() => loadConversation(conv._id)}>
              {conv.title || "Nouvelle Conversation"}
            </li>
          ))}
        </ul>
      </div>
      <div id="chat-container">
        {!isChatStarted ? (
          <div id="start-screen">
            <h1>Bienvenue chez Assistant Dentaire</h1>
            <button id="start-chat-btn" onClick={startNewConversation}>Nouvelle Conversation</button>
          </div>
        ) : (
          <>
            <div id="chat-header">
              <span>Assistant Dentaire</span>
              <button id="share-btn" onClick={handleShareConversation}>Partager</button>
            </div>
            <div id="chat-history">
              {messages.map((msg, index) => (
                <div key={index} className={msg.sender === user?._id ? 'user-message' : 'bot-message'}>
                  <p>{msg.message}</p>
                </div>
              ))}
            </div>
            <div id="chat-input-container">
              <input
                type="text"
                placeholder="Entrez votre message..."
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                id="userMessage"
              />
              <div id="input-buttons">
                <label htmlFor="photoUpload" id="uploadBtn">📷</label>
                <input type="file" id="photoUpload" accept="image/*" onChange={handleImageUpload} hidden />
                <button id="sendMessageBtn" onClick={sendMessage}>Envoyer</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Boîte de dialogue de partage */}
      {isShareDialogOpen && (
        <div id="share-dialog">
          <div id="share-dialog-content">
            <h3>Partager la conversation</h3>
            <input
              type="text"
              placeholder="Rechercher un dentiste..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <ul id="dentist-list">
              {filteredDentists.map((dentist) => (
                <li key={dentist._id} className="dentist-item">
                  <span>{dentist.name}</span>
                  <button onClick={() => handleDentistShare(dentist._id)}>Partager</button>
                </li>
              ))}
            </ul>
            <button id="close-share-dialog" onClick={() => setIsShareDialogOpen(false)}>Fermer</button>
          </div>
        </div>
      )}

      {/* Boîte de dialogue de confirmation */}
      {isConfirmationDialogOpen && (
        <div id="confirmation-dialog">
          <div id="confirmation-dialog-content">
            <p>Voulez-vous vraiment partager cette conversation avec {selectedDentistName} ?</p>
            <button onClick={confirmShare}>Confirmer</button>
            <button onClick={() => setIsConfirmationDialogOpen(false)}>Annuler</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
