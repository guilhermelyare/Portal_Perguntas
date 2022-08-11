const Squelize = require("sequelize");
const connection = require("./database");

const Pergunta = connection.define('perguntas',{
    titulo:{
        type: Squelize.STRING,
        allowNull: false
    },
    descricao:{
        type: Squelize.TEXT,
        allowNull: false
    }
});

Pergunta.sync({force: false})

module.exports = Pergunta;