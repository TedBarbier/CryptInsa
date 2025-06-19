import cryptage.main as main
import cryptage.cesar as cesar
import cryptage.decrypt as decrypt



storedclear1="le titre academique d ingenieur ou l exercice de la profession sont reglementes dans certains pays, a des degres divers." 
storedclear="le chiffre des francs macons est une substitution simple, ou chaque lettre de l alphabet est remplacee par un symbole geometrique. ce symbole pourrait en principe etre arbitraire ce qui caracterise le chiffre des francs macons et ses variantes c est l utilisation d un moyen mnemotechnique geometrique pour attacher a chaque lettre son symbole."

storedcipher= cesar.cesar_encrypt(storedclear,3)
traduction,traduction_sur,message_split,ponctuation = main.etape1(storedcipher)
print("Message clair:", storedclear)
print("Message chiffré:", storedcipher)
print("Traduction:", traduction)
print("Traduction sur:", traduction_sur)
print("Message split:", message_split)
print("Ponctuation:", ponctuation)
print("résultat")
traduction = main.etape2(storedcipher,traduction,traduction_sur,message_split,ponctuation)
print(traduction)
print(decrypt.message_from_key(storedcipher, traduction))