import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentNode, setCurrentNode] = useState("start");
  const [conversation, setConversation] = useState([]);
  const navigate = useNavigate(); 

  // Data structure to manage chatbot questions and options
  const chatData = {
    start: {
      question: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
      options: [
        { text: "Qu'est-ce qu'une carie ?", next: "carie" },
        { text: "Comment prévenir les caries ?", next: "prevention" },
        { text: "Quand consulter un dentiste ?", next: "consultation" },
      ],
    },
    carie: {
      question: "Une carie est une lésion de la dent causée par des bactéries. Voulez-vous en savoir plus ?",
      options: [
        { text: "Quels sont les symptômes ?", next: "symptomes" },
        { text: "Comment la traiter ?", next: "traitement" },
        { text: "Retour à l'accueil", next: "start" },
      ],
    },
    prevention: {
      question: "Pour prévenir les caries : brossez vos dents deux fois par jour, limitez les sucres, consultez régulièrement un dentiste.",
      options: [
        { text: "En savoir plus sur le brossage", next: "brossage" },
        { text: "Retour à l'accueil", next: "start" },
      ],
    },
    consultation: {
      question: "Consultez un dentiste si vous avez des douleurs, des saignements ou des caries visibles.",
      options: [
        { text: "Comment choisir un bon dentiste ?", next: "choisirDentiste" },
        { text: "Trouver un dentiste proche", next: "trouverDentiste" },
        { text: "Obtenir un diagnostic", next: "diagnostic" },
        { text: "Retour à l'accueil", next: "start" },
      ],
    },
    choisirDentiste: {
      question: "Pour choisir un bon dentiste : \n1. Vérifiez ses qualifications et certifications.\n2. Consultez les avis des patients.\n3. Assurez-vous qu'il utilise un matériel moderne.",
      options: [
        { text: "Retour à l'accueil", next: "start" },
      ],
    },
    trouverDentiste: {
      question: "Pour trouver un dentiste proche, utilisez notre outil de recherche en ligne ou des applications de localisation comme Google Maps.",
      options: [
        { text: "Retour à l'accueil", next: "start" },
      ],
    },
    diagnostic: {
      question: "Souhaitez-vous un diagnostic rapide ou détaillé ?",
      options: [
        { text: "Diagnostic rapide (photo réelle)", next: "diagnosticRapide" },
        { text: "Diagnostic détaillé (radiographie)", next: "diagnosticDetaille" },
        { text: "Retour à l'accueil", next: "start" },
      ],
    },
    diagnosticRapide: {
      question: "Envoyez une photo réelle de vos dents. Un diagnostic rapide sera généré en quelques secondes.",
      options: [
        { text: "Retour à l'accueil", next: "start" },
      ],
    },
    diagnosticDetaille: {
      question: "Téléchargez une radiographie de vos dents. Un diagnostic détaillé vous sera fourni.",
      options: [
        { text: "Retour à l'accueil", next: "start" },
      ],
    },
    symptomes: {
      question: "Les symptômes d'une carie incluent : douleur, sensibilité, taches noires ou blanches sur la dent.",
      options: [
        { text: "Comment la traiter ?", next: "traitement" },
        { text: "Retour à l'accueil", next: "start" },
      ],
    },
    traitement: {
      question: "Le traitement peut inclure : un plombage, une couronne ou une extraction selon la gravité.",
      options: [
        { text: "Puis-je éviter les plombages ?", next: "eviterPlombages" },
        { text: "Retour à l'accueil", next: "start" },
      ],
    },
    eviterPlombages: {
      question: "Vous pouvez éviter les plombages en détectant les caries tôt et en améliorant votre hygiène bucco-dentaire.",
      options: [
        { text: "Retour à l'accueil", next: "start" },
      ],
    },
  };

  // Function to toggle the chatbot window
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // Function to handle option selection
  const handleOptionClick = (next) => {
    const currentData = chatData[currentNode];
    setConversation([
      ...conversation,
      { question: currentData.question, answer: currentData.options.find((opt) => opt.next === next).text },
    ]);

    setCurrentNode(next); 
  };

  const handleStartClick = () => {
    navigate('/diagnostic');
    window.location.reload();
  };

  return (
    <div>
      {/* Banner Section */}
      <header className="bg-primary text-white text-center py-5">
        <div className="container">
          <h1>Bienvenue sur Dental Diagnostic</h1>
          <p className="lead">Une solution intelligente pour vos besoins dentaires</p>
          <button onClick={handleStartClick} className="btn btn-light btn-lg mt-3">
            Commencez dès maintenant
          </button>
        </div>
      </header>

      {/* About Section */}
      <section className="py-5">
        <div className="container text-center">
          <h2>À propos de nous</h2>
          <p className="lead">
            Dental Diagnostic est une plateforme moderne utilisant l'intelligence artificielle pour aider à diagnostiquer
            les problèmes dentaires rapidement et efficacement.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-light py-5">
        <div className="container">
          <h2 className="text-center">Nos fonctionnalités</h2>
          <div className="row text-center mt-4">
            <div className="col-md-4">
              <i className="bi bi-gear-fill fs-1 text-primary"></i>
              <h4 className="mt-3">Diagnostic AI</h4>
              <p>Identifiez les problèmes dentaires en téléchargeant simplement une image.</p>
            </div>
            <div className="col-md-4">
              <i className="bi bi-chat-dots-fill fs-1 text-primary"></i>
              <h4 className="mt-3">Chatbot intelligent</h4>
              <p>Posez vos questions dentaires et obtenez des réponses instantanées.</p>
            </div>
            <div className="col-md-4">
              <i className="bi bi-map-fill fs-1 text-primary"></i>
              <h4 className="mt-3">Trouver un dentiste</h4>
              <p>Localisez rapidement les dentistes les plus proches.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Chatbot Bubble */}
      <div className="chat-bubble" onClick={toggleChat}>
        <i className="bi bi-chat-dots-fill"></i>
      </div>

      {/* Chat Window */}
      {isChatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h5>Chatbot Médical</h5>
            <button className="close-btn" onClick={toggleChat}>
              X
            </button>
          </div>
          <div className="chat-body">
            {/* Display conversation history */}
            <div className="conversation">
              {conversation.map((entry, index) => (
                <div key={index}>
                  <p><strong>Question :</strong> {entry.question}</p>
                  <p><strong>Réponse :</strong> {entry.answer}</p>
                </div>
              ))}
            </div>

            {/* Display current question */}
            <p>{chatData[currentNode].question}</p>
            {chatData[currentNode].options.map((option, index) => (
              <button
                key={index}
                className="chat-option"
                onClick={() => handleOptionClick(option.next)}
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
