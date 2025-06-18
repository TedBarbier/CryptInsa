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


m="Le chiffre des francs macons est une substitution simple, ou chaque lettre de l alphabet est remplacee par un symbole geometrique. Ce symbole pourrait en principe etre arbitraire ce qui caracterise le chiffre des francs macons et ses variantes c est l utilisation d un moyen mnemotechnique geometrique pour attacher a chaque lettre son symbole. "
m2 = cesar.cesar_encrypt(m.lower(), 3)
vraie_cle=decrypt.crée_clé(m,m2)
traduction= main(m2)
print("Traductions:", traduction)
print("compar clé", decrypt.comparaison_clé(traduction,vraie_cle))
code=decrypt.message_from_key(m2,traduction)
print("comparaison:", decrypt.comparaison(code, m))