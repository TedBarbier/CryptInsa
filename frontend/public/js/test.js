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

// Gestion des événements
document.addEventListener('DOMContentLoaded', function() {
    const analyzeBtn = document.getElementById('analyzeBtn');
    
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', displayFrequencies);
    }
});