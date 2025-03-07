"use client";

import { useState } from "react";
import "./styles.css"; // Assurez-vous que le fichier CSS est correctement importé

const Article2 = () => {
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
      title: "Qu’est-ce qu’une radiographie dentaire ?",
      content: [
        "Les radiographies dentaires permettent de visualiser les structures internes et externes de votre bouche, telles que les dents, mâchoires et masse osseuse. Elles aident à identifier les lésions et anomalies invisibles à l’œil nu.",
        "Grâce à la radiologie bucco-dentaire, le dentiste peut effectuer un diagnostic précis de l’état de santé de votre bouche et de votre dentition, et traiter au besoin, des problèmes dentaires avant qu’ils ne s’aggravent.",
      ],
    },
    {
      title: "Les radiographies sont-elles nécessaires à chaque visite ?",
      content: [
        "Si vous êtes un patient nouveau, votre praticien(ne) souhaitera possiblement effectuer des radiographies pour évaluer de façon plus précise votre état de santé bucco-dentaire. Il est toutefois possible de faire transférer les radiographies récemment effectuées dans un autre cabinet dentaire pour éviter de les refaire.",
        "La fréquence à laquelle chaque patient(e) peut avoir besoin de radiographies varie néanmoins selon son état de santé buccale. Une bouche en bonne santé qui n’a pas eu de caries ou de problèmes parodontaux, osseux ou autres depuis quelques années n’aura sans doute pas besoin de radiographies dentaires à chaque visite.",
      ],
    },
    {
      title: "Les radiographies dentaires sont-elles sécuritaires ?",
      content: [
        "Il est important de garder à l’esprit que nous sommes quotidiennement exposés à différentes sources de radiation naturelle, provenant entre autres des rayons du soleil et du rayonnement d’autres astres.",
        "Les récents équipements numériques (images générées à l’ordinateur) permettent d’utiliser des doses de radiation beaucoup plus faibles (jusqu’à 50 % de moins) que les équipements de radiographie conventionnels qui nécessitaient le développement de films.",
        "En outre, le temps d’exposition est réduit de moitié avec la radiographie numérique. Utiliser un tablier de plomb pendant l’examen réduit également l’absorption des rayons X par le reste du corps.",
      ],
    },
  ];

  return (
    <div className="article-container">
      {/* En-tête de l'article avec image et titre */}
      <div className="article-header1">
        <div className="article-header-overlay">
          <h1 className="article-title1">Importance des Radiographies Dentaires</h1>
        </div>
      </div>

      {/* Introduction */}
      <p className="text-lg text-gray-700 mb-8">
        Les radiographies dentaires sont utilisées en dentisterie depuis plus de 100 ans. Elles fournissent des informations
        inestimables sur l’intérieur et l’extérieur de votre bouche, informations qui ne peuvent être obtenues par le seul
        examen visuel.
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
          En somme, les radiographies dentaires sont essentielles pour prévenir et diagnostiquer les problèmes bucco-dentaires
          avant qu’ils ne s’aggravent. Consultez votre dentiste pour un suivi adapté.
        </p>
      </div>
    </div>
  );
};

export default Article2;