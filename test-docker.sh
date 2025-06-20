#!/bin/bash

echo "🐳 Test de construction Docker pour CryptInsa"
echo "=============================================="

# Nettoyer les images précédentes
echo "🧹 Nettoyage des images précédentes..."
docker rmi cryptinsa:test 2>/dev/null || true

# Construire l'image
echo "🔨 Construction de l'image Docker..."
docker build -t cryptinsa:test . || {
    echo "❌ Erreur lors de la construction"
    exit 1
}

echo "✅ Image construite avec succès!"

# Tester l'image
echo "🚀 Test de l'image (port 8080)..."
echo "Appuyez sur Ctrl+C pour arrêter le test"
echo "URL de test: http://localhost:8080"

docker run -p 8080:8080 -e PORT=8080 cryptinsa:test 