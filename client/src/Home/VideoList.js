import React, { useState } from 'react';

function VideoList({ videos }) {
  const [isPaused, setIsPaused] = useState(false);

  const handleMouseEnter = () => {
    setIsPaused(true); // Arrête l'animation
  };

  const handleMouseLeave = () => {
    setIsPaused(false); // Reprend l'animation
  };

  return (
    <div className="video-list-container">
      <h3>Des vidéos pour des dents saines</h3><br/>
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