import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignUp from './auth/signup';
import SignIn from './auth/signin';
import NotFound from './NotFound';
import HomePage from './home';
import Chatbot from './Diagnostic'; 
import { Navbar, Footer } from './layout';
import DentistList from './Dentist';
import AdminDentistManagement from './admin/AdminDentistManagement';

const isAuthenticated = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user !== null;
};

const isAdmin = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user && user.role === "admin";
};

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1 container my-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route
              path="/diagnostic"
              element={
                isAuthenticated() ? (
                  <Chatbot />
                ) : (
                  <Navigate to="/signin" replace />
                )
              }
            />
            <Route path="/dentists" element={<DentistList />} />
            <Route
              path="/admin/dentists"
              element={
                isAdmin() ? (
                  <AdminDentistManagement />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;