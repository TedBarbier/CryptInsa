import decrypt as decrypt
import frequences_lettres as freq
import cesar
import random
import string
import dict_search
import mapping

alphabet = string.ascii_lowercase + ' ' + ',' + '.'
N_ITERATIONS = 50

freq_francais = freq.get_letter_frequencies(freq.extract_text_from_pdf("miserables.pdf"))
freq_combination = freq.get_combination_frequencies(freq.extract_text_from_pdf("miserables.pdf"))
combinaisons_frequentes = {k: v for k, v in freq_combination.items() if v > 0.8}
chemin_dictionnaire = "dict.txt"


def main(message):
    traduction = {}
    code, traduction = decrypt.decrypt_message(message)
    _,traduction_sur = decrypt.decrypt_message(message,10)
    max_score = decrypt.score_message(traduction,message)
    i=0
    message_split = decrypt.message_initiial_with_letter(message, traduction," ").split()
    espace=message[len(message_split[0])+1]
    traduction[espace]=" "
    for i in range(N_ITERATIONS):
        mot= message_split[i%len(message_split)]
        if decrypt.is_mot_sans_point(mot,) and decrypt.is_mot_sans_virgule(mot,):
            mots_correspondants, taille = dict_search.trouver_mots_correspondants(mot, chemin_dictionnaire)
        else:
            mots_correspondants,taille =dict_search.trouver_mots_correspondants(mot[:-1],chemin_dictionnaire)
        if taille == 1:
            temp_traduction = traduction.copy()
            temp_traduction = decrypt.change_traduction_with_word(temp_traduction, mot, mots_correspondants[0])
        elif taille > 1:
            lettre_en_commun = decrypt.lettre_en_commun(mots_correspondants)
            temp_traduction = traduction.copy()
            if lettre_en_commun != []:
                for lettre in lettre_en_commun:
                    temp_traduction = decrypt.change_traduction_with_letter(temp_traduction, mot[lettre[1]], lettre[0])
                traduction = temp_traduction
                
    return traduction
def main(message_cesar,m):
    frequences = freq.get_letter_frequencies(message_cesar)
    traduction = {}
    #clé avec fonction decrypt message pour un premier score
    code, traduction = decrypt.decrypt_message(message_cesar)
    #score = decrypt.score_message(traduction,message_cesar)
    print("ok")
    score,a,b=decrypt.comparaison(code,m)
    score_max=score
    
    liste_mots=code.split(" ")
    liste_temp=[]
    espace=0
    for k,l in traduction.items():
        if l==" ":
            espace=k
    liste_initial=message_cesar.split(espace)
    for i in range(N_ITERATIONS):
        print(i)
        temp=traduction.copy()
        if liste_temp==[]:
            liste_temp=code.split(" ")
        mot_chiffre=liste_temp.pop(0)
        mot_initial=liste_initial[liste_mots.index(mot_chiffre)]
        l,t=mapping.trouver_mots_correspondants(mot_initial,"dict.txt")

        #mot_final=decrypt.check_mot(mot_chiffre,l)
        for mot_final in l:
            if mot_final is None and l!=[]:
                mot_final=l[0]
            if mot_final is not None:
                mot_initial=liste_initial[liste_mots.index(mot_chiffre)]
                temp=decrypt.change_traduction_with_word(temp,mot_initial,mot_final)
                #changé le code partiel
                code_temp=[]
                for c in message_cesar:
                    code_temp.append(temp[c])

                code_temp="".join(code_temp)

                score = decrypt.score_message(temp,code_temp)
                #score,a,b=decrypt.comparaison(code_temp,m)
                if score>score_max:
                    score_max=score
                    traduction=temp
                    code=code_temp
            print("score=",score_max,"mot",mot_final,mot_chiffre)
      
    return code, traduction


def main2(message_cesar,m):
    frequences = freq.get_letter_frequencies(message_cesar)
    traduction = {}
    #clé avec fonction decrypt message pour un premier score
    code, traduction = decrypt.decrypt_message(message_cesar)
    score = decrypt.score_message(traduction,code)
    #score,a,b=decrypt.comparaison(code,m)
    score_max=score
    
    liste_mots=code.split(" ")
    liste_temp=[]
    espace=0
    for k,l in traduction.items():
        if l==" ":
            espace=k
    liste_initial=message_cesar.split(espace)
    for i in range(N_ITERATIONS):
        temp=traduction.copy()
        if liste_temp==[]:
            liste_temp=code.split(" ")
        mot_chiffre=liste_temp.pop(0)
        mot_initial=liste_initial[liste_mots.index(mot_chiffre)]
        l,t=mapping.trouver_mots_correspondants(mot_initial,"dict.txt")

        mot_final=decrypt.check_mot(mot_chiffre,l)
        if mot_final is None and l!=[]:
            mot_final=l[0]
        if mot_final is not None:
            mot_initial=liste_initial[liste_mots.index(mot_chiffre)]
            temp=decrypt.change_traduction_with_word(temp,mot_initial,mot_final)
            #changé le code partiel
            code_temp=[]
            
            for c in message_cesar:
                code_temp.append(temp[c])

            code_temp="".join(code_temp)
            print(code_temp)
            score = decrypt.score_message(temp,code_temp)
            #score,a,b=decrypt.comparaison(code_temp,m)
            if score>score_max:
                print("ok")
                score_max=score
                traduction=temp
                code=code_temp
        print("score=",score_max,"mot",mot_final,mot_chiffre)
      
    return code, traduction




m="Le chiffre des francs macons est une substitution simple, ou chaque lettre de l alphabet est remplacee par un symbole geometrique. Ce symbole pourrait en principe etre arbitraire ce qui caracterise le chiffre des francs macons et ses variantes c est l utilisation d un moyen mnemotechnique geometrique pour attacher a chaque lettre son symbole. "
m2 = cesar.cesar_encrypt(m.lower(), 3)
vraie_cle=decrypt.crée_clé(m,m2)
traduction= main(m2)
print("Traductions:", traduction)
print("compar clé", decrypt.comparaison_clé(traduction,vraie_cle))
code=decrypt.message_from_key(m2,traduction)
print(m2)
code, traductions = main2(m2,m)
code_temp=[]
#traductions["x"]="u"
traductions["a"]="A"
#print("***************************************************************************",temp,"***************************************************************************")
# for c in m2:

#     #print(c,temp[c])
#     a=traductions[c]
#     print(a)
#     code_temp.append(a)
    
# #code_temp="".join(code)
# print("*********************",code_temp,"******************************")

print("Code:", code)
print("Traductions:", traductions)
print("comparaison:", decrypt.comparaison(code, m))