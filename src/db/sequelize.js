const { Sequelize, DataTypes } = require('sequelize');
const PokemonModel = require('../models/pokemon');
const pokemons = require('./mock-pokemon');

const sequelize = new Sequelize(
    'pokedex', //table
    'root', //user
    '', //password
    {
        host: 'localhost',
        dialect :'mariadb',
        dialectOptions : {
            timezone : 'Etc/GMT-2'
        },
        logging : false
    }
)

sequelize.authenticate()
    .then(_ => console.log('connexion etablie') )
    .catch(error => console.error(`impossible ${error}`)) 

const Pokemon = PokemonModel(sequelize, DataTypes);

const initDb = () => {
    return sequelize.sync({force: true}).then(_ => {
        console.log('base Pokedex synchronisée.');
        pokemons.map(pokemon => 
            Pokemon.create({
                name: pokemon.name,
                hp: pokemon.hp,
                cp: pokemon.cp,
                picture: pokemon.picture,
                types: pokemon.types.join()
            }).then(pokemon => console.log(pokemon.toJSON()))
        )
    })
    console.log("La base a été bien initialisée");
}

module.exports = {
    initDb, Pokemon
}