// JavaScript pour le chiffrement par substitution
class SubstitutionCipher {
    constructor() {
        this.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.substitutionTable = {};
        this.initializeElements();
        this.initializeEventListeners();
        this.initializeTable();
        this.updateCipher();
    }

    initializeElements() {
        this.inputText = document.getElementById('inputText');
        this.outputText = document.getElementById('outputText');
        this.substitutionInputs = document.querySelectorAll('.substitution-input');
        this.keyButtons = document.querySelectorAll('.key-btn');
        this.customKeyInput = document.getElementById('customKey');
        this.applyCustomKeyBtn = document.getElementById('applyCustomKey');
        this.clearTextBtn = document.getElementById('clearText');
        this.resetTableBtn = document.getElementById('resetTable');
        this.copyResultBtn = document.getElementById('copyResult');
        this.modeRadios = document.querySelectorAll('input[name="mode"]');
        this.exampleCards = document.querySelectorAll('.example-card');
    }

    initializeEventListeners() {
        // Événements pour les champs de substitution
        this.substitutionInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => this.handleSubstitutionInput(e, index));
            input.addEventListener('blur', () => this.validateSubstitutionTable());
        });

        // Événements pour les boutons de clés prédéfinies
        this.keyButtons.forEach(button => {
            button.addEventListener('click', () => this.applyPredefinedKey(button));
        });

        // Événements pour la clé personnalisée
        this.applyCustomKeyBtn.addEventListener('click', () => this.applyCustomKey());
        this.customKeyInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.applyCustomKey();
        });

        // Événements pour les boutons d'action
        this.clearTextBtn.addEventListener('click', () => this.clearText());
        this.resetTableBtn.addEventListener('click', () => this.resetTable());
        this.copyResultBtn.addEventListener('click', () => this.copyResult());

        // Événements pour les modes
        this.modeRadios.forEach(radio => {
            radio.addEventListener('change', () => this.updateCipher());
        });

        // Événements pour le texte d'entrée
        this.inputText.addEventListener('input', () => this.updateCipher());

        // Événements pour les exemples
        this.exampleCards.forEach(card => {
            card.addEventListener('click', () => this.loadExample(card));
        });
    }

    initializeTable() {
        // Initialiser la table avec l'alphabet normal
        for (let i = 0; i < this.alphabet.length; i++) {
            this.substitutionTable[this.alphabet[i]] = this.alphabet[i];
        }
        this.updateTableDisplay();
    }

    handleSubstitutionInput(event, index) {
        const value = event.target.value.toUpperCase();
        const originalLetter = this.alphabet[index];

        // Valider l'entrée
        if (value && !this.alphabet.includes(value)) {
            event.target.value = this.substitutionTable[originalLetter] || '';
            return;
        }

        // Mettre à jour la table de substitution
        if (value) {
            this.substitutionTable[originalLetter] = value;
            event.target.value = value;
        } else {
            this.substitutionTable[originalLetter] = originalLetter;
            event.target.value = originalLetter;
        }

        this.validateSubstitutionTable();
        this.updateCipher();
    }

    validateSubstitutionTable() {
        const usedLetters = new Set();
        let hasConflicts = false;

        this.substitutionInputs.forEach((input, index) => {
            const value = input.value.toUpperCase();
            input.classList.remove('invalid');

            if (usedLetters.has(value)) {
                input.classList.add('invalid');
                hasConflicts = true;
            } else if (value) {
                usedLetters.add(value);
            }
        });

        return !hasConflicts;
    }

    applyPredefinedKey(button) {
        const keyType = button.dataset.key;
        const keyword = button.dataset.keyword;

        switch (keyType) {
            case 'reverse':
                this.applyReverseAlphabet();
                break;
            case 'atbash':
                this.applyAtbash();
                break;
            case 'random':
                this.applyRandomKey();
                break;
            case 'keyword':
                this.applyKeywordKey(keyword);
                break;
        }

        this.updateTableDisplay();
        this.updateCipher();
    }

    applyReverseAlphabet() {
        for (let i = 0; i < this.alphabet.length; i++) {
            const reversedIndex = this.alphabet.length - 1 - i;
            this.substitutionTable[this.alphabet[i]] = this.alphabet[reversedIndex];
        }
    }

    applyAtbash() {
        // Chiffrement Atbash (A->Z, B->Y, etc.)
        for (let i = 0; i < this.alphabet.length; i++) {
            const atbashIndex = this.alphabet.length - 1 - i;
            this.substitutionTable[this.alphabet[i]] = this.alphabet[atbashIndex];
        }
    }

    applyRandomKey() {
        const shuffledAlphabet = this.alphabet.split('').sort(() => Math.random() - 0.5);
        for (let i = 0; i < this.alphabet.length; i++) {
            this.substitutionTable[this.alphabet[i]] = shuffledAlphabet[i];
        }
    }

    applyKeywordKey(keyword) {
        if (!keyword) return;

        keyword = keyword.toUpperCase().replace(/[^A-Z]/g, '');
        
        // Créer l'alphabet de substitution avec le mot-clé
        let substitutionAlphabet = '';
        const usedLetters = new Set();

        // Ajouter les lettres du mot-clé (sans doublons)
        for (const letter of keyword) {
            if (!usedLetters.has(letter)) {
                substitutionAlphabet += letter;
                usedLetters.add(letter);
            }
        }

        // Ajouter le reste de l'alphabet
        for (const letter of this.alphabet) {
            if (!usedLetters.has(letter)) {
                substitutionAlphabet += letter;
            }
        }

        // Appliquer la substitution
        for (let i = 0; i < this.alphabet.length; i++) {
            this.substitutionTable[this.alphabet[i]] = substitutionAlphabet[i];
        }
    }

    applyCustomKey() {
        const keyword = this.customKeyInput.value.trim();
        if (keyword) {
            this.applyKeywordKey(keyword);
            this.updateTableDisplay();
            this.updateCipher();
            this.customKeyInput.value = '';
        }
    }

    updateTableDisplay() {
        this.substitutionInputs.forEach((input, index) => {
            const originalLetter = this.alphabet[index];
            input.value = this.substitutionTable[originalLetter] || originalLetter;
        });
        this.validateSubstitutionTable();
    }

    getCurrentMode() {
        const checkedMode = document.querySelector('input[name="mode"]:checked');
        return checkedMode ? checkedMode.value : 'encrypt';
    }

    encrypt(text) {
        return text.split('').map(char => {
            if (this.alphabet.includes(char.toUpperCase())) {
                return this.substitutionTable[char.toUpperCase()] || char;
            }
            return char;
        }).join('');
    }

    decrypt(text) {
        // Créer la table de déchiffrement (inverse)
        const decryptTable = {};
        for (const [original, substituted] of Object.entries(this.substitutionTable)) {
            decryptTable[substituted] = original;
        }

        return text.split('').map(char => {
            if (this.alphabet.includes(char.toUpperCase())) {
                return decryptTable[char.toUpperCase()] || char;
            }
            return char;
        }).join('');
    }

    updateCipher() {
        const inputValue = this.inputText.value;
        const mode = this.getCurrentMode();
        
        if (!inputValue.trim()) {
            this.outputText.value = '';
            return;
        }

        let result;
        if (mode === 'encrypt') {
            result = this.encrypt(inputValue);
        } else {
            result = this.decrypt(inputValue);
        }

        this.outputText.value = result;
        this.updateTransformIcon(mode);
    }

    updateTransformIcon(mode) {
        const icon = document.getElementById('transformIcon');
        if (mode === 'encrypt') {
            icon.className = 'fas fa-arrow-down';
        } else {
            icon.className = 'fas fa-arrow-up';
        }
    }

    clearText() {
        this.inputText.value = '';
        this.outputText.value = '';
    }

    resetTable() {
        this.initializeTable();
        this.updateCipher();
    }

    copyResult() {
        const textToCopy = this.outputText.value;
        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Animation de feedback
                const originalIcon = this.copyResultBtn.innerHTML;
                this.copyResultBtn.innerHTML = '<i class="fas fa-check"></i>';
                this.copyResultBtn.style.background = 'rgba(0, 255, 0, 0.3)';
                
                setTimeout(() => {
                    this.copyResultBtn.innerHTML = originalIcon;
                    this.copyResultBtn.style.background = '';
                }, 1000);
            }).catch(err => {
                console.error('Erreur lors de la copie:', err);
            });
        }
    }

    loadExample(card) {
        const text = card.dataset.text;
        const keyType = card.dataset.key;
        const keyword = card.dataset.keyword;
        const mode = card.dataset.mode;

        // Appliquer la clé de l'exemple
        if (keyType === 'keyword' && keyword) {
            this.applyKeywordKey(keyword);
        } else {
            const button = document.querySelector(`[data-key="${keyType}"]`);
            if (button) {
                this.applyPredefinedKey(button);
            }
        }

        // Charger le texte
        this.inputText.value = text;

        // Définir le mode
        const modeRadio = document.querySelector(`input[name="mode"][value="${mode}"]`);
        if (modeRadio) {
            modeRadio.checked = true;
        }

        // Mettre à jour l'affichage
        this.updateTableDisplay();
        this.updateCipher();

        // Animation de feedback
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
    }
}

// Initialiser l'application quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    new SubstitutionCipher();
});

// Fonctions utilitaires pour l'intégration avec Flask
function getSubstitutionTable() {
    const cipher = window.substitutionCipher;
    return cipher ? cipher.substitutionTable : {};
}

function setSubstitutionTable(table) {
    const cipher = window.substitutionCipher;
    if (cipher) {
        cipher.substitutionTable = table;
        cipher.updateTableDisplay();
        cipher.updateCipher();
    }
}

// Exposer l'instance globalement pour les interactions externes
window.addEventListener('DOMContentLoaded', () => {
    window.substitutionCipher = new SubstitutionCipher();
});
