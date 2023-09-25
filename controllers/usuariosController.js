const {Router} = require('express');
const {Usuario} = require('../models');
const {Favorito} = require('../models');
const {Topico} = require('../models');
const {Provas} = require('../models');
const {Perguntas} = require('../models');
const {Area} = require('../models');
const {PerguntasProvas} = require('../models');
const {Resposta} = require('../models');
const roteador = Router()

roteador.get('/inicio', (req, res)=>{
    res.status(200).render('inicio');
});

roteador.get('/login', (req, res)=>{
    res.status(200).render('login');
});

roteador.get('/cadastro', (req, res)=>{
    res.status(200).render('cadastro');
});

roteador.get('/logoff', (req, res)=>{
    req.session.destroy();
    res.redirect('/usuario/login');
});


roteador.post('/login', async (req, res)=>{
    const {usuario, senha} = req.body;

    const resposta = await Usuario.findOne({
        where: {
            usuario: usuario,
            senha: senha
        }
    });

    req.session.login = false;

    if(resposta){
        req.session.login = true;
        req.session.idUsuario = resposta.id;
        res.redirect('/usuario/inicioLogado');
    }else{
        res.redirect('/usuario/login');
    }
});

roteador.get('/perfil', async (req, res) => {
    const id = req.session.idUsuario;
  
    const usuario = await Usuario.findByPk(id);
    const favorito = await Favorito.findOne({
      where: { usuarioId: id },
      include: { model: Topico, as: 'Topico' }
    });
    console.log(usuario.perfil);
    if (usuario == null) {
      res.status(200).redirect('/usuario/login');
    } else if (usuario.perfil == 2) {
      res.status(200).render('perfilProf', { usuario, id });
    } else if (usuario.perfil == 3) {
      res.status(200).render('perfilAdm', { usuario, id });
    } else {
      res.status(200).render('perfil', { usuario, id, favorito });
    }
  });

  roteador.get('/inicioLogado', (req, res)=>{
    res.status(200).render('inicioLogado');
});

roteador.get('/perfilProf', async (req, res)=>{
    const id = req.session.idUsuario;

    const usuario = await Usuario.findByPk(id);

    if (usuario == null) {
        res.status(200).redirect('/usuario/login');
    }else{
        res.status(200).render('perfilProf', {usuario, id});
    }
});

roteador.get('/perfilAdm', async (req, res)=>{
    const id = req.session.idUsuario;

    const usuario = await Usuario.findByPk(id);

    if (usuario == null) {
        res.status(200).redirect('/usuario/login');
    }else{
        res.status(200).render('perfiladm', {usuario, id});
    }
});

roteador.get('/perfil/MudarSenha', async (req, res)=>{
    const id2 = req.session.idUsuario;

    let senha = await Usuario.findByPk(id2);
    res.status(200).render('editSenha', {senha, id2});
});

roteador.post('/', async (req, res)=>{
    const {nome, usuario, senha, email, email_secundario} = req.body;
    await Usuario.create({nome, usuario, senha, email, email_secundario});
    res.status(201).redirect('/usuario/login');
});

roteador.patch('/:id', async (req, res)=>{
    let {senha} = req.body;
    await Usuario.update({senha},
        {
            where: {id: req.params.id}
        }
    );
    res.status(200).redirect('/coxinharia');
});
  
  

roteador.delete('/:id', async (req, res)=>{
    await Pedido.destroy(
        {
            where: 
            {
                UsuarioId:req.params.id
            }
        }
    );
    
    
    await Usuario.destroy(
        {
            where: 
            {
                id:req.params.id
            }
        }
    );
    res.status(200).redirect('/usuario/login');
    
});

roteador.get('/registrar-pergunta', async (req, res) => {
    if (!req.session.login) {
        return res.status(401).redirect('/usuario/login');
    }
    const Topicos = await Topico.findAll();
    res.status(200).render('registroPergunta', { Topicos });
});

roteador.get('/registrar-perguntaX', async (req, res) => {
  if (!req.session.login) {
      return res.status(401).redirect('/usuario/login');
  }
  const Topicos = await Topico.findAll();
  res.status(200).render('registroPerguntaX', { Topicos });
});

roteador.post('/registrar-pergunta', async (req, res) => {
    try {
        const { pergunta,topicoId, titulo} = req.body;
        var resposta = " "
        // Use o modelo Pergunta para criar a pergunta no banco de dados
        const usuarioId = req.session.idUsuario;
        console.log(pergunta, topicoId, usuarioId ) 
        await Perguntas.create({
            pergunta,
            titulo,
            topicoId,
            usuarioId,
            resposta: resposta
        });

        res.status(201).redirect('/usuario/inicioLogado');
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Ocorreu um erro ao registrar a pergunta.' });
    }
});

