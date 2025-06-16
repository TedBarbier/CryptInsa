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

def initial_mapping(lettre_hypothétique, mot_chiffre, chemin_dictionnaire):
    """le mot_chiffre est le mot ayant le plus grand nombre de caractère dans le message"""
    L= []
    potentials = []
    candidat = trouver_mots_correspondants(mot_chiffre, chemin_dictionnaire, encoding='utf-8')
    for i in range(len(mot_chiffre)):
        if mot_chiffre[i] == lettre_hypothétique:
            L.append(i)
    for c in candidat:
        for i in L:
            if len(c) > i:
                if c[i] == lettre_hypothétique:
                    potentials.append(c)
    return potentials 
    

    

def affiner_mapping_par_mots(mots_chiffres, chemin_dictionnaire, mapping_initial, encoding='utf-8'):
    pass
