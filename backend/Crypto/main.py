import decrypt as decrypt
import frequences_lettres as freq
import cesar
import random
import string
import dict_search
import mapping

alphabet = string.ascii_lowercase + ' ' + ',' + '.'
N_ITERATIONS = 1

freq_francais = freq.get_letter_frequencies(freq.extract_text_from_pdf("miserables.pdf"))
freq_combination = freq.get_combination_frequencies(freq.extract_text_from_pdf("miserables.pdf"))
combinaisons_frequentes = {k: v for k, v in freq_combination.items() if v > 0.8}
chemin_dictionnaire = "dict.txt"


def main(message_cesar):
    frequences = freq.get_letter_frequencies(message_cesar)
    traduction = {}
    score = fonction_score(message_cesar,traduction)
    #clé avec fonction decrypt message pour un premier score
    code, traduction = decrypt.decrypt_message(message)
    print(code, traduction)
    for i in range(N_ITERATIONS):
        pass
        
    



    return code, traduction



m="Le chiffre des francs macons est une substitution simple, ou chaque lettre de l alphabet est remplacee par un symbole geometrique. Ce symbole pourrait en principe etre arbitraire ce qui caracterise le chiffre des francs macons et ses variantes c est l utilisation d un moyen mnemotechnique geometrique pour attacher a chaque lettre son symbole. "
m2 = cesar.cesar_encrypt(m.lower(), 3)
code, traductions = main(m2)
code, traduction= main(m2)
print("Code:", code)
print("Traductions:", traductions)
print("comparaison:", decrypt.comparaison(code, m))