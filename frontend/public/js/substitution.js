// JavaScript pour le chiffrement par substitution - Table horizontale

let currentMapping = {};

document.addEventListener('DOMContentLoaded', function() {
    console.log('Substitution cipher page loaded');
    
    // Initialiser la table de substitution horizontale
    initializeHorizontalTable();
    
    // Gestionnaires d'événements
    setupEventListeners();
    
    // Générer une table aléatoire par défaut
    generateRandomMapping();
});

function initializeHorizontalTable() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    // Conteneur des lettres originales
    const originalContainer = document.getElementById('originalLetters');
    originalContainer.innerHTML = '';
    
    // Conteneur des flèches
    const arrowsContainer = document.getElementById('arrowsContainer');
    arrowsContainer.innerHTML = '';
    
    // Conteneur des inputs de substitution
    const inputsContainer = document.getElementById('substitutionInputs');
    inputsContainer.innerHTML = '';
    
    // Générer les éléments pour chaque lettre
    for (let i = 0; i < alphabet.length; i++) {
        const letter = alphabet[i];
        
        // Lettre originale
        const originalDiv = document.createElement('div');
        originalDiv.className = 'original-letter';
        originalDiv.textContent = letter;
        originalContainer.appendChild(originalDiv);
        
        // Flèche
        const arrowDiv = document.createElement('div');
        arrowDiv.className = 'mapping-arrow';
        arrowDiv.textContent = '↓';
        arrowsContainer.appendChild(arrowDiv);
        
        // Input de substitution
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'substitution-input';
        input.maxLength = 1;
        input.id = `sub-${letter}`;
        input.value = letter; // Valeur par défaut = identité
        input.addEventListener('input', handleSubstitutionInput);
        input.addEventListener('focus', function() {
            this.select();
        });
        inputsContainer.appendChild(input);
        
        // Initialiser le mapping
        currentMapping[letter] = letter;
    }
    
    console.log('Horizontal substitution table initialized');
}

function handleSubstitutionInput(event) {
    const input = event.target;
    const value = input.value.toUpperCase();
    const originalLetter = input.id.replace('sub-', '');
    
    // Validation de l'entrée
    if (value && !/^[A-Z]$/.test(value)) {
        input.classList.add('invalid');
        setTimeout(() => input.classList.remove('invalid'), 500);
        input.value = currentMapping[originalLetter] || '';
        return;
    }
    
    // Mise à jour du mapping
    if (value) {
        input.value = value;
        currentMapping[originalLetter] = value;
    } else {
        currentMapping[originalLetter] = '';
    }
    
    // Mise à jour du chiffrement en temps réel
    updateEncryption();
}

function setupEventListeners() {
    // Bouton génération aléatoire
    const generateBtn = document.getElementById('generateRandom');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateRandomMapping);
    }
    
    // Boutons de clés prédéfinies
    document.querySelectorAll('[data-key]').forEach(btn => {
        btn.addEventListener('click', function() {
            const keyType = this.getAttribute('data-key');
            const keyword = this.getAttribute('data-keyword');
            
            if (keyType === 'keyword' && keyword) {
                applyKeywordMapping(keyword);
            } else {
                applyPredefinedKey(keyType);
            }
        });
    });
    
    // Zone de texte d'entrée
    const inputText = document.getElementById('inputText');
    if (inputText) {
        inputText.addEventListener('input', updateEncryption);
        inputText.addEventListener('paste', function() {
            setTimeout(updateEncryption, 10);
        });
    }
    
    // Boutons d'action
    setupActionButtons();
    
    // Exemples mini
    setupMiniExamples();
}

function generateRandomMapping() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const shuffled = alphabet.split('').sort(() => Math.random() - 0.5);
    
    // Animation de génération
    const inputs = document.querySelectorAll('.substitution-input');
    
    // Phase 1: Animation de mélange
    inputs.forEach((input, index) => {
        setTimeout(() => {
            input.style.transform = 'scale(1.1)';
            input.style.background = '#fff3cd';
            
            // Animation de changement rapide
            let counter = 0;
            const animationInterval = setInterval(() => {
                const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
                input.value = randomLetter;
                counter++;
                
                if (counter >= 10) {
                    clearInterval(animationInterval);
                    // Valeur finale
                    input.value = shuffled[index];
                    currentMapping[alphabet[index]] = shuffled[index];
                    
                    // Reset styling
                    setTimeout(() => {
                        input.style.transform = 'scale(1)';
                        input.style.background = 'white';
                    }, 200);
                }
            }, 50);
            
        }, index * 30);
    });
    
    // Mise à jour finale après animation
    setTimeout(() => {
        updateEncryption();
        console.log('Random mapping generated:', currentMapping);
    }, inputs.length * 30 + 600);
}

function applyPredefinedKey(keyType) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let newMapping = {};
    
    switch (keyType) {
        case 'identity':
            for (let i = 0; i < alphabet.length; i++) {
                newMapping[alphabet[i]] = alphabet[i];
            }
            break;
            
        case 'reverse':
            for (let i = 0; i < alphabet.length; i++) {
                newMapping[alphabet[i]] = alphabet[alphabet.length - 1 - i];
            }
            break;
            
        case 'atbash':
            for (let i = 0; i < alphabet.length; i++) {
                newMapping[alphabet[i]] = alphabet[25 - i];
            }
            break;
    }
    
    applyMapping(newMapping, keyType);
}

