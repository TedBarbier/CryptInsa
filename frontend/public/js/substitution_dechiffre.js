// Fréquences de référence en français (en pourcentage)
const FRENCH_FREQUENCIES = {
    'e': 17.76, 's': 8.23, 'a': 7.68, 'n': 7.61, 't': 7.30,
    'i': 7.23, 'r': 6.81, 'u': 6.05, 'l': 5.89, 'o': 5.34,
    'd': 3.69, 'c': 3.32, 'p': 2.24, 'm': 2.23, 'v': 1.28,
    'g': 1.10, 'f': 1.06, 'b': 0.80, 'h': 0.64, 'q': 0.54,
    'y': 0.46, 'x': 0.38, 'j': 0.31, 'k': 0.16, 'w': 0.08, 
    'z': 0.07, '_':6.00
};

// Alphabet français complet
const FRENCH_ALPHABET = 'abcdefghijklmnopqrstuvwxyz,.';
const ALPHABET_DISPLAY = FRENCH_ALPHABET.split('');

// Variables globales
let cipherFrequencies = {};
let currentMapping = {};
let analyzedText = '';
let is_finished = false;

// Variables pour l'animation d'électricité
let electricityActive = false;

// Variables pour l'animation de particules de loading
let loadingParticlesActive = false;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadMappingFromStorage();
    loadCipherTextFromStorage();
    loadOriginalTexts();
});

function setupEventListeners() {
    document.getElementById('copyResult').addEventListener('click', copyResult);
    document.getElementById('play').addEventListener('click', play);
    document.getElementById('stop').addEventListener('click', stop);
}

//==PLAY==//
let attackInterval = null;

async function play() {
    const cipherText = localStorage.getItem('cipherText');
    
    if (!cipherText) {
        showNotification('Aucun texte chiffré trouvé. Utilisez d\'abord la page d\'attaque.', 'error');
        return;
    }
    
    console.log('Begin Attack');
    
    // Mise à jour de l'interface
    const playButton = document.getElementById('play');
    const stopButton = document.getElementById('stop');
    
    playButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyse...';
    playButton.disabled = true;
    stopButton.disabled = false;
    
    // Démarrer l'animation d'électricité
    startElectricityAnimation();
    
    // Démarrer l'animation de particules de loading
    startLoadingParticles();
    
    // Réinitialiser l'état
    is_finished = false;
    
    try {
        // Premier appel pour démarrer l'attaque
        await window.updateAttack();
        
        // Démarrer les mises à jour périodiques (toutes les 3 secondes)
        attackInterval = setInterval(async () => {
            if (is_finished) {
                clearInterval(attackInterval);
                return;
            }
            
            try {
                const data = await window.updateAttack();
                console.log('Attack data received:', data);
                
                if (data && data.dictionnaire) {
                    currentMapping = data.dictionnaire;
                    console.log('Mapping updated:', data.dictionnaire);
                    

                    
                    // Mettre à jour l'affichage
                    updateMappingDisplay();
                    applyDecryption();
                    
                    // Sauvegarder le mapping
                    localStorage.setItem('mapping', JSON.stringify(currentMapping));
                }
            } catch (error) {
                console.error('Erreur lors de la mise à jour:', error);
                showNotification('Erreur lors de l\'analyse', 'error');
            }
        }, 3000); // Mise à jour toutes les 3 secondes
        
    } catch (error) {
        console.error('Erreur lors du démarrage de l\'attaque:', error);
        showNotification('Erreur lors du démarrage de l\'analyse', 'error');
        stop();
    }
}

//==STOP==//
function stop() {
    is_finished = true;
    
    // Arrêter l'animation d'électricité
    stopElectricityAnimation();
    
    // Arrêter l'animation de particules de loading
    stopLoadingParticles();
    
    // Arrêter l'intervalle de mise à jour
    if (attackInterval) {
        clearInterval(attackInterval);
        attackInterval = null;
    }
    
    // Remettre l'interface en état normal
    const playButton = document.getElementById('play');
    const stopButton = document.getElementById('stop');
    
    playButton.disabled = false;
    playButton.innerHTML = '<i class="fas fa-play"></i> Play';
    stopButton.disabled = true;
    
    console.log('Attack stopped');
}


