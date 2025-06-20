// Configuration des URLs de l'API selon l'environnement
const CONFIG = {
    get API_URL() {
        // Si on est en localhost, utiliser l'URL directe du backend Flask
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:5000';
        }
        // En production (Render), utiliser le proxy Express (/api)
        return window.location.origin + '/api';
    }
};

// Export pour utilisation dans d'autres fichiers
window.CONFIG = CONFIG; 