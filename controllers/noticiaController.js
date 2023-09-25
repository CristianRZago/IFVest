const {Router} = require('express');
const {Noticia, Usuario} = require('../models');

const roteador = Router()

roteador.get('/criar',(req, res)=>{

    res.status(200).render('/criarNoticia');
});

roteador.get('/lista1', async (req, res)=>{
    const noticias = await Noticia.findAll({
    });

    res.status(200).render('listaNoticias', {noticias});

    //res.status(200).send(comentarios);
});

roteador.get('/lista', (req, res)=>{
    res.status(200).render('listaNoticias');
});

roteador.get('/atualizar',(req, res)=>{

    res.status(200).render('/atualizarNoticia');
});


roteador.post('/', async (req, res)=>{
    const {titulo, sub_titulo, resumo, usuarioId, links} = req.body;
    await Noticia.create({titulo, sub_titulo, resumo, usuarioId, links});
    res.status(201).redirect('/noticias');
});

roteador.patch('/:id', async (req, res)=>{
    let {titulo, sub_titulo, resumo, usuarioId, links} = req.body;
    await Noticia.update({titulo, sub_titulo, resumo, usuarioId, links},
        {
            where: {id: req.params.id}
        }
    );
    res.status(200).redirect('/noticias');
});

roteador.delete('/:id', async (req, res)=>{
    await Noticia.destroy(
        {
            where: 
            {
                id:req.params.id
            }
        }
    );
    res.status(200).redirect('/noticias');
});
module.exports = roteador;

