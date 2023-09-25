module.exports = (sequelize, DataTypes) => {
    const Perguntas = sequelize.define('Perguntas', {
      pergunta: DataTypes.STRING,
      titulo: DataTypes.STRING,
      resposta: {
        type: DataTypes.STRING,
        allowNull: true
      }
    }, {});
  
    Perguntas.associate = (models) => {
      Perguntas.belongsTo(models.Topico, { foreignKey: 'topicoId' });
      Perguntas.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
      Perguntas.belongsToMany(models.Provas, { through: 'perguntas_provas', foreignKey: 'perguntaId' });
    };     
    return Perguntas;
  };
  