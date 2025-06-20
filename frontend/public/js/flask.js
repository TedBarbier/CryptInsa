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


async function updateAttack() { // Recuperer le texte chiffré et l'envoyer à l'API pour analyse et renvoi des fréquences json
    const res = await fetch("http://localhost:5000/update_attack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "update" })
    });

    const data = await res.json();
    return data;
}
async function startAttack(cipherText) { // Recuperer le texte chiffré et l'envoyer à l'API pour analyse et renvoi des fréquences json
    const res = await fetch("http://localhost:5000/start_attack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cipherText })
    });

    const data = await res.json();
    if (data.error) {
        console.error("Error in startAttack:", data.error);
        throw new Error(data.error);
    }
    console.log("Attack started successfully:", data);
    return data;
}
window.updateAttack = updateAttack;
window.startAttack = startAttack;