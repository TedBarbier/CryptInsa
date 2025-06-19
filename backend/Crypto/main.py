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
    return traduction

import json
import os

json_file = "donnees.json"

def save_to_json(mot_chiffre, mot_traduit, dictionnaire):
    data = {
        "mot_chiffre": mot_chiffre,
        "mot_traduit": mot_traduit,
        "dictionnaire": dictionnaire.copy()
    }
    # Créer le fichier s'il n'existe pas
    if not os.path.exists(json_file):
        with open(json_file, 'w') as f:
            json.dump([], f)

    # Ajouter au fichier
    with open(json_file, 'r+') as f:
        contenu = json.load(f)
        contenu.append(data)
        f.seek(0)
        json.dump(contenu, f, indent=2)

def etape1(message):
    with open(json_file, 'w') as f:
        json.dump([], f)
    traduction = {}
    _, traduction = decrypt.decrypt_message(message)
    _, traduction_sur = decrypt.decrypt_message(message,10)
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

    #Étape 1 : Enregistrement initial
    save_to_json(mot_chiffre="initial", mot_traduit="initial", dictionnaire=traduction_sur)

    return traduction, traduction_sur, message_split, ponctuation

def etape2(traduction, traduction_sur, message_split, ponctuation):
    for j in range(2):
        for i in range(len(message_split)):
            mot = message_split[i % len(message_split)]
            keys_sur = [k for k,v in traduction_sur.items() if v is not None and k in mot]
            lettre = None
            for char in keys_sur:
                if char in mot:
                    lettre = char
            if keys_sur:
                if decrypt.is_mot_sans_point(mot, ponctuation['point']) and decrypt.is_mot_sans_virgule(mot, ponctuation['virgule']):
                    mots_correspondants = mapping.mapping_with_list(keys_sur, traduction_sur, mot, chemin_dictionnaire)
                    taille = len(mots_correspondants)
                else:
                    mots_correspondants = mapping.mapping_with_list(keys_sur, traduction_sur, mot[:-1], chemin_dictionnaire)
                    taille = len(mots_correspondants)
            elif decrypt.is_mot_sans_point(mot, ponctuation['point']) and decrypt.is_mot_sans_virgule(mot, ponctuation['virgule']):
                mots_correspondants, taille = dict_search.trouver_mots_correspondants(mot, chemin_dictionnaire)
            else:
                mots_correspondants, taille = dict_search.trouver_mots_correspondants(mot[:-1], chemin_dictionnaire)
            traduction_sur_ref = traduction_sur.copy()
            if taille == 1:
                mot_traduit = mots_correspondants[0]
                traduction = decrypt.change_traduction_with_word(traduction, mot, mot_traduit)
                traduction_sur = decrypt.change_traduction_with_word(traduction_sur, mot, mot_traduit)
                if traduction_sur_ref != traduction_sur:
                    # Sauvegarde pour un mot trouvé
                    save_to_json(mot_chiffre=mot, mot_traduit=mot_traduit, dictionnaire=traduction_sur)
            elif taille > 1:
                lettre_en_commun = decrypt.lettre_en_commun(mots_correspondants)
                if lettre_en_commun:
                    for lettre in lettre_en_commun:
                        traduction = decrypt.change_traduction_with_letter(traduction, mot[lettre[1]], lettre[0])
                        traduction_sur = decrypt.change_traduction_with_letter(traduction_sur, mot[lettre[1]], lettre[0])
                    if traduction_sur_ref != traduction_sur:
                        # Sauvegarde même s’il n’y a pas de mot unique
                        save_to_json(mot_chiffre=mot, mot_traduit=None, dictionnaire=traduction_sur)
    save_to_json("final", "final", traduction)
    return traduction


# m_1="le chiffre des francs macons est une substitution simple, ou chaque lettre de l alphabet est remplacee par un symbole geometrique. ce symbole pourrait en principe etre arbitraire ce qui caracterise le chiffre des francs macons et ses variantes c est l utilisation d un moyen mnemotechnique geometrique pour attacher a chaque lettre son symbole."
# m_autre="elle ne trouve de reconfort que dans les lettres ecrites a son frere, porte disparu, qu elle glisse sous sa garde robe et qui disparaissent mysterieusement. lorsqu elle recoit des reponses anonymes, elle y repond, sans savoir que leur auteur n est autre que son plus grand rival. alors qu un lien indefectible se noue entre eux, iris accepte une mission au front en tant que correspondante. dans un pays ou les humains ne sont que les pions de puissances divines, iris et roman se font la promesse de continuer a s ecrire. mais, confrontes aux horreurs de la guerre, leur avenir sera de plus en plus incertain."

# m_0="cette serie policiere est caracterisee par un changement frequent de l equipe et de son inspecteur. l inspecteur de la police britannique richard, plutot pointilleux, est envoye sur l ile, une ile fictive, pour enqueter sur la mort de l inspecteur britannique local."

# m2 = cesar.cesar_encrypt(m_autre.lower(), 2)

# vraie_cle=decrypt.crée_clé(m_autre,m2)
# traductions= main_test(m2)
# code=decrypt.message_from_key(m2,traductions)
# print("score:", decrypt.comparaison(m_autre,code))
# print(code)