function applyKeywordMapping(keyword) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    // Nettoyer le mot-clé
    const cleanKeyword = keyword.replace(/[^A-Z]/g, '');
    if (!cleanKeyword) return;
    
    // Créer l'alphabet de substitution avec le mot-clé
    const uniqueKeyword = [...new Set(cleanKeyword)].join('');
    const remainingLetters = alphabet.split('').filter(letter => !uniqueKeyword.includes(letter));
    const substitutionAlphabet = uniqueKeyword + remainingLetters.join('');
    
    let newMapping = {};
    for (let i = 0; i < alphabet.length; i++) {
        newMapping[alphabet[i]] = substitutionAlphabet[i];
    }
    
    applyMapping(newMapping, `keyword: ${keyword}`);
}

function applyMapping(mapping, description) {
    const inputs = document.querySelectorAll('.substitution-input');
    
    // Animation d'application
    inputs.forEach((input, index) => {
        setTimeout(() => {
            const originalLetter = input.id.replace('sub-', '');
            input.style.transform = 'scale(1.1)';
            input.style.background = '#d4edda';
            
            setTimeout(() => {
                input.value = mapping[originalLetter];
                currentMapping[originalLetter] = mapping[originalLetter];
                
                setTimeout(() => {
                    input.style.transform = 'scale(1)';
                    input.style.background = 'white';
                }, 100);
            }, 50);
        }, index * 15);
    });
    
    // Mise à jour finale
    setTimeout(() => {
        updateEncryption();
        console.log(`Applied ${description}:`, currentMapping);
    }, inputs.length * 15 + 200);
}

function updateEncryption() {
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const inputLength = document.getElementById('inputLength');
    const outputLength = document.getElementById('outputLength');
    
    if (!inputText || !outputText) return;
    
    const text = inputText.value.toUpperCase();
    let encrypted = '';
    
    for (let char of text) {
        if (currentMapping[char]) {
            encrypted += currentMapping[char];
        } else {
            encrypted += char; // Conserver les caractères non-alphabétiques
        }
    }
    
    outputText.value = encrypted;
    
    // Mise à jour des statistiques
    if (inputLength) inputLength.textContent = inputText.value.length;
    if (outputLength) outputLength.textContent = encrypted.length;
}

function setupActionButtons() {
    // Effacer le texte
    const clearBtn = document.getElementById('clearText');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            const inputText = document.getElementById('inputText');
            if (inputText) {
                inputText.value = '';
                updateEncryption();
                inputText.focus();
            }
        });
    }
    
    // Coller du texte
    const pasteBtn = document.getElementById('pasteText');
    if (pasteBtn) {
        pasteBtn.addEventListener('click', async function() {
            try {
                const text = await navigator.clipboard.readText();
                const inputText = document.getElementById('inputText');
                if (inputText) {
                    inputText.value = text;
                    updateEncryption();
                }
            } catch (err) {
                console.log('Impossible de coller:', err);
                // Fallback pour navigateurs non compatibles
                const inputText = document.getElementById('inputText');
                if (inputText) {
                    inputText.focus();
                    inputText.select();
                }
            }
        });
    }
    
    // Copier le résultat
    const copyBtn = document.getElementById('copyToClipboard');
    const copyResultBtn = document.getElementById('copyResult');
    
    [copyBtn, copyResultBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', async function() {
                const outputText = document.getElementById('outputText');
                if (outputText && outputText.value) {
                    try {
                        await navigator.clipboard.writeText(outputText.value);
                        // Animation de succès
                        const icon = this.querySelector('i');
                        if (icon) {
                            const originalClass = icon.className;
                            icon.className = 'fas fa-check';
                            this.style.background = 'linear-gradient(135deg, #00b894, #00a085)';
                            
                            setTimeout(() => {
                                icon.className = originalClass;
                                this.style.background = '';
                            }, 1500);
                        }
                    } catch (err) {
                        console.log('Impossible de copier:', err);
                        outputText.select();
                    }
                }
            });
        }
    });
}

function setupMiniExamples() {
    document.querySelectorAll('.example-item').forEach(item => {
        item.addEventListener('click', function() {
            const text = this.getAttribute('data-text');
            const keyType = this.getAttribute('data-key');
            
            if (text && keyType) {
                // Appliquer la clé
                applyPredefinedKey(keyType);
                
                // Mettre le texte d'exemple après un délai
                setTimeout(() => {
                    const inputText = document.getElementById('inputText');
                    if (inputText) {
                        inputText.value = text;
                        updateEncryption();
                        
                        // Animation de highlight
                        this.style.background = 'rgba(255, 215, 0, 0.3)';
                        setTimeout(() => {
                            this.style.background = 'rgba(255, 255, 255, 0.1)';
                        }, 1000);
                    }
                }, 500);
            }
        });
    });
}
