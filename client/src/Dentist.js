import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DentistList.css'; 

const DentistList = () => {
  const [dentists, setDentists] = useState([]);
  const [city, setCity] = useState('');
  const [error, setError] = useState(null); 

  const fetchDentists = async (filterCity = '') => {
    try {
      const response = await axios.get("http://localhost:5000/api/dentists", {
        params: filterCity ? { city: filterCity } : {},
      });
      if (response.status === 200) {
        setDentists(response.data);
        setError(null);
      } else {
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching dentists:", error);
      setError("Failed to fetch dentists. Please try again later.");
    }
  };
  
  useEffect(() => {
    fetchDentists();
  }, []);

  const handleSearch = () => {
    fetchDentists(city);
  };

  return (
    <div className="dentist-list-container">
      <h2 className="title">Trouver un dentiste</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">Search</button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {dentists.length > 0 ? (
        <div className="card-container">
          {dentists.map((dentist) => (
            <div key={dentist._id} className="dentist-card">
              <h3 className="dentist-name">{dentist.name}</h3>
              <p className="dentist-info">Specialité: {dentist.specialization}</p>
              <p className="dentist-info">Adresse: {dentist.address}</p>
              <p className="dentist-info">Tel: {dentist.phone}</p>
              <p className="dentist-info">Note: {dentist.rating} ⭐</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-results">No dentists found.</p>
      )}
    </div>
  );
};

export default DentistList;
