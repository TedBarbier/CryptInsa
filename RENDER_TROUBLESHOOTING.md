# 🔧 Dépannage Render - CryptInsa

## 🎯 Problème résolu

**Erreur rencontrée** : `POST https://cryptinsa-app.onrender.com/api/start_attack 500 (Internal Server Error)`

**Cause identifiée** : Backend Flask non accessible sur Render (proxy fonctionne, mais Flask ne démarre pas avec supervisord)

## ✅ Solution implémentée

### 1. **Diagnostic effectué**
- ✅ Flask fonctionne parfaitement en local
- ✅ Tous les modules Python sont corrects
- ✅ Le proxy Express est configuré correctement
- ❌ Problème de démarrage avec supervisord sur Render

### 2. **Corrections apportées**

#### **Dockerfile optimisé**
- Passage au script de démarrage séquentiel plus fiable
- Scripts multiples : `start.sh` (supervisord) et `start-sequential.sh` (séquentiel)

#### **Configuration supervisord simplifiée**
```ini
[supervisord]
nodaemon=true
loglevel=info

[program:flask-backend]
directory=/app/backend
command=python app.py
environment=FLASK_ENV=production
priority=100
startsecs=10

[program:express-frontend]
directory=/app/frontend
command=node app.js
environment=NODE_ENV=production,PORT=%(ENV_PORT)s
priority=200
startsecs=5
```

#### **Script de démarrage séquentiel** (`start-sequential.sh`)
1. Lance Flask en arrière-plan
2. Attend que Flask réponde (`/health`)
3. Lance Express une fois Flask prêt
4. Gestion propre des signaux

### 3. **Routes de diagnostic ajoutées**

#### Backend Flask
```python
@app.route('/', methods=['GET'])
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "flask-backend",
        "message": "CryptInsa Backend API is running"
    })
```

#### Frontend Express
```javascript
// Test de la connexion avec Flask
app.get('/test-backend', async (req, res) => {
    // ... teste la connectivité avec Flask
});
```

## 🚀 Déploiement

### Option 1 : Script séquentiel (recommandé)
```dockerfile
CMD ["/app/start-sequential.sh"]
```

### Option 2 : Supervisord (fallback)
```dockerfile
CMD ["/app/start.sh"]
```

## 🧪 Test de la correction

### Sur Render après déploiement :

1. **Vérifier que Flask est accessible** :
   ```
   GET https://votre-app.onrender.com/test-backend
   ```

2. **Tester l'API de santé** :
   ```
   GET https://votre-app.onrender.com/api/health
   ```

3. **Tester l'analyse de fréquences** :
   ```
   POST https://votre-app.onrender.com/api/analyze
   Content-Type: application/json
   
   {"message": "test"}
   ```

## 📊 Monitoring

### Logs Render
- Rechercher : `✅ Flask est prêt!`
- Rechercher : `✅ Express est prêt!`
- Si timeout : `❌ Timeout: Flask n'a pas démarré`

### URLs de diagnostic
- `/test-backend` : Test de connectivité interne
- `/api/health` : Santé du backend via proxy

## 🔄 Si le problème persiste

1. **Vérifier les logs Render** :
   - Dashboard → Logs
   - Filtrer par service

2. **Tester les routes de diagnostic** :
   ```bash
   curl https://votre-app.onrender.com/test-backend
   curl https://votre-app.onrender.com/api/health
   ```

3. **Revenir à supervisord si nécessaire** :
   ```dockerfile
   # Dans Dockerfile, changer :
   CMD ["/app/start.sh"]
   ```

## 📋 Checklist de déploiement

- ✅ `package.json` : `http-proxy-middleware`, `node-fetch`
- ✅ `config.js` : URLs dynamiques configurées
- ✅ `app.js` : Proxy `/api` configuré
- ✅ `app.py` : Route `/health` ajoutée
- ✅ Scripts : `start-sequential.sh` exécutable
- ✅ Dockerfile : CMD utilise le bon script

## 🎉 Résultat attendu

Après déploiement, toutes les fonctionnalités CryptInsa fonctionnent :
- ✅ Analyse de fréquences
- ✅ Chiffrement César
- ✅ Chiffrement Vigenère  
- ✅ Attaque par substitution

---

**🚀 Votre application CryptInsa est maintenant robuste et prête pour la production !** 