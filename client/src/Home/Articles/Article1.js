"use client"

import { useState } from "react"
import "./styles.css"

const DentalCareArticle = () => {
  const [openSections, setOpenSections] = useState([0])

  const toggleSection = (index) => {
    setOpenSections((current) => (current.includes(index) ? current.filter((i) => i !== index) : [...current, index]))
  }

  const sections = [
    {
      title: "1. Utilisez la Soie Dentaire et le Bain de Bouche au Quotidien",
      content: [
        "L'utilisation quotidienne de la soie dentaire en complément du brossage est cruciale pour maintenir une bonne santé buccodentaire. Elle permet de retirer la plaque dentaire accumulée sur les surfaces latérales des dents, zones difficiles à atteindre avec une brosse à dents classique.",
        "Pour les personnes ayant des prothèses ou des dents déchaussées, les brossettes interdentaires sont une excellente alternative.",
        "Un bain de bouche dans votre routine quotidienne peut également être bénéfique, notamment pour ceux qui ont une tendance aux caries ou aux problèmes de gencives.",
      ],
    },
    { title: "2. Faites Attention à Votre Alimentation",
       content: [ "L’alimentation joue un rôle clé dans la santé bucco-dentaire. Il est conseillé d'éviter les aliments trop sucrés ou acides, comme les sodas ou les boissons alcoolisées, pour protéger l'émail de vos dents.", "Certains aliments, tels que les produits laitiers ou les poissons gras, sont bénéfiques pour les dents et devraient être intégrés à votre alimentation.", ], }, 
       { title: "3. Sensibilisez Vos Enfants Dès Leur Jeune Âge", 
        content: [ "Il est important d’initier les enfants à une bonne hygiène dentaire dès leur plus jeune âge. Comme pour les adultes, un brossage régulier et l'utilisation de la soie dentaire sont essentiels, tout comme éviter les boissons sucrées ou acides, particulièrement les biberons après le brossage, qui favorisent les caries chez les plus jeunes.", "Une première visite chez le dentiste est recommandée dès les 6 mois après la première dent, ou à leur premier anniversaire, pour assurer la santé de la bouche et prévenir d'éventuels problèmes.", "Pour toute question, n'hésitez pas à consulter l'un de nos dentistes spécialisés pour enfants. Nous serons ravis de vous accompagner dans les soins dentaires de votre enfant.", ], }, 
       { title: "4. Surveillez les Dents de Votre Adolescent",
         content: [ "L’adolescence est une période de grands changements buccodentaires. Il est essentiel de respecter le calendrier des visites chez le dentiste pour éviter les caries et évaluer l’évolution des dents de sagesse.", "Après un examen, nos dentistes détermineront si l'extraction des dents de sagesse est nécessaire ou si elles peuvent être conservées sous surveillance.", ], },
        { title: "5. Prenez Soin de Votre Santé Dentaire avec Le Centre Dentaire Mont-Royal", content: [ "Les dentistes du Centre Dentaire Mont-Royal sont à votre disposition pour prendre soin de vos dents, de vos gencives et de votre bouche.", "Si vous constatez des saignements récurrents ou une douleur persistante, il est important de consulter rapidement un dentiste. Ces symptômes peuvent cacher des problèmes buccodentaires qui sont généralement traitables si détectés tôt.", "Ressentez-vous ces symptômes ? Contactez-nous ou prenez rendez-vous aujourd’hui. Notre équipe se fera un plaisir de vous aider.", ], },
         { title: "6. Opter pour une brosse à dents électrique",
           content: [ "La brosse à dents électrique présente de nombreux avantages. Leur petite tête se glisse dans des endroits difficilement atteignables par les brosses manuelles. Elles sont aussi plus faciles à utiliser pour les personnes dont la dextérité est moindre ou celles qui appuient un peu trop vigoureusement. Elles permettent ainsi d’assurer un brossage doux pour vos dents et vos gencives, en diminuant les risques de saignement.", "La technique de brossage est un peu différente avec ces modèles. Un temps d’adaptation sera ainsi nécessaire pour apprendre à se brosser les dents efficacement avec une brosse électrique.", "Rappelons que tous les types de brosses à dents permettent de prendre soin de sa santé bucco-dentaire lorsqu’elles sont utilisées adéquatement. Quelle que soit votre préférence, le plus important est avant tout d’en choisir une de qualité et de l’utiliser régulièrement !", ], }, 
         { title: "7. Utiliser la soie dentaire et le bain de bouche au quotidien", 
          content: [ "Passer la soie dentaire en complément du brossage est un geste essentiel pour une bonne santé buccodentaire. Celle-ci permet notamment d’éliminer la plaque dentaire qui s’est formée sur les surfaces latérales des dents, plus difficilement accessible avec une brosse à dents.", "Les personnes ayant des prothèses ou des dents déchaussées peuvent aussi opter pour des brossettes interdentaires en complément.", "L’utilisation d’un bain de bouche au sein d’une routine d’hygiène dentaire peut enfin s’avérer profitable, surtout pour les patients qui ont une tendance à développer des caries ou des problèmes de gencives.", ], }, 
         { title: "8. Faire attention à son alimentation", 
          content: [ "Nos conseils ne concernent pas seulement le brossage des dents. L’alimentation occupe également une place centrale dans le maintien d’une bonne santé bucco-dentaire.", "À ce titre, il est recommandé d’éviter de consommer en trop grande quantité des aliments trop sucrés ou trop acides comme les sodas ou les boissons alcoolisées afin de préserver l’émail de vos dents.", "Certains aliments ont aussi un effet protecteur sur les dents, comme les produits laitiers, les poissons gras, etc. N’hésitez pas à les intégrer à votre alimentation.", ], }, 
         { title: "9. Sensibiliser vos enfants dès le plus jeune âge", 
          content: [ "Dès le plus jeune âge, il est essentiel d’être attentif à l’hygiène dentaire de vos enfants.", "Nos conseils d’hygiène dentaire : comme pour les adultes, un brossage régulier et l’utilisation de la soie dentaire ! Et faire attention aux boissons sucrées ou acides, particulièrement aux biberons donnés après le brossage de leurs dents. Ils participent fortement au développement des caries chez les plus jeunes.", "Une première visite chez le dentiste dès le plus jeune âge – 6 mois après leur première dent ou lorsqu’ils ont fêté leur première année – permet de s’assurer que la bouche de l’enfant est en santé et prévenir l’apparition de maux plus désagréables.", "Vous avez des questions ? Prenez contact avec l’un de nos dentistes pour enfants. C’est avec plaisir que nous vous accompagnerons pour prendre soin des dents de votre enfant.", ], },
          { title: "10. Surveillez les dents lors de l’adolescence", 
            content: [ "L’adolescence est aussi une époque de grands changements dans la bouche. Il est alors important de respecter le calendrier de visite chez le dentiste afin de prévenir le développement de caries, mais surtout d’évaluer l’arrivée des dents de sagesse.", "À la suite d’un examen minutieux, nos dentistes pourront déterminer si l’extraction des dents de sagesse est effectivement nécessaire pour préserver la santé bucco-dentaire du jeune adulte. Ou si elles peuvent plutôt être conservées, en surveillant régulièrement leur évolution.", ],
    },
  ]

  return (
    <div className="article-container">
      <div className="article-header">
        <div className="article-header-overlay">
          <h1 className="article-title1">10 conseils d'un dentiste pour une bonne hygiène dentaire</h1>
        </div>
      </div>

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
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="article-conclusion">
        <h2>Conclusion</h2>
        <p>
          Une bonne hygiène bucco-dentaire repose sur des gestes quotidiens simples mais essentiels. L'utilisation
          régulière de la soie dentaire et du bain de bouche, le choix d'une brosse à dents adaptée, ainsi qu'une
          alimentation équilibrée contribuent à préserver la santé de vos dents et de vos gencives. Dès le plus jeune
          âge, il est primordial d'instaurer de bonnes habitudes d'hygiène dentaire et de consulter un dentiste
          régulièrement, notamment à l'adolescence pour surveiller l'évolution des dents de sagesse. Enfin, en cas de
          douleurs ou de saignements persistants, il est important de consulter un professionnel afin de prévenir toute
          complication. Prendre soin de sa santé bucco-dentaire, c'est garantir un sourire en pleine santé tout au long
          de la vie !
        </p>
      </div>
    </div>
  )
}

export default DentalCareArticle

