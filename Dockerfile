FROM python:3.11-slim

# Variables d'environnement pour la production
ENV PYTHONUNBUFFERED=1
ENV NODE_ENV=production
ENV FLASK_ENV=production

# Installer Node.js et les dépendances système
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    nodejs \
    npm \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

# Créer le répertoire de travail
WORKDIR /app

# Copier et installer les dépendances Python
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r backend/requirements.txt && \
    pip install --no-cache-dir supervisor

# Copier le frontend et installer les dépendances
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm install --production
COPY frontend/ ./
WORKDIR /app

# Copier le reste des fichiers du backend
COPY backend/ ./backend/

# Copier la configuration supervisord optimisée pour Render
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Créer les répertoires nécessaires pour supervisor
RUN mkdir -p /var/log/supervisor

# Port exposé (Render utilise ce port)
EXPOSE $PORT

# Script de démarrage pour gérer le port dynamique de Render
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Commande de démarrage
CMD ["/app/start.sh"] 