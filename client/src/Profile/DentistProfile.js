import React, { useState, useEffect } from 'react';

const DentistProfile = () => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : {};
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    workDays: '',
    workHours: { start: '', end: '' },
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    console.log("Données de l'utilisateur mises à jour :", user);
    if (user && Object.keys(user).length > 0) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        address: user.address || '',
        workDays: Array.isArray(user.workDays) ? user.workDays.join(', ') : '',
        workHours: user.workHours
          ? { start: user.workHours.open || '', end: user.workHours.close || '' }
          : { start: '', end: '' },
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      ...(name === 'workHoursStart' || name === 'workHoursEnd'
        ? {
            workHours: {
              ...prev.workHours,
              [name === 'workHoursStart' ? 'start' : 'end']: value,
            },
          }
        : { [name]: value }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation de workDays
    const validDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const days = formData.workDays.split(',').map(day => day.trim());
    const invalidDays = days.filter(day => !validDays.includes(day));
    if (invalidDays.length > 0) {
      alert(`Jours invalides : ${invalidDays.join(', ')}`);
      return;
    }

      const updatedUserData = {
        firstname: formData.firstName,
        lastname: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        workDays: JSON.stringify(formData.workDays.split(',').map(day => day.trim())), // Convertir en chaîne JSON
        workHours: JSON.stringify(formData.workHours), // Convertir en chaîne JSON
      };
    
      try {
        const userId = user?.id ?? user?._id;
      if (!userId) {
        alert("Erreur : ID utilisateur introuvable !");
        return;
      }
        const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedUserData),
        });
    
        const data = await response.json();
        if (response.ok) {
          console.log("Profil mis à jour avec succès !", data);
        } else {
          console.error("Erreur lors de la mise à jour du profil :", data.message);
        }
      } catch (error) {
        console.error("Erreur de connexion au serveur :", error);
      }
    };

  return (
    <div className="container mt-5">
      <h1>Profil Dentiste</h1>
      <div className="card">
        <div className="card-body">
          <div className="d-flex align-items-center">
            {user?.image ? (
              <img
                src={`http://localhost:5000/${user.image.replace(/\\/g, '/')}`}
                alt="Profile"
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginRight: '20px',
                }}
              />
            ) : (
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  backgroundColor: '#ccc',
                  marginRight: '20px',
                }}
              />
            )}
            <div>
              <h2>{user?.username ?? 'Nom d’utilisateur'}</h2>
              <p className="text-muted">{user?.role ?? 'Rôle non défini'}</p>
            </div>
          </div>
          <hr />
          <h3>Informations professionnelles</h3>
          <form onSubmit={handleSubmit}>
            {['firstName', 'lastName', 'phone', 'address'].map((field) => (
              <div className="mb-3" key={field}>
                <label className="form-label">
                  <strong>
                    {field === 'firstName'
                      ? 'Prénom'
                      : field === 'lastName'
                      ? 'Nom'
                      : field === 'phone'
                      ? 'Téléphone'
                      : 'Adresse'}
                    :
                  </strong>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="form-control"
                  />
                ) : (
                  <p>{formData[field] || 'Non défini'}</p>
                )}
              </div>
            ))}
  
            {/* Traitement spécifique pour workDays */}
            <div className="mb-3">
              <label className="form-label">
                <strong>Jours de travail :</strong>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="workDays"
                  value={formData.workDays}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Ex: Lundi, Mardi, Mercredi"
                />
              ) : (
                <ul>
                  {formData.workDays.split(',').map((day, index) => (
                    <li key={index}>{day.trim()}</li>
                  ))}
                </ul>
              )}
            </div>
  
            {/* Heures de travail */}
            <div className="mb-3">
              <label className="form-label"><strong>Heures de travail :</strong></label>
              {isEditing ? (
                <div className="d-flex gap-2">
                  <input
                    type="time"
                    name="workHoursStart"
                    value={formData.workHours.start}
                    onChange={handleChange}
                    className="form-control"
                  />
                  <input
                    type="time"
                    name="workHoursEnd"
                    value={formData.workHours.end}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              ) : (
                <p>{formData.workHours.start || 'Non défini'} - {formData.workHours.end || 'Non défini'}</p>
              )}
            </div>
  
            {isEditing && (
              <button type="submit" className="btn btn-success me-2">
                Enregistrer les modifications
              </button>
            )}
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Annuler' : 'Modifier le profil'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DentistProfile;