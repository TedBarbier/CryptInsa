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

# Lancer le frontend
echo "Demarrage du serveur web statique sur http://localhost:8000 ..."
cd frontend || exit
python3 -m http.server 8000 > ../frontend.log 2>&1 &
HTTP_PID=$!
cd ..

# Petite pause pour laisser les serveurs démarrer
sleep 2

# Ouvrir le site dans le navigateur par défaut
open_browser "http://localhost:8000"

# Gestion du Ctrl+C
trap "echo 'Arret des serveurs...'; kill $FLASK_PID $HTTP_PID" SIGINT
wait