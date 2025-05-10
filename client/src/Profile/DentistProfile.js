import React, { useState, useEffect } from 'react';

const DentistProfile = () => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : {};
  });

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    address: '',
    workDays: '',
    workHours: { start: '', end: '' },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ loading: false, error: null, success: false });

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      setFormData({
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        phone: user.phone || '',
        address: user.address || '',
        workDays: Array.isArray(user.workDays) ? user.workDays.join(', ') : user.workDays || '',
        workHours: user.workHours
          ? {
              start: user.workHours.open || user.workHours.start || '',
              end: user.workHours.close || user.workHours.end || ''
            }
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
    setStatus({ loading: true, error: null, success: false });
  
    try {
      const userId = user?.id ?? user?._id;
      if (!userId) throw new Error("ID utilisateur introuvable");
  // Dans handleSubmit, avant le fetch
console.log("Données envoyées:", {
  firstname: formData.firstname,
  lastname: formData.lastname,
  phone: formData.phone,
  address: formData.address,
  workDays: formData.workDays.split(',').map(d => d.trim()),
  workHours: {
    open: formData.workHours.start,
    close: formData.workHours.end
  }
});

console.log("Token:", localStorage.getItem('token'));
console.log("User ID:", user?.id ?? user?._id);
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          firstname: formData.firstname,
          lastname: formData.lastname,
          phone: formData.phone,
          address: formData.address,
          workDays: formData.workDays.split(',').map(d => d.trim()),
          workHours: {
            start: formData.workHours.start,
            end: formData.workHours.end
          }
        })
      });
  
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Échec de la mise à jour");
      }
  
      // Mise à jour complète de l'état utilisateur
      const updatedUser = { 
        ...user, 
        ...result.user,
        workHours: result.user.workHours || formData.workHours
      };
  
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setStatus({ loading: false, error: null, success: true });
      setIsEditing(false);
  
    } catch (err) {
      console.error("Erreur:", err);
      setStatus({ loading: false, error: err.message, success: false });
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
              <h2>{user?.username ?? 'utilisateur'}</h2>
              <p className="text-muted">{user?.role ?? 'Rôle non défini'}</p>
            </div>
          </div>
          <hr />
          <h3>Informations professionnelles</h3>
          <form onSubmit={handleSubmit}>
            {['firstname', 'lastname', 'phone', 'address'].map((field) => (
              <div className="mb-3" key={field}>
                <label className="form-label"><strong>
                  {field === 'firstname' ? 'Prénom' :
                   field === 'lastname' ? 'Nom' :
                   field === 'phone' ? 'Téléphone' : 'Adresse'}
                </strong></label>
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

            <div className="mb-3">
              <label className="form-label"><strong>Jours de travail :</strong></label>
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
                  {formData.workDays && formData.workDays.split(',').map((day, index) => (
                    <li key={index}>{day.trim()}</li>
                  ))}
                </ul>
              )}
            </div>

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
                  <span className="align-self-center">à</span>
                  <input
                    type="time"
                    name="workHoursEnd"
                    value={formData.workHours.end}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              ) : (
                <p>
                  {formData.workHours.start || 'Non défini'} - {formData.workHours.end || 'Non défini'}
                </p>
              )}
            </div>

            <div className="d-flex gap-2">
              {isEditing && (
                <button 
                  type="submit" 
                  className="btn btn-success"
                  disabled={isLoading}
                >
                  {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              )}
              <button
                type="button"
                className={`btn ${isEditing ? 'btn-secondary' : 'btn-primary'}`}
                onClick={() => setIsEditing(!isEditing)}
                disabled={isLoading}
              >
                {isEditing ? 'Annuler' : 'Modifier'}
              </button>
            </div>
          </form>

          {status.error && <div className="alert alert-danger mt-3">{status.error}</div>}
          {status.success && <div className="alert alert-success mt-3">Profil mis à jour avec succès.</div>}
        </div>
      </div>
    </div>
  );
};

export default DentistProfile;
