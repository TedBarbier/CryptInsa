"""

Ce code sert à affiner les vhoix de mots dans le dictionnaire
C'est à merger avec le reste du code
je le ferais quand le code fonctionne à 100%

"""
from collections import Counter, defaultdict
import string
#from Crypto.dict_search import trouver_mots_correspondants
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

# Fréquence des lettres en français (environ)
freq_francais = {
    'e': 12.10, 'a': 7.10, 'i': 6.50, 's': 6.20, 'n': 6.10,
    't': 5.90, 'r': 5.30, 'o': 5.10, 'l': 4.80, 'd': 3.50,
    'c': 3.10, 'u': 2.90, 'm': 2.70, 'h': 2.10, 'g': 1.40,
    'b': 1.10, 'f': 1.10, 'p': 1.00, 'v': 0.80, 'w': 0.20,
    'y': 0.10, 'j': 0.10, 'k': 0.05, 'x': 0.04, 'q': 0.03, 'z': 0.01
}
frequences_francais = list(freq_francais.keys())

#def frequences_lettres(texte):
#    texte = ''.join(filter(lambda c: c in string.ascii_letters, texte.lower()))
#    compteur = Counter(texte)
#    total = sum(compteur.values())
#    return {lettre: (count / total) * 100 for lettre, count in compteur.items()} if total > 0 else {}

def decrypt_message(message_chiffre, chemin_dictionnaire):
    maximum = 0
    c1 = 0
    max_mot = ""
    

    for c in message_chiffre:
        if not c.isalpha() and c != ' ':
            raise ValueError("Le message chiffré ne doit contenir que des lettres et des espaces.")
    lettres_chiffrees = [c.lower() for c in message_chiffre if c.isalpha()]
    
    #for mot in message_chiffre.split():
    #    maximum = max(len(mot), maximum)
    #    if len(mot) == maximum:
    #        max_mot = mot
    mots_tries = sorted(
        set(message_chiffre.split()),
        key=lambda mot: (-len(mot), mot)
    )
    freq_chiffree = Counter(lettres_chiffrees)
    
    total = len(lettres_chiffrees)
    
    freq_chiffree_pourcent = {
        lettre: (count / total) * 100 for lettre, count in freq_chiffree.items()
    }
    
    sorted_chiffre = sorted(freq_chiffree_pourcent.items(), key=lambda x: -x[1])
    print("Fréquences des lettres chiffrées :", sorted_chiffre)

    lettre_fréquente = sorted_chiffre[0][0] if sorted_chiffre else None

    n = 0
    print(mots_tries)
    
    
    i = 0
    imapping = []
    new_mot = list(mots_tries[n])

    while len(imapping) == 0 and i < len(frequences_francais):
        candidate_lettre = frequences_francais[i]
        temp_mot = new_mot[:]
        
        while lettre_fréquente not in new_mot and n < len(mots_tries):
            n = n + 1
            new_mot = list(mots_tries[n])
            print(new_mot) 
        
        temp_mot = new_mot[:]
        
        for j in range(len(temp_mot)):
            if temp_mot[j] == lettre_fréquente:
                temp_mot[j] = candidate_lettre
                c1 = j 
        
        imapping = initial_mapping(frequences_francais[i], mots_tries[n][c1], mots_tries[n], chemin_dictionnaire)
        i += 1
    print(temp_mot)

    i=i-1
    print(f"Mots correspondants pour {frequences_francais[i]} dans le mot le plus long :", imapping)
    #for j in range(len(max_mot)):
    #    if c != lettre_fréquente:
    #        new_mot[j] = max_mot[j]
    #    else:
    #        new_mot[j] = frequences_francais[i]

    #for j in range(len(max_mot)):
    #    new_mot = max_mot.replace(max_mot[j], imapping[0][j])
    mot_final = ''.join(temp_mot)
    print(f"Mapping initial pour {frequences_francais[i]} dans le mot le plus long :", mot_final)

    message_dechiffre = list(message_chiffre)
    mapping_mot = d_general(mot_final, imapping, message_chiffre, chemin_dictionnaire)[1]

    for j in range(len(mot_final)) :
        for k in range(len(message_chiffre)) :
            if mot_final[j] == message_chiffre[k] :
                message_dechiffre[k] = mapping_mot[j]
            elif  message_dechiffre[k] == lettre_fréquente:
                message_dechiffre[k] = frequences_francais[i]
    
    
    #for j in range(len(message_dechiffre)):
    #    if message_dechiffre[j] == lettre_fréquente:
    #        message_dechiffre[j] = frequences_francais[i]
    message_original = ''.join(message_dechiffre)
    print(message_original)
                
    #for mot in message_original.split() :
    #    if mot not in chemin_dictionnaire:
    #        i2mapping = initial_mapping(frequences_francais[i], sorted_chiffre[i], mot, chemin_dictionnaire)
    #        while len(i2mapping) == 0 and i < len(frequences_francais):
    #            i += 1
    #            i2mapping = initial_mapping(frequences_francais[i], sorted_chiffre[i], mot, chemin_dictionnaire)
    #            list_mot = list(mot)
    #        for j in range(len(list_mot)):
    #                i = i - 1
    #                print(i)
    #                list_mot[j] =  i2mapping[i][j]

    #        mot_f = ''.join(list_mot)
    #message_original = message_original.replace(mot, mot_f)

        

    return mot_final, message_original
        
