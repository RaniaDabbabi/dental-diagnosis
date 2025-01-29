import React, { useState } from 'react';
import './styles.css';

const Chatbot = () => {
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  // Ajouter un message à l'historique
  const addMessage = (message, sender, isImage = false) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { message, sender, isImage },
    ]);
  };

  // Fonction pour envoyer le message
  const sendMessage = async () => {
    if (!userMessage.trim() && !selectedImage) return;
  
    if (userMessage.trim()) {
      addMessage(userMessage, 'user', false);
      setUserMessage('');
    }
  
    if (selectedImage) {
      addMessage(URL.createObjectURL(selectedImage), 'user', true); // Ajouter l'image dans l'historique
      const formData = new FormData();
      formData.append('image', selectedImage);
  
      try {
        const response = await fetch('http://localhost:5000/api/diagnostic', {
          method: 'POST',
          body: formData,
        });
  
        const data = await response.json();
        if (response.ok) {
          // Ajouter un message pour le diagnostic
          addMessage(
            ` ${data.diagnostic
              .map((d) => d.description)
              .join(', ')}`,
            'bot'
          );
        } else {
          addMessage("Erreur lors de l'analyse de l'image.", 'bot');
        }
      } catch (error) {
        console.error("Erreur lors de l'envoi de l'image :", error);
        addMessage("Erreur lors de l'envoi de l'image.", 'bot');
      }
  
      setSelectedImage(null);
    }
  };
  
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  return (
    <div id="chat-container">
      <div id="chat-header">Assistant Dentaire</div>
      <div id="chat-history">
  {messages.map((msg, index) => (
    <div
      key={index}
      className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
    >
      {msg.isImage ? (
        <img src={msg.message} alt="Uploaded" className="message-image" />
      ) : (
        msg.message
      )}
    </div>
  ))}
</div>

      <div id="chat-input-container">
        <input
          type="text"
          id="userMessage"
          placeholder="Entrez votre message..."
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
        />
        <label htmlFor="photoUpload" id="uploadBtn">
          📷
        </label>
        <input
          type="file"
          id="photoUpload"
          accept="image/*"
          onChange={handleImageUpload}
        />
        <button id="sendMessageBtn" onClick={sendMessage}>
          Envoyer
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
