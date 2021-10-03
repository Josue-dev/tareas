const express = require('express');
const routes = require('./routes/index');
const path = require('path');
const bodyParser = require('body-parser');
const session =  require('express-session');
const cookieParser =  require('cookie-parser');
const passport = require('./config/passport');
const flash = require('connect-flash');
const helpers = require('./helpers/helpers');
require('dotenv').config({path:'variables.env'});


const db = require('./config/db');
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
    .then(()=>console.log('Conectado al servidor'))
    .catch((error)=>console.log(error));


const app = express();
//archivos estaticos
app.use(express.static('public'));
//habilitar pug
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: true }));


app.set('views', path.join(__dirname, './views'));

app.use(flash());
app.use(cookieParser());
app.use(session({
    secret:'supersecreto',
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) =>{
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes= req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
})


//ruta para el home
app.use('/',routes());

const host= process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;
app.listen(port,host,()=>{
    console.log('Servidor Funcionando ');
});


