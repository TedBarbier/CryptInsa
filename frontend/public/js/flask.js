const BASE_URL = "https://cryptinsa-t3ze.onrender.com:5000/"; // Change this to your backend URL if needed

async function analyze() {
    const message = document.getElementById("cipherText").value;
    const res = await fetch(`${BASE_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
    });

    const data = await res.json();
    return data;
}
window.analyze = analyze;

async function cesar(message, shift) {
    const res = await fetch(`${BASE_URL}/cesar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, shift })
    });
    console.log("Cesar function called with message:", message, "and shift:", shift);
    const data = await res.json();
    return data;
}
window.cesar = cesar;

async function cesarDecrypt(message, shift) {
    const res = await fetch(`${BASE_URL}/cesar/decrypt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, shift })
    });

    const data = await res.json();
    return data;
}
window.cesarDecrypt = cesarDecrypt;

async function vigenere(message, key) {
    const res = await fetch(`${BASE_URL}/vigenere`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, key })
    });

    const data = await res.json();
    return data;
}
window.vigenere = vigenere;

async function vigenereDecrypt(message, key) {
    const res = await fetch(`${BASE_URL}/vigenere/decrypt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, key })
    });

    const data = await res.json();
    return data;
}
window.vigenereDecrypt = vigenereDecrypt;

async function updateAttack() {
    const res = await fetch(`${BASE_URL}/update_attack`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "update" })
    });

    const data = await res.json();
    return data;
}

async function startAttack(cipherText) {
    const res = await fetch(`${BASE_URL}/start_attack`, {
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