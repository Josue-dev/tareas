const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;




const Usuario = require('../models/Usuarios');


passport.use(
    new LocalStrategy(
        {
            usernameField:'email',
            passwordField:'password'
        },
        async(email, password, done)=>{
            try {
                const usuario = await Usuario.findOne({
                    where:{
                        email:email,
                        activo:1
                    }
                });

                if(!usuario.verificarPassword(password)){
                    return done(null, false,{
                        message:'Correo o Contraseña incorrectos!!'
                    })
                }
                return done(null, usuario);
            } catch (error) {
                return done(null, false,{
                    message:'La cuenta no existe!!'
                })
            }
        }
    )
)

//serializar el usuario 
passport.serializeUser((usuario, callback)=>{
    callback(null, usuario);
})

//deserealizar el objecto
passport.deserializeUser((usuario, callback)=>{
    callback(null, usuario);
})

module.exports = passport;