'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const questionarioId = 1; // ID do questionário ao qual as perguntas serão associadas

    const perguntas = [
      {
        topicoId: 1,
        usuarioId: 1,
        pergunta: 'Qual é a derivada da função f(x) = x^2?',
        alternativaA: '2x',
        alternativaB: 'x^2',
        alternativaC: '2x^2',
        alternativaD: '1/x',
        resposta: '2x' // Índice da alternativa correta (começando do 0)
      },
      {
        topicoId: 1,
        usuarioId: 1,
        pergunta: 'Qual é a integral de ∫(3x^2 + 2x) dx?',
        alternativaA: 'x^3 + x^2',
        alternativaB: 'x^3 + x',
        alternativaC: 'x^2 + x',
        alternativaD: '1/x',
        resposta: 'x^3 + x^2'
      }
    ];

    await queryInterface.bulkInsert('Perguntas', perguntas);

    const perguntasCriadas = await queryInterface.sequelize.query(
      `SELECT * FROM \`Perguntas\` WHERE \`usuarioId\` = 1 AND \`topicoId\` = 1`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const perguntasIds = perguntasCriadas.map(pergunta => pergunta.id);

    const perguntasQuestionarios = perguntasIds.map(perguntaId => ({
      perguntaId,
      questionarioId,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('perguntas_questionarios', perguntasQuestionarios);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Perguntas', null, {});
    await queryInterface.bulkDelete('perguntas_questionarios', null, {});
  }
};
