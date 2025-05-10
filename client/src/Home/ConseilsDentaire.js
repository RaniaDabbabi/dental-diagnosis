import { motion } from "framer-motion";

const conseils = [
  "Brossez-vous les dents 2 fois par jour pendant 2 minutes",

"  Utilisez une brosse à dents à poils souples pour éviter d’abîmer les gencives",
  
  "Complétez avec du fil dentaire ou des brossettes interdentaires 1 fois par jour",
  
  "Utilisez un dentifrice fluoré pour renforcer l’émail"
  ,
  "Nettoyez aussi votre langue pour éliminer les bactéries"
  ,"Limitez les boissons sucrées (sodas, jus) et les grignotages"
  ,
  "Évitez les aliments trop acides (agrumes, vinaigre) qui usent l’émail"
  ,
  "Mâchez des gommes sans sucre (avec xylitol) pour stimuler la salive"
  ,
  "Buvez de l’eau après les repas pour éliminer les résidus"
  ,
  "Arrêtez le tabac (risque de caries, maladies des gencives et cancer)"
  ,
  "Changez de brosse à dents tous les 3 mois (ou quand les poils sont usés)"
  ,
  "Faites un bain de bouche (sans alcool) occasionnellement"
  ,
  "Consultez votre dentiste au moins 1 fois par an pour un contrôle"
  ,
  "Faites un détartrage régulier pour éviter les problèmes de gencives"
  ,
"  Protégez vos dents avec un gouttière si vous grincez des dents la nuit"
];

// Palette de couleurs douces
const couleurs = [
  "#FFD6D6", // rose clair
  "#D6F5FF", // bleu clair
  "#D6FFD6", // vert clair
  "#FFF5D6", // jaune pâle
  "#E8D6FF"  // violet pastel
];

const ConseilsDentaire = () => {
  return (
    <div style={{ width: "100%", overflow: "hidden" }}>
      <div>
        <motion.div
          style={{ display: "flex" }}
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {[...conseils, ...conseils].map((review, index) => (
            <div
              key={`left-${index}`}
              style={{
                flex: "0 0 300px",
                background: couleurs[index % couleurs.length],
                borderRadius: "18px",
                padding: "20px",
                margin: "0 10px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              <h5 style={{ color: "#101B4EFF" }}>{review}</h5>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ConseilsDentaire;
