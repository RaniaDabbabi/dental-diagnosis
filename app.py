from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import tensorflow as tf
import numpy as np
import random
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
import subprocess
import json
import ollama

app = Flask(__name__)
CORS(app)

# Charger le modèle TensorFlow
model = tf.keras.models.load_model("dental_diagnosis_model.keras")
CLASSES = ['calculus', 'caries', 'gingivitis', 'hypodontia', 'tooth_discoloration', 'ulcer']

# Prétraitement de l'image
def preprocess_image(image):
    image = image.resize((224, 224))
    image = np.array(image) / 255.0
    image = np.expand_dims(image, axis=0)
    return image

# Descriptions détaillées avec probabilités
DESCRIPTIONS = {
    "calculus": [
        {"text": "Il existe une accumulation de tartre dentaire qui peut provoquer une irritation des gencives et favoriser les infections. Consultez un dentiste pour un détartrage complet.", "probability": 0.7},
        {"text": "Il y a une présence importante de tartre dentaire, signe d'une hygiène buccale insuffisante. Un nettoyage professionnel est recommandé pour éviter des complications.", "probability": 0.3},
    ],
    "caries": [
        {"text": "Il existe une carie dentaire, caractérisée par une dégradation visible de l'émail, souvent due à une accumulation de plaque dentaire et à une hygiène buccale insuffisante. Il est recommandé de consulter un dentiste pour retirer les tissus endommagés et appliquer un traitement, comme un plombage ou une couronne.", "probability": 0.5},
        {"text": "Il y a une carie qui semble progresser en profondeur, atteignant potentiellement la dentine. Cette situation peut provoquer des douleurs, une sensibilité accrue et, si elle n'est pas traitée, une infection de la pulpe dentaire. Consultez un dentiste rapidement pour prévenir toute complication.", "probability": 0.3},
        {"text": "Il existe des signes de carie avancée, nécessitant un traitement immédiat comme un plombage ou une couronne.", "probability": 0.2},
    ],
    "gingivitis": [
        {"text": "Il existe une gingivite, une inflammation des gencives caractérisée par des rougeurs et des saignements fréquents. Consultez un dentiste pour un nettoyage professionnel.", "probability": 0.6},
        {"text": "Il y a des signes de gingivite modérée, avec des gencives sensibles et enflammées. Un traitement rapide peut prévenir la progression vers une parodontite.", "probability": 0.4},
    ],
    "hypodontia": [
        {"text": "Il existe une hypodontie, indiquant l'absence de dents. Cela peut nécessiter une intervention orthodontique pour corriger la dentition.", "probability": 1.0},
    ],
    "tooth_discoloration": [
        {"text": "Il existe une décoloration des dents qui peut être causée par des habitudes alimentaires ou le tabac. Un blanchiment dentaire professionnel est recommandé.", "probability": 0.7},
        {"text": "Il y a des signes de décoloration, potentiellement dus à des facteurs externes ou internes. Consultez un dentiste pour un traitement adapté.", "probability": 0.3},
    ],
    "ulcer": [
        {"text": "Il existe un ulcère buccal, qui peut être causé par des irritations ou une infection. Consultez un professionnel pour un traitement adapté.", "probability": 0.8},
        {"text": "Il y a un ulcère dans la bouche, provoquant des douleurs localisées. Un suivi médical est nécessaire pour soulager et guérir rapidement.", "probability": 0.2},
    ],
}


# Fonction pour sélectionner une description aléatoire
def get_random_description(class_name):
    descriptions = DESCRIPTIONS.get(class_name, [])
    if not descriptions:
        return "Aucune description disponible."
    
    # Sélectionner une description en fonction des probabilités
    probabilities = [desc["probability"] for desc in descriptions]
    selected_description = random.choices(descriptions, weights=probabilities, k=1)[0]
    return selected_description["text"]

# Route pour le diagnostic
@app.route('/diagnostic', methods=['POST'])
def diagnostic():
    if 'image' not in request.files:
        return jsonify({"error": "No image file found"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    try:
        image = Image.open(file)
        processed_image = preprocess_image(image)
        predictions = model.predict(processed_image)[0]

        # Seuil pour multi-label
        threshold = 0.5
        detected_classes = [
            {"class": CLASSES[i], "probability": float(prob)}
            for i, prob in enumerate(predictions)
            if prob > threshold
        ]

        if not detected_classes:
            # Aucun diagnostic trouvé, retourner un message spécifique
            return jsonify({"diagnostic": [{"class": "no_diagnosis", "description": "Prenez une photo plus claire pour bien diagnostiquer l'anomalie."}]})

        # Ajouter des descriptions aléatoires
        response = [
            {
                "class": item["class"],
                "description": get_random_description(item["class"]),
                "probability": item["probability"],
            }
            for item in detected_classes
        ]

        return jsonify({"diagnostic": response})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/chatbot/conversation', methods=['POST'])
def chatbot_response():
    data = request.json
    user_message = data.get("text", "")

    # Exécuter la commande Ollama pour obtenir une réponse
    process = subprocess.run(
        ["ollama", "run", "mistral", user_message],
        capture_output=True,
        text=True
    )

    bot_response = process.stdout.strip()  # Récupérer la réponse générée

    response = {"sender": "bot", "text": bot_response}
    return jsonify(response)


if __name__ == '__main__':
    app.run(debug=True)
