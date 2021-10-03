

const express = require('express');
const router = express.Router();

const { check } = require('express-validator');
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');



module.exports = function(){
    router.get('/',authController.usuarioAutenticado ,proyectosController.proyectosHome);
    router.get('/nuevo-proyecto',authController.usuarioAutenticado, proyectosController.formularioProyecto);
    router.post('/nuevo-proyecto',
    check('nombre','El nombre del proyecto es obligatorio!!').not().isEmpty().trim().escape(),
    authController.usuarioAutenticado,proyectosController.nuevoProyecto
    );
    //listar proyectos
    router.get('/proyectos/:url',authController.usuarioAutenticado, proyectosController.proyectosPorUrl);
    //editar
    router.get('/proyecto/editar/:id',authController.usuarioAutenticado, proyectosController.formularioEditar);
    //actualizar
    router.post('/nuevo-proyecto/:id',check('nombre','El id es obligatorio').not().isEmpty().trim().escape(),
    authController.usuarioAutenticado, proyectosController.actualizarProyecto
    );
    router.delete('/proyectos/:url',authController.usuarioAutenticado,proyectosController.eliminarProyecto);

    //rutas para las tareas
    router.post('/proyectos/:url',authController.usuarioAutenticado, tareasController.agregarTarea);
    router.patch('/tareas/:id',authController.usuarioAutenticado, tareasController.cambiarEstadoTarea);
    router.delete('/tareas/:id',authController.usuarioAutenticado, tareasController.eliminarTarea);

    //crear nueva cuenta
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    //para enviar datos de crear cuenta
    router.post('/crear-cuenta', usuariosController.crearCuenta);
    router.get('/confirmar/:correo',usuariosController.confirmarCuenta);
    //iniciar session
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);

    //cerrar sesion
    router.get('/cerrar-sesion', authController.cerrarSesion);
    //reestablece contraseña
    router.get('/reestablecer', usuariosController.formReestablecerPassword);
    router.post('/reestablecer', authController.enviarToken);
    router.get('/reestablecer/:token', authController.validarToken);
    router.post('/reestablecer/:token',authController.actualizarPassword);
    return router;
}