
const Sequelize = require('sequelize');
require('dotenv').config({path:'variables.env'});

const sequelize = new Sequelize(
    process.env.BD_NOMBRE,
    process.env.BD_USER,
    process.env.BD_PASS,{
    host:process.env.BD_HOST,
    dialect:'mysql',
    port:process.env.BD_PORT,
    operatorsAliases:false,
    define:{
        timestamp:false
    },
    pool:{
        max:5,
        min:0,
        acquire:3000,
        idle:10000
    },

})


module.exports = sequelize;