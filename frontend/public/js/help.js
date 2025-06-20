/**
 * JavaScript pour la page d'aide - CryptInsa
 * Fonctionnalités interactives et animations
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeHelpPage();
});

/**
 * Initialisation de la page d'aide
 */
function initializeHelpPage() {
    setupSmoothScrolling();
    setupBackToTop();
    setupAnimations();
    setupSearchFunctionality();
    setupTooltips();
    console.log('📖 Page d\'aide initialisée');
}

/**
 * Configuration du scroll fluide pour la navigation
 */
function setupSmoothScrolling() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Animation de clic sur le bouton
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
                
                // Scroll vers la section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Highlight temporaire de la section
                highlightSection(targetSection);
            }
        });
    });
}

/**
 * Mise en évidence temporaire d'une section
 */
function highlightSection(section) {
    const card = section.querySelector('.help-card');
    if (card) {
        card.style.boxShadow = '0 0 30px rgba(102, 126, 234, 0.3)';
        card.style.transform = 'scale(1.02)';
        
        setTimeout(() => {
            card.style.boxShadow = '';
            card.style.transform = '';
        }, 2000);
    }
}

/**
 * Configuration du bouton "Retour en haut"
 */
function setupBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
    // Affichage/masquage selon le scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Action de clic
    backToTopBtn.addEventListener('click', function() {
        // Animation du bouton
        this.style.transform = 'scale(0.8)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
        
        // Scroll vers le haut
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Configuration des animations au scroll
 */
function setupAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                
                // Animation spéciale pour les éléments de grille
                if (entry.target.classList.contains('tips-grid')) {
                    animateGridItems(entry.target);
                }
                if (entry.target.classList.contains('glossary-grid')) {
                    animateGridItems(entry.target);
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observer les cartes d'aide
    const helpCards = document.querySelectorAll('.help-card');
    helpCards.forEach(card => {
        card.style.animationPlayState = 'paused';
        observer.observe(card);
    });
    
    // Observer les grilles
    const grids = document.querySelectorAll('.tips-grid, .glossary-grid');
    grids.forEach(grid => observer.observe(grid));
}

/**
 * Animation des éléments de grille
 */
function animateGridItems(grid) {
    const items = grid.children;
    Array.from(items).forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

/**
 * Fonctionnalité de recherche simple
 */
function setupSearchFunctionality() {
    // Ajouter une barre de recherche si elle n'existe pas
    addSearchBar();
    
    const searchInput = document.getElementById('helpSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            searchInContent(query);
        });
    }
}

/**
 * Ajout d'une barre de recherche
 */
function addSearchBar() {
    const navSection = document.querySelector('.help-nav');
    if (navSection && !document.getElementById('helpSearch')) {
        const searchContainer = document.createElement('div');
        searchContainer.innerHTML = `
            <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 2px solid #e1e5ff;">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                    <i class="fas fa-search" style="color: #667eea;"></i>
                    <label for="helpSearch" style="font-weight: 600; color: #333;">Rechercher dans l'aide</label>
                </div>
                <input type="text" id="helpSearch" placeholder="Tapez un mot-clé (ex: césar, fréquence, clé...)" 
                       style="width: 100%; padding: 0.8rem; border: 2px solid #e1e5ff; border-radius: 8px; font-size: 1rem; transition: border-color 0.3s ease;">
                <div id="searchResults" style="margin-top: 0.5rem; font-size: 0.9rem; color: #666;"></div>
            </div>
        `;
        navSection.appendChild(searchContainer);
        
        // Style focus pour l'input
        const input = document.getElementById('helpSearch');
        input.addEventListener('focus', function() {
            this.style.borderColor = '#667eea';
            this.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
        });
        
        input.addEventListener('blur', function() {
            this.style.borderColor = '#e1e5ff';
            this.style.boxShadow = 'none';
        });
    }
}

/**
 * Recherche dans le contenu
 */
function searchInContent(query) {
    const sections = document.querySelectorAll('.help-section');
    const resultsDiv = document.getElementById('searchResults');
    let matchCount = 0;
    
    if (query === '') {
        // Réinitialiser l'affichage
        sections.forEach(section => {
            section.style.display = '';
            const highlights = section.querySelectorAll('.search-highlight');
            highlights.forEach(highlight => {
                highlight.replaceWith(document.createTextNode(highlight.textContent));
            });
        });
        resultsDiv.textContent = '';
        return;
    }
    
    sections.forEach(section => {
        const text = section.textContent.toLowerCase();
        const hasMatch = text.includes(query);
        
        if (hasMatch) {
            matchCount++;
            section.style.display = '';
            highlightText(section, query);
        } else {
            section.style.display = 'none';
        }
    });
    
    // Afficher les résultats
    if (matchCount > 0) {
        resultsDiv.innerHTML = `<i class="fas fa-check-circle" style="color: #10b981;"></i> ${matchCount} section(s) trouvée(s)`;
    } else {
        resultsDiv.innerHTML = `<i class="fas fa-exclamation-circle" style="color: #f59e0b;"></i> Aucun résultat trouvé`;
    }
}

/**
 * Mise en évidence du texte recherché
 */
function highlightText(container, query) {
    const textNodes = getTextNodes(container);
    
    textNodes.forEach(node => {
        const text = node.textContent;
        const index = text.toLowerCase().indexOf(query);
        
        if (index !== -1) {
            const beforeText = text.substring(0, index);
            const matchText = text.substring(index, index + query.length);
            const afterText = text.substring(index + query.length);
            
            const span = document.createElement('span');
            span.className = 'search-highlight';
            span.style.cssText = 'background: #ffd700; color: #92400e; padding: 2px 4px; border-radius: 3px; font-weight: 600;';
            span.textContent = matchText;
            
            const fragment = document.createDocumentFragment();
            fragment.appendChild(document.createTextNode(beforeText));
            fragment.appendChild(span);
            fragment.appendChild(document.createTextNode(afterText));
            
            node.parentNode.replaceChild(fragment, node);
        }
    });
}

/**
 * Récupération des nœuds de texte
 */
function getTextNodes(node) {
    const textNodes = [];
    const walker = document.createTreeWalker(
        node,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    let textNode;
    while (textNode = walker.nextNode()) {
        if (textNode.textContent.trim()) {
            textNodes.push(textNode);
        }
    }
    
    return textNodes;
}

/**
 * Configuration des tooltips
 */
function setupTooltips() {
    const termElements = document.querySelectorAll('.term h4');
    
    termElements.forEach(term => {
        term.style.cursor = 'help';
        term.title = 'Cliquez pour voir la définition';
        
        term.addEventListener('click', function() {
            const definition = this.nextElementSibling;
            if (definition) {
                definition.style.background = '#f0f4ff';
                definition.style.padding = '1rem';
                definition.style.borderRadius = '8px';
                definition.style.border = '2px solid #667eea';
                
                setTimeout(() => {
                    definition.style.background = '';
                    definition.style.padding = '';
                    definition.style.borderRadius = '';
                    definition.style.border = '';
                }, 2000);
            }
        });
    });
}

/**
 * Copie du texte d'exemple
 */
function copyExampleText(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Texte copié dans le presse-papiers !', 'success');
        }).catch(() => {
            fallbackCopyText(text);
        });
    } else {
        fallbackCopyText(text);
    }
}

/**
 * Copie de texte fallback
 */
function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('Texte copié dans le presse-papiers !', 'success');
    } catch (err) {
        showNotification('Impossible de copier le texte', 'error');
    }
    
    document.body.removeChild(textArea);
}

/**
 * Affichage de notifications
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}-circle" style="margin-right: 0.5rem;"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animation de sortie
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

/**
 * Ajout de boutons de copie aux exemples
 */
function addCopyButtons() {
    const examples = document.querySelectorAll('.cipher-example .text');
    
    examples.forEach(example => {
        const copyBtn = document.createElement('button');
        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
        copyBtn.style.cssText = `
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            padding: 0.3rem;
            border-radius: 3px;
            margin-left: 0.5rem;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.3s ease;
        `;
        
        copyBtn.addEventListener('click', () => {
            copyExampleText(example.textContent);
        });
        
        copyBtn.addEventListener('mouseenter', () => {
            copyBtn.style.opacity = '1';
        });
        
        copyBtn.addEventListener('mouseleave', () => {
            copyBtn.style.opacity = '0.7';
        });
        
        example.appendChild(copyBtn);
    });
}

// Initialisation des boutons de copie
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(addCopyButtons, 500);
});
