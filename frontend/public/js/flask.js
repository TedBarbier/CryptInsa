async function analyze() { // Recuperer le texte chiffré et l'envoyer à l'API pour analyse et renvoi des fréquences json
    const message = document.getElementById("cipherText").value;
    const res = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
    });

    const data = await res.json();
    return data;
}

// Export the function to make it available for other modules
window.analyze = analyze;

async function cesar(message, shift) { // Recuperer le texte chiffré et l'envoyer à l'API pour analyse et renvoi des fréquences json

    const res = await fetch("http://localhost:5000/cesar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, shift })
    });
    console.log("Cesar function called with message:", message, "and shift:", shift);
    const data = await res.json();
    return data;
}
window.cesar = cesar;

async function cesarDecrypt(message, shift) { // Recuperer le texte chiffré et l'envoyer à l'API pour analyse et renvoi des fréquences json
    const res = await fetch("http://localhost:5000/cesar/decrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, shift })
    });

    const data = await res.json();
    return data;
}
window.cesarDecrypt = cesarDecrypt;

async function vigenere(message, key) { // Recuperer le texte chiffré et l'envoyer à l'API pour analyse et renvoi des fréquences json
    const res = await fetch("http://localhost:5000/vigenere", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, key })
    });

    const data = await res.json();
    return data;
}
window.vigenere = vigenere;

async function vigenereDecrypt(message, key) { // Recuperer le texte chiffré et l'envoyer à l'API pour analyse et renvoi des fréquences json
    const res = await fetch("http://localhost:5000/vigenere/decrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, key })
    });

    const data = await res.json();
    return data;
}
window.vigenereDecrypt = vigenereDecrypt;

async function substitutionAttack(ciphertext, language = 'fr') { // Recuperer le texte chiffré et l'envoyer à l'API pour analyse et renvoi des fréquences json
    const res = await fetch("http://localhost:5000/analyse_frequences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ciphertext, language })
    });

    const data = await res.json();
    return data;
}
window.substitutionAttack = substitutionAttack;

async function updateAttack() { // Recuperer le texte chiffré et l'envoyer à l'API pour analyse et renvoi des fréquences json
    const res = await fetch("http://localhost:5000/update_attack", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });

    const data = await res.json();
    return data;
}
window.updateAttack = updateAttack;
