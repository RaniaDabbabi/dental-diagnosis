import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import VideoList from './Home/VideoList';
import ArticleList from './Home/ArticleList';
function HomePage() {
  const navigate = useNavigate();

  // Vérification de l'utilisateur
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user')) || null;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
  }

  // Exemple de données pour les articles et les vidéos
  const articles = [
    {
      id: 1,
      title: "10 conseils d’un dentiste pour une bonne hygiène dentaire",
      image: "/images/images.jpeg",
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

  const handleStartClick = async () => {
    const token = localStorage.getItem('token');
    let chatdiagnosticId = localStorage.getItem('chatdiagnosticId');

    if (!token) {
      alert("Vous devez être connecté pour accéder au chatdiagnostic.");
      navigate('/signin');
      return;
    }

    // Ensure the user object and its _id property are defined
    if (!user || !user._id) {
      alert("Erreur : ID utilisateur invalide. Veuillez vous reconnecter.");
      navigate('/signin');
      return;
    }

    // If chatdiagnosticId exists, redirect to the chat
    if (chatdiagnosticId) {
      navigate(`/diagnostic/${chatdiagnosticId}`);
      return;
    }

    // Create or retrieve a ChatDiagnostic
    try {
      console.log('Envoi de la requête avec le corps :', { user: user._id });

      const response = await fetch('http://localhost:5000/api/chatdiagnostic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user: user._id }), // Ensure user._id is sent
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur du serveur :', errorData);
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
      }

      const data = await response.json(); // Parse the response JSON
      console.log('Réponse du serveur :', data);

      // Save the chatdiagnosticId in localStorage and redirect
      chatdiagnosticId = data.chatDiagnostic._id;
      localStorage.setItem('chatdiagnosticId', chatdiagnosticId);
      navigate(`/diagnostic/${chatdiagnosticId}`);
    } catch (error) {
      console.error("Erreur lors de la création du chatdiagnostic :", error);
      alert(`Impossible de créer le chatdiagnostic : ${error.message}`);
    }
  };

  return (
    <div>
      {/* Banner Section */}
      <header className="bg-primary text-white text-center py-5" style={{ background: "linear-gradient(135deg, #0b2b66, #1a53ff)" }}>
        <div className="container" >
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
    </div>
  );
}

export default HomePage;