import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FloatingChatbot.css';

const FloatingChatbot = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);

  // Charger la conversation au montage du composant
useEffect(() => {
  const fetchConversation = async () => {
    try {
      console.log('Token:', localStorage.getItem('token'));
      
      const res = await axios.get('http://localhost:5000/api/chatbot/conversation', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      console.log('Réponse API après rafraîchissement:', res.data);
      setConversation(res.data);
    } catch (error) {
      console.error('Erreur lors de la récupération de la conversation:', error);
    }
  };

  fetchConversation();
}, [userId]);  

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Ajouter le message de l'utilisateur à la conversation
    const userMessage = { sender: 'user', text: message };
    setConversation((prev) => [...prev, userMessage]);

    try {
      // Envoyer le message au backend
      await axios.post('http://localhost:5000/api/chatbot/conversation', userMessage, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      // Simuler une réponse du bot (à remplacer par une vraie réponse)
      const botResponse = { sender: 'bot', text: 'Ceci est une réponse du bot.' };
      setConversation((prev) => [...prev, botResponse]);
      await axios.post('http://localhost:5000/api/chatbot/conversation', botResponse, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
    } catch (error) {
      console.error(error);
      setConversation((prev) => [...prev, { sender: 'bot', text: "Désolé, une erreur s'est produite." }]);
    }

    setMessage('');
  };

  const clearConversation = async () => {
    try {
      await axios.delete('http://localhost:5000/api/chatbot/conversation', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setConversation([]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={`floating-chatbot ${isOpen ? 'open' : ''}`}>
      {!isOpen && (
        <div className="chatbot-icon" onClick={toggleChat}>
          <i className="bi bi-chat-dots-fill"></i>
        </div>
      )}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Chatbot Assistant</h3>
            <div>
              <button onClick={clearConversation} title="Effacer la conversation">
                <h3>🔁</h3>
              </button>
              <button onClick={toggleChat}><h3>×</h3></button>
            </div>
          </div>
          <div className="chatbot-conversation">
            {conversation.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <span className="message-sender">
                  {msg.sender === 'user' ? 'Vous' : 'Bot'}
                </span>
                <span className="message-text">{msg.text}</span>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="chatbot-input">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tapez votre message..."
            />
            <button type="submit">Envoyer</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default FloatingChatbot;