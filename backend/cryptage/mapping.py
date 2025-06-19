from collections import Counter, defaultdict
import unicodedata


def generer_pattern(mot):
    mapping = {}
    compteur = 1
    pattern = []
    for lettre in mot:
        if lettre not in mapping:
            mapping[lettre] = compteur
            compteur += 1
        pattern.append(str(mapping[lettre]))
    return "".join(pattern)

def charger_dictionnaire_complet(chemin_dict="cryptage/dict.txt"):
    """
    Construit les 3 dictionnaires :
    - par pattern isomorphique
    """
    DICO_PATTERN = defaultdict(set)

    with open(chemin_dict, "r", encoding="utf-8") as f:
        mots = f.read().split()

    for mot in mots:
        mot = mot.lower()

        # DICO_PATTERN
        DICO_PATTERN[generer_pattern(mot)].add(mot)

    return dict(DICO_PATTERN)

DICO_PATTERN = charger_dictionnaire_complet() 


def enlever_accents(texte):
    texte_normalise = unicodedata.normalize('NFD', texte)
    texte_sans_accents = ''.join(c for c in texte_normalise if unicodedata.category(c) != 'Mn')
    return texte_sans_accents

def trouver_mots_correspondants(mot_chiffre):
    mot_chiffre_sans_accents = enlever_accents(mot_chiffre)
    pattern_recherche = generer_pattern(mot_chiffre_sans_accents)
    longueur_recherche = len(mot_chiffre_sans_accents)
    mots_correspondants = []
    mots_correspondants=(list(DICO_PATTERN.get(pattern_recherche, [])))

    return mots_correspondants, len(mots_correspondants)





def trouver_dernier_char_non_espace(texte: str, espace: str):
    """Retourne le dernier caractère non-espace du texte, sinon None."""
    i = len(texte) - 1
    while i >= 0:
        if texte[i] != espace:
            return texte[i]
        i -= 1
    return None

def detecter_ponctuation(texte_chiffre: str, caractere_espace: str, score_seuil=0.95):
    """
    Détecte les caractères représentant le point et la virgule dans un texte chiffré.
    
    Args:
        texte_chiffre (str): Le texte chiffré.
        caractere_espace (str): Le caractère qui représente l'espace.
        score_seuil (float): Seuil de confiance pour identifier la ponctuation.

    Returns:
        dict: {'point': caractère ou None, 'virgule': caractère ou None}
    """
    if not texte_chiffre:
        return {'virgule': None, 'point': None}

    # Étape 1 : Identifier un candidat pour le point
    point_candidat = trouver_dernier_char_non_espace(texte_chiffre, caractere_espace)
    resultat = {'virgule': None, 'point': point_candidat}

    # Étape 2 : Chercher la virgule parmi les autres caractères
    profils = defaultdict(lambda: {'avant_espace': 0, 'autre_position': 0})
    
    for i in range(len(texte_chiffre) - 1):
        char_actuel = texte_chiffre[i]
        char_suivant = texte_chiffre[i + 1]

        if char_actuel == caractere_espace:
            continue
        if char_actuel == point_candidat:
            continue

        if char_suivant == caractere_espace:
            profils[char_actuel]['avant_espace'] += 1
        else:
            profils[char_actuel]['autre_position'] += 1

    # Étape 3 : Calcul du score des candidats virgule
    candidats_virgule = []
    for char, profil in profils.items():
        total = profil['avant_espace'] + profil['autre_position']
        if total == 0:
            continue
        score = profil['avant_espace'] / total
        if score >= score_seuil:
            candidats_virgule.append({'char': char, 'freq': profil['avant_espace'], 'score': score})

    # Sélection du meilleur candidat virgule
    candidats_virgule.sort(key=lambda x: (x['score'], x['freq']), reverse=True)
    if candidats_virgule:
        resultat['virgule'] = candidats_virgule[0]['char']

    # Si on n’a détecté aucune ponctuation
    if not point_candidat and not candidats_virgule:
        print("[INFO] Aucune ponctuation détectée.")

    return resultat
     
#pas encore fini 
def mapping_with_list(keys_sure,traduction,mot_chiffre):
    L= []
    D=[]
    potentials = []
    candidat = trouver_mots_correspondants(mot_chiffre)

    for i in range(len(mot_chiffre)):
        for lettre in keys_sure:
            if mot_chiffre[i]==lettre:
                L.append(i)
                D.append(lettre)
            
    Ln=[i for i in range(len(mot_chiffre)) if i not in L]

    for c in candidat[0]:
        test=True
        j=0
        for i in L:
            if test and len(c)>=i :
                if c[i] != traduction[D[j]]:
                    test=False
            j+=1
        if test:
            for j in Ln:
                if c[j] in traduction.values():
                    test=False
            if test:
                potentials.append(c)
    return potentials
