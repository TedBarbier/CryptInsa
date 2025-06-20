import cryptage.decrypt as decrypt
import cryptage.mapping as mapping
import json
import os

chemin_dictionnaire = "cryptage/dict.txt"
json_file = "cryptage/donnees.json"

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
    print("start 1")
    traduction = {}
    _, traduction = decrypt.decrypt_message(message)
    _,traduction_sur = decrypt.decrypt_message(message,10)
    espace,e=decrypt.make_traduction_sur(message)
    # traduction_sur[espace[0]]=' '
    # traduction[espace[0]]=' '
    # traduction_sur[e[0]]='e'
    # traduction[e[0]]='e'
    message_split=message.split(espace[0])
    ponctuation=mapping.detecter_ponctuation(message,espace[0])
    if ponctuation['point'] is not None:
        traduction[ponctuation['point']]="."
        traduction_sur[ponctuation['point']]="."
    if ponctuation['virgule'] is not None:
        traduction[ponctuation['virgule']]=","
        traduction_sur[ponctuation['virgule']]=","

    #Étape 1 : Enregistrement initial
    save_to_json(mot_chiffre="initial", mot_traduit="initial", dictionnaire=traduction_sur)

    return traduction, traduction_sur, message_split, ponctuation

def etape2(message,traduction,traduction_sur,message_split,ponctuation):
    print("start 2")
    traduction_test=traduction_sur.copy()
    for j in range(2):
        print(j)
        if j==1:
            print(traduction_sur) 
            print(j)
            if traduction_test==traduction_sur:
                espace,e=decrypt.make_traduction_sur(message)
                traduction_sur[espace[0]]=' '
                traduction_sur[e[0]]='e'
                j=0
                espace_key=[k for k,v in traduction_sur.items() if v==' ']
                e_key=[k for k,v in traduction_sur.items() if v=='e']
                traduction_sur[espace_key[0]]='e'
                traduction_sur[e_key[0]]=' '
                message_split=message.split(e_key[0])
        for i in range(len(message_split)):
            mot = message_split[i % len(message_split)]
            keys_sur = [k for k,v in traduction_sur.items() if v is not None and k in mot]
            lettre = None
            for char in keys_sur:
                if char in mot:
                    lettre=char
            if keys_sur != []:
                if decrypt.is_mot_sans_point(mot,ponctuation['point']) and decrypt.is_mot_sans_virgule(mot,ponctuation['virgule']):
                    mots_correspondants=mapping.mapping_with_list(keys_sur,traduction_sur,mot)
                    taille=len(mots_correspondants)
                else:
                    mots_correspondants=mapping.mapping_with_list(keys_sur,traduction_sur,mot[:-1])
                    taille=len(mots_correspondants)
            
            elif decrypt.is_mot_sans_point(mot,ponctuation['point']) and decrypt.is_mot_sans_virgule(mot,ponctuation['virgule']):
                mots_correspondants, taille = mapping.trouver_mots_correspondants(mot)
            else:
                mots_correspondants, taille = mapping.trouver_mots_correspondants(mot[:-1])
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
    
    # liste_mots=message.split(" ")
    # for i in range(0,len(liste_mots)):
    #     nouveau_mot=decrypt.check_mot(liste_mots[i],decrypt.dico_par_longueur)
    #     liste_mots[i]=nouveau_mot

    # message="".join(liste_mots)
    save_to_json("final", "final", traduction)
    return traduction