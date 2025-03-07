"use client";

import { useState } from "react";
import "./styles.css"; // Assurez-vous que le fichier CSS est correctement importé

const Article3 = () => {
  const [openSections, setOpenSections] = useState([0]); // Par défaut, la première section est ouverte

  const toggleSection = (index) => {
    setOpenSections((current) =>
      current.includes(index)
        ? current.filter((i) => i !== index)
        : [...current, index]
    );
  };

  const sections = [
    {
      title: "Pourquoi le brossage quotidien est-il si crucial ?",
      content: [
        "Le brossage des dents joue un rôle déterminant dans la prévention des problèmes dentaires. En effet, une bonne hygiène bucco-dentaire permet de limiter la formation de plaque dentaire, principal facteur de développement des caries et des maladies parodontales.",
        "La plaque dentaire, un film complexe de bactéries qui se forme sur les dents, se nourrit des sucres présents dans notre alimentation. L’acidité résultante attaque l’émail des dents, favorisant ainsi l’apparition de caries.",
        "De plus, sans un brossage adéquat, la plaque peut se minéraliser et se transformer en tartre, une substance dure qui s’attache aux dents et qui ne peut être retirée que par un professionnel.",
      ],
    },
    {
      title: "Comment bien se brosser les dents ?",
      content: [
        "Pour un brossage efficace, il est recommandé d’utiliser une brosse à dents à poils souples, de manière à ne pas agresser les gencives, et un dentifrice contenant du fluor pour renforcer l’émail des dents.",
        "La technique de brossage joue également un rôle crucial. Il est conseillé de brosser les dents en effectuant des mouvements circulaires doux, en veillant à couvrir toutes les surfaces des dents, y compris les zones difficiles d’accès comme le bord des gencives et l’arrière des molaires.",
        "La durée recommandée d’un brossage est d’au moins deux minutes, deux fois par jour, idéalement le matin après le petit-déjeuner et le soir avant de se coucher.",
      ],
    },
    {
      title: "Quand et combien de fois par jour ?",
      content: [
        "La fréquence et le moment du brossage sont aussi des aspects à ne pas négliger. Se brosser les dents après chaque repas serait idéal, mais pour beaucoup, cela peut s’avérer difficile à réaliser au quotidien.",
        "S’assurer d’un brossage minutieux matin et soir constitue déjà une bonne base. Cependant, il est particulièrement important de ne pas négliger le brossage du soir. Durant la nuit, le flux salivaire diminue, réduisant ainsi la capacité naturelle de la bouche à se nettoyer, ce qui favorise la prolifération des bactéries.",
      ],
    },
    {
      title: "L’importance d’une routine régulière",
      content: [
        "Adopter une routine de brossage rigoureuse est essentiel pour prévenir les maladies dentaires et maintenir une bouche saine. Cela inclut non seulement le brossage, mais aussi l’utilisation du fil dentaire pour éliminer les résidus alimentaires et la plaque dentaire entre les dents, zones souvent négligées par le brossage seul.",
        "De plus, des visites régulières chez le dentiste permettent de détecter et de traiter les éventuels problèmes avant qu’ils ne s’aggravent.",
      ],
    },
  ];

  return (
    <div className="article-container">
      {/* En-tête de l'article avec image et titre */}
      <div className="article-header2">
        <div className="article-header-overlay">
          <h1 className="article-title1">L’importance du brossage quotidien pour la santé dentaire</h1>
        </div>
      </div>

      {/* Introduction */}
      <p className="text-lg text-gray-700 mb-8">
        Le brossage quotidien des dents est une habitude essentielle pour maintenir une bonne santé bucco-dentaire. Il permet de prévenir les caries, les maladies des gencives et d’autres problèmes dentaires. Voici tout ce que vous devez savoir pour adopter les bonnes pratiques de brossage.
      </p>

      {/* Sections interactives */}
      <div className="article-sections">
        {sections.map((section, index) => (
          <div key={index} className="article-section">
            <button
              className="section-header"
              onClick={() => toggleSection(index)}
              aria-expanded={openSections.includes(index)}
            >
              <h2>{section.title}</h2>
              <span className={`arrow ${openSections.includes(index) ? "open" : ""}`}>▼</span>
            </button>
            <div className={`section-content ${openSections.includes(index) ? "active" : ""}`}>
              {section.content.map((paragraph, idx) => (
                <p key={idx} className="text-gray-700 mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Conclusion */}
      <div className="article-conclusion">
        <h2>Conclusion</h2>
        <p>
          Le brossage quotidien des dents n’est pas seulement une habitude d’hygiène personnelle ; c’est un investissement dans votre santé générale. Une bouche saine contribue à votre bien-être général et peut même prévenir certaines maladies. En adoptant les bonnes pratiques de brossage et en faisant de l’hygiène bucco-dentaire une priorité, vous mettez toutes les chances de votre côté pour conserver un sourire éclatant et une bonne santé dentaire tout au long de votre vie.
        </p>
      </div>
    </div>
  );
};

export default Article3;