// ===== CHARGEMENT DES DONNÉES ===== //
function loadCipherTextFromStorage() {
    
    let cipherText = null;
    let source = '';
    
    // 1. Essayer localStorage cipherText
    cipherText = localStorage.getItem('cipherText');
    if (cipherText) {
        source = 'localStorage cipherText';
    }
    
    // 2. Essayer localStorage attackData (fallback)
    if (!cipherText) {
        const attackData = localStorage.getItem('attackData');
        if (attackData) {
            try {
                const data = JSON.parse(attackData);
                if (data.cipherText) {
                    cipherText = data.cipherText;
                    source = 'localStorage attackData';
                }
            } catch (e) {
                // Erreur silencieuse
            }
        }
    }
    
    // 3. Vérifier le résultat final
    if (!cipherText || cipherText.trim().length === 0) {
        showNotification('Aucun texte chiffré trouvé. Utilisez d\'abord la page d\'attaque.', 'error');
        return false;
    }
    return true;
}

// Nouvelle fonction pour charger les textes originaux
function loadOriginalTexts() {
    // Charger le texte chiffré original
    let cipherText = localStorage.getItem('cipherText');
    
    // Essayer aussi de récupérer depuis attackData
    const attackData = localStorage.getItem('attackData');
    if (attackData) {
        try {
            const data = JSON.parse(attackData);
            if (data.cipherText && !cipherText) {
                cipherText = data.cipherText;
            }
            if (data.plainText && !document.getElementById('originalPlainText').value) {
                document.getElementById('originalPlainText').value = data.plainText;
            }
        } catch (e) {
            console.log('Erreur lors du parsing des données d\'attaque:', e);
        }
    }
    
    if (cipherText) {
        document.getElementById('originalCipherText').value = cipherText;
        // Mettre à jour l'affichage du mapping (s'il y en a un)
        updateMappingDisplay();
    }
    
    // Charger le texte en clair original (si disponible)
    const plainText = localStorage.getItem('plaintext');
    if (plainText) {
        document.getElementById('originalPlainText').value = plainText;
    }
}

// ===== MAPPING ===== //
function loadMappingFromStorage() {
    const mapping = localStorage.getItem('mapping');
    if (mapping) {
        currentMapping = JSON.parse(mapping);
    }
    updateMappingDisplay();
}

function updateMappingDisplay() {
    updateCompleteAlphabetDisplay();
}

// Fonction pour afficher l'alphabet complet avec le mapping
function updateCompleteAlphabetDisplay() {
    updateCipherAlphabetRow();
    updateArrowsRow();
    updateClearAlphabetRow();
}

function updateCipherAlphabetRow() {
    const container = document.getElementById('cipherAlphabet');
    container.innerHTML = '';
    
    ALPHABET_DISPLAY.forEach(letter => {
        const letterBox = document.createElement('div');
        letterBox.className = 'alphabet-letter cipher';
        letterBox.textContent = letter.toUpperCase();
        letterBox.setAttribute('data-letter', letter);
        container.appendChild(letterBox);
    });
}

function updateArrowsRow() {
    const container = document.getElementById('arrowsRow');
    container.innerHTML = '';
    
    ALPHABET_DISPLAY.forEach(() => {
        const arrow = document.createElement('div');
        arrow.className = 'arrow';
        arrow.textContent = '↓';
        container.appendChild(arrow);
    });
}

function updateClearAlphabetRow() {
    const container = document.getElementById('clearAlphabet');
    container.innerHTML = '';
    
    ALPHABET_DISPLAY.forEach(letter => {
        const letterBox = document.createElement('div');
        letterBox.className = 'alphabet-letter';
        
        // Vérifier s'il y a une correspondance dans le mapping
        if (currentMapping[letter]) {
            letterBox.textContent = currentMapping[letter].toUpperCase();
            letterBox.classList.add('clear');
            } else {
            letterBox.textContent = '?';
            letterBox.classList.add('empty');
            }
        
        letterBox.setAttribute('data-cipher', letter);
        container.appendChild(letterBox);
    });
}





