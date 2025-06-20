#!/bin/bash

echo "🔗 Test du proxy API pour CryptInsa"
echo "=================================="

# Vérifier si les services tournent
echo "🔍 Vérification des services..."

# Test direct Flask (doit fonctionner en local)
echo "1️⃣ Test direct Flask (http://localhost:5000)..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/ || echo "Flask non accessible directement"

# Test via proxy Express (doit fonctionner)
echo "2️⃣ Test via proxy Express (http://localhost:8000/api)..."
sleep 2
curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}' \
  http://localhost:8000/api/analyze || echo "Proxy non accessible"

echo ""
echo "✅ Si les deux tests passent, le proxy fonctionne !"
echo "🚀 Prêt pour le déploiement sur Render" 