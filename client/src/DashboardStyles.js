// DashboardStyles.js
export const styles = {
  container: {
    display: 'flex',
    width: '100vw',
    height: '89.5vh',
    backgroundColor: '#f5f7fa',
    overflow: 'hidden',
    fontFamily: 'Arial, sans-serif'
  },
  
  sidebar: {
    width: 280,
    backgroundColor: '#1e3a8a',
    color: 'white',
    padding: '20px 0',
    display: 'flex',
    flexDirection: 'column'
  },
  
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '0 20px 20px',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    borderBottom: '1px solid rgba(255,255,255,0.1)'
  },
  
  sidebarItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '15px 25px',
    margin: '5px 10px',
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: 'rgba(255,255,255,0.1)'
    }
  },
  
  sidebarIcon: {
    fontSize: 16
  },
  
  sidebarLabel: {
    fontSize: 15
  },
  
  mainContent: {
    flex: 1,
    padding: 25,
    overflowY: 'auto'
  },
  
  topRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 20,
    marginBottom: 20
  },
  
  bottomRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 20
  },
  
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    padding: 20,
    height: '100%'
  },
  
  smallCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    padding: 20,
    height: 250
  },
  
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#1e3a8a'
  },
  
  icon: {
    color: '#3b82f6'
  },
  
  historyList: {
    maxHeight: 300,
    overflowY: 'auto'
  },
  
  historyItem: {
    padding: '12px 0',
    borderBottom: '1px solid #eee',
    ':last-child': {
      borderBottom: 'none'
    }
  },
  
  historyDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 3
  },
  
  historyResult: {
    fontWeight: '500',
    color: '#333'
  },
  
  historyDetails: {
    fontSize: 13,
    color: '#666',
    marginTop: 3
  },
  
  messagesList: {
    maxHeight: 300,
    overflowY: 'auto'
  },
  
  messagePreview: {
    padding: '12px 0',
    borderBottom: '1px solid #eee',
    cursor: 'pointer',
    ':last-child': {
      borderBottom: 'none'
    },
    ':hover': {
      backgroundColor: '#f9f9f9'
    }
  },
  
  messageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  
  senderName: {
    fontSize: 14
  },
  
  messageTime: {
    fontSize: 12,
    color: '#999'
  },
  
  messageContent: {
    fontSize: 13,
    color: '#555',
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  
  notificationsList: {
    maxHeight: 300,
    overflowY: 'auto'
  },
  
  notificationItem: {
    padding: '12px 0',
    borderBottom: '1px solid #eee',
    fontSize: 13,
    ':last-child': {
      borderBottom: 'none'
    }
  },
  
  notificationTime: {
    display: 'block',
    fontSize: 11,
    color: '#999',
    marginBottom: 3
  },
  
  tipsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
    marginTop: 5,
    height: 'calc(100% - 40px)',
    overflowY: 'auto',
  },
  
  tip: {
    padding: 15,
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    borderLeft: '3px solid #3b82f6',
    animation: 'fadeIn 0.5s ease-out forwards',
    opacity: 0,
    '@keyframes fadeIn': {
      to: { opacity: 1 }
    }
  },
  
  reviewContainer: {
    height: 'calc(100% - 40px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};