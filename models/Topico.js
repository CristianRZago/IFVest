module.exports = (sequelize, DataTypes) => {
  const Topico = sequelize.define('Topico', {
    materia: DataTypes.STRING,
  }, {});

  Topico.associate = (models) => {
    Topico.belongsTo(models.Area);
    Topico.hasMany(models.Favorito);
    Topico.hasMany(models.Perguntas);
  };

  Topico.associate = (models)=>{
    Topico.hasMany(models.Video);
}

  return Topico;
};