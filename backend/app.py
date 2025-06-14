from flask import Flask, request, jsonify
from flask_cors import CORS
from collections import Counter
import string
from Crypto.cesar import cesar_cipher

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
    result = cesar_cipher(data)
    # Retourne une réponse standardisée
    return jsonify({
        "status": "success",
        "result": result,
        "metadata": {
            "algorithm": "cesar",
            "shift": data.get('shift', 3)
        }
    })

if __name__ == '__main__':
    app.run(debug=True)
