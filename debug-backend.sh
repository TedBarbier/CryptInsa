#!/bin/bash

echo "🔍 Diagnostic du backend Flask"
echo "=============================="

cd /var/www/html/CryptInsa/backend

echo "📁 Répertoire actuel: $(pwd)"
echo "📋 Contenu du répertoire backend:"
ls -la

echo ""
echo "🐍 Test de lancement direct de Flask..."
echo "--------------------------------------"

# Tester si les dépendances sont correctes
echo "1️⃣ Vérification des imports Python..."
python3 -c "
try:
    from flask import Flask, request, jsonify
    from flask_cors import CORS
    from collections import Counter
    import string
    print('✅ Imports de base OK')
except ImportError as e:
    print(f'❌ Erreur import: {e}')
"

echo ""
echo "2️⃣ Test des imports spécifiques à l'application..."
python3 -c "
try:
    from cryptage.cesar import *
    print('✅ Cesar module OK')
except ImportError as e:
    print(f'❌ Erreur cesar: {e}')

try:
    from cryptage.vigenere import *
    print('✅ Vigenere module OK')
except ImportError as e:
    print(f'❌ Erreur vigenere: {e}')

try:
    import cryptage.main as main
    print('✅ Main module OK')
except ImportError as e:
    print(f'❌ Erreur main: {e}')
"

echo ""
echo "3️⃣ Structure du dossier cryptage:"
ls -la cryptage/ 2>/dev/null || echo "❌ Dossier cryptage introuvable"

echo ""
echo "4️⃣ Test de lancement Flask (15 secondes)..."
timeout 15s python3 app.py &
FLASK_PID=$!
sleep 3

echo "5️⃣ Test de connexion..."
curl -s http://localhost:5000/health || echo "❌ Flask non accessible"

echo ""
echo "6️⃣ Arrêt du processus de test..."
kill $FLASK_PID 2>/dev/null

echo ""
echo "✅ Diagnostic terminé!" 