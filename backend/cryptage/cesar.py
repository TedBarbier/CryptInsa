import string

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

alphabet=string.ascii_lowercase+' '+','+'.'

def cesar_encrypt(message,decalage):
    lettres=message.split()
    code=[]
    for l in message:
        i=alphabet.index(l)
        i+=decalage
        code.append(alphabet[i%len(alphabet)])
    separateur=""
    return separateur.join(code)

def cesar_decrypt(code,decalage):
    lettres=code.split()
    message=[]
    for l in code:
        i=alphabet.index(l)
        i-=decalage
        message.append(alphabet[i%len(alphabet)])
    separateur=""
    return separateur.join(message)

def test():
    code=cesar_encrypt("pip is fun",4)
    print(code)
    print(cesar_decrypt(code,4))