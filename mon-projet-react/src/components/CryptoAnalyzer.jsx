import "./CryptoAnalyzer.css";
import { useState } from "react";

const cipherText = "py dtio f'i,kfy giwf py lijgxw fzkf py dxyp qpykbs fk gx py gpykfz";
const hypotheses = {
  p: "l",
  y: "e",
  d: "c",
  t: "h",
  i: "a",
  o: "t",
  f: "s",
  k: "u",
  g: "m",
  w: "r",
  l: "d",
  j: "j",
  x: "i",
  z: "n",
  q: "p",
  b: "o",
  s: "x",
  ",": "m", // ajout de la virgule
};  

function FlipLetter({ char, revealed, onReveal }) {
  const lower = char.toLowerCase();
  const canReveal = !!hypotheses[lower];
  const [flipping, setFlipping] = useState(false);

  // Quand on clique sur une lettre cliquable qui n'a pas été révélée
  const handleClick = () => {
    if (!canReveal || revealed) return;
    setFlipping(true);
    setTimeout(() => {
      setFlipping(false);
      onReveal(lower);
    }, 600);
  };

  // Si la lettre est révélée on montre la lettre déchiffrée en vert, sinon on montre la lettre chiffrée.
  // L’animation flip est gérée avec transform rotateY sur deux faces.
  return (
    <span
      onClick={handleClick}
      style={{
        cursor: canReveal && !revealed ? "pointer" : "default",
        display: "inline-block",
        width: 20,
        height: 28,
        perspective: 600,
        marginRight: 2,
        userSelect: "none",
        position: "relative",
      }}
      aria-label={canReveal ? `Lettre ${char}, clique pour déchiffrer` : undefined}
    >
      {/* Face avant : lettre chiffrée */}
      <span
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backfaceVisibility: "hidden",
          fontWeight: "bold",
          fontSize: 20,
          lineHeight: "28px",
          color: "#d4d4d8",
          textAlign: "center",
          transform: flipping || revealed ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: flipping ? "transform 0.6s" : undefined,
        }}
      >
        {char}
      </span>

      {/* Face arrière : lettre déchiffrée */}
      <span
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backfaceVisibility: "hidden",
          fontWeight: "bold",
          fontSize: 20,
          lineHeight: "28px",
          color: "#4ade80", // vert clair
          textAlign: "center",
          transform: flipping || revealed ? "rotateY(0deg)" : "rotateY(-180deg)",
          transition: flipping ? "transform 0.6s" : undefined,
          userSelect: "none",
        }}
      >
        {hypotheses[lower] || char}
      </span>
    </span>
  );
}

export default function CryptoAnalyzer() {
  // Lettres révélées (minuscules)
  const [revealedLetters, setRevealedLetters] = useState(new Set());

  // On ajoute une lettre révélée dans le set
  function onReveal(char) {
    setRevealedLetters((prev) => new Set(prev).add(char));
  }

  // Texte déchiffré partiel
  const decodedText = cipherText
    .split("")
    .map((c) => {
      const lower = c.toLowerCase();
      return revealedLetters.has(lower) && hypotheses[lower] ? hypotheses[lower] : c;
    })
    .join("");

  return (
    <div
      style={{
        backgroundColor: "#18181b",
        color: "white",
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Analyse de chiffrement par substitution</h1>

      <div
        style={{
          backgroundColor: "#27272a",
          padding: "1rem",
          borderRadius: "8px",
          fontSize: "1.3rem",
          lineHeight: "2rem",
          userSelect: "none",
          maxWidth: 900,
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {cipherText.split("").map((char, i) => (
          <FlipLetter
            key={i}
            char={char}
            revealed={revealedLetters.has(char.toLowerCase())}
            onReveal={onReveal}
          />
        ))}
      </div>

      <section
        style={{
          marginTop: "2rem",
          maxWidth: 900,
          backgroundColor: "#3f3f46",
          borderRadius: "8px",
          padding: "1rem",
          fontSize: "1.15rem",
          minHeight: 60,
          whiteSpace: "pre-wrap",
        }}
      >
        <h2>Texte déchiffré partiel :</h2>
        <p>{decodedText}</p>
      </section>
    </div>
  );
}

