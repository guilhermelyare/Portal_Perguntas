'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Pergunta extends Model {
    static associate(models) {
      // Associações
      Pergunta.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'usuario' });
      Pergunta.hasMany(models.Resposta, { foreignKey: 'perguntaId' });
    }
  }

  Pergunta.init({
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tema: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios', // Nome da tabela de referência
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Pergunta',
    tableName: 'perguntas',
    timestamps: true
  });

  return Pergunta;
};
