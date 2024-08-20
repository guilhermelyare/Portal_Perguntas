'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Resposta extends Model {
    static associate(models) {
      // Associações
      Resposta.belongsTo(models.Pergunta, { foreignKey: 'perguntaId', as: 'pergunta' });
      Resposta.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'usuario' });
    }
  }

  Resposta.init({
    corpo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    perguntaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'perguntas', // Nome da tabela de referência
        key: 'id'
      }
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Resposta',
    tableName: 'respostas',
    timestamps: true
  });

  return Resposta;
};
