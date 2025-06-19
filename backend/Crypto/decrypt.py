from collections import Counter, defaultdict
import frequences_lettres as freq
import string
import cesar
import random
import dict_search as dict_search
import mapping
import json
# Fréquence des lettres en français (environ)
freq_francais = freq.get_letter_frequencies(freq.extract_text_from_pdf("miserables.pdf"))

freq_combination_francais = freq.get_combination_frequencies(freq.extract_text_from_pdf("miserables.pdf"))

combinaisons= freq.get_combination_frequencies(freq.extract_text_from_pdf("miserables.pdf"))
combinaison_frequentes = {k: v for k, v in combinaisons.items() if v > 0.8}

N_ITERATIONS=50

alphabet = string.ascii_lowercase + ' ' + ',' + '.'

def charger_dictionnaire_pattern(chemin_fichier="dict_patterns.json"):
    """
    Charge le dictionnaire et le groupe par longueur de mot pour une recherche rapide.
    Retourne un dictionnaire où les clés sont les longueurs et les valeurs sont des sets de mots.
    Ex: {3: {'les', 'des'}, 4: {'pour', 'avec'}}
    """
    with open(chemin_fichier, "r", encoding="utf-8") as f:
        donnees = json.load(f)
    index_isomorphique = defaultdict(set)
    index_double = defaultdict(set)

    for entree in donnees:
        mot = entree["mot"]
        isomorphique = entree["isomorphique"]
        index_isomorphique[isomorphique].add(mot)
        if entree["lettres_doubles"]:
            for lettre in entree["lettres_doubles"]:
                index_double[lettre].add(mot)

    return index_isomorphique, index_double

DICO_PATTERN, DICO_DOUBLE = charger_dictionnaire_pattern("dict_patterns.json")

DICO_OPTIMISE = charger_dictionnaire_pattern("dict_patterns.json")

def charger_dictionnaire_optimise(chemin_fichier="dict.txt"):
    """
    Charge le dictionnaire et le groupe par longueur de mot pour une recherche rapide.
    Retourne un dictionnaire où les clés sont les longueurs et les valeurs sont des sets de mots.
    Ex: {3: {'les', 'des'}, 4: {'pour', 'avec'}}
    """
    mots_par_longueur = {}
    with open(chemin_fichier, "r", encoding="utf-8") as f:
        for mot in f.read().split():
            longueur = len(mot)
            if longueur not in mots_par_longueur:
                mots_par_longueur[longueur] = set()
            mots_par_longueur[longueur].add(mot)
    return mots_par_longueur

DICO_OPTIMISE = charger_dictionnaire_optimise("dict.txt")


def frequences_lettres(texte):
    texte = ''.join(filter(lambda c: c in string.ascii_letters, texte.lower()))
    compteur = Counter(texte)
    total = sum(compteur.values())
    return {lettre: (count / total) * 100 for lettre, count in compteur.items()} if total > 0 else {}


def decrypt_lettre_liste(frequence):
    
    proches = [(lettre, abs(freq - frequence)) for lettre, freq in freq_francais.items()]
    proches.sort(key=lambda x: x[1])
    return [lettre for lettre, _ in proches]

def decrypt_lettre(frequence,seuil_frequence=None):
    min_diff=1000
    if seuil_frequence is not None and frequence < seuil_frequence:
        return None
    
    for l,f in freq_francais.items():
        if abs(frequence-f)<min_diff:
            min_diff=abs(frequence-f)
            decode=l
    
    return decode

def decrypt_lettre_inverse(message,frequence):
    frequence_lettres=freq.get_letter_frequencies(message)
    min_diff=1000

    for l,f in frequence_lettres.items():
        if abs(frequence-f)<min_diff:
            min_diff=abs(frequence-f)
            decode=l
    
    return decode



def create_key(message):
    message=cesar.cesar_encrypt(message.lower(),3)
    frequences=freq.get_letter_frequencies(message)
    code=["0"]*len(message)
    code=["0"]*len(message)
    for i in range(0,len(message)):
        l=message[i]
        if l in frequences.keys():
            c=decrypt_lettre(frequences[l])
            code[i]=c
    key={}
    for i in range(0,len(message)):
        if code[i]!="0":
            key[message[i]]=code[i]
    return key

