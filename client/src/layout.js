import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaBell, FaEnvelope, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ChatBubble from './ChatBubble';
import { FaTooth } from 'react-icons/fa';


export function Navbar() {
  const user = JSON.parse(localStorage.getItem('user'));
  const imageUrl = user?.image ? `http://localhost:5000/${user.image.replace(/\\/g, '/')}` : null;
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [activeConversation, setActiveConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false)


  const fetchNotifications = async () => {
    if (!user || !user._id) return;
  
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

  const fetchConversations = async () => {
    if (!user || !user._id) return;
  
    try {
      const response = await fetch(`http://localhost:5000/api/conversations/user/${user._id}`, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
      });
  
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
  
      const data = await response.json();
      const sortedConversations = data.sort((a, b) => {
        const lastMsgA = a.messages[a.messages.length - 1]?.timestamp || 0;
        const lastMsgB = b.messages[b.messages.length - 1]?.timestamp || 0;
        return new Date(lastMsgB) - new Date(lastMsgA);
      });
      setConversations(sortedConversations);
    } catch (error) {
      console.error('Erreur lors du chargement des conversations:', error);
      // Optionnel : Afficher un message à l'utilisateur
    }
  };
  
  useEffect(() => {
    if (user && user._id) {
      fetchConversations().then(data => {
        console.log("Conversations data:", data);
      });
    }
  }, [user?._id]);

  useEffect(() => {
    if (user && user._id) {
      fetchNotifications();
      fetchConversations();
    }
  }, [user?._id]); // Seulement si user._id change

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;

    try {
      const response = await fetch(`http://localhost:5000/api/conversations/${activeConversation._id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          sender: user._id,
          message: newMessage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const updatedConversation = await response.json();
      setActiveConversation(updatedConversation);
      setNewMessage('');
      fetchConversations(); // Rafraîchir la liste des conversations
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      fetchNotifications();
      fetchConversations();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('chatdiagnosticId');
    localStorage.removeItem('notifications');
    navigate('/');
    window.location.reload();
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showMessages) setShowMessages(false);
  };

  const toggleMessages = () => {
    setShowMessages(!showMessages);
    if (showNotifications) setShowNotifications(false);
    if (showMessages) setActiveConversation(null);
  };

  const openConversation = (conversation) => {
    setActiveConversation(conversation);
  };

  const getOtherParticipant = (conversation) => {
    if (!conversation || !conversation.participants) return null;
    const other = conversation.participants.find(p => p._id !== user._id);
    // Ajoutez un log pour déboguer
    console.log("Other participant:", other);
    return other;
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ background: "linear-gradient(135deg, #0b2b66, #1a53ff)" }}>
      <div className="container">
      <Link className="navbar-brand text-light" to={user ? "/Home" : "/"}><FaTooth />DentDiag</Link>
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
            <Link className="nav-link text-light " to={user ? "/Home" : "/"}>Accueil</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/dentists">Les Dentistes</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/Apropos">À propos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/ContactUs">Contact</Link>
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

                {/* Icône de messagerie */}
                <div className="position-relative me-3">
                  <button 
                    className="btn btn-link text-light p-0"
                    onClick={toggleMessages}
                  >
                    <FaEnvelope size={24} />
                    {conversations.length > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {conversations.length}
                      </span>
                    )}
                  </button>

                  {showMessages && !activeConversation && (
  <div
    className="position-absolute end-0 mt-2 bg-white rounded shadow-lg"
    style={{ width: '350px', zIndex: 1000, maxHeight: '500px', overflowY: 'auto' }}
  >
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0">Messages</h6>
        <button 
          className="btn btn-sm btn-outline-secondary"
          onClick={() => setShowMessages(false)}
        >
          <FaTimes />
        </button>
      </div>
      {conversations.length > 0 ? (
        conversations.map((conversation) => {
          const otherParticipant = getOtherParticipant(conversation);
          const lastMessage = conversation.messages[conversation.messages.length - 1];
          
          return (
            <div 
              key={conversation._id} 
              className="mb-2 p-2 border-bottom cursor-pointer"
              onClick={() => openConversation(conversation)}
            >
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-center">
  <h6 className="mb-0">
    {otherParticipant?.firstname} {otherParticipant?.lastname}
  </h6>
  <small className="text-muted">
    {lastMessage?.timestamp ? 
      new Date(lastMessage.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
      : ''}
  </small>
</div>
                  <p className="mb-0 text-muted small">
                    {lastMessage?.message?.substring(0, 30)}{lastMessage?.message?.length > 30 ? '...' : ''}
                  </p>
                </div>
                {otherParticipant?.image ? (
                  <img
                    src={`http://localhost:5000/${otherParticipant.image.replace(/\\/g, '/')}`}
                    alt={otherParticipant.firstName}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginLeft: '10px'
                    }}
                  />
                ) : (
                  <FaUserCircle
                    style={{
                      width: '40px',
                      height: '40px',
                      color: '#6c757d',
                      marginLeft: '10px'
                    }}
                  />
                )}
              </div>
            </div>
          );
        })
      ) : (
        <p className="mb-0">Aucune conversation.</p>
      )}
    </div>
  </div>
)}
                </div>

                {activeConversation && (
                  <ChatBubble
  conversation={activeConversation}
  currentUser={user}
  otherParticipant={getOtherParticipant(activeConversation)}
  onClose={() => setActiveConversation(null)}
  isMinimized={isMinimized}
  onToggleMinimize={() => setIsMinimized(!isMinimized)}
/>
)}


                {/* Afficher le prénom et l'image/icône de profil */}
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