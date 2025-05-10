import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignUp from './auth/signup';
import SignIn from './auth/signin';
import NotFound from './NotFound';
import HomePage from './home';
import ChatDiagnostic from './Diagnostic'; 
import { Navbar, Footer } from './layout';
import DentistList from './Dentist';
import DentalCareArticle from './Home/Articles/Article1';
import Article2 from './Home/Articles/Article2';
import Article3 from './Home/Articles/Article3';
import Apropos from'./Apropos';
import DentistProfile from './Profile/DentistProfile';
import UserProfile from './Profile/UserProfile';
import FloatingChatbot from './FloatingChatbot';
import ContactUsPage from './ContactUsPage';
import Dashboard from './HomeLogin';

const isAuthenticated = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user !== null;
};

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100" style={layoutStyles.appContainer}>
        <Navbar />
        <main className={`flex-grow-1 ${window.location.pathname === "/Home" ? "" : "container"}`}>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/Home/Articles/Article1" element={<DentalCareArticle />} />
            <Route path="/Home/Articles/Article2" element={<Article2 />} />
            <Route path="/Home/Articles/Article3" element={<Article3 />} />
            <Route path="/Apropos" element={<Apropos />} />
            <Route path="/profile/dentist" element={<DentistProfile />} />
            <Route path="/profile/user" element={<UserProfile />} />
            <Route path="/diagnostic/:chatdiagnosticId"
  element={isAuthenticated() ? <ChatDiagnostic /> : <Navigate to="/signin" replace />}
/>
<Route path="/Home"
  element={isAuthenticated() ? <Dashboard /> : <Navigate to="/signin" replace />}
  className={`flex-grow-1  ${window.location.pathname === "/Home" ? "" : "container"}`}/>
            <Route path="/dentists" element={<DentistList />} />
            <Route path="/ContactUs" element={<ContactUsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <FloatingChatbot />
      </div>
    </Router>
    
  );
}

export default App;

const layoutStyles = {
  appContainer: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  }
};
