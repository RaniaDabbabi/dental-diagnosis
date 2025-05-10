import React, { useState, useEffect } from 'react';
import { FaTimes, FaUserCircle, FaMinus } from 'react-icons/fa';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io("http://localhost:5000");

const ChatBubble = ({
  conversation,
  currentUser,
  otherParticipant,
  onClose,
  isMinimized,
  onToggleMinimize,
  position = 'fixed',
  style
}) => {
  const [messages, setMessages] = useState(conversation?.messages || []);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!conversation) return;

    socket.emit("join_conversation", conversation._id);

    const handleReceiveMessage = (data) => {
      if (data.conversationId === conversation._id) {
        setMessages(prev => [...prev, {
          sender: data.sender,
          message: data.message,
          timestamp: new Date(data.timestamp || Date.now()),
        }]);
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.emit("leave_conversation", conversation._id);
    };
  }, [conversation]);

  const handleSend = async () => {
    if (!newMessage.trim() || !conversation) return;

    setIsLoading(true);
    const tempMessage = newMessage;
    setNewMessage('');

    try {
      await axios.post(
        `http://localhost:5000/api/conversations/${conversation._id}/messages`,
        {
          sender: currentUser._id,
          message: tempMessage,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
    } catch (error) {
      console.error("Error sending message:", error);
      setNewMessage(tempMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!conversation || !otherParticipant) return null;

  if (isMinimized) {
    return (
      <div 
        className="chat-bubble-mini"
        onClick={onToggleMinimize}
        style={{
          position,
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          cursor: 'pointer',
          ...style
        }}
      >
        {otherParticipant?.image ? (
          <img
            src={`http://localhost:5000/${otherParticipant.image.replace(/\\/g, '/')}`}
            alt={`${otherParticipant.firstname} ${otherParticipant.lastname}`}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/60';
              e.target.onerror = null;
            }}
          />
        ) : (
          <FaUserCircle size={50} color="#6c757d" />
        )}
        <span
          className="close-mini"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          ×
        </span>
      </div>
    );
  }

  return (
    <div 
      className="chat-window"
      style={{
        position,
        bottom: '20px',
        right: '20px',
        width: '380px',
        height: '500px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 5px 20px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        ...style
      }}
    >
      <div className="chat-header" style={{
        background: 'linear-gradient(135deg, #3498db, #2c3e50)',
        color: 'white',
        padding: '12px 15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {otherParticipant?.image ? (
            <img
              src={`http://localhost:5000/${otherParticipant.image.replace(/\\/g, '/')}`}
              alt={`${otherParticipant.firstname} ${otherParticipant.lastname}`}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/40';
                e.target.onerror = null;
              }}
            />
          ) : (
            <FaUserCircle size={40} color="white" />
          )}
          <h5 style={{ margin: 0, fontSize: '1rem' }}>
            {otherParticipant?.role === 'Dentist' ? 'Dr. ' : ''}
            {otherParticipant?.firstname} {otherParticipant?.lastname}
          </h5>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={onToggleMinimize}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%'
            }}
          >
            <FaMinus size={14} />
          </button>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%'
            }}
          >
            <FaTimes size={16} />
          </button>
        </div>
      </div>

      <div className="chat-body" style={{
        flex: 1,
        padding: '15px',
        overflowY: 'auto',
        backgroundColor: '#f5f7fa'
      }}>
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              style={{
                maxWidth: '75%',
                marginBottom: '12px',
                marginLeft: msg.sender === currentUser._id ? 'auto' : '0',
                marginRight: msg.sender === currentUser._id ? '0' : 'auto'
              }}
            >
              {msg.sender !== currentUser._id && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  marginBottom: '5px'
                }}>
                  <strong style={{ marginRight: '5px' }}>
                    {otherParticipant?.role === 'Dentist' ? 'Dr. ' : ''}
                    {otherParticipant?.firstname}
                  </strong>
                </div>
              )}
              <div style={{
                padding: '10px 14px',
                borderRadius: msg.sender === currentUser._id 
                  ? '18px 18px 4px 18px' 
                  : '18px 18px 18px 4px',
                backgroundColor: msg.sender === currentUser._id 
                  ? '#3498db' 
                  : '#ecf0f1',
                color: msg.sender === currentUser._id ? 'white' : '#2c3e50',
                wordWrap: 'break-word'
              }}>
                {msg.message}
              </div>
              <div style={{
                fontSize: '0.7rem',
                color: '#7f8c8d',
                marginTop: '4px',
                textAlign: msg.sender === currentUser._id ? 'right' : 'left',
                padding: '0 14px'
              }}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))
        ) : (
          <p style={{ 
            textAlign: 'center', 
            color: '#7f8c8d',
            margin: 'auto'
          }}>
            Aucun message échangé pour le moment
          </p>
        )}
      </div>

      <div className="chat-footer" style={{
        padding: '12px',
        backgroundColor: 'white',
        borderTop: '1px solid #dfe6e9',
        display: 'flex',
        gap: '8px'
      }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Tapez votre message..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '10px 15px',
            border: '1px solid #dfe6e9',
            borderRadius: '20px',
            fontSize: '0.9rem',
            outline: 'none'
          }}
        />
        <button 
          onClick={handleSend} 
          disabled={isLoading || !newMessage.trim()}
          style={{
            padding: '10px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: '500',
            cursor: 'pointer',
            opacity: isLoading || !newMessage.trim() ? 0.5 : 1
          }}
        >
          {isLoading ? '...' : 'Envoyer'}
        </button>
      </div>
    </div>
  );
};

export default ChatBubble;