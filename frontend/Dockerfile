# Utiliser une image Node.js officielle comme base
FROM node:18-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier tout le code source
COPY . .

# Exposer le port sur lequel l'application va tourner
EXPOSE 8000

# Définir les variables d'environnement
ENV NODE_ENV=production

# Commande pour démarrer l'application
CMD ["npm", "start"] 