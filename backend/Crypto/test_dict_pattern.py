import json

# Charger le fichier généré
with open("dict_patterns.json", "r", encoding="utf-8") as f:
    mots_analytiques = json.load(f)

# Pattern cible
pattern_recherche = "12343"

# Filtrer les mots correspondant
resultats = [mot["mot"] for mot in mots_analytiques if mot["isomorphique"] == pattern_recherche]

# Affichage
print(f"Mots avec le pattern {pattern_recherche} :")
for mot in resultats:
    print(mot)

