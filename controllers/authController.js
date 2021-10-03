

const passport = require('passport');
const crypto  = require('crypto');
const Sequelize = require('sequelize');
const Op =  Sequelize.Op;
const Usuarios = require('../models/Usuarios');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail =  require('../handlers/email');



exports.autenticarUsuario= passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'/iniciar-sesion',
    failureFlash:true,
    badRequestMessage:'Ambos campos son obligatorios!!'
});


exports.usuarioAutenticado = (req, res, next)=>{

    if(req.isAuthenticated()){
        return next();
    }

    return res.redirect('/iniciar-sesion');

};

exports.cerrarSesion = (req, res, next)=>{

    req.session.destroy(()=>{
        res.redirect('/iniciar-sesion');
    })

}

exports.enviarToken = async(req, res)=>{

    const usuario = await Usuarios.findOne({
        where:{
            email:req.body.email
        }
    });

    if(!usuario){
        req.flash('error', 'No existe esa cuenta!!');
        res.render('reestablecer',{
            nombrePagina:'Reestablecer tu contraseña',
            mensajes:req.flash()
        })
    }

    usuario.token  = crypto.randomBytes(20).toString('hex');
    usuario.expiracion  = Date.now() + 3600000;//equivale a una hora
    await usuario.save();
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

   
    
    await enviarEmail.enviar({
        usuario,
        subject:'Reseteo de Contraseña',
        resetUrl,
        archivo:'reestablecer-password'
    });

    req.flash('correcto', 'Se envio un mensaje a tu correo para reestablecer contraseña');
    res.redirect('/iniciar-sesion');

}

exports.validarToken = async(req, res)=>{
    const usuario = await Usuarios.findOne({
        where:{
            token:req.params.token
        }
    })
   
    if(!usuario){
        req.flash('error','No valido!!');
        res.redirect('/reestablecer');
    }

    res.render('resetPassword',{
        nombrePagina:'Reestablecer Contraseña'
    })
}

exports.actualizarPassword = async(req, res)=>{
    const usuario = await Usuarios.findOne({
        where:{
            token:req.params.token,
            expiracion:{
                [Op.gte]:Date.now()
            }
        }
    });

    if(!usuario){
        req.flash('error','No valido!!');
        res.redirect('/reestablecer');
    }

    
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token=null;
    usuario.expiracion=null;
    await usuario.save();

    req.flash('correcto', ' Tu Contraseña se ha modificaco correctamente!!');
    res.redirect('/iniciar-sesion');
}