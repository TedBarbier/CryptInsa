from collections import Counter
import string


# Fréquence des lettres en français (environ)
freq_francais = {
    'e': 12.10, 'a': 7.10, 'i': 6.50, 's': 6.20, 'n': 6.10,
    't': 5.90, 'r': 5.30, 'o': 5.10, 'l': 4.80, 'd': 3.50,
    'c': 3.10, 'u': 2.90, 'm': 2.70, 'h': 2.10, 'g': 1.40,
    'b': 1.10, 'f': 1.10, 'p': 1.00, 'v': 0.80, 'w': 0.20,
    'y': 0.10, 'j': 0.10, 'k': 0.05, 'x': 0.04, 'q': 0.03, 'z': 0.01
}


def frequences_lettres(texte):
    texte = ''.join(filter(lambda c: c in string.ascii_letters, texte.lower()))
    compteur = Counter(texte)
    total = sum(compteur.values())
    return {lettre: (count / total) * 100 for lettre, count in compteur.items()} if total > 0 else {}

def decrypt_message(message_chiffre, chemin_dictionnaire):
    pass

def initial_mapping(message_chiffre):
    frequences_lettres = frequences_lettres(message_chiffre)

    sorted_chiffre = sorted(frequences_lettres.keys(), key=lambda x: -frequences_lettres[x])

    sorted_langue = sorted(freq_francais.keys(), key=lambda x: -freq_francais[x])
    mapping = {}
    
    for chiffre, clair in zip(sorted_chiffre, sorted_langue):
        mapping[chiffre] = clair

    return mapping

    

def affiner_mapping_par_mots(mots_chiffres, chemin_dictionnaire, mapping_initial, encoding='utf-8'):
    pass
