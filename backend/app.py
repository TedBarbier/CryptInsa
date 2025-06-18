from flask import Flask, request, jsonify
from flask_cors import CORS # type: ignore
from collections import Counter
import string
from Crypto.cesar import *
from Crypto.vigenere import *
import json
from flask import make_response

app = Flask(__name__)
CORS(app)  # autorise les requêtes depuis le frontend

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
def substitution_attack(ciphertext, language='fr'):
    # Implémentez l'attaque par substitution ici
    # Pour l'instant, on retourne un message d'erreur
    return {"error": "Substitution attack not implemented yet"}
@app.route('/analyse_frequences', methods=['POST'])
def route_analyse_frequences():
    data = request.get_json()
    cipherText = data.get('ciphertext', '')
    if not cipherText:
        return jsonify({"error": "No message provided"}), 400
    language = data.get('language', 'fr')
    freqCipher, freqMessage, freqLang, message = substitution_attack(cipherText, language)
    response = {
        "freqCipher": freqCipher,
        "freqMessage": freqMessage,
        "freqLang": freqLang,
        "message": message
    }
    return jsonify(response)
@app.route('/update_attack', methods=['GET'])
def route_substitution_attack():
    def read_donnees_json():
        try:
            with open('donnees.json', 'r', encoding='utf-8') as f:
                data = json.load(f)
            return data
        except Exception as e:
            return {"error": str(e)}

    data = read_donnees_json()
    return make_response(jsonify(data), 200)

if __name__ == '__main__':
    app.run(debug=True)
