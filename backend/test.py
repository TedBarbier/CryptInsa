import Crypto.main as main


storedcipher= "Portez ce vieux whisky au juge blond qui fume dans l’exquise brume d’un matin froid, tandis que vingt lynx chassent bravement le zebre goguenard a travers champs."
traduction,traduction_sur,message_split,ponctuation = main.etape1(storedcipher)
print("Traduction:", traduction)
print("Traduction sur:", traduction_sur)
print("Message split:", message_split)
print("Ponctuation:", ponctuation)
print(main.etape2(traduction,traduction_sur,message_split,ponctuation))