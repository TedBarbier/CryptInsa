# 🚀 Déploiement CryptInsa sur Render

Ce guide vous explique comment déployer votre application CryptInsa sur Render en utilisant Docker.

## 📋 Prérequis

- Un compte Render (gratuit)
- Un repository Git contenant votre projet
- Docker installé localement pour les tests (optionnel)

## 🐳 Architecture Docker

L'application utilise une architecture multi-services dans un seul container :
- **Backend Flask** : Port 5000 (interne)
- **Frontend Express** : Port dynamique fourni par Render
- **Supervisord** : Gestion des processus

## 📁 Fichiers créés pour le déploiement

### `Dockerfile`
- Multi-stage build optimisé
- Installation des dépendances Python et Node.js
- Configuration pour production

### `supervisord.conf`
- Configuration pour gérer les deux services
- Logs dirigés vers stdout/stderr pour Render

### `start.sh`
- Script de démarrage intelligent
- Gestion du port dynamique de Render
- Configuration automatique des variables d'environnement

### `render.yaml`
- Configuration Infrastructure as Code pour Render
- Déploiement automatisé

### Configuration frontend mise à jour
- `config.js` : Gestion dynamique des URLs d'API
- `flask.js` : Utilisation des URLs configurables
- `app.js` : Support des ports dynamiques

## 🚀 Déploiement sur Render

### Option 1 : Via le Dashboard Render

1. **Connecter votre repository**
   - Allez sur [render.com](https://render.com)
   - Cliquez sur "New +" → "Web Service"
   - Connectez votre repository GitHub/GitLab

2. **Configuration du service**
   ```
   Name: cryptinsa-app
   Environment: Docker
   Region: Frankfurt (ou votre préférence)
   Branch: main
   Dockerfile Path: ./Dockerfile
   ```

3. **Variables d'environnement**
   ```
   NODE_ENV=production
   FLASK_ENV=production
   PYTHONUNBUFFERED=1
   ```

4. **Déployer**
   - Cliquez sur "Create Web Service"
   - Render construira et déploiera automatiquement

### Option 2 : Via render.yaml (Recommandé)

1. **Pousser le fichier render.yaml**
   ```bash
   git add render.yaml
   git commit -m "Add Render deployment config"
   git push
   ```

2. **Importer dans Render**
   - Dashboard Render → "New +" → "Blueprint"
   - Sélectionnez votre repository
   - Render détectera automatiquement le `render.yaml`

## 🧪 Test local avec Docker

```bash
# Construire l'image
docker build -t cryptinsa .

# Lancer en local (port 8000)
docker run -p 8000:8000 -e PORT=8000 cryptinsa

# Tester dans votre navigateur
curl http://localhost:8000
```

## 🔧 Configuration avancée

### Scaling
- Plan gratuit : 1 instance
- Plans payants : Auto-scaling disponible

### Domaine personnalisé
```yaml
# Dans render.yaml
services:
  - type: web
    # ... autres configs
    customDomains:
      - name: votre-domaine.com
```

### Monitoring
- Logs automatiques dans le dashboard Render
- Métriques de performance disponibles
- Health checks configurables

## 🐛 Dépannage

### Problèmes courants

1. **Port binding error**
   ```
   Solution: Vérifiez que PORT est bien configuré dans start.sh
   ```

2. **API calls failing**
   ```
   Solution: Vérifiez que config.js est bien chargé avant flask.js
   ```

3. **Build timeouts**
   ```
   Solution: Optimiser le Dockerfile (multi-stage build déjà implémenté)
   ```

### Vérification des logs
```bash
# Dans le dashboard Render
Logs → View logs → Filtrer par service
```

## 📊 Monitoring en production

1. **Health check endpoint**
   - L'application répond sur `/` (frontend)
   - Backend accessible via `/analyze` (POST)

2. **Performance**
   - Temps de démarrage : ~2-3 minutes
   - Mémoire utilisée : ~200-400MB
   - CPU : Minimal en idle

## 🔄 Mise à jour

```bash
# Pousser les changements
git add .
git commit -m "Update application"
git push

# Render redéploiera automatiquement
```

## 💰 Coûts

- **Plan Free** : 750h/mois, suffisant pour des demos
- **Plan Starter** : $7/mois, pour production
- Pas de coûts cachés

## 📞 Support

- [Documentation Render](https://render.com/docs)
- [Community Forum](https://community.render.com)
- Support direct via dashboard (plans payants)

---

🎉 **Votre application CryptInsa est maintenant prête pour le cloud !** 