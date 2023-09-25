'use strict';

module.exports = (sequelize, DataTypes) => {
  const Provas = sequelize.define('Provas', {
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tipo: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {});

  Provas.associate = (models) => {
    // Associação com o modelo Usuario
    Provas.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
    
    Provas.hasMany(models.Resposta, {
      foreignKey: 'provaId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    // Associação com o modelo PerguntasProvas (um questionário tem várias perguntas)
    Provas.belongsToMany(models.Perguntas, { through: 'perguntas_provas', foreignKey: 'provaId' });
    Provas.belongsTo(models.Area, { foreignKey: 'areaId' });
  };
  

  return Provas;
};
