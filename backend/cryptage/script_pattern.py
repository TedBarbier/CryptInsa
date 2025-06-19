import json


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



def analyser_mot(mot):
    return {
        "mot": mot,
        "isomorphique": pattern_isomorphique(mot),
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
