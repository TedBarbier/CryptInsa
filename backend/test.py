import Crypto.main as main
import app

storecypher=""



message="le chiffrement ou cryptage est un procede de cryptographie grace auquel on souhaite rendre la comprehension d un document impossible a toute personne qui n a pas la cle de chiffrement. ce principe est generalement lie au principe d acces conditionnel."

def call_substitution_attack():
    # Cette fonction est appelée dans un thread séparé pour l'attaque par substitution
    # Vous pouvez implémenter la logique de l'attaque ici
    storedcipher= main.cesar.cesar_encrypt(message,3)
    traduction,traduction_sur,message_split,ponctuation = main.etape1(storedcipher)
    main.etape2(traduction,traduction_sur,message_split,ponctuation)

call_substitution_attack()