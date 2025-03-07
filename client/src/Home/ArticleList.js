import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ArticleList({ articles }) {
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  // Dupliquer les articles pour l'effet de défilement infini
  const duplicatedArticles = [...articles, ...articles];

  // Styles inline pour le titre
  const attractiveTitleStyle = {
    fontSize: '2.0rem',
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: '20px',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    background: 'linear-gradient(90deg, #3498db, #8e44ad)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: 'shine 3s infinite',
  };

  // Styles inline pour l'animation
  const shineAnimation = `
    @keyframes shine {
      0% { background-position: -200%; }
      100% { background-position: 200%; }
    }
  `;

  return (
    <div className="article-list-container">
      {/* Ajouter l'animation dans une balise <style> */}
      <style>{shineAnimation}</style>

      {/* Titre avec styles inline */}
      <h6 style={attractiveTitleStyle}>
        Découvrez Notre Sélection d'Articles Dentaires Essentiels
      </h6>
      <br />
      <div
        className="article-list"
        style={{ animationPlayState: isPaused ? 'paused' : 'running' }} // Contrôle l'animation
        onMouseEnter={() => setIsPaused(true)} // Arrête l'animation au survol
        onMouseLeave={() => setIsPaused(false)} // Reprend l'animation
      >
        {duplicatedArticles.map((article, index) => (
          <div
            key={`${article.id}-${index}`} // Clé unique pour chaque élément
            className="article-item"
            onClick={() => navigate(article.link)} // Redirige vers la page de l'article
          >
            <img src={article.image} alt={article.title} className="article-image" />
            <p className="article-title">{article.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArticleList;