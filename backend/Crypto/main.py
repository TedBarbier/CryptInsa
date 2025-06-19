import decrypt as decrypt
import frequences_lettres as freq
import cesar
import random
import string
import dict_search
import mapping
import json


alphabet = string.ascii_lowercase + ' ' + ',' + '.'
N_ITERATIONS = 2

freq_francais = freq.get_letter_frequencies(freq.extract_text_from_pdf("miserables.pdf"))
freq_combination = freq.get_combination_frequencies(freq.extract_text_from_pdf("miserables.pdf"))
combinaisons_frequentes = {k: v for k, v in freq_combination.items() if v > 0.8}
chemin_dictionnaire = "dict.txt"


import json

def lire_json(nom_fichier='donnees.json'):
    with open(nom_fichier, 'r', encoding='utf-8') as f:
        return json.load(f)
import json

def initialiser_json_vide(nom_fichier='donnees.json'):
    donnees = {
        "texte": "",
        "dictionnaire": {},
        'is_finish':False
    }
    with open(nom_fichier, 'w', encoding='utf-8') as f:
        json.dump(donnees, f, ensure_ascii=False, indent=4)


def enregistrer_en_json(message, dict_val,iteration, nom_fichier='donnees.json'):
    b=iteration>=N_ITERATIONS-1

    donnees = {
        'chiffré':message,
        'dictionnaire': dict_val,
        'is_finish':b
    }
    with open(nom_fichier, 'w', encoding='utf-8') as f:
        json.dump(donnees, f, ensure_ascii=False, indent=4)

initialiser_json_vide()

def main0(message):
    print("start")
    traduction = {}
    _, traduction = decrypt.decrypt_message(message)
    _,traduction_sur = decrypt.decrypt_message(message,10)
    espace_chiffre=[k for k,v in traduction.items() if v==" "][0]
    message_split=message.split(espace_chiffre)
    espace=message[len(message_split[0])]
    ponctuation=mapping.detecter_ponctuation(message,espace)
    traduction[espace]=" "
    traduction[ponctuation['point']]="."
    traduction[ponctuation['virgule']]=","
    traduction_sur[espace]=" "
    traduction_sur[ponctuation['point']]="."
    traduction_sur[ponctuation['virgule']]=","
    for j in range(2):
        for i in range(len(message_split)):
            mot= message_split[i%len(message_split)]
            keys_sur=[k for k,v in traduction_sur.items() if v is not None and k in mot]
            lettre= None
            for char in keys_sur:
                if char in mot:
                    lettre=char
            if keys_sur != []:
                if decrypt.is_mot_sans_point(mot,ponctuation['point']) and decrypt.is_mot_sans_virgule(mot,ponctuation['virgule']):
                    mots_correspondants=mapping.mapping_with_list(keys_sur,traduction_sur,mot,chemin_dictionnaire)
                    # mots_correspondants2=mapping.initial_mapping(traduction[lettre],lettre,mot,chemin_dictionnaire)
                    # print(j, i, mots_correspondants, mots_correspondants2)
                    taille=len(mots_correspondants)
                else:
                    mots_correspondants=mapping.mapping_with_list(keys_sur,traduction_sur,mot[:-1],chemin_dictionnaire)
                    # mots_correspondants2=mapping.initial_mapping(traduction[lettre],lettre,mot[:-1],chemin_dictionnaire)
                    # print(j, i, mots_correspondants, mots_correspondants2)
                    taille=len(mots_correspondants)
            elif decrypt.is_mot_sans_point(mot,ponctuation['point']) and decrypt.is_mot_sans_virgule(mot,ponctuation['virgule']):
                mots_correspondants, taille = dict_search.trouver_mots_correspondants(mot, chemin_dictionnaire)
            else:
                mots_correspondants,taille =dict_search.trouver_mots_correspondants(mot[:-1],chemin_dictionnaire)
            if taille == 1:
                traduction = decrypt.change_traduction_with_word(traduction, mot, mots_correspondants[0])
                traduction_sur = decrypt.change_traduction_with_word(traduction_sur, mot, mots_correspondants[0])
            elif taille > 1:
                lettre_en_commun = decrypt.lettre_en_commun(mots_correspondants)
                if lettre_en_commun != []:
                    for lettre in lettre_en_commun:
                        traduction = decrypt.change_traduction_with_letter(traduction, mot[lettre[1]], lettre[0])
                        traduction_sur = decrypt.change_traduction_with_letter(traduction_sur, mot[lettre[1]], lettre[0])

    lettre_non_trouve=[k for k,v in traduction_sur.items() if v is None]
    lettre_trouve=[v for k,v in traduction_sur.items()]
    print(lettre_trouve, lettre_non_trouve)
    for let in lettre_non_trouve:
        let_trad_list=decrypt.decrypt_lettre_liste((freq.get_letter_frequencies(message)[let]))
        t=0
        for l in let_trad_list:
            if l not in lettre_trouve and t==0:
                traduction[let]=l
                lettre_non_trouve.remove(let)
                t=1
    return traduction


# def main1(message):
#     print("start")
#     traduction = {}
#     _, traduction = decrypt.decrypt_message(message)
#     _,traduction_sur = decrypt.decrypt_message(message,10)
#     message_split = decrypt.message_initiial_with_letter(message, traduction," ").split()
#     espace=message[len(message_split[0])]
#     ponctuation=mapping.detecter_ponctuation(message,espace)
#     traduction[espace]=" "
#     traduction[ponctuation['point']]="."
#     traduction[ponctuation['virgule']]=","
#     traduction_sur[espace]=" "
#     traduction_sur[ponctuation['point']]="."
#     traduction_sur[ponctuation['virgule']]=","
#     for j in range(2):
#         for i in range(len(message_split)):
#             enregistrer_en_json(message,traduction)
#             # donnees = lire_json()
#             # print(json.dumps(donnees, ensure_ascii=False, indent=4))
#             keys_sur=[k for k,v in traduction_sur.items() if v is not None]
#             mot= message_split[i%len(message_split)]
#             lettre= None
#             for char in keys_sur:
#                 if char in mot:
#                     lettre=char
#             if lettre is not None:
#                 if decrypt.is_mot_sans_point(mot,ponctuation['point']) and decrypt.is_mot_sans_virgule(mot,ponctuation['virgule']):
#                     mots_correspondants=mapping.initial_mapping(traduction[lettre],lettre,mot,chemin_dictionnaire)
#                     taille=len(mots_correspondants)
#                 else:
#                     mots_correspondants=mapping.initial_mapping(traduction[lettre],lettre,mot[:-1],chemin_dictionnaire)
#                     taille=len(mots_correspondants)
#             elif decrypt.is_mot_sans_point(mot,ponctuation['point']) and decrypt.is_mot_sans_virgule(mot,ponctuation['virgule']):
#                 mots_correspondants, taille = dict_search.trouver_mots_correspondants(mot, chemin_dictionnaire)
#             else:
#                 mots_correspondants,taille =dict_search.trouver_mots_correspondants(mot[:-1],chemin_dictionnaire)
#             if taille == 1:
#                 print(mots_correspondants)
#                 print("taille == 1 ")
#                 traduction = decrypt.change_traduction_with_word(traduction, mot, mots_correspondants[0])
#                 traduction_sur = decrypt.change_traduction_with_word(traduction_sur, mot, mots_correspondants[0])
#             elif taille > 1:
#                 lettre_en_commun = decrypt.lettre_en_commun(mots_correspondants)
#                 if taille < 10:
#                     print(taille,mots_correspondants, traduction_sur, keys_sur)
#                 if lettre_en_commun != []:
#                     for lettre in lettre_en_commun:
#                         traduction = decrypt.change_traduction_with_letter(traduction, mot[lettre[1]], lettre[0])
#                         traduction_sur = decrypt.change_traduction_with_letter(traduction_sur, mot[lettre[1]], lettre[0])
    # print(traduction_sur)
    # print(decrypt.comparaison_clé(vraie_cle,traduction_sur))
    # lettre_non_trouve=[k for k,v in traduction_sur.items() if v is None]
    # lettre_trouve=[v for k,v in traduction_sur.items()]
    # for let in lettre_non_trouve:
    #     let_trad_list=decrypt.decrypt_lettre_liste((freq.get_letter_frequencies(message)[let]))
    #     t=0
    #     for l in let_trad_list:
    #         if l not in lettre_trouve and t==0:
    #             traduction[let]=l
    #             lettre_non_trouve.remove(let)
    #             t=1
    # return traduction

