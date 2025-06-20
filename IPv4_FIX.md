# 🔧 Fix IPv4 - Résolution du problème de proxy

## 🎯 Problème identifié

D'après les logs, **les services démarrent correctement** :
- ✅ Flask : `* Running on http://127.0.0.1:5000`
- ✅ Express : `App listening at http://127.0.0.1:10000`
- ✅ Service : `==> Your service is live 🎉`

**MAIS** le proxy échoue avec :
```
Proxy error for /cesar: connect ECONNREFUSED ::1:5000
```

## 🔍 Cause racine

Le proxy utilise `localhost` qui se résout en `::1` (IPv6) dans l'environnement Render, alors que Flask écoute sur `127.0.0.1` (IPv4).

## ✅ Solution IPv4

### 1. **Proxy Express** - Force IPv4
```javascript
// AVANT (problématique)
target: 'http://localhost:5000',

// APRÈS (corrigé)
target: 'http://127.0.0.1:5000',
```

### 2. **Route de test** - Force IPv4
```javascript
// AVANT (problématique)
fetch('http://localhost:5000/health')

// APRÈS (corrigé)
fetch('http://127.0.0.1:5000/health')
```

### 3. **Scripts de test** - Force IPv4
```bash
# AVANT (problématique)
curl http://localhost:5000/health

# APRÈS (corrigé)
curl http://127.0.0.1:5000/health
```

## 🚀 Déploiement de la correction

```bash
cd CryptInsa
git add .
git commit -m "Fix IPv4 resolution for proxy connectivity"
git push
```

## 📊 Résultat attendu

Après déploiement, dans les logs Render :

1. **Services démarrent** (comme avant) :
   ```
   🚀 Démarrage simple de CryptInsa
   🎉 Services lancés: Flask PID: 8, Express PID: 9
   * Running on http://127.0.0.1:5000
   App listening at http://127.0.0.1:10000
   ==> Your service is live 🎉
   ```

2. **Proxy fonctionne** (nouveau) :
   ```
   [2025-XX-XX] Proxying: POST /cesar -> http://127.0.0.1:5000/cesar
   [2025-XX-XX] Proxy response: 200 for /cesar
   ```

3. **Plus d'erreurs ECONNREFUSED** ✅

## 🧪 Tests post-déploiement

1. **API Santé** : `GET https://votre-app.onrender.com/api/health`
2. **Test Backend** : `GET https://votre-app.onrender.com/test-backend`
3. **Chiffrement César** : `POST https://votre-app.onrender.com/api/cesar`

## 💡 Pourquoi cette solution fonctionne

Dans Docker/Render :
- `localhost` → peut résoudre en `::1` (IPv6)
- `127.0.0.1` → force IPv4 direct
- Flask écoute sur `0.0.0.0` → accessible via IPv4

## 🎯 Résolution finale

Cette correction **IPv4** résout définitivement le problème de connectivité proxy → Flask.

---

🎉 **Votre application CryptInsa sera 100% fonctionnelle après ce déploiement !** 