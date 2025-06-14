import string
from flask import jsonify

def cesar_cipher(data):
    text = data.get('text', '')
    shift = int(data.get('shift', 3))  # décalage par défaut
    steps = []

    encrypted = []
    for char in text:
        if char.upper() in string.ascii_uppercase:
            base = ord('A') if char.isupper() else ord('a')
            shifted = chr((ord(char) - base + shift) % 26 + base)
            steps.append({
                'original': char,
                'code': shifted,
            })
            encrypted.append(shifted)
        else:
            steps.append({
                'original': char,
                'code': char,
            })
            encrypted.append(char)

    return {
        'encrypted': ''.join(encrypted),
        'steps': steps
    }
