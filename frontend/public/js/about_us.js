// ===== ABOUT US PAGE - JAVASCRIPT INTERACTIVITY =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des fonctionnalités
    initScrollAnimations();
    initTeamMemberInteractions();
    initParallaxEffects();
    initCounterAnimations();
    initSmoothScrolling();
    initTypingEffect();
    initFloatingParticles();
});

// ===== ANIMATIONS AU SCROLL =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animation spéciale pour les cartes de l'équipe
                if (entry.target.classList.contains('team-member')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 200;
                    setTimeout(() => {
                        entry.target.style.animation = `fadeInUp 0.6s ease forwards`;
                    }, delay);
                }
                
                // Animation spéciale pour les features
                if (entry.target.classList.contains('feature-card')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 150;
                    setTimeout(() => {
                        entry.target.style.animation = `slideInLeft 0.6s ease forwards`;
                    }, delay);
                }
            }
        });
    }, observerOptions);

    // Observer tous les éléments animables
    const animatableElements = document.querySelectorAll(
        '.team-member, .feature-card, .value-card, .main-card, .section-header'
    );
    
    animatableElements.forEach(el => {
        observer.observe(el);
    });
}

// ===== SLIDESHOW ÉQUIPE =====
function initTeamMemberInteractions() {
    let currentSlide = 1;
    const totalSlides = 6;
    
    const slides = document.querySelectorAll('.team-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // Vérifier que les éléments existent
    if (!slides.length || !dots.length || !prevBtn || !nextBtn) {
        console.warn('Slideshow elements not found');
        return;
    }
    
    // Fonction pour afficher une slide
    function showSlide(slideNumber) {
        // Masquer toutes les slides
        slides.forEach(slide => {
            slide.classList.remove('active', 'prev');
        });
        
        // Désactiver tous les dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Afficher la slide courante
        const currentSlideElement = document.querySelector(`[data-slide="${slideNumber}"]`);
        if (currentSlideElement) {
            currentSlideElement.classList.add('active');
        }
        
        // Activer le dot correspondant
        const currentDot = document.querySelector(`.dot[data-slide="${slideNumber}"]`);
        if (currentDot) {
            currentDot.classList.add('active');
        }
        
        // Mettre à jour l'index
        currentSlide = slideNumber;
    }
    
    // Navigation avec les boutons
    prevBtn.addEventListener('click', () => {
        currentSlide = currentSlide > 1 ? currentSlide - 1 : totalSlides;
        showSlide(currentSlide);
    });
    
    nextBtn.addEventListener('click', () => {
        currentSlide = currentSlide < totalSlides ? currentSlide + 1 : 1;
        showSlide(currentSlide);
    });
    
    // Navigation avec les dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index + 1);
        });
    });
    
    // Navigation avec le clavier
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            nextBtn.click();
        }
    });
    
    // Auto-play (optionnel)
    let autoplayInterval;
    
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            nextBtn.click();
        }, 5000); // Change toutes les 5 secondes
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    // Démarrer l'autoplay
    startAutoplay();
    
    // Arrêter l'autoplay au hover
    const slideshowContainer = document.querySelector('.slideshow-container');
    if (slideshowContainer) {
        slideshowContainer.addEventListener('mouseenter', stopAutoplay);
        slideshowContainer.addEventListener('mouseleave', startAutoplay);
    }
    
    // Supporter le swipe sur mobile
    let startX = 0;
    let endX = 0;
    
    if (slideshowContainer) {
        slideshowContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        slideshowContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        }, { passive: true });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diffX = startX - endX;
        
        if (Math.abs(diffX) > swipeThreshold) {
            if (diffX > 0) {
                // Swipe vers la gauche - slide suivante
                nextBtn.click();
            } else {
                // Swipe vers la droite - slide précédente
                prevBtn.click();
            }
        }
    }
    
    // Initialiser avec la première slide
    showSlide(1);
}

// ===== MODAL SIMULÉ POUR LES MEMBRES =====
function showMemberModal(memberNumber) {
    // Création d'un modal simple (peut être étendu)
    const modalHTML = `
        <div class="member-modal" id="memberModal">
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Profil Détaillé</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Informations détaillées sur le membre ${memberNumber} à venir...</p>
                    <p>Cette fonctionnalité peut être étendue avec plus d'informations, portfolio, etc.</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const modal = document.getElementById('memberModal');
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    
    // Animation d'entrée
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.modal-content').style.transform = 'translateY(0)';
    }, 10);
    
    // Fermeture du modal
    const closeModal = () => {
        modal.style.opacity = '0';
        modal.querySelector('.modal-content').style.transform = 'translateY(-50px)';
        setTimeout(() => modal.remove(), 300);
    };
    
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    
    // Fermeture avec Escape
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    });
}

// ===== EFFETS PARALLAX =====
function initParallaxEffects() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-about');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// ===== ANIMATIONS DE COMPTEUR =====
function initCounterAnimations() {
    const counters = [
        { element: createCounterElement('6', 'Membres d\'équipe'), target: 6 },
        { element: createCounterElement('3', 'Outils crypto'), target: 2 },
        { element: createCounterElement('24/7', 'Support disponible'), target: 247, suffix: '/7', displayTarget: 24 }
    ];
    
    // Ajouter les compteurs à la page (par exemple dans la section valeurs)
    const valuesSection = document.querySelector('.values-section .container');
    if (valuesSection) {
        const countersContainer = document.createElement('div');
        countersContainer.className = 'counters-container';
        countersContainer.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
            padding: 2rem 0;
            border-top: 1px solid var(--border-color);
        `;
        
        counters.forEach(counter => {
            countersContainer.appendChild(counter.element);
        });
        
        valuesSection.appendChild(countersContainer);
        
        // Observer pour déclencher l'animation
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters(counters);
                    counterObserver.unobserve(entry.target);
                }
            });
        });
        
        counterObserver.observe(countersContainer);
    }
}

