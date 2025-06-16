async function displayFrequencies() {
    // Check if analyze function is available
    if (typeof window.analyze !== 'function') {
        console.error('Analyze function not available. Make sure flask.js is loaded.');
        return;
    }
    
    const freqs = await window.analyze();
    console.log(freqs);
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "<h2>Fréquences :</h2><ul>" +
    Object.entries(freqs)
        .sort((a, b) => b[1] - a[1])
        .map(([char, freq]) => `<li>${char} : ${(freq * 100).toFixed(2)}%</li>`)
        .join("") +
    "</ul>";
}

async function cesarEncryptText() {
    // Check if cesar function is available
    if (typeof window.cesar !== 'function') {
        console.error('Cesar function not available. Make sure flask.js is loaded.');
        return;
    }
    
    const result = await window.cesar();
    encryptedText = result.encrypted;
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "<pre>" + encryptedText + "</pre>";
}
async function cesarDecryptText() {
    // Check if cesarDecrypt function is available
    if (typeof window.cesarDecrypt !== 'function') {
        console.error('CesarDecrypt function not available. Make sure flask.js is loaded.');
        return;
    }
    
    const result = await window.cesarDecrypt();
    decryptedText = result.decrypted;
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "<pre>" + decryptedText + "</pre>";
}
async function vigenereEncryptText() {
    // Check if vigenere function is available
    if (typeof window.vigenere !== 'function') {
        console.error('Vigenere function not available. Make sure flask.js is loaded.');
        return;
    }
    
    const result = await window.vigenere();
    encryptedText = result.encrypted;
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "<pre>" + encryptedText + "</pre>";
}
async function vigenereDecryptText() {
    // Check if vigenereDecrypt function is available
    if (typeof window.vigenereDecrypt !== 'function') {
        console.error('VigenereDecrypt function not available. Make sure flask.js is loaded.');
        return;
    }
    
    const result = await window.vigenereDecrypt();
    decryptedText = result.decrypted;
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "<pre>" + decryptedText + "</pre>";
}
// Gestion des événements
document.addEventListener('DOMContentLoaded', function() {
    const analyzeBtn = document.getElementById('analyzeBtn');
    
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', vigenereDecryptText); // Change to vigenereDecryptText for decryption
        /*analyzeBtn.addEventListener('click', cesarDecryptText); // Change to cesarDecryptText for decryption
        analyzeBtn.addEventListener('click', cesarEncryptText); // Change to cesarEncryptText for encryption
        analyzeBtn.addEventListener('click', vigenereEncryptText); // Change to vigenereEncryptText for encryption
        analyzeBtn.addEventListener('click', displayFrequencies); // Call displayFrequencies to show frequencies
        */
    }
});

