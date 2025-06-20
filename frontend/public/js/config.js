// Configuration des URLs de l'API selon l'environnement
const CONFIG = {
    // En production (Render), les deux services tournent sur le même domaine
    // Le backend Flask sur le port 5000 interne et le frontend Express sur le port principal
    API_BASE_URL: window.location.protocol + '//' + window.location.hostname + ':5000',
    
    // Pour le développement local, utiliser localhost
    get API_URL() {
        // Si on est en localhost, utiliser l'URL locale
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:5000';
        }
        // En production, le backend est accessible sur le même domaine mais port 5000
        // Mais comme on utilise un seul container, on utilise localhost:5000 en interne
        return 'http://localhost:5000';
    }
};

// Export pour utilisation dans d'autres fichiers
window.CONFIG = CONFIG; 