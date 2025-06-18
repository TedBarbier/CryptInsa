// Background Effects Controller with Vanta.js Integration
class BackgroundEffects {
    constructor() {
        this.floatingElements = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.vantaEffect = null;
        this.init();
    }

    init() {
        this.loadVantaLibraries().then(() => {
            this.initVantaBackground();
            this.createFloatingElements();
            this.setupMouseEffects();
            this.setupScrollEffects();
            this.startAnimationLoop();
        });
    }

    // Load Vanta.js and Three.js libraries
    async loadVantaLibraries() {
        return new Promise((resolve, reject) => {
            // Check if libraries are already loaded
            if (window.VANTA && window.THREE) {
                resolve();
                return;
            }

            // Load Three.js first
            const threeScript = document.createElement('script');
            threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
            threeScript.onload = () => {
                // Then load Vanta.js BIRDS
                const vantaScript = document.createElement('script');
                vantaScript.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.birds.min.js';
                vantaScript.onload = () => resolve();
                vantaScript.onerror = () => reject(new Error('Failed to load Vanta.js'));
                document.head.appendChild(vantaScript);
            };
            threeScript.onerror = () => reject(new Error('Failed to load Three.js'));
            document.head.appendChild(threeScript);
        });
    }

    // Initialize Vanta BIRDS background
    initVantaBackground() {
        // Skip Vanta.js for users who prefer reduced motion
        if (window.DISABLE_VANTA || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            console.log('Vanta.js disabled for reduced motion preferences');
            return;
        }

        // Create background container if it doesn't exist
        let vantaContainer = document.getElementById('vanta-background');
        if (!vantaContainer) {
            vantaContainer = document.createElement('div');
            vantaContainer.id = 'vanta-background';
            document.body.insertBefore(vantaContainer, document.body.firstChild);
        }

        // Mobile detection for performance optimization
        const isMobile = window.innerWidth <= 768;
        
        // Initialize Vanta BIRDS effect
        this.vantaEffect = window.VANTA.BIRDS({
            el: vantaContainer,
            mouseControls: !isMobile,
            touchControls: true,
            gyroControls: false,
            minHeight: window.innerHeight,
            minWidth: window.innerWidth,
            scale: isMobile ? 0.8 : 1.0,
            scaleMobile: 0.6,
            // Custom colors matching your theme
            backgroundColor: 0x0a0a15,
            color1: 0x00ff88,      // Primary green
            color2: 0x4dabf7,      // Accent blue
            colorMode: 'lerp',
            birdSize: isMobile ? 0.8 : 1.2,
            wingSpan: isMobile ? 15 : 25,
            speedLimit: isMobile ? 3 : 5,
            separation: isMobile ? 15 : 25,
            alignment: isMobile ? 15 : 25,
            cohesion: isMobile ? 15 : 25,
            quantity: isMobile ? 2 : 4,
            backgroundAlpha: 0.8
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (this.vantaEffect) {
                this.vantaEffect.resize();
            }
        });
    }

    createFloatingElements() {
        // Create container for floating elements
        const container = document.createElement('div');
        container.className = 'bg-floating-elements';
        document.body.appendChild(container);

        // Reduce floating elements since Vanta provides main animation
        const elementCount = window.innerWidth <= 768 ? 3 : 5;
        for (let i = 0; i < elementCount; i++) {
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

    // Page visibility API to pause/resume Vanta when tab is hidden
    document.addEventListener('visibilitychange', () => {
        if (bgEffects.vantaEffect) {
            if (document.hidden) {
                // Pause or reduce animation when tab is hidden
                bgEffects.vantaEffect.setOptions({ quantity: 1 });
            } else {
                // Resume normal animation when tab is visible
                const isMobile = window.innerWidth <= 768;
                bgEffects.vantaEffect.setOptions({ quantity: isMobile ? 2 : 4 });
            }
        }
    });
});

// Performance optimization for reduced motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--animation-duration', '0s');
    // Disable Vanta.js for users who prefer reduced motion
    window.DISABLE_VANTA = true;
} 