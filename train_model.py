import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras import layers, models
from tensorflow.keras.optimizers import Adam

# Configuration
DATASET_PATH = "C:/Users/Rania Dabbebi/OneDrive/Bureau/projet-tutoree/dental-diagnosis/data"
CLASSES = ['calculus', 'caries', 'gingivitis', 'hypodontia', 'tooth_discoloration', 'ulcer']
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 15

# Préparation des générateurs
train_datagen = ImageDataGenerator(rescale=1./255)
val_test_datagen = ImageDataGenerator(rescale=1./255)

train_generator = train_datagen.flow_from_directory(
    f"{DATASET_PATH}/train",
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical'
)

validation_generator = val_test_datagen.flow_from_directory(
    f"{DATASET_PATH}/valid",
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical'
)

# Charger MobileNetV2 comme base
base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))

# Modifier la dernière couche
model = models.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dense(128, activation='relu'),
    layers.Dense(len(CLASSES), activation='sigmoid')  # Utilisation de sigmoid pour multi-label
])


base_model.trainable = False  # Geler les couches de base

# Compiler le modèle
model.compile(optimizer=Adam(), loss='binary_crossentropy', metrics=['accuracy'])

# Entraîner le modèle
model.fit(
    train_generator,
    epochs=EPOCHS,
    validation_data=validation_generator
)

# Sauvegarder le modèle
model.save('dental_diagnosis_model.keras')
