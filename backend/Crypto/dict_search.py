import unicodedata

def enlever_accents(texte):
    texte_normalise = unicodedata.normalize('NFD', texte)
    texte_sans_accents = ''.join(c for c in texte_normalise if unicodedata.category(c) != 'Mn')
    return texte_sans_accents

def generer_pattern(mot):
    mapping = {}
    compteur = 1
    pattern = []
    for lettre in mot:
        if lettre not in mapping:
            mapping[lettre] = compteur
            compteur += 1
        pattern.append(mapping[lettre])
    return tuple(pattern)


def trouver_mots_correspondants(mot_chiffre, DICO_PATTERN, DICO_LONGUEUR, DICO_DOUBLE):
    mot_chiffre_sans_accents = enlever_accents(mot_chiffre)
    pattern_recherche = generer_pattern(mot_chiffre_sans_accents)
    longueur_recherche = len(mot_chiffre_sans_accents)
    mots_correspondants = []

    for mot in DICO_LONGUEUR.get(longueur_recherche, []):
        if DICO_PATTERN.get(mot) == pattern_recherche:
            mots_correspondants.append(mot)

    return mots_correspondants, len(mots_correspondants)

