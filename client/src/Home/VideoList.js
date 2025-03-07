import React, { useState } from 'react';

function VideoList({ videos }) {
  const [isPaused, setIsPaused] = useState(false);

  const handleMouseEnter = () => {
    setIsPaused(true); // Arrête l'animation
  };

  const handleMouseLeave = () => {
    setIsPaused(false); // Reprend l'animation
  };
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
    <div className="video-list-container">
      {/* Ajouter l'animation dans une balise <style> */}
      <style>{shineAnimation}</style>

      {/* Titre avec styles inline */}
      <h6 style={attractiveTitleStyle}>Vidéos Instructives sur les Soins Dentaires : Astuces et Techniques</h6><br/>
      <div
        className="video-list"
        style={{ animationPlayState: isPaused ? 'paused' : 'running' }} // Contrôle l'animation
      >
        {videos.map((video, index) => (
          <div
            key={index}
            className="video-item"
            onMouseEnter={handleMouseEnter} // Gère l'entrée de la souris
            onMouseLeave={handleMouseLeave} // Gère la sortie de la souris
          >
            <video controls width="100%" height="200">
              <source src={video.link} type="video/mp4" />
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
            <p>{video.title}</p>
          </div>
        ))}
        {/* Dupliquer les vidéos pour l'effet infini */}
        {videos.map((video, index) => (
          <div
            key={`${index}-duplicate`}
            className="video-item"
            onMouseEnter={handleMouseEnter} // Gère l'entrée de la souris
            onMouseLeave={handleMouseLeave} // Gère la sortie de la souris
          >
            <video controls width="100%" height="200">
              <source src={video.link} type="video/mp4" />
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
            <p>{video.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VideoList;