def message_from_key(message, traduction): #message apres cesar
    new_message = ""
    for char in message:
        if char in traduction.keys() and traduction[char] is not None:
            new_message += traduction[char]
        else:
            new_message += char
    return new_message

# def find_score_lettre(l, t, traductions, freqs_message, freqs_combi_message):
#     """
#     Calcule le score d'une lettre en utilisant les fréquences pré-calculées.
#     """
#     score_combi = 0
#     cpt = 0
    
#     # On filtre les combinaisons pertinentes une seule fois
#     combinaisons_pertinentes = {k: v for k, v in freqs_combi_message.items() if v > 0.003} # Seuil ajusté
    
#     for combi in combinaisons_pertinentes:
#         if l in combi and combi[0] in traductions and combi[1] in traductions:
#             c1 = traductions[combi[0]]
#             c2 = traductions[combi[1]]
#             trad_combi = c1 + c2
#             if trad_combi in freq_combination_francais:
#                 score_combi += freq_combination_francais[trad_combi]
#                 cpt += 1

#     if cpt > 0:
#         score_combi = (score_combi / cpt) / 4 # Normalisation
    
#     # Score basé sur la fréquence de la lettre
#     # On évite la division par zéro si la fréquence est nulle.
#     freq_ref = freq_francais.get(t, 0)
#     p = 1 - (abs(freqs_message.get(l, 0) - freq_ref) / 19) # 19 est une constante magique, peut-être à revoir
    
#     # Pondération des deux scores
#     score_final = 0.4 * p + 0.6 * score_combi
#     return score_final

def change_traduction_with_word(traduction, mot_initial, mot_final):
    for i in range(min(len(mot_initial), len(mot_final))):
        if mot_initial[i] in traduction:
            traduction[mot_initial[i]] = mot_final[i]
    return traduction

def change_traduction_with_letter(traduction, lettre_initiale, lettre_finale):
    traduction[lettre_initiale]=lettre_finale
    return traduction


def is_mot_sans_virgule(mot,virgule_chiffre):
    return(mot[-1]!=virgule_chiffre)

def is_mot_sans_point(mot,point_chiffre):
    return(mot[-1]!=point_chiffre)

def decrypt_message(message,seuil_frequence=None):
    frequences=freq.get_letter_frequencies(message)
    code=["0"]*len(message)
    traductions=dict()
    for i in range(0,len(message)):
        l=message[i]
        if l in frequences.keys():
            c=decrypt_lettre(frequences[l],seuil_frequence)
            if c is not None:
                code[i]=c
            traductions[l]=c
    separateur=""
    return separateur.join(code),traductions

def lettre_en_commun(mots):   #mots est une liste de mots
    commun=[]
    for i in range(0,len(mots[0])):
        lettre=mots[0][i]
        for mot in mots:
            if i>=len(mot) or mot[i]!=lettre:
                lettre=None
                break
        if lettre is not None:
            commun.append((lettre,i))
    return commun

def comparaison(m1,m2):
    cpt=0
    for i in range(0,min(len(m1),len(m2))):
        if m1[i]==m2[i]:
            cpt+=1
            # print("lettre",m1[i],"position",i)
        else:
            #pour voir les erreurs
            print(m1[i],m2[i],i)
    return cpt/len(m1)*100,cpt,len(m2)


def crée_clé(message, chiffre):
    """
    Crée une clé de substitution à partir d'un message clair et de son texte chiffré.
    La clé est un dictionnaire : lettre_chiffre -> lettre_claire
    """
    clé = {}
    for m, c in zip(message, chiffre):
        if m in alphabet and c in alphabet:
            clé[c] = m
    return clé

def comparaison_clé(clé1, clé2):
    """
    Compare deux clés de substitution (dictionnaires).
    Retourne le nombre de correspondances exactes.
    """
    count = 0
    liste=[]
    for k in clé1:
        if k in clé2 and clé1[k] == clé2[k]:
            count += 1
            liste.append((k,clé1[k]))
    return count, liste

pdf_path = "miserables.pdf"
text = freq.extract_text_from_pdf(pdf_path)
