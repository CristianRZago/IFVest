const comentarios = require('./comentariosController');
const usuarios = require('./usuariosController');
const AreaProfessor = require('./AreaProfessorController');
const noticias = require('./noticiaController');


const controllers = {
    comentarios: comentarios,
    usuarios: usuarios,
    AreaProfessor: AreaProfessor,
    noticias: noticias
}

module.exports = controllers;