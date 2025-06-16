/**
 * Footer JavaScript - CryptoAnalyzer
 * Effets visuels et interactions pour le footer
 */

class CryptoFooter {
    constructor() {
        this.particlesContainer = document.getElementById('particles');
        this.footerLinks = document.querySelectorAll('.footer-section a');
        this.hexPattern = document.querySelector('.hex-pattern');
        
        this.init();
    }
    
    init() {
        this.createParticles();
        this.bindEvents();
        this.animateHexPattern();
        this.updateCopyright();
    }
    
    bindEvents() {
        // Smooth scroll for internal links
        this.footerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    this.smoothScrollTo(href);
                }
            });
        });
        
        // Add glow effect on hover
        this.footerLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.addGlowEffect(link);
            });
            
            link.addEventListener('mouseleave', () => {
                this.removeGlowEffect(link);
            });
        });
    }
    
    createParticles() {
        if (!this.particlesContainer) return;
        
        // Create floating particles
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: #00ff88;
                border-radius: 50%;
                opacity: 0.3;
                animation: particle-float ${3 + Math.random() * 4}s infinite ease-in-out;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 2}s;
            `;
            
            this.particlesContainer.appendChild(particle);
        }
        
        // Add particle animation CSS
        this.addParticleStyles();
    }
    
    addParticleStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes particle-float {
                0%, 100% { 
                    transform: translateY(0px) rotate(0deg);
                    opacity: 0.3;
                }
                50% { 
                    transform: translateY(-20px) rotate(180deg);
                    opacity: 0.8;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    animateHexPattern() {
        if (!this.hexPattern) return;
        
        setInterval(() => {
            const spans = this.hexPattern.querySelectorAll('span');
            spans.forEach(span => {
                const randomHex = '0x' + Math.floor(Math.random() * 255).toString(16).toUpperCase().padStart(2, '0');
                span.textContent = randomHex;
            });
        }, 3000);
    }
    
    updateCopyright() {
        const copyrightElement = document.querySelector('.footer-copyright p');
        if (copyrightElement) {
            const currentYear = new Date().getFullYear();
            copyrightElement.innerHTML = copyrightElement.innerHTML.replace('{{currentYear}}', currentYear);
        }
    }
    
    smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    addGlowEffect(element) {
        element.style.filter = 'drop-shadow(0 0 10px #00ff88)';
    }
    
    removeGlowEffect(element) {
        element.style.filter = '';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cryptoFooter = new CryptoFooter();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CryptoFooter;
}
