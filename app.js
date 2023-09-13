//L’application démarre un serveur et écoute le port 3000 à la recherche de connexions. 
//L’application répond “Hello World!” aux demandes adressées à l’URL racine (/) ou à la route racine. 

const express = require('express'); // recuperer le paquet dans notre code
const morgan = require('morgan'); //middleware
const bodyParser = require('body-parser'); //middleware
const favicon = require('serve-favicon'); //middleware
const { Sequelize, DataTypes } = require('sequelize');
const { success, getUniqueId } = require('./helper.js')
let pokemons = require('./src/db/mock-pokemon.js');
const PokemonModel = require('./src/models/pokemon');

const app = express(); // creer une instance d'une app express, serveur web sur lequel va fonctionner l'API Rest
const port = 3000;




    
// middleware qui crée un journal des differentes requetes du client 
/*app.use((req, res, next) => {
    console.log('URL :', req.url);
    next();
})*/

app
    .use(favicon(__dirname + '/favicon.ico'))
    .use(morgan('dev'))
    .use(bodyParser.json())

app.get('/', (req,res) => res.send('Helloo again, Express!')); // definir l'end point, app.METHOD(PATH, HANDLER)

app.get('/api/pokemons', (req, res) => {
    //const HowManypokemons = pokemons.length;
    //res.send(`Il y a ${HowManypokemons} pokemons dans le pokedex pour le moment`);
    const message = "La liste des pokemons a bien été trouvé";
    res.json(success(message,pokemons));
})

app.get('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    //const name = req.params.name;
    const pokemon = pokemons.find(pokemon => pokemon.id === id)
    //res.send(`Vous avez demandé le pokemon : ${pokemon.name}`);
    const message = "Un pokemon a bien été trouvé";
    res.json(success(message,pokemon));
})

app.post('/api/pokemons', (req, res) => {
    const id = getUniqueId(pokemons);
    const pokemonCreated = { ...req.body, ...{id : id, created : new Date()}};
    console.log(req.body);
    pokemons.push(pokemonCreated);
    const message = `Le pokemon ${pokemonCreated.name} a été crée.`;
    res.json(success(message,pokemonCreated));
})

app.put('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pokemonUpdated = { ...req.body, id : id};
    pokemons = pokemons.map(pokemon => {
        return pokemon.id === id ? pokemonUpdated : pokemon
    })
    const message = `Le pokemon ${pokemonUpdated.name} a bien été modifié.`;
    res.json(success(message,pokemonUpdated));
})

app.delete('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pokemonDeleted = pokemons.find(pokemon => pokemon.id === id );
    pokemons = pokemons.filter(pokemon => pokemon.id !==  id);
    const message = `Le pokemon ${pokemonDeleted.name} a bien été supprimé.`;
    res.json(success(message,pokemonDeleted));
})
app.listen(port, () => console.log(`port : http://localhost:${port}`)); // demarrer l'API 
