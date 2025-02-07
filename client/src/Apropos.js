import React from 'react';

const Apropos = () => {
  return (
    <div>
{/* About Section */}
<section className="py-5">
  <div className="container text-center">
    <h2>À propos de nous</h2>
    <p className="lead">
      Dental Diagnostic est une plateforme innovante qui utilise l'intelligence artificielle pour révolutionner les soins dentaires. Notre objectif est de rendre la santé bucco-dentaire accessible, éducative et efficace pour tous. Découvrez nos fonctionnalités conçues pour vous accompagner à chaque étape de votre parcours dentaire.
    </p>

    <div className="mt-4">
      <h3>Nos fonctionnalités</h3>
      <div className="row text-left mt-4">
        {/* Conseils de santé et vidéos */}
        <div className="col-md-6 mb-4">
          <h4>Conseils de santé et vidéos</h4>
          <p>
            Accédez à une bibliothèque riche en articles et vidéos éducatives sur les soins dentaires. Notre contenu est classé par thématiques telles que la prévention, les traitements et l'hygiène quotidienne pour vous aider à prendre soin de votre sourire en toute connaissance.
          </p>
        </div>

        {/* Espace de discussion / Chatbot */}
        <div className="col-md-6 mb-4">
          <h4>Espace de discussion / Chatbot</h4>
          <p>
            Notre chatbot interactif est là pour répondre à vos questions sur la santé dentaire, vous guider dans l'utilisation de la plateforme et vous accompagner dans le processus de diagnostic. Vous pouvez même partager des photos de vos dents pour une analyse rapide et personnalisée.
          </p>
        </div>

        {/* Diagnostic par IA */}
        <div className="col-md-6 mb-4">
          <h4>Diagnostic par IA</h4>
          <p>
            Grâce à notre technologie d'intelligence artificielle, nous analysons les images que vous envoyez pour détecter des anomalies telles que les caries, les inflammations ou les fractures. Un rapport détaillé est généré, vous offrant des explications claires et des recommandations adaptées.
          </p>
        </div>

        {/* Liste des dentistes */}
        <div className="col-md-6 mb-4">
          <h4>Liste des dentistes</h4>
          <p>
            Trouvez facilement les dentistes les plus proches de chez vous grâce à notre système de recommandation basé sur votre localisation. Consultez leurs profils détaillés, y compris leurs spécialités, leurs horaires et les avis des patients.
          </p>
        </div>

        {/* Partage de diagnostic */}
        <div className="col-md-12 mb-4">
          <h4>Partage de diagnostic</h4>
          <p>
            Vous pouvez partager votre diagnostic directement avec votre dentiste via votre espace personnel. Une notification est envoyée au professionnel avec un lien sécurisé, lui permettant d'accéder à votre rapport et de vous proposer un suivi personnalisé.
          </p>
        </div>
      </div>
    </div>

    <p className="mt-4">
      Dental Diagnostic s'engage à rendre les soins dentaires modernes et accessibles à tous. Rejoignez-nous pour prendre le contrôle de votre santé bucco-dentaire dès aujourd'hui !
    </p>
  </div>
</section>
  </div>

  );
}

export default Apropos;
