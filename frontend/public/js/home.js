/**
 * Home Page JavaScript - CryptoAnalyzer
 * Simple navigation et animations pour la homepage
 */

// Smooth scroll pour les liens d'ancrage
function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth'
        });
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Gestion des liens smooth scroll pour la navigation interne
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const target = this.getAttribute('href');
            if (document.querySelector(target)) {
                e.preventDefault();
                smoothScrollTo(target);
            }
        });
    });
    
    // Animation des barres de fréquence au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);
    
    // Observer les barres de fréquence dans le hero
    document.querySelectorAll('.frequency-chart .bar').forEach(bar => {
        observer.observe(bar);
    });
});
