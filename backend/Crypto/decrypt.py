from collections import Counter
import frequences_lettres as freq
import string
import cesar
import random
import dict_search as dict_search
# Fréquence des lettres en français (environ)
freq_francais = freq.get_letter_frequencies(freq.extract_text_from_pdf("miserables.pdf"))

freq_combination_francais = freq.get_combination_frequencies(freq.extract_text_from_pdf("miserables.pdf"))


N_ITERATIONS=50

alphabet = string.ascii_lowercase + ' ' + ',' + '.'

def frequences_lettres(texte):
    texte = ''.join(filter(lambda c: c in string.ascii_letters, texte.lower()))
    compteur = Counter(texte)
    total = sum(compteur.values())
    return {lettre: (count / total) * 100 for lettre, count in compteur.items()} if total > 0 else {}

def decrypt_lettre(frequence,seuil_frequence=None):
    
    min_diff=1000
    
    for l,f in freq_francais.items():
        if abs(frequence-f)<min_diff:
            min_diff=abs(frequence-f)
            decode=l
    return decode

def decrypt_lettre_combinaison(frequence):
    min_diff=1000
    
    for l,f in freq_combination_francais.items():
        if abs(frequence-f)<min_diff:
            min_diff=abs(frequence-f)
            decode=l
    return decode

def create_key(message):
    message=cesar.cesar_encrypt(message.lower(),3)



def swap_letters(key):
    new_key = key.copy()
    l1, l2 = random.sample(list(new_key.keys()), 2)
    new_key[l1], new_key[l2] = new_key[l2], new_key[l1]
    return new_key

def find_score(message, key):
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

def find_score_lettre(l,t,traductions,message):
    score=0
    cpt=0
    frequences=freq.get_letter_frequencies(message)

    combi_freq= freq.get_combination_frequencies(message)
    combinaisons = {k: v for k, v in combi_freq.items() if v > 0.3}
    for combi in combinaisons.keys():
        if combi[0] in traductions.keys() and combi[1] in traductions.keys() and l in combi:
            c1=traductions[combi[0]]
            c2=traductions[combi[1]]
            trad_combi=c1+c2
            f=freq_combination_francais[trad_combi]
            score+=f
            cpt+=1
    if cpt!=0:
        score=(score/cpt)/4
    p=1-(abs(frequences[l]-freq_francais[t]))/19
    score=0.3*p+0.7*score
    return score

def decrypt_message(message):
    frequences=freq.get_letter_frequencies(message)
    print("frequences",frequences)
    code=["-1"]*len(message)
    traductions=dict()
    for i in range(0,len(message)):
        l=message[i]
        if l in frequences.keys():
            c=decrypt_lettre(frequences[l])
            code[i]=c
            traductions[l]=c
    separateur=""
    print(traductions.keys())
    return separateur.join(code),traductions


def decrypt_message_with_combination(message):
    message=cesar.cesar_encrypt(message.lower(),3)
    frequences=freq.get_combination_frequencies(message)
    #print("frequences",frequences)
    code=["-1"]*len(message)
    traductions=dict()
    for i in range(0,len(message)-1):
        l=message[i:i+2]
        if l in frequences.keys():
            c=decrypt_lettre(frequences[l])
            if code[i]=="-1" or code[i]==c[0]:
                code[i]=c
                traductions[l]=c
    separateur=""
    return separateur.join(code),traductions

def check_mot(mot):
    # Ouvrir le fichier en lecture
    with open("dict.txt", "r", encoding="utf-8") as f:
        contenu = f.read()

        # Séparer le contenu en mots
        liste_mots = contenu.split()

        diff=max(len(mot)-4,1)
        result=None
        for m in liste_mots:
            cpt=abs(len(m)-len(mot))
            for i in range(0,min(len(mot),len(m))):
                if m[i]!=mot[i]:
                    cpt+=1
            if cpt<=diff:
                diff=cpt
                result=m
        return result

def comparaison(m1,m2):
    cpt=0
    for i in range(0,min(len(m1),len(m2))):
        if m1[i]==m2[i]:
            cpt+=1
            print("lettre",m1[i],"position",i)
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
    print("message_chiffre", message_chiffre)
    message_dechiffre = decrypt_message(message_chiffre)
    print("message_dechiffre", message_dechiffre)
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
    print(k)
            

    

def affiner_mapping_par_mots(mots_chiffres, chemin_dictionnaire, mapping_initial, encoding='utf-8'):
    pass


pdf_path = "miserables.pdf"
text = freq.extract_text_from_pdf(pdf_path)
m="Le chiffre des francs macons est une substitution simple, ou chaque lettre de l alphabet est remplacee par un symbole geometrique. Ce symbole pourrait en principe etre arbitraire ce qui caracterise le chiffre des francs macons et ses variantes c est l utilisation d un moyen mnemotechnique geometrique pour attacher a chaque lettre son symbole. "
m2=cesar.cesar_encrypt(m.lower(),3)

code,traductions=decrypt_message(m2)

tabc=code.split(" ")
print(comparaison(code,m))

# for l,t in traductions.items(): 
#     s=find_score_lettre(l,t,traductions,m2)
#     print(l,t,s)
# print(m)
# print(m2)