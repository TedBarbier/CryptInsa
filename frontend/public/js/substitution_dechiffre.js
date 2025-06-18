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
const FRENCH_ALPHABET = 'abcdefghijklmnopqrstuvwxyz_';

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
async function play() {
    const cipherText = localStorage.getItem('cipherText');
    while (!is_finished) {
        //Begin Attack
        console.log('Begin Attack');
        document.getElementById('play').disabled = true;
        document.getElementById('play').innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        await window.substitutionAttack(cipherText);
        //After 5 seconds, fetch to server to get the mapping
        setTimeout(async () => {
            const data = await window.updateAttack;
            currentMapping = data.dictionnaire;
            is_finished = data.is_finished;
            console.log(data.dictionnaire);
        }, 10000);
        console.log('play');
    }
}

//==STOP==//

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