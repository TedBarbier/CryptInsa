// Background Effects Controller
class BackgroundEffects {
    constructor() {
        this.floatingElements = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.init();
    }

    init() {
        this.createFloatingElements();
        this.setupMouseEffects();
        this.setupScrollEffects();
        this.startAnimationLoop();
    }

    createFloatingElements() {
        // Create container for floating elements
        const container = document.createElement('div');
        container.className = 'bg-floating-elements';
        document.body.appendChild(container);

        // Create floating elements
        for (let i = 0; i < 8; i++) {
            const element = document.createElement('div');
            element.className = 'floating-element';
            
            // Random properties
            const size = Math.random() * 80 + 40; // 40-120px
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const duration = Math.random() * 20 + 15; // 15-35s
            const delay = Math.random() * 10;

            element.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${x}%;
                top: ${y}%;
                animation-duration: ${duration}s;
                animation-delay: -${delay}s;
            `;

            container.appendChild(element);
            this.floatingElements.push({
                element,
                originalX: x,
                originalY: y,
                size
            });
        }
    }

    setupMouseEffects() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX / window.innerWidth;
            this.mouseY = e.clientY / window.innerHeight;
            
            // Create subtle parallax effect on floating elements
            this.floatingElements.forEach((item, index) => {
                const factor = (index + 1) * 0.02;
                const offsetX = (this.mouseX - 0.5) * factor * 50;
                const offsetY = (this.mouseY - 0.5) * factor * 50;
                
                item.element.style.transform = `
                    translate(${offsetX}px, ${offsetY}px) 
                    scale(${1 + factor * 0.5})
                `;
            });
        });
    }

    setupScrollEffects() {
        let ticking = false;
        
        document.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                    const scrollPercent = scrollY / maxScroll;
                    
                    // Adjust background opacity based on scroll
                    const beforeElement = document.querySelector('body::before');
                    if (beforeElement) {
                        document.body.style.setProperty('--scroll-opacity', 
                            Math.max(0.3, 1 - scrollPercent * 0.5));
                    }
                    
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    startAnimationLoop() {
        const animate = () => {
            // Add subtle breathing effect to background
            const time = Date.now() * 0.001;
            const breathe = Math.sin(time * 0.5) * 0.02 + 1;
            
            document.documentElement.style.setProperty('--breathe-scale', breathe);
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    // Method to add particle effect on click
    createClickEffect(x, y) {
        const particles = [];
        const particleCount = 8;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 4px;
                height: 4px;
                background: var(--primary-color);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                opacity: 1;
                transform: translate(-50%, -50%);
            `;
            
            document.body.appendChild(particle);
            
            // Animate particle
            const angle = (i / particleCount) * Math.PI * 2;
            const velocity = Math.random() * 50 + 50;
            const lifetime = 1000;
            
            particle.animate([
                {
                    transform: `translate(-50%, -50%) translate(0, 0)`,
                    opacity: 1
                },
                {
                    transform: `translate(-50%, -50%) translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px)`,
                    opacity: 0
                }
            ], {
                duration: lifetime,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => {
                particle.remove();
            };
        }
    }
}

// Initialize background effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const bgEffects = new BackgroundEffects();
    
    // Add click effects
    document.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON' && !e.target.closest('.btn')) {
            bgEffects.createClickEffect(e.clientX, e.clientY);
        }
    });
});

// Performance optimization for reduced motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--animation-duration', '0s');
} 