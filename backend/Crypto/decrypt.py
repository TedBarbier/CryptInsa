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
    if seuil_frequence is not None and frequence < seuil_frequence:
        return None
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
    frequences=freq.get_letter_frequencies(message)
    print("frequences",frequences)
    code=["-1"]*len(message)
    code=["-1"]*len(message)
    for i in range(0,len(message)):
        l=message[i]
        if l in frequences.keys():
            c=decrypt_lettre(frequences[l])
            code[i]=c
    key={}
    for i in range(0,len(message)):
        if code[i]!="-1":
            key[message[i]]=code[i]
    return key

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

def decrypt_message(message):
    message=cesar.cesar_encrypt(message.lower(),3)
    frequences=freq.get_letter_frequencies(message)
    print("frequences",frequences)
    code=["-1"]*len(message)
    for i in range(0,len(message)):
        l=message[i]
        if l in frequences.keys():
            c=decrypt_lettre(frequences[l])
            code[i]=c
    # for l,f in frequences.items():
    #     c=decrypt_lettre(f,chemin_dictionnaire)
    #     code[message.index(l)]=c
    separateur=""
    return separateur.join(code)

def decrypt_message_with_combination(message):
    message=cesar.cesar_encrypt(message.lower(),3)
    frequences=freq.get_combination_frequencies(message)
    print("frequences",frequences)
    code=["-1"]*len(message)
    for i in range(0,len(message)-1):
        l=message[i:i+2]
        if l in frequences.keys():
            c=decrypt_lettre(frequences[l])
            if code[i]=="-1" or code[i]==c[0]:
                code[i]=c
    separateur=""
    return separateur.join(code)

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
# code=decrypt_message(m)
# print("code",code)
# print(comparaison(code,m))
# print(freq_francais)
# print("affiner_combinaison_par_mots", affiner_combinaison_par_mots(m))

code=decrypt_message_with_combination(m)
print("code",code)
print(comparaison(code,m))
# print(freq_francais)
# print("affiner_combinaison_par_mots", affiner_combinaison_par_mots(m))


# meilleur_clef=create_key(m)
# print("cle initiale", meilleur_clef)
# print("longueur cle initiale", len(meilleur_clef))
# meilleur_score=find_score(m, meilleur_clef)
# for i in range(N_ITERATIONS):
#     print("Iteration", i+1)
#     key_test=swap_letters(meilleur_clef)
#     score_test=find_score(text,key_test)
#     if score_test>meilleur_score:
#         print("meilleur score amélioré",score_test)
#         meilleur_score=score_test
#         meilleur_clef=key_test

# print("Meilleure clé trouvée :", meilleur_clef)
# print("Longueur de la clé :", len(meilleur_clef))
# print("Meilleur score :", meilleur_score)
# # Décryptage du message avec la meilleure clé trouvée
# message_dechiffre = ''.join(meilleur_clef.get(c, c) for c in m)
# print("Message déchiffré :", message_dechiffre)
# print(comparaison(message_dechiffre, m))