// ===== DÉCHIFFREMENT ===== //
function applyDecryption() {
    const originalText = localStorage.getItem('cipherText') || '';
    
    if (!originalText) {
        showNotification('Aucun texte à déchiffrer', 'error');
        return;
    }
    
    if (Object.keys(currentMapping).length === 0) {
        showNotification('Aucune correspondance définie', 'error');
        return;
    }
    
    const decryptedText = decryptText(originalText, currentMapping);
    
    // Comparer avec le texte en clair original si disponible
    const originalPlainText = localStorage.getItem('plaintext');
    if (originalPlainText) {
        const comparedText = compareTexts(decryptedText, originalPlainText);
        displayComparedText(comparedText);
    } else {
    document.getElementById('decryptedText').value = decryptedText;
    }
    
    showNotification('Déchiffrement appliqué', 'success');
}

function decryptText(text, mapping) {
    return text.split('').map(char => {
        const lowerChar = char.toLowerCase();
        if (mapping[lowerChar]) {
            return char === char.toUpperCase() ? 
                mapping[lowerChar].toUpperCase() : 
                mapping[lowerChar];
        }
        return char;
    }).join('');
}

function updateLiveDecryption() {
        applyDecryption();
    }

// ===== COMPARAISON DE TEXTES ===== //
function compareTexts(decryptedText, originalPlainText) {
    const decrypted = decryptedText.toLowerCase();
    const original = originalPlainText.toLowerCase();
    const maxLength = Math.max(decrypted.length, original.length);
    
    let comparedChars = [];
    
    for (let i = 0; i < maxLength; i++) {
        const decryptedChar = decrypted[i] || '';
        const originalChar = original[i] || '';
        
        comparedChars.push({
            char: decryptedText[i] || '', // Garder la casse originale
            isCorrect: decryptedChar === originalChar,
            isMissing: i >= decrypted.length,
            isExtra: i >= original.length
        });
    }
    
    return comparedChars;
}

function displayComparedText(comparedChars) {
    const textarea = document.getElementById('decryptedText');
    const container = textarea.parentNode;
    
    // Créer un div pour afficher le texte avec coloration
    let coloredDiv = document.getElementById('coloredDecryptedText');
    if (!coloredDiv) {
        coloredDiv = document.createElement('div');
        coloredDiv.id = 'coloredDecryptedText';
        coloredDiv.className = 'colored-text-display';
        
        // Insérer après le textarea et le cacher
        container.insertBefore(coloredDiv, textarea.nextSibling);
        textarea.style.display = 'none';
    }
    
    // Construire le HTML avec les caractères colorés
    let html = '';
    comparedChars.forEach(charData => {
        const char = charData.char;
        
        if (charData.isCorrect) {
            // Caractère correct - vert
            html += `<span class="char-correct">${char === ' ' ? '&nbsp;' : char}</span>`;
        } else if (charData.isMissing) {
            // Caractère manquant - rouge avec glow
            html += `<span class="char-missing">_</span>`;
        } else if (charData.isExtra) {
            // Caractère en trop - orange avec glow
            html += `<span class="char-extra">${char === ' ' ? '&nbsp;' : char}</span>`;
        } else {
            // Caractère incorrect - rouge avec glow
            html += `<span class="char-incorrect">${char === ' ' ? '&nbsp;' : char}</span>`;
        }
    });
    
    coloredDiv.innerHTML = html;
    
    // Calculer les statistiques
    const correct = comparedChars.filter(c => c.isCorrect).length;
    const total = comparedChars.length;
    const accuracy = total > 0 ? ((correct / total) * 100).toFixed(1) : 0;
    
    // Afficher les statistiques
    let statsDiv = document.getElementById('comparisonStats');
    if (!statsDiv) {
        statsDiv = document.createElement('div');
        statsDiv.id = 'comparisonStats';
        statsDiv.className = 'comparison-stats';
        container.appendChild(statsDiv);
    }
    
    statsDiv.innerHTML = `
        <div class="stats-content">
            <span class="stat-item">
                <i class="fas fa-check-circle"></i>
                Précision: <strong>${accuracy}%</strong>
            </span>
            <span class="stat-item">
                <i class="fas fa-chart-bar"></i>
                ${correct}/${total} caractères corrects
            </span>
        </div>
    `;
}

