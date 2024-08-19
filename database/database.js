const Squelize = require('sequelize') // squeliza faz com que não precise usar comandos MySQL para usar o banco de dados, em vez disso usa-se comandos do próprio JS

const connection = new Squelize('guiaperguntas2','root','',{
    host : 'localhost',
    dialect: 'mysql'
});

module.exports = connection;