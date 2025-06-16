import string
from flask import jsonify
import fitz

alphabet = string.ascii_lowercase+' '+','+'.'

combinaisons = ['on','ch','en','es','le','la','te','re','nt','st','it','ou','ne','an','un',
               'er','es','se','ai','ou','au','eu','oi','et','de','qu','ion','eau']

def extract_text_from_pdf(pdf_path):
    text = ""
    with fitz.open(pdf_path) as doc:
        for page in doc:
            text += page.get_text()
    text=text.lower()
    return ''.join(c for c in text if c in alphabet)

def extract_text_from_txt(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        text = file.read()
    text = text.lower()
    return ''.join(c for c in text if c in alphabet)

def get_letter_frequencies(text):
    size_text = len(text)
    letter_frequencies = {letter: 0 for letter in alphabet}
    for i in range(len(text) - 1):
        if text[i] in letter_frequencies:
            letter_frequencies[text[i]] += 1
    return letter_frequencies, size_text

def get_combination_frequencies(text):
    size_text = len(text)
    combination_frequencies = {comb: 0 for comb in combinaisons}
    for i in range(len(text) - 1):
        comb = text[i:i+2]
        long_comb = text[i:i+3]
        if long_comb in combinaisons:
            combination_frequencies[long_comb] += 1
        if comb in combination_frequencies:
            combination_frequencies[comb] += 1
    return combination_frequencies, size_text

def display(frequencies,size_text):
    for letter, freq in frequencies.items():
        print(f"{letter}: {freq / size_text*100:.4f}")

pdf_path = "miserables.pdf"
text = extract_text_from_pdf(pdf_path)
letter_freq,size= get_letter_frequencies(text)
combination_freq,size2 = get_combination_frequencies(text)
display(letter_freq,size)
display(combination_freq,size2) 