# def main(message_cesar,m):
#     frequences = freq.get_letter_frequencies(message_cesar)
#     traduction = {}
#     #clé avec fonction decrypt message pour un premier score
#     code, traduction = decrypt.decrypt_message(message_cesar)
#     #score = decrypt.score_message(traduction,message_cesar)
#     print("ok")
#     score,a,b=decrypt.comparaison(code,m)
#     score_max=score
    
#     liste_mots=code.split(" ")
#     liste_temp=[]
#     espace=0
#     for k,l in traduction.items():
#         if l==" ":
#             espace=k
#     liste_initial=message_cesar.split(espace)
#     for i in range(N_ITERATIONS):
#         print(i)
#         temp=traduction.copy()
#         if liste_temp==[]:
#             liste_temp=code.split(" ")
#         mot_chiffre=liste_temp.pop(0)
#         mot_initial=liste_initial[liste_mots.index(mot_chiffre)]
#         l,t=mapping.trouver_mots_correspondants(mot_initial,"dict.txt")

#         #mot_final=decrypt.check_mot(mot_chiffre,l)
#         for mot_final in l:
#             if mot_final is None and l!=[]:
#                 mot_final=l[0]
#             if mot_final is not None:
#                 mot_initial=liste_initial[liste_mots.index(mot_chiffre)]
#                 temp=decrypt.change_traduction_with_word(temp,mot_initial,mot_final)
#                 #changé le code partiel
#                 code_temp=[]
#                 for c in message_cesar:
#                     code_temp.append(temp[c])

#                 code_temp="".join(code_temp)

#                 score = decrypt.score_message(temp,code_temp)
#                 #score,a,b=decrypt.comparaison(code_temp,m)
#                 if score>score_max:
#                     score_max=score
#                     traduction=temp
#                     code=code_temp
#             print("score=",score_max,"mot",mot_final,mot_chiffre)
      
#     return code, traduction


m_1="le chiffre des francs macons est une substitution simple, ou chaque lettre de l alphabet est remplacee par un symbole geometrique. ce symbole pourrait en principe etre arbitraire ce qui caracterise le chiffre des francs macons et ses variantes c est l utilisation d un moyen mnemotechnique geometrique pour attacher a chaque lettre son symbole."
m_autre="elle ne trouve de reconfort que dans les lettres ecrites a son frere, porte disparu, qu elle glisse sous sa garde robe et qui disparaissent mysterieusement. lorsqu elle recoit des reponses anonymes, elle y repond, sans savoir que leur auteur n est autre que son plus grand rival. alors qu un lien indefectible se noue entre eux, iris accepte une mission au front en tant que correspondante. dans un pays ou les humains ne sont que les pions de puissances divines, iris et roman se font la promesse de continuer a s ecrire. mais, confrontes aux horreurs de la guerre, leur avenir sera de plus en plus incertain."

m_0="cette serie policiere est caracterisee par un changement frequent de l equipe et de son inspecteur. l inspecteur de la police britannique richard, plutot pointilleux, est envoye sur l ile, une ile fictive, pour enqueter sur la mort de l inspecteur britannique local."

m2 = cesar.cesar_encrypt(m_autre.lower(), 2)

vraie_cle=decrypt.crée_clé(m_autre,m2)
traduction= main0(m2)
# print("Traductions:", traduction)
# print("vraie trad", vraie_cle)
# print("compar clé", decrypt.comparaison_clé(traduction,vraie_cle))
code=decrypt.message_from_key(m2,traduction)
# print("score:", decrypt.comparaison(m_autre,code))
# test=decrypt.decrypt_message(m2)
print("score:", decrypt.comparaison(m_autre,code))
print(code)

# print(m2)
# print(code)
# print(m_autre)


