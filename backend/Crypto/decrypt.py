from collections import Counter
import frequences_lettres as freq
import string
import cesar
import random
import dict_search as dict_search
import mapping
# Fréquence des lettres en français (environ)
freq_francais = freq.get_letter_frequencies(freq.extract_text_from_pdf("miserables.pdf"))

freq_combination_francais = freq.get_combination_frequencies(freq.extract_text_from_pdf("miserables.pdf"))

combinaisons= freq.get_combination_frequencies(freq.extract_text_from_pdf("miserables.pdf"))
combinaison_frequentes = {k: v for k, v in combinaisons.items() if v > 0.8}

N_ITERATIONS=50

alphabet = string.ascii_lowercase + ' ' + ',' + '.'

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

def decrypt_lettre_combinaison(frequence_combi,combinaison):
    min_diff=1000
    
    for l,f in combinaison.items():
        if abs(frequence_combi-f)<min_diff:
            min_diff=abs(frequence_combi-f)
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

def swap_letters(key):
    new_key = key.copy()
    l1, l2 = random.sample(list(new_key.keys()), 2)
    new_key[l1], new_key[l2] = new_key[l2], new_key[l1]
    return new_key

def message_from_key(message, traduction): #message apres cesar
    new_message = ""
    for char in message:
        if char in traduction.keys() and traduction[char] is not None:
            new_message += traduction[char]
        else:
            new_message += char
    return new_message
    

def find_score(message, key):  # message juste après cesar et key = traduction
    score=0
    frequence=freq.get_letter_frequencies(message)
    for i in range(0,len(message)):
        if message[i] in key.keys():
            if 0.9<abs(freq_francais[message[i]]/frequence[message[i]]) < 1.1 or freq_francais[message[i]]>10:
                score+=50
            else:
                score+=1
    for i in range(0,len(message)-1):
        if message[i:i+2] in freq_combination_francais.keys():
            score+=freq_combination_francais[message[i:i+2]]
    # for mot in message.split():
    #     if dict_search.is_in_dict(mot,"dict.txt"):
    #         score += len(mot) * 100
    return score/len(message)*100

def find_score_lettre(l, t, traductions, freqs_message, freqs_combi_message):
    """
    Calcule le score d'une lettre en utilisant les fréquences pré-calculées.
    """
    score_combi = 0
    cpt = 0
    
    # On filtre les combinaisons pertinentes une seule fois
    combinaisons_pertinentes = {k: v for k, v in freqs_combi_message.items() if v > 0.003} # Seuil ajusté
    
    for combi in combinaisons_pertinentes:
        if l in combi and combi[0] in traductions and combi[1] in traductions:
            c1 = traductions[combi[0]]
            c2 = traductions[combi[1]]
            trad_combi = c1 + c2
            if trad_combi in freq_combination_francais:
                score_combi += freq_combination_francais[trad_combi]
                cpt += 1

    if cpt > 0:
        score_combi = (score_combi / cpt) / 4 # Normalisation
    
    # Score basé sur la fréquence de la lettre
    # On évite la division par zéro si la fréquence est nulle.
    freq_ref = freq_francais.get(t, 0)
    p = 1 - (abs(freqs_message.get(l, 0) - freq_ref) / 19) # 19 est une constante magique, peut-être à revoir
    
    # Pondération des deux scores
    score_final = 0.4 * p + 0.6 * score_combi
    return score_final

def message_initiial_with_letter(message, traduction, letter): # letter en char
    new_message = ""
    trad_letter = [k for k, v in traduction.items() if v == letter]
    trad_inverse =[ value for key, value in traduction.items() if key == letter]
    if len(trad_letter) == 0:
        return None
    if len(trad_inverse) == 1:
        for char in message:
            if char in trad_letter:
                new_message += letter
            elif char == letter:
                new_message += trad_inverse[0]
            else:
                new_message += char
    else:
        for char in message:
            if char in trad_letter:
                new_message += letter
            else:
                new_message += char
    return new_message

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


