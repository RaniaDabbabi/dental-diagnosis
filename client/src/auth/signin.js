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

    // Vérifier que tous les champs sont remplis
    if (!username || !password) {
      setMessage('Tous les champs sont obligatoires.');
      setError(true);
      return;
    }

    try {
      // Envoyer une requête POST au serveur
      const response = await fetch('http://localhost:5000/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // Si la connexion est réussie
      if (response.ok) {
        // Stocker les informations de l'utilisateur dans le localStorage
        const user = {
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
          role: data.user.role,
        };
        localStorage.setItem('user', JSON.stringify(user));

        // Afficher un message de succès
        setMessage('Connexion réussie');
        setError(false);

        // Rediriger vers la page d'accueil
        navigate('/');
        window.location.reload(); // Recharger la page pour mettre à jour l'état de l'application
      } else {
        // Afficher un message d'erreur
        setMessage(data.message || 'Erreur de serveur.');
        setError(true);
      }
    } catch (error) {
      console.error('Erreur de connexion au serveur:', error);
      setMessage('Erreur de connexion au serveur.');
      setError(true);
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
          <input
            type="submit"
            value="Se connecter"
            className="btn btn-primary btn-block"
          />
          <p className="mt-3">
            Pas encore inscrit ?{' '}
            <a href="/signup" className="btn btn-link">
              Créer un compte
            </a>
          </p>
        </div>
      </form>

      {/* Message */}
      <div className="form-group">
        <span style={{ color: error ? 'red' : 'green' }}>{message}</span>
      </div>
    </div>
  );
};

export default SignIn;