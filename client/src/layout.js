import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';

export function Navbar() {
  const user = JSON.parse(localStorage.getItem("user")); 

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark" >
      <div className="container">
        <Link className="navbar-brand" to="/">DentDiag</Link>
        <button className="navbar-toggler"  type="button"  data-bs-toggle="collapse"
          data-bs-target="#navbarNav" aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Accueil</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/dentists">Les Dentistes</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">À propos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact</Link>
            </li>
            {user && user.role === "admin" && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin/dentists">Administration</Link>
              </li>
            )}
          </ul>
          <div className="d-flex align-items-center">
            {user ? (
              <>
                <span className="navbar-text text-light me-3">
                  Bonjour, {user.firstName}
                </span>
                <button
                  className="btn btn-outline-danger"
                  onClick={handleLogout}
                >
                  Déconnecter
                </button>
              </>
            ) : (
              <Link to="/signin" className="btn btn-outline-light">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}


export function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-3">
      <div className="container">
        <p className="mb-0">© {new Date().getFullYear()} DentDiag. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
