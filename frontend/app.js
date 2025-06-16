const express = require('express');
const { engine } = require('express-handlebars');
const morgan = require('morgan');

const app = express();
const port = 8000;

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

//Start the server: Use commande "node app.js" to start the server
const server = app.listen(port, () => {
    console.log(`App listening at http://127.0.0.1:${port}`);
  });