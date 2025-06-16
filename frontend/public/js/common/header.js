/**
 * Header JavaScript - CryptoAnalyzer
 * Gestion de la navigation mobile et des interactions
 */

class CryptoHeader {
    constructor() {
        this.navToggle = document.getElementById('navToggle');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.isMenuOpen = false;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupActiveNavigation();
        this.createMatrixRain();
    }
    
    bindEvents() {
        // Toggle mobile menu
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        // Close menu when clicking on links (mobile)
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    this.closeMobileMenu();
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !e.target.closest('.navbar')) {
                this.closeMobileMenu();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
        
        // Scroll effect on header
        window.addEventListener('scroll', () => this.handleScroll());
    }
    
    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        
        if (this.isMenuOpen) {
            this.openMobileMenu();
        } else {
            this.closeMobileMenu();
        }
    }
    
    openMobileMenu() {
        this.navMenu.classList.add('active');
        this.navToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Animate toggle lines
        const lines = this.navToggle.querySelectorAll('.toggle-line');
        lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        lines[1].style.opacity = '0';
        lines[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    }
    
    closeMobileMenu() {
        this.isMenuOpen = false;
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset toggle lines
        const lines = this.navToggle.querySelectorAll('.toggle-line');
        lines.forEach(line => {
            line.style.transform = '';
            line.style.opacity = '';
        });
    }
    
    setupActiveNavigation() {
        // Get current page or section
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;
        
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            // Remove all active classes first
            link.classList.remove('active');
            
            // Add active class based on current location
            if (href === currentPath || href === currentHash) {
                link.classList.add('active');
            }
        });
    }
    
    handleScroll() {
        const header = document.querySelector('.crypto-header');
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            header.style.backdropFilter = 'blur(15px)';
            header.style.background = 'linear-gradient(135deg, rgba(15, 15, 30, 0.95) 0%, rgba(26, 26, 46, 0.95) 50%, rgba(22, 33, 62, 0.95) 100%)';
        } else {
            header.style.backdropFilter = 'blur(10px)';
            header.style.background = 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)';
        }
    }
    
    createMatrixRain() {
        // Create matrix rain effect in header decoration
        const binaryStream = document.querySelector('.binary-stream');
        if (!binaryStream) return;
        
        setInterval(() => {
            const spans = binaryStream.querySelectorAll('span');
            spans.forEach(span => {
                // Generate random binary
                const binary = Math.random().toString(2).substr(2, 8).padStart(8, '0');
                span.textContent = binary;
            });
        }, 2000);
    }
    
    // Method to programmatically set active nav item
    setActiveNav(linkHref) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === linkHref) {
                link.classList.add('active');
            }
        });
    }
    
    // Method to show notification in header
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `header-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add to header
        const header = document.querySelector('.crypto-header');
        header.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cryptoHeader = new CryptoHeader();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CryptoHeader;
}
