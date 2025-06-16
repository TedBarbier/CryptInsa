from collections import Counter
import frequences_lettres as freq
import string
import cesar

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

def decrypt_lettre(frequence, chemin_dictionnaire):
    
    min_diff=1000
    
    for l,f in chemin_dictionnaire.items():
        if abs(frequence-f)<min_diff:
            min_diff=abs(frequence-f)
            decode=l
    return decode

def decrypt_message(message,pdf_path):
    message=message.lower()
    frequences=freq.get_letter_frequencies(message)
    text = freq.extract_text_from_pdf(pdf_path)
    chemin_dictionnaire= freq.get_letter_frequencies(text)
    code=["-1"]*len(message)
    for i in range(0,len(message)):
        l=message[i]
        if l in frequences.keys():
            c=decrypt_lettre(frequences[l],chemin_dictionnaire)
            code[i]=c
    # for l,f in frequences.items():
    #     c=decrypt_lettre(f,chemin_dictionnaire)
    #     code[message.index(l)]=c
    separateur=""
    return separateur.join(code)

def comparaison(m1,m2):
    cpt=0
    for i in range(0,min(len(m1),len(m2))):
        if m1[i]==m2[i]:
            cpt+=1
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

def check_mot(mot,liste_mot):
    diff=max(len(mot)-4,1)
    result=None
    for m in liste_mot:
        cpt=abs(len(m)-len(mot))
        for i in range(0,min(len(mot),len(m))):
            if m[i]!=mot[i]:
                cpt+=1
        if cpt<=diff:
            diff=cpt
            result=m
    return result

    

def affiner_mapping_par_mots(mots_chiffres, chemin_dictionnaire, mapping_initial, encoding='utf-8'):
    pass


pdf_path = "miserables.pdf"
text = freq.extract_text_from_pdf(pdf_path)
letter_freq= freq.get_letter_frequencies(text)
m="Le chiffre des francs macons est une substitution simple, ou chaque lettre de l alphabet est remplacee par un symbole geometrique. Ce symbole pourrait en principe etre arbitraire ce qui caracterise le chiffre des francs macons et ses variantes c est l utilisation d un moyen mnemotechnique geometrique pour attacher a chaque lettre son symbole. "
m2=cesar.cesar_encrypt(m.lower(),3)
code=decrypt_message(m2,"miserables.pdf")
print(code)
tabc=code.split(" ")
tabm=m.split(" ")
print(tabc)
print(tabm)
print(comparaison(code,m))
for mot in tabc:
    result=check_mot(mot,tabm)
    if result==tabm[tabc.index(mot)]:
        print("trouvé")