roteador.post('/registrar-perguntaX', async (req, res) => {
  try {
      const { pergunta,topicoId, titulo} = req.body;
      const { respostas } = req.body;
      const respostaConcatenada = respostas.join(',');

      // Use o modelo Pergunta para criar a pergunta no banco de dados
      const usuarioId = req.session.idUsuario;
      console.log(pergunta, topicoId, usuarioId ) 
      await Perguntas.create({
          pergunta,
          titulo,
          topicoId,
          usuarioId,
          resposta: respostaConcatenada

      });

      res.status(201).redirect('/usuario/inicioLogado');
  } catch (error) {
      console.error(error);
      res.status(500).json({ mensagem: 'Ocorreu um erro ao registrar a pergunta.' });
  }
});

roteador.get('/criar-prova', async (req, res) => {
  const areas = await Area.findAll();
    res.render('criar-prova', {areas}); 
  });

// Rota para lidar com o envio do formulário
roteador.post('/criar-prova', async (req, res) => {
    const { titulo, descricao, areaId, tipo } = req.body;
    const usuarioId1 = req.session.idUsuario;

    if (tipo == 'Com opções') {
      tipo == 1;
    }else{
      tipo == 2;
    }

    const tipoCompleto = parseInt(tipo, 10);
    try {
      // Crie um novo questionário no banco de dados usando Sequelize
      const novoProva = await Provas.create({
        titulo,
        descricao,
        areaId,
        usuarioId: usuarioId1,
        tipo: tipoCompleto
      });
  
      res.redirect(`/usuario/provas/${novoProva.id}/adicionar-pergunta`);
    } catch (error) {
      console.error(error);
      res.status(500).send('Ocorreu um erro ao criar o questionário.');
    }
  });

// Rota para visualizar questionários
roteador.get('/provas', async (req, res) => {
    try {
      const provas = await Provas.findAll(); // Supondo que você tenha um modelo "Provas"
  
      res.render('lista-provas', { provas });
    } catch (error) {
      console.error(error);
      res.status(500).send('Ocorreu um erro ao recuperar os questionários.');
    }
  });

  // Rota para associar uma pergunta a um questionário (formulário)
roteador.get('/provas/:provaId/adicionar-pergunta', async (req, res) => {
    try {
      const provaId = req.params.provaId;
      const prova = await Provas.findByPk(provaId);
      const perguntas = await Perguntas.findAll();
      const topicos = await Topico.findAll();
  
      res.render('formularioAssociarPergunta', { prova, perguntas, topicos });
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao carregar formulário de associação de pergunta');
    }
  });
  
  // Importe os modelos necessários e quaisquer outras dependências que você precise

// Rota para processar o formulário de associação de pergunta a questionário
    roteador.post('/provas/:provaId/adicionar-pergunta', async (req, res) => {
    try {
      const { provaId } = req.params;
      const { perguntaId } = req.body;
  
      // Primeiro, verifique se o questionário e a pergunta existem
      const prova = await Provas.findByPk(provaId);
      const pergunta = await Perguntas.findByPk(perguntaId);
  
      if (!prova || !pergunta) {
        return res.status(404).send('Questionário ou pergunta não encontrados.');
      }
  
      // Agora, associe a pergunta ao questionário usando o método addPerguntas
      await prova.addPerguntas(pergunta);
  
      res.redirect(`/usuario/provas/${provaId}/adicionar-pergunta`);
    } catch (error) {
      console.error('Erro ao associar pergunta a questionário:', error);
      res.status(500).send('Erro ao associar pergunta a questionário.');
    }
  });
  
  // Rota para processar as respostas do questionário
  roteador.get('/FazerProva/:provaId', async (req, res) => {
    try {
      const provaId = req.params.provaId;
  
      // Busque as perguntas da prova específica usando o modelo PerguntasProvas
      const perguntasProvas = await PerguntasProvas.findAll({
        where: { provaId },
      });
  
      // Crie um array para armazenar os detalhes das perguntas
      const perguntas = [];
  
      // Para cada entrada em perguntasProvas, busque os detalhes da pergunta usando o modelo Perguntas
      for (const perguntaProva of perguntasProvas) {
        const perguntaDetalhe = await Perguntas.findByPk(perguntaProva.perguntaId);
        perguntas.push(perguntaDetalhe);
      }
      const prova = await Provas.findByPk(provaId);

      res.render('prova', { perguntas, prova });
    } catch (error) {
      console.error('Erro ao buscar perguntas da prova:', error);
      res.status(500).send('Erro ao buscar perguntas da prova.');
    }
  });

  roteador.post('/responder-prova/:provaId', async (req, res) => {
    const { respostas } = req.body;
    const { idUsuario } = req.session;
    const { provaId } = req.params;
    const respostaConcatenada = respostas.join(',');

    try {
      await Resposta.create({
        resposta: respostaConcatenada,
        usuarioId: idUsuario,
        provaId,
      });
  
      return res.redirect('/usuario/inicioLogado');
    } catch (error) {
      console.error('Erro ao salvar respostas associadas:', error);
      return res.status(500).send('Erro ao salvar respostas associadas.');
    }
  });
  
  roteador.get('/video', (req, res)=>{
    res.status(200).render('video');
});
  
module.exports = roteador;

