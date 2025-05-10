import React, { useState, useEffect } from 'react';
import { FaTooth, FaCommentDots, FaUserMd, FaVideo, FaCog, FaHeartbeat, FaBell, FaHistory } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ReviewCarousel from "./Home/ReviewCarousel";
import ConseilsDentaire from './Home/ConseilsDentaire';
import { styles } from './DashboardStyles';
import { io } from "socket.io-client"
import 'bootstrap/dist/css/bootstrap.min.css';

const socket = io("http://localhost:5000");

const SidebarItem = ({ icon: Icon, label, path }) => {
  const navigate = useNavigate();
  return (
    <div style={styles.sidebarItem} onClick={() => navigate(path)}>
      <Icon style={styles.sidebarIcon} />
      <span style={styles.sidebarLabel}>{label}</span>
    </div>
  );
};

const MessagePreview = ({ name, lastMessage, time, unread }) => (
  <div style={styles.messagePreview}>
    <div style={styles.messageHeader}>
      <span style={{ ...styles.senderName, fontWeight: unread ? 'bold' : 'normal' }}>{name}</span>
      <span style={styles.messageTime}>{time}</span>
    </div>
    <p style={{ ...styles.messageContent, fontWeight: unread ? 'bold' : 'normal' }}>
      {lastMessage}
    </p>
  </div>
);

export default function Dashboard() {
  const [tips, setTips] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [activeConversation, setActiveConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));
  const imageUrl = user?.image ? `http://localhost:5000/${user.image.replace(/\\/g, '/')}` : null;
  const navigate = useNavigate();

  const [diagnosisHistory] = useState([
    { date: "15/05/2023", result: "Gingivite légère", details: "Recommandé: bain de bouche" },
    { date: "10/03/2023", result: "Sensibilité dentaire", details: "Dentifrice spécial recommandé" },
    { date: "05/01/2023", result: "Aucun problème détecté", details: "Continuer votre routine" }
  ]);

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) return false;
    return { token, userId };
  };

  const fetchNotifications = async () => {
    if (!user || !user._id) return;
    try {
      const response = await fetch(`http://localhost:5000/api/notifications/user/${user._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
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
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      const data = await response.json();
console.log("Conversations:", data);
setConversations(data);

      const sorted = data.sort((a, b) => {
        const tA = a.messages[a.messages.length - 1]?.timestamp || 0;
        const tB = b.messages[b.messages.length - 1]?.timestamp || 0;
        return new Date(tB) - new Date(tA);
      });
      setConversations(sorted);
    } catch (error) {
      console.error('Erreur lors du chargement des conversations:', error);
    }
  };
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user || !user._id) return;
      try {
        const response = await fetch(`http://localhost:5000/api/notifications/user/${user._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        const data = await response.json();
        console.log("Notifications:", data); // 👈 debug
        setNotifications(data);
      } catch (error) {
        console.error('Erreur lors du chargement des notifications:', error);
      }
    };
  
    fetchNotifications(); // Appel correct
  }, [user?._id]);
  
  useEffect(() => {
    if (user && user._id) {
      fetchNotifications();
      fetchConversations();
    }
  }, [user?._id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTips(prevTips => prevTips.length > 0 ? [...prevTips.slice(1), prevTips[0]] : prevTips);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getOtherParticipant = (conversation) => {
    if (!conversation?.participants) return null;
    return conversation.participants.find(p => p._id !== user._id);
  };

  useEffect(() => {
    socket.on("newMessage", (newMessageData) => {
      console.log("Message reçu en temps réel:", newMessageData);
      fetchConversations(); // Recharger la liste des conversations
    });
  
    return () => {
      socket.off("newMessage"); // Nettoyage
    };
  }, []);

  
  return (
    <div style={styles.container}>
      {/* Sidebar avec navigation */}
      <div style={styles.sidebar}>
        
        <SidebarItem icon={FaHeartbeat} label="Diagnostic" path="/diagnostic/:chatdiagnosticId" />
        <SidebarItem icon={FaCommentDots} label="Messages" path="/messages" />
        <SidebarItem icon={FaUserMd} label="Articles" path="/dentists" />
        <SidebarItem icon={FaVideo} label="Vidéos" path="/videos" />
        <SidebarItem icon={FaCog} label="Paramètres" path="/settings" />
      </div>

      {/* Contenu principal */}
      <div style={styles.mainContent}>
        {/* Première ligne - Historique et Messages */}
        <div style={styles.topRow}>
          {/* Historique des diagnostics */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}><FaHistory style={styles.icon} /> Historique des diagnostics</h3>
            <div style={styles.historyList}>
              {diagnosisHistory.map((item, index) => (
                <div key={index} style={styles.historyItem}>
                  <div style={styles.historyDate}>{item.date}</div>
                  <div style={styles.historyResult}>{item.result}</div>
                  <div style={styles.historyDetails}>{item.details}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Messages récents */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}><FaCommentDots style={styles.icon} /> Messages récents</h3>
            <div style={styles.messagesList}>
  {conversations.length > 0 ? (
    conversations.map((conversation) => {
      const otherParticipant = getOtherParticipant(conversation);
      const lastMessage = conversation.messages[conversation.messages.length - 1];

      return (
        <div 
          key={conversation._id} 
          className="mb-2 p-2 border-bottom cursor-pointer d-flex align-items-center"
          onClick={() => navigate(`/messages/${conversation._id}`)}
        >
          <div className="flex-grow-1 me-2">
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
              {lastMessage?.message?.substring(0, 30)}
              {lastMessage?.message?.length > 30 ? '...' : ''}
            </p>
          </div>

          {otherParticipant?.image && (
            <img
              src={`http://localhost:5000/${otherParticipant.image.replace(/\\/g, '/')}`}
              alt="avatar"
              className="rounded-circle"
              width="40"
              height="40"
            />
          )}
        </div>
      );
    })
  ) : (
    <p className="text-muted">Aucune conversation</p>
  )}
</div>

          </div>

          {/* Notifications */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}><FaBell style={styles.icon} /> Notifications</h3>
            <div style={styles.notificationsList}>
              {notifications.map(notif => (
                <div 
                  key={notif.id} 
                  style={{
                    ...styles.notificationItem,
                    fontWeight: notif.read ? 'normal' : 'bold'
                  }}
                >
                  <span style={styles.notificationTime}>{notif.time}</span>
                  <p>{notif.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Deuxième ligne - Conseils et Avis */}
        <div>
          {/* Conseils dentaires (taille réduite) */}
          <div style={styles.smallCard}>
            <h3 style={styles.cardTitle}><FaTooth style={styles.icon} /> Conseils dentaires</h3><br/>
            <div style={styles.tipsContainer}>
              <ConseilsDentaire/>
            </div>
          </div>
<br></br>
          {/* Avis des patients */}
          <div style={styles.smallCard}>
            <h3 style={styles.cardTitle}>Avis de nos Utilisateurs</h3>
            <div style={styles.reviewContainer}>
              <ReviewCarousel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
