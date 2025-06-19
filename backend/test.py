import cryptage.main as main
import cryptage.cesar as cesar
import cryptage.decrypt as decrypt



storedclear="" 
storedcipher= cesar.cesar_encrypt(storedclear,3)
traduction,traduction_sur,message_split,ponctuation = main.etape1(storedcipher)
print("Message clair:", storedclear)
print("Message chiffré:", storedcipher)
print("Traduction:", traduction)
print("Traduction sur:", traduction_sur)
print("Message split:", message_split)
print("Ponctuation:", ponctuation)
print("résultat")
traduction = main.etape2(traduction,traduction_sur,message_split,ponctuation)
print(traduction)
print(decrypt.message_from_key(storedcipher, traduction))