// ===== UTILITAIRES ===== //
function applyMatch(cipherLetter, clearLetter) {
    currentMapping[cipherLetter] = clearLetter;
    updateMappingDisplay();
    updateLiveDecryption();
}

// ===== ANIMATION D'ÉLECTRICITÉ ===== //
function startElectricityAnimation() {
    electricityActive = true;
    const alphabetMapping = document.getElementById('alphabetMapping');
    const energyDots = document.getElementById('energyDots');
    
    if (alphabetMapping) {
        alphabetMapping.classList.add('electricity-active');
    }
    
    if (energyDots) {
        energyDots.classList.add('active');
    }
    
    console.log('Animation d\'électricité démarrée');
}

function stopElectricityAnimation() {
    electricityActive = false;
    const alphabetMapping = document.getElementById('alphabetMapping');
    const energyDots = document.getElementById('energyDots');
    
    if (alphabetMapping) {
        alphabetMapping.classList.remove('electricity-active');
    }
    
    if (energyDots) {
        energyDots.classList.remove('active');
    }
    
    console.log('Animation d\'électricité arrêtée');
}

// ===== ANIMATION DE PARTICULES DE LOADING ===== //
function startLoadingParticles() {
    loadingParticlesActive = true;
    const loadingOverlay = document.getElementById('loadingParticlesOverlay');
    
    if (loadingOverlay) {
        loadingOverlay.classList.add('active');
    }
    
    console.log('Animation de particules de loading démarrée');
}

function stopLoadingParticles() {
    loadingParticlesActive = false;
    const loadingOverlay = document.getElementById('loadingParticlesOverlay');
    
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
    
    console.log('Animation de particules de loading arrêtée');
}

function clearMapping() {
    currentMapping = {};
    updateMappingDisplay();
    document.getElementById('decryptedText').value = '';
    showNotification('Mapping réinitialisé', 'success');
}

function copyResult() {
    const textarea = document.getElementById('decryptedText');
    const coloredDiv = document.getElementById('coloredDecryptedText');
    
    let textToCopy = '';
    
    if (coloredDiv && coloredDiv.style.display !== 'none') {
        // Si on affiche le texte coloré, copier le texte brut
        textToCopy = coloredDiv.textContent || coloredDiv.innerText;
    } else {
        // Sinon copier depuis le textarea
        textToCopy = textarea.value;
    }
    
    // Utiliser l'API moderne clipboard si disponible
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            showNotification('Texte copié dans le presse-papiers', 'success');
        }).catch(() => {
            // Fallback vers l'ancienne méthode
            fallbackCopy(textToCopy);
        });
    } else {
        fallbackCopy(textToCopy);
    }
}

function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
    document.execCommand('copy');
    showNotification('Texte copié dans le presse-papiers', 'success');
    } catch (err) {
        showNotification('Erreur lors de la copie', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Fonction pour afficher les notifications
function showNotification(message, type = 'info') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Styles inline pour la notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #00ff88, #00cc6a)' : 
                   type === 'error' ? 'linear-gradient(135deg, #ff6b6b, #ee5a52)' : 
                   'linear-gradient(135deg, #4dabf7, #339af0)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s ease;
        max-width: 400px;
        font-weight: 500;
    `;
    
    // Ajouter au DOM
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 100);
    
    // Suppression automatique après 5 secondes
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
    
    // Permettre la fermeture au clic
    notification.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
}