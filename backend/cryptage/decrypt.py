from collections import Counter, defaultdict
import cryptage.frequences_lettres as freq
import string
import cryptage.cesar as cesar
import json
# Fréquence des lettres en français (environ)
freq_francais = freq.get_letter_frequencies(freq.extract_text_from_pdf("cryptage/miserables.pdf"))

freq_combination_francais = freq.get_combination_frequencies(freq.extract_text_from_pdf("cryptage/miserables.pdf"))

combinaisons= freq.get_combination_frequencies(freq.extract_text_from_pdf("cryptage/miserables.pdf"))
combinaison_frequentes = {k: v for k, v in combinaisons.items() if v > 0.8}

N_ITERATIONS=50

alphabet = string.ascii_lowercase + ' ' + ',' + '.'


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

pdf_path = "cryptage/miserables.pdf"
text = freq.extract_text_from_pdf(pdf_path)
