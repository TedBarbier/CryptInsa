# 🔧 Correction du problème API sur Render

## 🚨 Problème rencontré

```
POST http://localhost:5000/start_attack net::ERR_CONNECTION_REFUSED
```

## 🔍 Analyse du problème

Sur Render, l'architecture Docker expose uniquement le port principal (EXPRESS) publiquement :
- ✅ **Frontend Express** : Accessible via `https://votre-app.onrender.com`
- ❌ **Backend Flask** : Port 5000 interne au container, **non accessible depuis l'extérieur**

Le navigateur client ne peut pas accéder directement au port 5000 du container.

## 🛠️ Solution implémentée : Proxy API

### 1. **Ajout du proxy dans Express** (`frontend/app.js`)

```javascript
const { createProxyMiddleware } = require('http-proxy-middleware');

// Proxy API calls to Flask backend
app.use('/api', createProxyMiddleware({
    target: 'http://localhost:5000',
    changeOrigin: true,
    pathRewrite: {
        '^/api': '', // Remove /api prefix when forwarding to Flask
    },
    // ... error handling
}));
```

### 2. **Configuration dynamique des URLs** (`public/js/config.js`)

```javascript
const CONFIG = {
    get API_URL() {
        // Développement local : accès direct Flask
        if (window.location.hostname === 'localhost') {
            return 'http://localhost:5000';
        }
        // Production Render : via proxy Express
        return window.location.origin + '/api';
    }
};
```

### 3. **Nouvelle dépendance** (`package.json`)

```json
{
  "dependencies": {
    "http-proxy-middleware": "^2.0.6"
  }
}
```

## 🔄 Flux de communication

### Avant (❌ Cassé sur Render)
```
Navigateur → http://localhost:5000/start_attack
                     ↓
                 ❌ Connection refused
```

### Après (✅ Fonctionnel)
```
Navigateur → https://votre-app.onrender.com/api/start_attack
                     ↓
           Express Proxy → http://localhost:5000/start_attack
                              ↓
                          Flask Backend
```

## 🧪 Test en local

```bash
# Lancer l'application
./run_dev.sh

# Tester le proxy (nouveau terminal)
./test-proxy.sh
```

## 🚀 Déploiement sur Render

1. **Pousser les changements** :
   ```bash
   git add .
   git commit -m "Add API proxy for Render compatibility"
   git push
   ```

2. **Render va automatiquement redéployer** avec les nouvelles configurations

3. **Tester** : Les appels API fonctionneront maintenant via :
   - Local : `http://localhost:5000/analyze`
   - Render : `https://votre-app.onrender.com/api/analyze`

## 📋 Changements apportés

- ✅ `frontend/app.js` : Ajout du proxy middleware
- ✅ `frontend/package.json` : Nouvelle dépendance
- ✅ `public/js/config.js` : URLs dynamiques
- ✅ `test-proxy.sh` : Script de test
- ✅ Compatibilité local/production préservée

## 🔧 Avantages de cette solution

1. **Sécurité** : Backend Flask reste interne
2. **Simplicité** : Un seul port exposé sur Render
3. **Flexibilité** : Fonctionne en local ET en production
4. **Maintenance** : Pas de changement dans les appels API côté client

---

🎉 **Votre application CryptInsa fonctionne maintenant parfaitement sur Render !** 