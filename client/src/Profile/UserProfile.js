import React from 'react';

const UserProfile = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="container mt-5">
      <h1>Profil Utilisateur</h1>
      <div className="card">
        <div className="card-body">
          <div className="d-flex align-items-center">
            {user.image ? (
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
              <h2>{user.firstname} {user.lastname}</h2>
              <p className="text-muted">{user.role}</p>
            </div>
          </div>
          <hr />
          <h3>Informations personnelles</h3>
          <p><strong>Nom :</strong> {user.username}</p>

          <p><strong>Email :</strong> {user.email}</p>
          <p><strong>Ville :</strong> {user.city}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;