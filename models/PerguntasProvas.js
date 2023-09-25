// models/perguntas_provas.js

'use strict';

module.exports = (sequelize, DataTypes) => {
  const PerguntasProvas = sequelize.define('PerguntasProvas', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    perguntaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Perguntas',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    provaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Provas',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    tableName: 'perguntas_provas' // Especifique o nome correto da tabela
  });

  return PerguntasProvas;
};
