import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "./DentistList.css"
import { io } from "socket.io-client"

const socket = io("http://localhost:5000")

const DentistList = () => {
  const navigate = useNavigate()
  const [dentists, setDentists] = useState([])
  const [city, setCity] = useState("")
  const [error, setError] = useState(null)
  const [showChat, setShowChat] = useState(false)
  const [currentConversation, setCurrentConversation] = useState(null)
  const [message, setMessage] = useState("")
  const [chatMessages, setChatMessages] = useState([])
  const [currentDentist, setCurrentDentist] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [activeChats, setActiveChats] = useState([])

  // Vérifier l'authentification
  const checkAuth = () => {
    const token = localStorage.getItem("token")
    const userId = localStorage.getItem("userId")
    if (!token || !userId) {
      return false
    }
    return { token, userId }
  }

  const fetchDentists = async (filterCity = "") => {
    setIsLoading(true)
    try {
      const response = await axios.get("http://localhost:5000/api/dentists", {
        params: filterCity ? { city: filterCity } : {},
      })

      if (response.status === 200) {
        setDentists(response.data)
        setError(null)
      }
    } catch (error) {
      console.error("Error fetching dentists:", error)
      setError("Échec du chargement des dentistes. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e) => {
    e?.preventDefault()
    fetchDentists(city)
  }

  useEffect(() => {
    fetchDentists()
  }, [])

  useEffect(() => {
    if (!currentConversation) return;
  
    socket.emit("join_conversation", currentConversation._id);
  
    const handleReceiveMessage = (data) => {
      if (data.conversationId === currentConversation._id) {
        const newMessage = {
          sender: data.sender,
          message: data.message,
          timestamp: new Date(data.timestamp || Date.now()),
        };
  
        // Mettre à jour tous les chats concernés
        setActiveChats(prevChats =>
          prevChats.map(chat => 
            chat.conversation._id === data.conversationId
              ? { ...chat, messages: [...chat.messages, newMessage] }
              : chat
          )
        );
      }
    };
  
    socket.on("receive_message", handleReceiveMessage);
  
    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.emit("leave_conversation", currentConversation._id);
    };
  }, [currentConversation]);
// Ajoutez ce useEffect pour synchroniser chatMessages avec le chat actif
useEffect(() => {
  if (currentConversation) {
    const activeChat = activeChats.find(
      chat => chat.conversation._id === currentConversation._id
    );
    if (activeChat) {
      setChatMessages(activeChat.messages);
    }
  }
}, [activeChats, currentConversation]);
  
  const handleChat = async (dentist) => {
    const auth = checkAuth()
    if (!auth) {
      if (window.confirm("Vous devez être connecté pour accéder au chat. Souhaitez-vous vous connecter maintenant ?")) {
        navigate("/login", { state: { from: "dentists" } })
      }
      return
    }

    try {
      setIsLoading(true)
      const { token, userId } = auth

      const response = await axios.get(`http://localhost:5000/api/conversations/check`, {
        params: {
          participant1: userId,
          participant2: dentist._id,
        },
        headers: { Authorization: `Bearer ${token}` },
      })

      let conversation
      if (response.data.exists) {
        const convResponse = await axios.get(
          `http://localhost:5000/api/conversations/${response.data.conversationId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        )
        conversation = convResponse.data
      } else {
        const createResponse = await axios.post(
          "http://localhost:5000/api/conversations",
          { participants: [userId, dentist._id] },
          { headers: { Authorization: `Bearer ${token}` } },
        )
        conversation = createResponse.data
      }

      // Vérifier si ce chat est déjà actif
      const existingChatIndex = activeChats.findIndex((chat) => chat.conversation._id === conversation._id)

      if (existingChatIndex >= 0) {
        // Si le chat existe déjà, le mettre en focus
        const updatedChats = [...activeChats]
        updatedChats[existingChatIndex].isMinimized = false
        setActiveChats(updatedChats)
      } else {
        // Ajouter un nouveau chat
        setActiveChats((prev) => [
          ...prev,
          {
            dentist,
            conversation,
            messages:
              conversation.messages?.map((msg) => ({
                ...msg,
                timestamp: new Date(msg.timestamp),
              })) || [],
            isMinimized: false,
          },
        ])
      }

      setCurrentConversation(conversation)
      setChatMessages(
        conversation.messages?.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })) || [],
      )
      setCurrentDentist(dentist)
      setShowChat(true)
      setIsMinimized(false)
    } catch (error) {
      console.error("Error handling chat:", error)
      setError("Une erreur est survenue lors de l'ouverture du chat.")
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async (chatIndex = -1) => {
    const targetChat =
      chatIndex >= 0
        ? activeChats[chatIndex]
        : {
            conversation: currentConversation,
            messages: chatMessages,
          };
  
    if (!message.trim() || !targetChat.conversation) return;
  
    const auth = checkAuth();
    if (!auth) {
      alert("Session expirée. Veuillez vous reconnecter.");
      navigate("/login");
      return;
    }
  
    // Sauvegarder le message temporairement
    const tempMessage = message;
    setMessage("");
  
    try {
      // Envoyer au serveur sans mettre à jour l'UI immédiatement
      await axios.post(
        `http://localhost:5000/api/conversations/${targetChat.conversation._id}/messages`,
        {
          sender: auth.userId,
          message: tempMessage,
        },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
  
      // Le serveur renverra le message via socket.io qui mettra à jour l'état
    } catch (error) {
      console.error("Error sending message:", error);
      setMessage(tempMessage); // Restaurer le message si erreur
      setError("Erreur lors de l'envoi du message");
    }
  };

  const toggleMinimize = (index = -1) => {
    if (index >= 0) {
      // Gérer un chat spécifique dans activeChats
      const updatedChats = [...activeChats]
      updatedChats[index].isMinimized = !updatedChats[index].isMinimized
      setActiveChats(updatedChats)
    } else {
      // Gérer le chat principal
      setIsMinimized(!isMinimized)
    }
  }

  const closeChat = (index = -1) => {
    if (index >= 0) {
      // Fermer un chat spécifique
      setActiveChats((prev) => prev.filter((_, i) => i !== index))
    } else {
      // Fermer le chat principal
      setShowChat(false)
      setIsMinimized(false)
    }
  }

  return (
    <div className="dentist-list-container">
      <h2 className="title">Trouver un dentiste</h2>

      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          placeholder="Entrez une ville"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button" disabled={isLoading}>
          {isLoading ? "Recherche..." : "Rechercher"}
        </button>
      </form>

      {error && <div className="alert alert-error">{error}</div>}

      {isLoading && dentists.length === 0 ? (
        <div className="loading-spinner">Chargement...</div>
      ) : (
        <div className="card-container">
          {dentists.length > 0
            ? dentists.map((dentist) => (
              <div key={dentist._id} className="dentist-card">
              <div className="dentist-photo-container">
                <img
                  src={`http://localhost:5000/${dentist.image?.replace(/\\/g, "/")}`}
                  alt={`${dentist.firstname} ${dentist.lastname}`}
                  className="dentist-photo"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300"
                    e.target.onerror = null
                  }}
                />
              </div>
              <div className="dentist-info">
                <h3 className="dentist-name">
                  Dr. {dentist.firstname} {dentist.lastname}
                </h3>
                <div className="dentist-detail">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{dentist.address}, {dentist.city}</span>
                </div>
                <div className="dentist-detail">
                  <i className="fas fa-phone"></i>
                  <span>{dentist.phone}</span>
                </div>
                <button 
                  onClick={() => handleChat(dentist)} 
                  className="chat-button"
                  disabled={isLoading}
                >
                  <i className="fas fa-comment-dots"></i>
                  Discuter
                </button>
              </div>
            </div>
              ))
            : !isLoading && <p className="no-results">Aucun dentiste trouvé.</p>}
        </div>
      )}

      {/* Affichage des chats actifs */}
      <div className="chat-bubbles-container">
        {activeChats.map((chat, index) => (
          <div
            key={chat.conversation._id}
            className={`chat-wrapper ${chat.isMinimized ? "minimized" : ""}`}
            style={{ bottom: `${90 + index * 70}px` }}
          >
            {!chat.isMinimized ? (
              <div className="chat-window visible">
                <div className="chat-header">
                <div className="chat-bubble-mini">
  <img
    src={`http://localhost:5000/${chat.dentist.image?.replace(/\\/g, "/")}`}
    alt={`Dr. ${chat.dentist.firstname}`}
    onClick={() => toggleMinimize(index)}
    onError={(e) => {
      e.target.src = "https://via.placeholder.com/60"
      e.target.onerror = null
    }}
  />
</div>
                  <h5 style={{
                          padding: '15px',
                        }}>
                    Dr. {chat.dentist.firstname} {chat.dentist.lastname}
                  </h5>
                  {/* Pour le chat principal */}
                  
<div className="chat-controls">
  <button className="minimize-btn" onClick={() => toggleMinimize(index)}>
    <i className="fas fa-minus"></i>
  </button>
  <button className="close-btn" onClick={() => closeChat(index)}>
    <i className="fas fa-times"></i>
  </button>
</div>

{/* Pour les mini-chats */}

                </div>
                <div className="chat-body">
                  {chat.messages.length > 0 ? (
                    chat.messages.map((msg, msgIndex) => (
                      <div
                        key={msgIndex}
                        className={`message ${msg.sender === localStorage.getItem("userId") ? "sent" : "received"}`}
                      >
                        <div className="message-content">{msg.message}</div>
                        <div className="message-time">
                          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-messages">Aucun message échangé pour le moment</p>
                  )}
                </div>
                <div className="chat-footer">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tapez votre message..."
                    onKeyPress={(e) => e.key === "Enter" && sendMessage(index)}
                    disabled={isLoading}
                  />
                  <button onClick={() => sendMessage(index)} disabled={isLoading || !message.trim()}>
                    Envoyer
                  </button>
                </div>
              </div>
            ) : (
<div className="chat-bubble-mini">
  <img
    src={`http://localhost:5000/${chat.dentist.image?.replace(/\\/g, "/")}`}
    alt={`Dr. ${chat.dentist.firstname}`}
    onClick={() => toggleMinimize(index)}
    onError={(e) => {
      e.target.src = "https://via.placeholder.com/60";
      e.target.onerror = null;
    }}
  />
  <span
    className="close-mini"
    onClick={(e) => {
      e.stopPropagation();
      closeChat(index);
    }}
  >
    ×
  </span>
</div>
            )}
          </div>
        ))}
      </div>

      {dentists.length > 0 && (
        <div
          className={`chat-bubble ${showChat ? "active" : ""}`}
          onClick={() =>
            currentDentist ? setShowChat(!showChat) : setError("Veuillez d'abord sélectionner un dentiste")
          }
          title="Ouvrir le chat"
        >
          <i className="fas fa-comments"></i>
        </div>
      )}
    </div>
  )
}

export default DentistList
