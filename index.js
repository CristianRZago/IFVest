const express = require('express');
const methodOverride = require('method-override');
const session = require('express-session');


const {comentarios, usuarios, AreaProfessor, noticias} = require('./controllers');

const app = express();

const umDia = 1000*60*60*24;
const sessionOptions = {
    secret: "frasealeatoria",
    cookie: {maxAge: umDia},
    resave: false,
    saveUninitialized: false
};

app.use(session(sessionOptions));

const secure_pass = (req, res, next)=>{
    if(req.session.login || 
    req.path === '/login'){
        next();
    }else{
        res.redirect('/usuario/inicio');
    }
}

const path = require('path');

//Configura as variáveis do Node para a View Engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

//Permite obter informações do corpo das requisições
app.use(express.urlencoded({extended:true}));

//Define diretório para arquivos estáticos
app.use(express.static('public'));

//Define _method como parâmetro para transformar
// de POST para PATCH ou DELETE
app.use(methodOverride('_method'));

app.use('/usuario', usuarios); // usuario, usuarios(lista com os usuarios)
app.use(secure_pass);
app.use('/noticias', noticias);
app.use('/comentario', comentarios); //comentarios do usuario
app.use('/prof', AreaProfessor);

app.listen(80, ()=>{
    console.log('Working on port 80!')
});
