#!/bin/bash

# Détecter le système pour choisir le bon navigateur opener
open_browser() {
  URL=$1
  if command -v xdg-open &> /dev/null; then
    xdg-open "$URL"
  elif command -v open &> /dev/null; then
    open "$URL"
  elif command -v start &> /dev/null; then
    start "$URL"
  else
    echo "Impossible d'ouvrir le navigateur automatiquement. Ouvre manuellement : $URL"
  fi
}

# Créer un venv si besoin
if [ ! -d "venv" ]; then
  echo "Creation de l'environnement virtuel..."
  python3 -m venv venv || { echo "Echec de creation du venv"; exit 1; }
fi

# Activer le venv
source venv/bin/activate || { echo "Impossible d'activer le venv"; exit 1; }

# Installer les dépendances du backend
echo "Installation des dependances Python..."
pip install -r backend/requirements.txt

# Lancer le backend Flask
echo "Demarrage du serveur Flask..."
cd backend || exit
export FLASK_APP=app.py
export FLASK_ENV=development
flask run > ../flask.log 2>&1 &
FLASK_PID=$!
cd ..

# Installer les dépendances npm du frontend
echo "Installation des dependances npm..."
cd frontend || exit

# Vérifier si package.json existe
if [ ! -f "package.json" ]; then
  echo "Erreur: package.json introuvable dans le dossier frontend"
  exit 1
fi

# Installer les dépendances si node_modules n'existe pas ou si package.json est plus récent
if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
  echo "Installation/mise à jour des packages npm..."
  npm install || { echo "Echec de l'installation npm"; exit 1; }
else
  echo "Les packages npm sont déjà installés et à jour."
fi

# Lancer le serveur Node.js/Express
echo "Demarrage du serveur Express sur http://127.0.0.1:8000 ..."
echo ""
echo "POUR UTILISER NODEMON DE MANIERE INTERACTIVE :"
echo "1. Ouvrez un nouveau terminal"
echo "2. Executez: cd frontend && npm run dev"
echo "3. Utilisez 'rs' pour redemarrer le serveur"
echo ""
echo "POUR L'INSTANT: Demarrage en arriere-plan..."

npm run dev > ../frontend.log 2>&1 &
HTTP_PID=$!
cd ..

# Petite pause pour laisser les serveurs démarrer
sleep 2

# Ouvrir le site dans le navigateur par défaut
open_browser "http://127.0.0.1:8000"

# Gestion du Ctrl+C
echo "=== SERVEURS DEMARRES ==="
echo "Frontend (Express + nodemon): http://127.0.0.1:8000"
echo "Backend (Flask): http://127.0.0.1:5000"
echo "=== Appuyez sur Ctrl+C pour arreter les serveurs ==="

trap "echo 'Arret des serveurs...'; kill $FLASK_PID $HTTP_PID 2>/dev/null" SIGINT
wait