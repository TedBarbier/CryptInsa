#!/bin/bash

# Script de démarrage simple pour CryptInsa sur Render
echo "🚀 Démarrage simple de CryptInsa"

# Port par défaut si PORT n'est pas défini
PORT=${PORT:-8000}

echo "📁 Répertoire de travail: $(pwd)"
echo "🔧 Port configuré: $PORT"

# Exporter les variables d'environnement
export PORT=$PORT
export FLASK_ENV=production
export NODE_ENV=production

# Fonction pour démarrer Flask
start_flask() {
    echo "🐍 Démarrage du backend Flask..."
    cd /app/backend
    exec python app.py
}

# Fonction pour démarrer Express (avec délai)
start_express() {
    echo "🌐 Attente de 10 secondes avant de démarrer Express..."
    sleep 10
    echo "🌐 Démarrage du frontend Express..."
    cd /app/frontend
    exec node app.js
}

# Démarrer Flask en arrière-plan
start_flask &
FLASK_PID=$!

# Démarrer Express en arrière-plan
start_express &
EXPRESS_PID=$!

echo "🎉 Services lancés:"
echo "   - Flask PID: $FLASK_PID"
echo "   - Express PID: $EXPRESS_PID"

# Gestion des signaux pour arrêter proprement
trap "echo 'Arrêt des services...'; kill $FLASK_PID $EXPRESS_PID 2>/dev/null; exit 0" SIGTERM SIGINT

# Attendre que les processus se terminent
wait 