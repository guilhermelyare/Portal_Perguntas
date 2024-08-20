'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      // Associações
      Usuario.hasMany(models.Pergunta, { foreignKey: 'usuarioId' });
      Usuario.hasMany(models.Resposta, { foreignKey: 'usuarioId' });
    }
  }

  Usuario.init({
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    timestamps: true
  });

  return Usuario;
};
