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

        console.log('Données reçues:', res.data); // Ajoutez ce log
        setHistory(res.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des messages de diagnostic :', error);
        setError('Échec de la récupération des messages de diagnostic.');
      }
    };
    fetchChatDiagnostic();
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('La taille de l\'image ne doit pas dépasser 5 Mo.');
        return;
      }
      console.log('Fichier sélectionné:', file);
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setError(null);
    }
  };
  console.log('History mis à jour:', history);
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
  
      // Envoyer l'image au backend
      const response = await axios.post('http://localhost:5000/api/diagnostic', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log('Réponse du backend:', response.data); // Log pour vérifier la réponse
  
      // Récupérer les données mises à jour après l'envoi
      const updatedResponse = await axios.get('http://localhost:5000/api/chatdiagnostic', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log('Données mises à jour:', updatedResponse.data); // Log pour vérifier les données mises à jour
  
      // Mettre à jour l'état local avec les données mises à jour
      setHistory(updatedResponse.data);
  
      setSelectedImage(null);
      setPreviewImage(null);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Échec du diagnostic. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedImage]);

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
            <div
              key={index}
              className={`message-container ${message.type === 'user' ? 'user-message-container' : 'bot-message-container'}`}
            >
              {message.type === 'user' ? (
                <div className="image-container">
                  <img src={message.content} alt="Envoyé" className="message-image" />
                </div>
              ) : (
                <div className="text-container">
                  <p>{message.content}</p>
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