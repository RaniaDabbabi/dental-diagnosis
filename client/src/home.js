import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import VideoList from './Home/VideoList';
import ArticleList from './Home/ArticleList';


function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentNode, setCurrentNode] = useState("start");
  const [conversation, setConversation] = useState([]);
  const navigate = useNavigate();

  // Exemple de données pour les articles et les vidéos
  const articles = [
    {
      id: 1,
      title: "10 conseils d’un dentiste pour une bonne hygiène dentaire",
      image: "/images/article1.jpeg",
      link: "/Home/Articles/Article1",
    },
    {
      id: 2,
      title: "Pourquoi les radiographies dentaires sont-elles essentielles pour votre santé ?",
      image: "/images/article2.jpeg",
      link: "/Home/Articles/Article2",
    },
    {
      id: 3,
      title: "Les bienfaits du brossage régulier",
      image: "/images/article3.jpeg",
      link: "/Home/Articles/Article3",
    },
  
  ];
  
  const videos = [
    {
      title: "Comment faut-il se brosser les DENTS",
      link: "/Videos/V2.mp4",
    },
    {
      title: "Rincez-vous votre bouche après avoir brossé vos dents Si oui, ne le faites plus!",
      link: "/Videos/V3.mp4", 
    },
    {
      title :"7 conseils pour des dents en santé",
      link:"/Videos/V1.mp4",
    },
    {
      title: "Les 3 erreurs qui peuvent ruiner votre sourire",
      link: "/Videos/V4.mp4",
    },
    {
      title: "Le détatrage",
      link: "/Videos/V5.mp4",
    },
  ];
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

    <br/>  
      {/* Article List Section */}
      <section className="bg-light py-5">
        <div className="container">
          <ArticleList articles={articles} />
        </div>
      </section>
<br/>
      {/* Video List Section */}
      <section className="bg-light py-5">
        <div className="container">
          <VideoList videos={videos} />
        </div>
      </section>
      <br/>

{/* About Section */}
<section className="py-5">
  <div className="container text-center">
    <h2>À propos de nous</h2>
    <p className="lead">
      Dental Diagnostic est une plateforme innovante qui utilise l'intelligence artificielle pour révolutionner les soins dentaires. Nous proposons des conseils de santé et des vidéos éducatives sur des thématiques comme la prévention, les traitements et l'hygiène quotidienne. Notre chatbot interactif répond à vos questions, vous guide dans l'utilisation de la plateforme et permet même l'envoi de photos pour une analyse rapide. Grâce à notre IA, nous détectons des anomalies dentaires telles que les caries, les inflammations ou les fractures, et générons un rapport détaillé avec des recommandations personnalisées. De plus, nous vous aidons à trouver les dentistes les plus proches grâce à un système de recommandation basé sur votre localisation, avec des profils détaillés incluant leurs spécialités, horaires et avis des patients. Enfin, vous pouvez partager votre diagnostic directement avec votre dentiste via un lien sécurisé, facilitant ainsi un suivi personnalisé. Dental Diagnostic s'engage à rendre les soins dentaires modernes, accessibles et efficaces pour tous.
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