def d(mot, chemin_dictionnaire) :
    distance_min = len(mot)
    mot_sa = enlever_accents(mot)
    mot_correspondants = trouver_mots_correspondants(mot_sa, chemin_dictionnaire, encoding='utf-8')[0]
    
    for mot_p in mot_correspondants:
        mot_p_sa = enlever_accents(mot_p)
        distance = sum(1 for a, b in zip(mot_sa, mot_p_sa) if a != b)
        distance_min = min(distance_min, distance)
    
    return distance_min

def d_general(mot_long, imapping, message_chiffre, chemin_dictionnaire):
    mot_choisi = None
    distance_min = len(message_chiffre)
    message_sa = enlever_accents(message_chiffre)
    message_dechiffre = list(message_sa)

    for mot_p in imapping:
        mot_p_sa = enlever_accents(mot_p)
        for j in range(len(mot_p_sa)) :
            for k in range(len(message_chiffre)) :
                if mot_long[j] == message_chiffre[k] :
                    message_dechiffre[k] = mot_p_sa[j]
                #elif  message_dechiffre[k] == lettre_fréquente:
                #    message_dechiffre[k] = frequences_francais[i]
        message_dechiffre_str = ''.join(message_dechiffre)
        distance = sum(d(mot, chemin_dictionnaire) for mot in message_dechiffre_str.split())
        
        if distance < distance_min:
            distance_min = distance
            mot_choisi = mot_p
                

    return distance_min, mot_choisi
        


def initial_mapping(lettre_freq, lettre_change, mot_chiffre, chemin_dictionnaire):
    L= []
    potentials = []
    mot_liste = list(mot_chiffre)
    candidat = trouver_mots_correspondants(mot_chiffre, chemin_dictionnaire, encoding='utf-8')
    
    for i in range(len(mot_chiffre)):
        if mot_chiffre[i] == lettre_change:
            L.append(i)
    
    for c in candidat[0]:
        for i in L:
            if len(c) >= i:
                if c[i] == lettre_freq and c not in potentials:
                    potentials.append(c)
    return potentials


#pas encore fini 
def mapping_with_list(keys_sure,traduction,mot_chiffre,chemin_dictionnaire):
    # print(mot_chiffre)
    L= []
    D=[]
    potentials = []
    candidat = trouver_mots_correspondants(mot_chiffre, chemin_dictionnaire)
    
    for i in range(len(mot_chiffre)):
        for lettre in keys_sure:
            # print(mot_chiffre[i],lettre)
            if mot_chiffre[i]==lettre:
                L.append(i)
                D.append(lettre)
            
    Ln=[i for i in range(len(mot_chiffre)) if i not in L]
    # print(Ln)
    # print(L,D)

    for c in candidat[0]:
        test=True
        j=0
        for i in L:
            if test and len(c)>=i :
                if c[i] != traduction[D[j]]:
                    # print(c,c[i],traduction[D[j]])
                    test=False
            j+=1
        if test:
            # print(c, Ln)
            for j in Ln:
                if c[j] in traduction.values():
                    test=False
            if test:
                potentials.append(c)
    return potentials
