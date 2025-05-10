// ContactUsPage.jsx
import React, { useState } from 'react';
import './ContactUsPage.css';

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici vous pouvez ajouter la logique pour envoyer les données
    console.log('Formulaire soumis:', formData);
    alert('Merci pour votre message! Nous vous contacterons bientôt.');
    setFormData({
      name: '',
      email: '',
      message: ''
    });
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Contactez-nous</h1>
        <p>Nous serions ravis d'avoir de vos nouvelles. Remplissez le formulaire ci-dessous et nous vous répondrons dès que possible.</p>
      </div>
      
      <div className="contact-content">
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Nom complet</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              required
            ></textarea>
          </div>
          
          <button type="submit" className="submit-btn">Envoyer le message</button>
        </form>
        
        <div className="contact-info">
          <h2>Informations de contact</h2>
          <div className="info-item">
            <i className="fas fa-map-marker-alt"></i>
            <p>Fac de sciences ,Monastir</p>
          </div>
          <div className="info-item">
            <i className="fas fa-phone"></i>
            <p>+216477505</p>
          </div>
          <div className="info-item">
            <i className="fas fa-envelope"></i>
            <p>rania.dabbabi20@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
