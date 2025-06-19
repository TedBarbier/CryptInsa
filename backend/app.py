from flask import Flask, request, jsonify
from flask_cors import CORS # type: ignore
from collections import Counter
import string
from Crypto.cesar import *
from Crypto.vigenere import *
import json
import threading
from flask import make_response
import Crypto.main as main 

app = Flask(__name__)
CORS(app)  # autorise les requêtes depuis le frontend
analyse_started = False
storedcipher = ""
def analyze_frequencies(text):
    filtered = [c.upper() for c in text if c.upper() in string.ascii_uppercase]
    freq = Counter(filtered)
    total = sum(freq.values())
    return {char: round(count / total, 4) for char, count in freq.items()}

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    message = data.get('message', '')
    frequencies = analyze_frequencies(message)
    return jsonify(frequencies)


@app.route('/cesar', methods=['POST'])
def route_cesar():
    data = request.get_json()
    message = data.get('message', '').lower().replace('\n', ' ')
    result = cesar_encrypt(message, int(data.get('shift', 3)))
    response = {"encrypted" : result}
    # Retourne une réponse standardisée
    return jsonify(response)

@app.route('/cesar/decrypt', methods=['POST'])
def route_cesar_decrypt():
    data = request.get_json()
    message = data.get('message', '').lower().replace('\n', ' ')
    result = cesar_decrypt(message, int(data.get('shift', 3)))
    response = {"decrypted" : result}
    # Retourne une réponse standardisée
    return jsonify(response)

@app.route('/vigenere', methods=['POST'])
def route_vigenere():
    data = request.get_json()
    message = data.get('message', '').lower().replace('\n', ' ')
    key = data.get('key', '').lower().replace('\n', ' ')
    result = vigenere_encrypt(message, key)
    response = {"encrypted": result}
    # Retourne une réponse standardisée
    return jsonify(response)

@app.route('/vigenere/decrypt', methods=['POST'])
def route_vigenere_decrypt():
    data = request.get_json()
    message = data.get('message', '').lower().replace('\n', ' ')
    key = data.get('key', '').lower().replace('\n', ' ')
    result = vigenere_decrypt(message, key)
    response = {"decrypted": result}
    # Retourne une réponse standardisée
    return jsonify(response)


def call_substitution_attack():
    # Cette fonction est appelée dans un thread séparé pour l'attaque par substitution
    # Vous pouvez implémenter la logique de l'attaque ici
    global storedcipher
    traduction,traduction_sur,message_split,ponctuation = main.etape1(storedcipher)
    main.etape2(traduction,traduction_sur,message_split,ponctuation)


@app.route('/update_attack', methods=['POST'])
def route_update_attack():
    def read_donnees_json():
        try:
            with open('Crypto/donnees.json', 'r', encoding='utf-8') as f:
                data = json.load(f)
            return data
        except Exception as e:
            return {"error": str(e)}
    data = read_donnees_json()
    return jsonify(data)
@app.route('/start_attack', methods=['POST'])
def start_attack():
    global storedcipher
    data = request.get_json()
   
    storedcipher = data.get('cipherText', '')
    # Démarrer l'attaque dans un thread séparé
    thread = threading.Thread(target=call_substitution_attack)
    thread.daemon = True
    thread.start()
    return jsonify({"message": storedcipher})

if __name__ == '__main__':
    app.run(debug=True)
