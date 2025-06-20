// Vanta.js NET Background Controller
class VantaNetBackground {
    constructor() {
        this.vantaEffect = null;
        this.isInitialized = false;
        this.config = {
            // NET effect configuration
            color: 0x00ff88,        // Primary green color
            backgroundColor: 0x0a0a15, // Dark background
            points: 20,             // Number of connection points
            maxDistance: 25,        // Maximum distance for connections
            spacing: 20,            // Spacing between points  
            showDots: true,         // Show connection dots
            mouseControls: true,    // Enable mouse interaction
            touchControls: true,    // Enable touch interaction
            gyroControls: false,    // Disable gyro controls
            minHeight: 200.00,      // Minimum height
            minWidth: 200.00,       // Minimum width
            scale: 1.00,           // Scale factor
            scaleMobile: 1.00,     // Mobile scale factor
            // Advanced settings
            speed: 0.5,            // Animation speed
            opacity: 0.8,          // Overall opacity
        };
        this.init();
    }

    init() {
        // Wait for Vanta.js to load
        this.waitForVanta().then(() => {
            this.initializeVanta();
            this.setupResponsiveHandling();
            this.setupPerformanceOptimizations();
            this.setupClickEffects();
        }).catch(error => {
            console.warn('Vanta.js failed to load, falling back to simple background');
            this.fallbackBackground();
        });
    }

    waitForVanta() {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 50; // 5 seconds max wait
            
            const checkVanta = () => {
                if (typeof VANTA !== 'undefined' && VANTA.NET) {
                    resolve();
                } else if (attempts < maxAttempts) {
                    attempts++;
                    setTimeout(checkVanta, 100);
                } else {
                    reject(new Error('Vanta.js not loaded'));
                }
            };
            
            checkVanta();
        });
    }

    initializeVanta() {
        const target = document.getElementById('vanta-bg');
        if (!target) {
            console.error('Vanta background target element not found');
            return;
        }

        // Initialize Vanta NET effect
        this.vantaEffect = VANTA.NET({
            el: target,
            ...this.config
        });

        this.isInitialized = true;
        console.log('Vanta.js NET background initialized');

        // Add custom styling after initialization
        this.customizeVantaStyles();
    }

    customizeVantaStyles() {
        // Add custom CSS classes for enhanced styling
        const vantaCanvas = document.querySelector('#vanta-bg canvas');
        if (vantaCanvas) {
            vantaCanvas.style.filter = 'brightness(0.9) contrast(1.1)';
            vantaCanvas.style.transition = 'filter 0.3s ease';
        }
    }

    setupResponsiveHandling() {
        let resizeTimeout;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (this.vantaEffect && this.vantaEffect.resize) {
                    this.vantaEffect.resize();
                }
                
                // Adjust configuration for mobile
                if (window.innerWidth <= 768) {
                    this.updateConfig({
                        points: 8,
                        maxDistance: 20,
                        spacing: 15,
                        speed: 0.3
                    });
                } else {
                    this.updateConfig({
                        points: 12,
                        maxDistance: 25,
                        spacing: 20,
                        speed: 0.5
                    });
                }
            }, 250);
        });
    }

    setupPerformanceOptimizations() {
        // Pause animation when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (this.vantaEffect) {
                if (document.hidden) {
                    this.pauseAnimation();
                } else {
                    this.resumeAnimation();
                }
            }
        });

        // Reduce animation on battery-powered devices
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                if (!battery.charging && battery.level < 0.2) {
                    this.updateConfig({ speed: 0.2 });
                }
            });
        }

        // Respect reduced motion preferences
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.updateConfig({ 
                speed: 0.1,
                mouseControls: false,
                touchControls: false
            });
        }
    }

    setupClickEffects() {
        document.addEventListener('click', (e) => {
            // Don't add effects on buttons or interactive elements
            if (e.target.tagName !== 'BUTTON' && !e.target.closest('.btn')) {
                this.createClickRipple(e.clientX, e.clientY);
            }
        });
    }

    createClickRipple(x, y) {
        // Create multiple particles that shoot out in different directions
        const particleCount = 8;
        const particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            const angle = (i / particleCount) * Math.PI * 2;
            const distance = 100 + Math.random() * 50;
            const size = 4 + Math.random() * 6;
            
            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: ${size}px;
                height: ${size}px;
                background: #00ff88;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                transform: translate(-50%, -50%);
                opacity: 1;
                box-shadow: 0 0 10px #00ff88;
            `;
            
            document.body.appendChild(particle);
            particles.push(particle);
            
            // Calculate end position
            const endX = x + Math.cos(angle) * distance;
            const endY = y + Math.sin(angle) * distance;
            
            // Animate particle shooting out
            particle.animate([
                {
                    transform: 'translate(-50%, -50%) scale(1)',
                    opacity: 1,
                    left: x + 'px',
                    top: y + 'px'
                },
                {
                    transform: 'translate(-50%, -50%) scale(0)',
                    opacity: 0,
                    left: endX + 'px',
                    top: endY + 'px'
                }
            ], {
                duration: 800 + Math.random() * 400,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => {
                particle.remove();
            };
        }
        
        // Add central explosion effect
        const explosion = document.createElement('div');
        explosion.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 10px;
            height: 10px;
            border: 2px solid #00ff88;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1001;
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
            box-shadow: 0 0 20px #00ff88;
        `;
        
        document.body.appendChild(explosion);
        
        explosion.animate([
            {
                transform: 'translate(-50%, -50%) scale(0)',
                opacity: 1
            },
            {
                transform: 'translate(-50%, -50%) scale(3)',
                opacity: 0
            }
        ], {
            duration: 500,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => {
            explosion.remove();
        };
    }

    updateConfig(newConfig) {
        if (this.vantaEffect && this.vantaEffect.setOptions) {
            this.vantaEffect.setOptions({
                ...this.config,
                ...newConfig
            });
            this.config = { ...this.config, ...newConfig };
        }
    }

    pauseAnimation() {
        if (this.vantaEffect && this.vantaEffect.renderer) {
            this.vantaEffect.renderer.setAnimationLoop(null);
        }
    }

    resumeAnimation() {
        if (this.vantaEffect && this.vantaEffect.renderer) {
            this.vantaEffect.renderer.setAnimationLoop(() => {
                this.vantaEffect.render();
            });
        }
    }

    // Fallback for when Vanta.js fails to load
    fallbackBackground() {
        const target = document.getElementById('vanta-bg');
        if (target) {
            target.style.cssText = `
                background: linear-gradient(135deg, #0a0a15 0%, #1a1a2e 50%, #0a0a15 100%);
                opacity: 0.8;
            `;
        }
    }

    // Method to change theme colors dynamically
    changeTheme(color) {
        const colorMap = {
            green: 0x00ff88,
            blue: 0x4dabf7,
            purple: 0x9775fa,
            orange: 0xffa502,
            red: 0xff4757
        };
        
        const newColor = colorMap[color] || colorMap.green;
        this.updateConfig({ color: newColor });
    }

    // Cleanup method
    destroy() {
        if (this.vantaEffect) {
            this.vantaEffect.destroy();
            this.vantaEffect = null;
            this.isInitialized = false;
        }
    }
}

// Initialize Vanta NET background when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.vantaNetBg = new VantaNetBackground();
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (window.vantaNetBg) {
        window.vantaNetBg.destroy();
    }
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VantaNetBackground;
} 