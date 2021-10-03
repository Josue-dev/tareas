
const Sequelize = require('sequelize');
const db = require('../config/db');
const bcrypt = require('bcrypt-nodejs');
const Proyectos = require('../models/Proyectos');

const Usuarios = db.define('usuarios',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        validate:{
            isEmail:{
                msg:'Agrega un Correo Valido!!'
            },
            notEmpty:{
                msg:'El correo no puede estar vacio!!'
            }
        },
        unique:{
            args:true,
            msg:'Usuario ya registrado!!!'
        }
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false,
        validate:{
            notEmpty:{
                msg:'La contraseña no puede estar vacia!!'
            }
        }
    },
    activo:{
        type:Sequelize.INTEGER,
        defaultValue:0
    },
    token:Sequelize.STRING,
    expiracion:Sequelize.DATE
},{
    hooks:{
        beforeCreate(usuario){
            
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
        }
    }
});

//metodos personalizados
Usuarios.prototype.verificarPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}
Usuarios.hasMany(Proyectos);
module.exports = Usuarios;