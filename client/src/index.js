import React from 'react';
import ReactDOM from 'react-dom/client'; // Import correct pour React 18
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // Crée un root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