function createCounterElement(initialText, description) {
    const element = document.createElement('div');
    element.className = 'counter-item';
    element.style.cssText = `
        text-align: center;
        padding: 1.5rem;
        background: var(--bg-card);
        border-radius: var(--border-radius);
        border: 1px solid var(--border-color);
    `;
    
    element.innerHTML = `
        <div class="counter-number" style="font-size: 2.5rem; font-weight: 700; color: var(--primary-color); margin-bottom: 0.5rem;">
            ${initialText}
        </div>
        <div class="counter-description" style="color: var(--text-secondary); font-size: 0.9rem;">
            ${description}
        </div>
    `;
    
    return element;
}

function animateCounters(counters) {
    counters.forEach((counter, index) => {
        setTimeout(() => {
            const numberElement = counter.element.querySelector('.counter-number');
            const target = counter.displayTarget || counter.target;
            const suffix = counter.suffix || '';
            
            animateNumber(numberElement, 0, target, 2000, suffix);
        }, index * 200);
    });
}

function animateNumber(element, start, end, duration, suffix = '') {
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * easeOutQuart(progress));
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

function easeOutQuart(t) {
    return 1 - (--t) * t * t * t;
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== EFFET DE FRAPPE =====
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    const originalText = heroTitle.innerHTML;
    
    // Masquer le texte initialement
    heroTitle.style.opacity = '0';
    
    setTimeout(() => {
        heroTitle.style.opacity = '1';
        typeText(heroTitle, originalText, 50);
    }, 500);
}

function typeText(element, html, speed) {
    element.innerHTML = '';
    let i = 0;
    
    // Extraire le texte sans les balises pour la frappe
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    function type() {
        if (i < textContent.length) {
            element.innerHTML = html.substring(0, i + 1);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ===== PARTICULES FLOTTANTES =====
function initFloatingParticles() {
    // Créer le container de particules en position fixe pour toute la page
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    
    // Ajouter au body pour couvrir toute la page
    document.body.appendChild(particlesContainer);
    
    // Créer des particules avec différentes tailles et délais
    for (let i = 0; i < 25; i++) {
        createModernParticle(particlesContainer, i);
    }
}

function createModernParticle(container, index) {
    // Vérifier que le container existe encore
    if (!container || !container.parentNode) {
        return;
    }
    
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Position horizontale aléatoire
    const startX = Math.random() * 100;
    // Délai aléatoire pour étaler les particules dans le temps
    const delay = Math.random() * 10;
    
    // Style de base appliqué par CSS, on définit juste la position et le délai
    particle.style.cssText = `
        left: ${startX}%;
        animation-delay: ${delay}s;
        will-change: transform, opacity;
    `;
    
    container.appendChild(particle);
    
    // Programmer la suppression et recréation de la particule
    // Durée de base + délai + petite marge
    const cycleDuration = (25 + delay + 2) * 1000; // 25s est la durée max des animations CSS
    
    setTimeout(() => {
        if (particle && particle.parentNode) {
            try {
                particle.parentNode.removeChild(particle);
            } catch (e) {
                console.warn('Error removing particle:', e);
            }
        }
        // Créer une nouvelle particule si le container existe encore
        if (container && container.parentNode) {
            createModernParticle(container, index);
        }
    }, cycleDuration);
}

// ===== STYLES CSS DYNAMIQUES =====
const dynamicStyles = `
<style>
.member-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
}

.modal-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) translateY(-50px);
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    max-width: 500px;
    width: 90%;
    transition: transform 0.3s ease;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color);
}

.modal-close {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 1.5rem;
    cursor: pointer;
    transition: color 0.3s ease;
}

.modal-close:hover {
    color: var(--primary-color);
}

.modal-body {
    padding: 1.5rem;
    color: var(--text-secondary);
}

@keyframes floatUp {
    0% {
        transform: translateY(0) rotate(0deg) scale(0.5);
        opacity: 0;
    }
    10% {
        opacity: 0.6;
        transform: translateY(-10vh) rotate(36deg) scale(1);
    }
    50% {
        opacity: 0.4;
        transform: translateY(-50vh) rotate(180deg) scale(0.8);
    }
    90% {
        opacity: 0.2;
        transform: translateY(-90vh) rotate(324deg) scale(0.6);
    }
    100% {
        transform: translateY(-110vh) rotate(360deg) scale(0.3);
        opacity: 0;
    }
}

.animate-in {
    animation: fadeInUp 0.6s ease forwards;
}

.counter-item:hover {
    transform: translateY(-5px);
    border-color: var(--primary-color);
    transition: all 0.3s ease;
}
</style>
`;

// Ajouter les styles dynamiques
document.head.insertAdjacentHTML('beforeend', dynamicStyles);

// ===== NETTOYAGE DES PARTICULES =====
function cleanupParticles() {
    const particles = document.querySelectorAll('.particles');
    particles.forEach(container => {
        if (container && container.parentNode) {
            container.parentNode.removeChild(container);
        }
    });
}

// Nettoyer les particules quand on quitte la page
window.addEventListener('beforeunload', cleanupParticles);

// ===== GESTION DES ERREURS =====
window.addEventListener('error', (e) => {
    console.warn('Erreur JS dans about_us.js:', e.error);
});

// ===== OPTIMISATION PERFORMANCE =====
// Debounce pour les événements de scroll
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Appliquer le debounce aux événements scroll
const debouncedScrollHandler = debounce(() => {
    // Logique de scroll si nécessaire
}, 16); // ~60fps

window.addEventListener('scroll', debouncedScrollHandler);

console.log('About Us page JavaScript loaded successfully! 🚀');

