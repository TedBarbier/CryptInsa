const express = require('express');
const { engine } = require('express-handlebars');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 8000;

//Set up morgan
app.use(morgan('combined'));


//Set up handlebars

app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', './views');

// Serve static files
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('home', { title: 'CryptoAnalyzer - Analyse de Fréquence' });
});
app.get('/test', (req, res) => {
    res.render('test', { title: 'Test' });
});
app.get('/cesar', (req, res) => {
    res.render('cesar', { title: 'Illustration du chiffrement de César' });
});
app.get('/vigenere', (req, res) => {
    res.render('vigenere', { title: 'Illustration du chiffrement de Vigenère' });
});
app.get('/substitution', (req, res) => {
    res.render('substitution', { title: 'Illustration du chiffrement par substitution' });
});
app.get('/about_us', (req, res) => {
    res.render('about_us', { title: 'A propos de nous' });
});
app.get('/substitution_attaque', (req, res) => {
    res.render('substitution_attaque', { title: 'Attaque par substitution' });
});
app.get('/substitution_annalyse', (req, res) => {
    res.render('substitution_annalyse', { title: 'Analyse de fréquence' });
});
app.get('/substitution_dechiffre', (req, res) => {
    res.render('substitution_dechiffre', { title: 'Déchiffrement par substitution' });
});
app.get('/help', (req, res) => {
    res.render('help', { title: 'Aide' });
});
//Start the server: Use commande "node app.js" to start the server. "npm run dev" to start the server with debug mode.
const server = app.listen(port, () => {
    console.log(`App listening at http://127.0.0.1:${port}`);
  });