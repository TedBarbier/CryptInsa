import json
from collections import Counter

# Définir les voyelles
VOYELLES = set("aeiouy")

# Définir les préfixes et suffixes fréquents
PREFIXES = ["re", "in", "dé", "pré", "trans", "inter", "sub"]
SUFFIXES = ["tion", "ment", "able", "eux", "ette", "ique", "aire"]

def pattern_isomorphique(mot):
    """Encode un mot sous forme isomorphique comme 12343"""
    mapping = {}
    result = []
    code = 1
    for lettre in mot:
        if lettre not in mapping:
            mapping[lettre] = str(code)
            code += 1
        result.append(mapping[lettre])
    return ''.join(result)

def pattern_cv(mot):
    """Encode en CVCVC structure"""
    return ''.join(['V' if l in VOYELLES else 'C' for l in mot])

def bigrammes(mot):
    return [mot[i:i+2] for i in range(len(mot) - 1)]

def trigrammes(mot):
    return [mot[i:i+3] for i in range(len(mot) - 2)]

def lettres_doubles(mot):
    return list({mot[i] for i in range(len(mot) - 1) if mot[i] == mot[i+1]})

def lettres_freq(mot):
    return dict(Counter(mot))

def detect_prefixe(mot):
    return next((p for p in PREFIXES if mot.startswith(p)), None)

def detect_suffixe(mot):
    return next((s for s in SUFFIXES if mot.endswith(s)), None)

def analyser_mot(mot):
    return {
        "mot": mot,
        "isomorphique": pattern_isomorphique(mot),
        "cv_pattern": pattern_cv(mot),
        "lettres_doubles": lettres_doubles(mot),
        "lettres_frequentes": lettres_freq(mot),
        "longueur": len(mot),
    }

def main():
    input_file = "Crypto/dict.txt"
    output_file = "Crypto/dict_patterns.json"

    with open(input_file, "r", encoding="utf-8") as f:
        mots = [line.strip().lower() for line in f if line.strip().isalpha()]

    resultats = [analyser_mot(mot) for mot in mots]

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(resultats, f, ensure_ascii=False, indent=2)

    print(f"{len(resultats)} mots analysés et sauvegardés dans {output_file}")

if __name__ == "__main__":
    main()
