import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

const ChatDiagnostic = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [dentists, setDentists] = useState([]);
  const [error, setError] = useState(null);

  // Charger les messages de ChatDiagnostic au montage du composant
  useEffect(() => {
    const fetchChatDiagnostic = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Vous devez être connecté pour accéder à cette fonctionnalité.');
          return;
        }

        const res = await axios.get('http://localhost:5000/api/chatdiagnostic', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const formattedMessages = res.data.map((msg) => ({
          type: msg.image ? 'user' : 'bot',
          image: msg.image || null,
          text: msg.response || null,
        }));

        setHistory(formattedMessages);
      } catch (error) {
        console.error('Erreur lors de la récupération des messages :', error);
        setError('Échec de la récupération des messages.');
      }
    };

    fetchChatDiagnostic();
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("L'image ne doit pas dépasser 5 Mo.");
        return;
      }
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setError(null);
    }
  };

  const sendImageForDiagnosis = useCallback(async () => {
    if (!selectedImage) {
      setError('Veuillez sélectionner une image.');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vous devez être connecté pour effectuer cette action.');
        setIsLoading(false);
        return;
      }

      const response = await axios.post('http://localhost:5000/api/diagnostic', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      setHistory((prevHistory) => [
        ...prevHistory,
        { type: 'user', image: previewImage },
        { type: 'bot', text: response.data.diagnostic.diagnosis },
      ]);

      setSelectedImage(null);
      setPreviewImage(null);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Échec du diagnostic. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedImage, previewImage]);

  const ShareDialog = ({ show, dentists, onClose, onShare }) => {
    const [selectedDentist, setSelectedDentist] = useState('');

    return (
      show && (
        <div id="share-dialog">
          <div id="share-dialog-content">
            <h3>Partager avec un dentiste</h3>
            <select onChange={(e) => setSelectedDentist(e.target.value)} value={selectedDentist}>
              <option value="">Sélectionnez un dentiste</option>
              {dentists.map(dentist => (
                <option key={dentist._id} value={dentist._id}>{dentist.username}</option>
              ))}
            </select>
            <div className="dialog-buttons">
              <button onClick={() => onShare(selectedDentist)}>Partager</button>
              <button onClick={onClose}>Fermer</button>
            </div>
          </div>
        </div>
      )
    );
  };

  const openShareDialog = async () => {
    setShowShareDialog(true);
    try {
      const response = await axios.get('http://localhost:5000/api/dentists');
      setDentists(response.data);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Échec du chargement des dentistes.');
    }
  };

  const shareChatWithDentist = useCallback(async (dentistId) => {
    if (!dentistId) {
      setError('Veuillez sélectionner un dentiste.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/shareChat', {
        dentistId,
        chatHistory: history,
      });
      setShowShareDialog(false);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Échec du partage. Réessayez.');
    }
  }, [history]);

  return (
    <div id="app-container">
      <div id="chat-container">
        <div id="chat-header">
          Assistant Dentaire - Diagnostic
          <button id="share-btn" onClick={openShareDialog}>Partager</button>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => setError(null)}>Fermer</button>
          </div>
        )}

        <div id="chat-history">
          {history.map((message, index) => (
            <div key={index} className={`message-container ${message.type === 'user' ? 'user-message-container' : 'bot-message-container'}`}>
              {message.image && (
                <div className="image-container">
                  <img src={message.image} alt="Envoyé" className="message-image" />
                </div>
              )}
              {message.text && (
                <div className="text-container">
                  <p>{message.text}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {previewImage && (
          <div className="preview-container">
            <p>Aperçu :</p>
            <img src={previewImage} alt="Aperçu" className="preview-image" />
          </div>
        )}

        <div id="chat-input-container">
          <label htmlFor="photoUpload" id="uploadBtn">📷</label>
          <input type="file" id="photoUpload" accept="image/*" onChange={handleImageUpload} hidden />
          <button id="sendImageBtn" onClick={sendImageForDiagnosis} disabled={isLoading}>
            {isLoading ? <div className="spinner"></div> : 'Envoyer'}
          </button>
        </div>
      </div>

      <ShareDialog
        show={showShareDialog}
        dentists={dentists}
        onClose={() => setShowShareDialog(false)}
        onShare={shareChatWithDentist}
      />
    </div>
  );
};

export default ChatDiagnostic;