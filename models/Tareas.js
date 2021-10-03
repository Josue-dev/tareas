const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos  = require('./Proyectos');


const Tareas = db.define('tareas',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    tarea:Sequelize.STRING,
    estado:Sequelize.INTEGER
});
//una tarea pertenece o va tener un proyecto
Tareas.belongsTo(Proyectos);
//un proyecto puede tener varias tareas
//Proyectos.hasMany(Tareas);

module.exports = Tareas;