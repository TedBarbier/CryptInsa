#!/bin/bash

# Script de démarrage séquentiel pour CryptInsa sur Render
echo "🚀 Démarrage séquentiel de CryptInsa"

# Port par défaut si PORT n'est pas défini
PORT=${PORT:-8000}

echo "📁 Répertoire de travail: $(pwd)"
echo "🔧 Configuration du port $PORT pour le frontend..."

# Mettre à jour le port dans app.js du frontend
sed -i "s/const port = process.env.PORT || [0-9]*;/const port = process.env.PORT || $PORT;/" /app/frontend/app.js

# Exporter les variables d'environnement
export PORT=$PORT
export FLASK_ENV=production
export NODE_ENV=production

echo "🐍 Lancement du backend Flask..."
cd /app/backend
python app.py &
FLASK_PID=$!

# Attendre que Flask soit prêt
echo "⏳ Attente du démarrage de Flask..."
for i in {1..30}; do
    if curl -s http://localhost:5000/health > /dev/null 2>&1; then
        echo "✅ Flask est prêt!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Timeout: Flask n'a pas démarré"
        exit 1
    fi
    echo "   Tentative $i/30..."
    sleep 2
done

echo "🌐 Lancement du frontend Express..."
cd /app/frontend
node app.js &
EXPRESS_PID=$!

# Attendre que Express soit prêt
echo "⏳ Attente du démarrage d'Express..."
sleep 3
if curl -s http://localhost:$PORT > /dev/null 2>&1; then
    echo "✅ Express est prêt!"
else
    echo "⚠️ Express peut-être pas encore prêt, mais continuons..."
fi

echo "🎉 Services démarrés avec succès!"
echo "   - Flask: http://localhost:5000"
echo "   - Express: http://localhost:$PORT"

# Gestion des signaux pour arrêter proprement
trap "echo 'Arrêt des services...'; kill $FLASK_PID $EXPRESS_PID 2>/dev/null; exit 0" SIGTERM SIGINT

# Attendre que les processus se terminent
wait 