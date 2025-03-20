import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export function Navbar() {
  const user = JSON.parse(localStorage.getItem('user'));

  const imageUrl = user?.image ? `http://localhost:5000/${user.image.replace(/\\/g, '/')}` : null;
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]); // État pour stocker les notifications
  const [showNotifications, setShowNotifications] = useState(false); // État pour afficher/cacher les notifications

  // Fonction pour charger les notifications de l'utilisateur
  const fetchNotifications = async () => {
    if (!user || !user._id) return; // Vérifier si l'utilisateur est bien défini
  
    try {
      const response = await fetch(`http://localhost:5000/api/notifications/user/${user._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    }
  };
  
  // Exécuter la requête une seule fois lorsque `user` est chargé
  useEffect(() => {
    if (user && user._id) {
      fetchNotifications();
    }
  }, []); 
  

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('chatdiagnosticId')
    localStorage.removeItem('notifications')
    navigate('/');
    window.location.reload();
  };

  // Fonction pour basculer l'affichage des notifications
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ background: "linear-gradient(135deg, #0b2b66, #1a53ff)" }}>
      <div className="container">
        <Link className="navbar-brand text-light" to="/">DentDiag</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link text-light" to="/">Accueil</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/dentists">Les Dentistes</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/Apropos">À propos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/contact">Contact</Link>
            </li>
          </ul>
          <div className="d-flex align-items-center">
            {user ? (
              <>
                {/* Icône des notifications */}
                <div className="position-relative me-3">
                  <button
                    className="btn btn-link text-light p-0"
                    onClick={toggleNotifications}
                  >
                    <FaBell size={24} />
                    {notifications.length > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {notifications.length}
                      </span>
                    )}
                  </button>

                  {/* Liste déroulante des notifications */}
                  {showNotifications && (
                    <div
                      className="position-absolute end-0 mt-2 bg-white rounded shadow-lg"
                      style={{ width: '300px', zIndex: 1000 }}
                    >
                      <div className="p-3">
                        <h6 className="mb-3">Notifications</h6>
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div key={notification._id} className="mb-2">
                              <p className="mb-0">{notification.message}</p>
                              <small className="text-muted">
                                {new Date(notification.timestamp).toLocaleString()}
                              </small>
                            </div>
                          ))
                        ) : (
                          <p className="mb-0">Aucune nouvelle notification.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Afficher le firstname et l'image/icône de profil */}
                <div className="d-flex align-items-center me-3">
                  <span className="navbar-text text-light me-2">
                    {user.firstName}
                  </span>
                  <Link to={user.role === 'Dentist' ? '/profile/dentist' : '/profile/user'} className="text-decoration-none">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="Profile"
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <FaUserCircle
                        style={{
                          width: '40px',
                          height: '40px',
                          color: 'white',
                        }}
                      />
                    )}
                  </Link>
                </div>

                {/* Bouton de déconnexion */}
                <button
                  className="btn btn-outline-warning"
                  onClick={handleLogout}
                >
                  Déconnecter
                </button>
              </>
            ) : (
              <Link to="/signin" className="btn btn-outline-light">
                Connecter
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-3" style={{ background: "linear-gradient(135deg, #0b2b66, #1a53ff)" }}>
      <div className="container">
        <p className="mb-0">© {new Date().getFullYear()} DentDiag. Tous droits réservés.</p>
      </div>
    </footer>
  );
}