def decrypt_message_with_combination(message):
    code,_=decrypt_message(message,3)
    bien_place=[]
    bien_place=[a for a in code if a!="0" and a not in bien_place]
    for j in range(N_ITERATIONS):

        for i in range(0,len(code)-1):
            if code[i] in bien_place and code[i+1]=="0":
                l=code[i]+message[i+1]
                frequences=freq.get_combi_frequencies_for_a_letter(message, code[i], 0)
                if l in frequences.keys():
                    c=decrypt_lettre_combinaison(frequences[l],frequences)
                    if code[i]==c[0] and c is not None:
                        code = code[:i] + str(c) + code[i+2:]
            if code[i+1] in bien_place and code[i]=="0" :
                l=message[i]+code[i+1]
                frequences_message=freq.get_combi_frequencies_for_a_letter(message, message[i+1], 1)
                fre=freq.get_combination_frequencies(message)
                frequences=freq.get_combi_frequencies_for_a_letter(freq.extract_text_from_pdf(pdf_path), code[i+1], 1)
                c=decrypt_lettre_combinaison(fre[message[i:i+2]],frequences)
                if code[i+1]==c[1] and c is not None:
                    code = code[:i] + str(c) + code[i+2:]
        bien_place=[a for a in code if a!="0" and a not in bien_place]
                    

    # for i in range(0,len(code)-1):
    #     l=code[i:i+2]
    #     if l in frequences.keys():
    #         c=decrypt_lettre_combinaison(frequences[l])
    #         if (code[i]=="0" or code[i]==c[0]) and c is not None:
    #             code = code[:i] + str(c) + code[i+2:]
    separateur=""
    return separateur.join(code),traductions

def check_mot(mot, dico_par_longueur):
    """
    Trouve le mot le plus proche dans le dictionnaire optimisé.
    La recherche est limitée aux mots de longueur similaire.
    """
    longueur_mot = len(mot)
    if longueur_mot == 0:
        return None

    # Définir la plage de recherche (ex: mots de longueur -1, même longueur, et +1)
    longueurs_a_chercher = range(max(1, longueur_mot - 1), longueur_mot + 2)
    
    meilleur_mot = None
    diff_min = len(mot) # La différence maximale est la longueur du mot lui-même

    for l in longueurs_a_chercher:
        if l in dico_par_longueur:
            # On cherche dans un sous-ensemble beaucoup plus petit du dictionnaire
            for mot_dico in dico_par_longueur[l]:
                cpt = abs(longueur_mot - len(mot_dico))
                for i in range(min(longueur_mot, len(mot_dico))):
                    if mot[i] != mot_dico[i]:
                        cpt += 1
                
                if cpt < diff_min:
                    diff_min = cpt
                    meilleur_mot = mot_dico
                    # # Petite optimisation : si le mot est presque parfait, on peut s'arrêter
                    # if diff_min <= 1:
                    #     return meilleur_mot
                        
    return meilleur_mot

def lettre_en_commun_new(mots):   #mots est une liste de mots
    commun=[]
    if len(mots)==1:
        commun=[(mots[i],i) for i in range(len(mots))]
    elif mots==[]:
        return []
    else:
        for i in range(0,len(mots[0])):
            lettre=mots[0][i]
            for mot in mots:
                if i>=len(mot) or mot[i]!=lettre:
                    lettre=None
                    break
            if lettre is not None:
                commun.append((lettre,i))
    return commun

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

def score_mot(mot, dico_par_longueur):
    """
    Calcule le score d'un mot en utilisant le dictionnaire pré-chargé.
    """
    if len(mot) == 0:
        return 0

    mot_proche = check_mot(mot, dico_par_longueur)

    if mot_proche is None:
        return 0

    # Calcul de la similarité (nombre de lettres communes au début)
    distance = 0
    for i in range(min(len(mot), len(mot_proche))):
        if mot[i] == mot_proche[i]:
            distance += 1
    
    return distance / len(mot)

