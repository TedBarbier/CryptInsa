from flask import Flask, request, jsonify
from flask_cors import CORS # type: ignore
from collections import Counter
import string
from Crypto.cesar import *
from Crypto.vigenere import *

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
    message = data.get('message', '')
    result = cesar_encrypt(message, int(data.get('shift', 3)))
    response = {o:e for o,e in zip(message, result)}
    # Retourne une réponse standardisée
    return jsonify({response})

@app.route('/cesar/decrypt', methods=['POST'])
def route_cesar_decrypt():
    data = request.get_json()
    message = data.get('message', '')
    result = cesar_decrypt(message, int(data.get('shift', 3)))
    response = {o:e for o,e in zip(message, result)}
    # Retourne une réponse standardisée
    return jsonify({response})

@app.route('/vigenere', methods=['POST'])
def route_vigenere():
    data = request.get_json()
    message = data.get('message', '')
    key = data.get('key', '')
    result = vigenere_encrypt(message, key)
    response = {o:e for o,e in zip(message, result)}
    # Retourne une réponse standardisée
    return jsonify({response})

@app.route('/vigenere/decrypt', methods=['POST'])
def route_vigenere_decrypt():
    data = request.get_json()
    message = data.get('message', '')
    key = data.get('key', '')
    result = vigenere_decrypt(message, key)
    response = {o:e for o,e in zip(message, result)}
    # Retourne une réponse standardisée
    return jsonify({response})

if __name__ == '__main__':
    app.run(debug=True)
