import { createContext, useContext, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const socket = io("http://localhost:5000");

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [activeChats, setActiveChats] = useState([]);

  const addChat = useCallback((newChat) => {
    setActiveChats(prevChats => {
      // Vérifier si le chat existe déjà
      const exists = prevChats.some(chat => 
        chat.conversation._id === newChat.conversation._id
      );
      
      if (exists) {
        return prevChats.map(chat => 
          chat.conversation._id === newChat.conversation._id 
            ? { ...chat, isMinimized: false } 
            : chat
        );
      }
      
      return [...prevChats, { ...newChat, isMinimized: false }];
    });
  }, []);

  const removeChat = useCallback((chatId) => {
    setActiveChats(prev => prev.filter(chat => chat.conversation._id !== chatId));
  }, []);

  const toggleMinimize = useCallback((chatId) => {
    setActiveChats(prev => 
      prev.map(chat => 
        chat.conversation._id === chatId 
          ? { ...chat, isMinimized: !chat.isMinimized } 
          : chat
      )
    );
  }, []);

  return (
    <ChatContext.Provider value={{ 
      activeChats, 
      addChat, 
      removeChat,
      toggleMinimize
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);