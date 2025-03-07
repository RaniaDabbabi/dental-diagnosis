import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Mettre à jour les champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;

    if (!username || !password) {
      setMessage('Tous les champs sont obligatoires.');
      setError(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      console.log("Réponse du serveur:", data);

      if (response.ok && data.token) {
        // Stocker le token dans localStorage
        localStorage.setItem('token', data.token);

        // Stocker les informations de l'utilisateur dans localStorage
        localStorage.setItem('user', JSON.stringify(data.user));

        // Stocker l'ID du chatbot dans localStorage
        if (data.user.chatbotId) {
          localStorage.setItem('chatbotId', data.user.chatbotId);
        }

        // Stocker les notifications dans localStorage
        if (data.user.notifications) {
          localStorage.setItem('notifications', JSON.stringify(data.user.notifications));
        }

        setMessage('Connexion réussie');
        setError(false);
        setLoading(false);
        navigate('/'); // Rediriger vers la page d'accueil
      } else {
        setMessage(data.message || 'Nom d\'utilisateur ou mot de passe incorrect.');
        setError(true);
        setLoading(false);
      }
      const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));
const chatbotId = localStorage.getItem('chatbotId');
const notifications = JSON.parse(localStorage.getItem('notifications'));

console.log("Token:", token);
console.log("Utilisateur:", user);
console.log("ID du chatbot:", chatbotId);
console.log("Notifications:", notifications);
    } catch (error) {
      console.error('Erreur de connexion au serveur:', error);
      setMessage('Erreur de connexion au serveur.');
      setError(true);
      setLoading(false);
    }
    
  };

  return (
    <div
      className="signin-form mb-4"
      style={{
        backgroundColor: '#f9f9f9',
        color: 'black',
        height: 'auto',
        padding: '30px',
        borderRadius: '8px',
        maxWidth: '400px',
        margin: 'auto',
        marginTop: '10%',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h2 className="text-center mb-4">Se Connecter</h2>
      <form onSubmit={handleSubmit}>
        {/* Nom d'utilisateur */}
        <div className="form-group mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Nom d'utilisateur"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Mot de passe */}
        <div className="form-group mb-4">
          <input
            type="password"
            className="form-control"
            placeholder="Mot de passe"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Bouton de soumission */}
        <div className="form-group text-center mb-4">
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
          <p className="mt-3">
            Pas encore inscrit ?{' '}
            <a href="/signup" className="btn btn-link">
              Créer un compte
            </a>
          </p>
        </div>
      </form>

      {/* Message */}
      {message && (
        <div className="form-group text-center">
          <span style={{ color: error ? 'red' : 'green' }}>{message}</span>
        </div>
      )}
    </div>
  );
};

export default SignIn;