# Utilise une image Node officielle légère
FROM node:20-alpine

# Définit le répertoire de travail
WORKDIR /app

# Copie les fichiers package.json et package-lock.json
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie le reste du code dans le conteneur
COPY . .

# (Optionnel) Build CSS/JS si tu as un script build
RUN npm run build

# Expose le port utilisé par ton serveur de dev (Vite, etc.)
EXPOSE 5173

# Commande de démarrage (adapte selon ton stack)
CMD ["npm", "run", "dev"]
