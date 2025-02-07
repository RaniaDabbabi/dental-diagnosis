import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ArticleList({ articles }) {
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  // Dupliquer les articles pour l'effet de défilement infini
  const duplicatedArticles = [...articles, ...articles];

  return (
    <div className="article-list-container">
      <h3>Articles dentaires à ne pas manquer</h3>
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