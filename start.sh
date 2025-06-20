#!/bin/bash

# Script de démarrage pour Render
# Render fournit un port dynamique via la variable $PORT

# Port par défaut si PORT n'est pas défini (pour tests locaux)
PORT=${PORT:-8000}

echo "🚀 Démarrage de CryptInsa sur le port $PORT"
echo "📁 Répertoire de travail: $(pwd)"
echo "🐍 Version Python: $(python --version)"
echo "📦 Version Node.js: $(node --version)"

# Vérifier que les fichiers nécessaires existent
if [ ! -f "/app/backend/app.py" ]; then
    echo "❌ Erreur: app.py du backend introuvable"
    exit 1
fi

if [ ! -f "/app/frontend/app.js" ]; then
    echo "❌ Erreur: app.js du frontend introuvable"
    exit 1
fi

# Mettre à jour le port dans app.js du frontend
echo "🔧 Configuration du port $PORT pour le frontend..."
sed -i "s/const port = [0-9]*;/const port = process.env.PORT || $PORT;/" /app/frontend/app.js

# Exporter les variables d'environnement pour supervisor
export PORT=$PORT
export FLASK_APP=app.py
export FLASK_ENV=production
export NODE_ENV=production

echo "✅ Variables d'environnement configurées"
echo "   - PORT: $PORT"
echo "   - FLASK_ENV: $FLASK_ENV"
echo "   - NODE_ENV: $NODE_ENV"

# Démarrer supervisord
echo "🚀 Lancement des services avec supervisord..."
exec supervisord -c /etc/supervisor/conf.d/supervisord.conf 