def score_message(traductions, message):
    """
    Fonction principale optimisée.
    """
    # 1. Calculer les fréquences une seule fois
    freqs_lettres_msg = freq.get_letter_frequencies(message)
    freqs_combi_msg = freq.get_combination_frequencies(message)

    # 2. Calculer le score des mots
    liste_mots = message.split(" ")
    if not liste_mots:
        return 0
        
    score_mots_total = 0
    for mot in liste_mots:
        # On passe le dictionnaire pré-chargé
        score_mots_total += score_mot(mot, DICO_OPTIMISE)
    
    score_mots_moyen = score_mots_total / len(liste_mots)
    
    # 3. Calculer le score des lettres
    score_lettres_total = 0
    if not traductions:
        return (1 - score_mots_moyen) * 100

    for lettre_chiffree, lettre_traduite in traductions.items():
        # On passe les fréquences pré-calculées
        score_lettres_total += find_score_lettre(
            lettre_chiffree, lettre_traduite, traductions, freqs_lettres_msg, freqs_combi_msg
        )
    
    score_lettres_moyen = score_lettres_total / len(traductions)

    # 4. Combiner les scores
    # La formule originale était un peu étrange, je la clarifie
    # score = (1 - score_mots_moyen) + score_lettres_moyen
    # Votre formule:
    score = (1 - score_mots_moyen) + score_lettres_moyen/len(traductions) # C'est ce que vous aviez
    # Le score_lettre était déjà divisé par len(traductions), donc je l'enlève ici
    score = (1 - score_mots_moyen) + score_lettres_moyen
    
    return score * 100

def comparaison(m1,m2):
    cpt=0
    for i in range(0,min(len(m1),len(m2))):
        if m1[i]==m2[i]:
            cpt+=1
            # print("lettre",m1[i],"position",i)
    return cpt/len(m1)*100,cpt,len(m2)

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


    
def affiner_combinaison_par_mots(message):
    message_chiffre= cesar.cesar_encrypt(message.lower(), 3)
    message_dechiffre = decrypt_message(message_chiffre)
    freq_combi_cesar=freq.get_combination_frequencies(message_chiffre)
    freq_combi_dechiffre=freq.get_combination_frequencies(message_dechiffre)
    k=0
    f=0
    for i in range(0, len(message_chiffre)-1):
        combi_dechiffre = message_dechiffre[i:i+2]
        combi_cesar = message_chiffre[i:i+2]
        if freq_combi_cesar.get(combi_cesar) != freq_combi_dechiffre.get(combi_dechiffre):
            print("Incohérence de combinaison :", combi_cesar, "->", combi_dechiffre, "fréquence :", freq_combi_cesar.get(combi_cesar), "->", freq_combi_dechiffre.get(combi_dechiffre))
        else:
            k+=1
            

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

def affiner_mapping_par_mots(mots_chiffres, chemin_dictionnaire, mapping_initial, encoding='utf-8'):
    pass


pdf_path = "miserables.pdf"
text = freq.extract_text_from_pdf(pdf_path)
m="le chiffre des francs macons est une substitution simple, ou chaque lettre de l alphabet est remplacee par un symbole geometrique. Ce symbole pourrait en principe etre arbitraire ce qui caracterise le chiffre des francs macons et ses variantes c est l utilisation d un moyen mnemotechnique geometrique pour attacher a chaque lettre son symbole. "
m2=cesar.cesar_encrypt(m.lower(),3)

# code,traductions=decrypt_message(m2)
#  print(comparaison(code,m))

# for l,t in traductions.items(): 
#     s=find_score_lettre(l,t,traductions,m2)
#     print(l,t,s)
# print(m)
# print(m2)
# print(score_message(traductions,m2))
# traductions["x"]="u"
# print(score_message(traductions,m2))