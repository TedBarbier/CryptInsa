// Fréquences de référence en français (en pourcentage)
const FRENCH_FREQUENCIES = {
    'e': 17.76, 's': 8.23, 'a': 7.68, 'n': 7.61, 't': 7.30,
    'i': 7.23, 'r': 6.81, 'u': 6.05, 'l': 5.89, 'o': 5.34,
    'd': 3.69, 'c': 3.32, 'p': 2.24, 'm': 2.23, 'v': 1.28,
    'g': 1.10, 'f': 1.06, 'b': 0.80, 'h': 0.64, 'q': 0.54,
    'y': 0.46, 'x': 0.38, 'j': 0.31, 'k': 0.16, 'w': 0.08, 
    'z': 0.07, '_':6.00
};

// Alphabet français
const FRENCH_ALPHABET = 'abcdefghijklmnopqrstuvwxyz_,.';

// Variables globales
let cipherFrequencies = {};
let currentMapping = {};
let analyzedText = '';
let is_finished = false;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadMappingFromStorage();
    loadCipherTextFromStorage();
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

// ===== MAPPING ===== //
function loadMappingFromStorage() {
    const mapping = localStorage.getItem('mapping');
    if (mapping) {
        currentMapping = JSON.parse(mapping);
    }
    updateMappingDisplay();
}

function updateMappingDisplay() {
    updateCipherAlphabet();
    updateClearAlphabet();
}

function updateCipherAlphabet() {
    const container = document.getElementById('cipherAlphabet');
    container.innerHTML = '';
    
    const presentLetters = Object.keys(cipherFrequencies)
        .filter(letter => cipherFrequencies[letter] > 0)
        .sort();
    
    presentLetters.forEach(letter => {
        const box = document.createElement('div');
        box.className = 'letter-box cipher-letter';
        box.textContent = letter.toUpperCase();
        container.appendChild(box);
    });
}

function updateClearAlphabet() {
    const container = document.getElementById('clearAlphabet');
    container.innerHTML = '';
    
    const presentLetters = Object.keys(cipherFrequencies)
        .filter(letter => cipherFrequencies[letter] > 0)
        .sort();
    
    presentLetters.forEach(letter => {
        const box = document.createElement('div');
        box.className = 'letter-box clear-letter';
        
        const input = document.createElement('input');
        input.className = 'substitution-input';
        input.type = 'text';
        input.maxLength = 1;
        input.value = currentMapping[letter] ? currentMapping[letter].toUpperCase() : '';
        input.setAttribute('data-cipher', letter);
        
        input.addEventListener('input', function() {
            const value = this.value.toLowerCase();
            if (value && /[a-z ]/.test(value)) {
                currentMapping[letter] = value;
                updateLiveDecryption();
            } else {
                delete currentMapping[letter];
                this.value = '';
            }
        });
        
        box.appendChild(input);
        container.appendChild(box);
    });
}

function updateMappingDisplay() {
    updateCipherAlphabet();
    updateClearAlphabet();
}

// ===== DÉCHIFFREMENT ===== //
function applyDecryption() {
    if (!analyzedText) {
        showNotification('Aucun texte à déchiffrer', 'error');
        return;
    }
    
    if (Object.keys(currentMapping).length === 0) {
        showNotification('Aucune correspondance définie', 'error');
        return;
    }
    
    const originalText = localStorage.getItem('cipherText') || '';
    const decryptedText = decryptText(originalText, currentMapping);
    
    document.getElementById('decryptedText').value = decryptedText;
    
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
    if (analyzedText) {
        applyDecryption();
    }
}

// ===== UTILITAIRES ===== //
function applyMatch(cipherLetter, clearLetter) {
    currentMapping[cipherLetter] = clearLetter;
    updateMappingDisplay();
    updateLiveDecryption();
}

function clearMapping() {
    currentMapping = {};
    updateMappingDisplay();
    document.getElementById('decryptedText').value = '';
    showNotification('Mapping réinitialisé', 'success');
}

function copyResult() {
    const textarea = document.getElementById('decryptedText');
    textarea.select();
    document.execCommand('copy');
    showNotification('Texte copié dans le presse-papiers', 'success');
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