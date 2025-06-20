"""
ce code va générer des listes de candidat pour chaque mots chiffré
va servir après la première tentative du mapping par fréquence
"""



import unicodedata

def trouver_mots_correspondants(mot_chiffre, chemin_dictionnaire, encoding='utf-8'):
    mot_chiffre_sans_accents = enlever_accents(mot_chiffre)
    pattern_recherche = generer_pattern(mot_chiffre_sans_accents)
    longueur_recherche = len(mot_chiffre_sans_accents)
    mots_correspondants = []

    with open(chemin_dictionnaire, 'r', encoding=encoding) as fichier:
        for ligne in fichier:
            mot = ligne.strip().lower()
            mot_sans_accents = enlever_accents(mot)
            if len(mot_sans_accents) == longueur_recherche and mot.isalpha():
                pattern_mot = generer_pattern(mot_sans_accents)
                if pattern_mot == pattern_recherche:
                    mots_correspondants.append(mot)
    return mots_correspondants, len(mots_correspondants)


def generer_pattern(mot):
    mapping = {}
    compteur = 0
    pattern = []
    for lettre in mot:
        if lettre not in mapping:
            mapping[lettre] = compteur
            compteur += 1
        pattern.append(mapping[lettre])
    return tuple(pattern)

def enlever_accents(texte):
    texte_normalise = unicodedata.normalize('NFD', texte)
    texte_sans_accents = ''.join(c for c in texte_normalise if unicodedata.category(c) != 'Mn')
    return texte_sans_accents
