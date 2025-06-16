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

