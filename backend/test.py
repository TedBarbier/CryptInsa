import cryptage.main as main
import cryptage.cesar as cesar
import cryptage.decrypt as decrypt



storedclear="elle ne trouve de reconfort que dans les lettres ecrites a son frere, porte disparu, qu elle glisse sous sa garde robe et qui disparaissent mysterieusement. lorsqu elle recoit des reponses anonymes, elle y repond, sans savoir que leur auteur n est autre que son plus grand rival. alors qu un lien indefectible se noue entre eux, iris accepte une mission au front en tant que correspondante. dans un pays ou les humains ne sont que les pions de puissances divines, iris et roman se font la promesse de continuer a s ecrire. mais, confrontes aux horreurs de la guerre, leur avenir sera de plus en plus incertain." 
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