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

  // Update form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;
  
    if (!username || !password) {
      setMessage('Tous les champs sont obligatoires.');
      setError(true);
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      if (response.ok) {
        const user = {
          firstName: data.firstName,
          username: data.username,
          role: data.role, 
        };
        localStorage.setItem('user', JSON.stringify(user));
        setMessage('Connexion réussie');
        setError(false);
      
        navigate('/'); 
        window.location.reload();
      } else {
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
        {/* Username */}
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

        {/* Password */}
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

        {/* Submit */}
        <div className="form-group text-center mb-4 ">
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
