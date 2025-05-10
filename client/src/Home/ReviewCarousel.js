import { motion } from "framer-motion";

const reviews = [
  { type: "Dentiste", name: "Dr. Salah", comment: "Très bonne application pour le suivi des patients." },
  { type: "Patient", name: "Sami", comment: "Le diagnostic est rapide et précis !" },
  { type: "Dentiste", name: "Dr. Meriem", comment: "Une IA utile au quotidien !" },
  { type: "Patient", name: "Nour", comment: "Facile à utiliser, j'adore l'interface." },
  { type: "Dentiste", name: "Dr. Ahmed", comment: "Révolutionne ma pratique dentaire." },
  { type: "Patient", name: "Lina", comment: "Résultats impressionnants en quelques secondes." },
];

const ReviewCarousel = () => {
  return (
    <div style={{ width: "100%", overflow: "hidden" }}>      
      <div>
        <motion.div
          style={{ display: "flex" }}
          animate={{ x: ["-50%", "0%"] }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear" 
          }}
        >
          {[...reviews.reverse(), ...reviews.reverse()].map((review, index) => (
            <div 
              key={`right-${index}`}
              style={{
                flex: "0 0 300px",
                background: "#f2f2f2",
                borderRadius: "16px",
                padding: "20px",
                margin: "0 10px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              <h4 style={{ color: "#2313ADFF" }}>{review.type}</h4>
              <p style={{ fontSize: "18px", fontWeight: "bold" }}>{review.name}</p>
              <p style={{ fontStyle: "italic" }}>{review.comment}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ReviewCarousel;