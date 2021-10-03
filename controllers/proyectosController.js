const { request } = require("express");
const Proyectos  = require('../models/Proyectos');
const Tareas = require('../models/Tareas');
const slug = require('slug');



exports.proyectosHome = async(req, res)=>{
    const {email} = res.locals.usuario;
    const proyectos  = await Proyectos.findAll();


    res.render('index',{
        nombrePagina :'Proyectos',
        proyectos,
        email:email
    });
}
exports.formularioProyecto = async(req, res)=>{
    const {email} = res.locals.usuario;
    const proyectos  =  await Proyectos.findAll();
    res.render('nuevoProyecto',{
        nombrePagina:'NuevoProyecto',
        proyectos,
        email
    })
}

exports.nuevoProyecto = async(req = request, res=Response)=>{
    const {email} = res.locals.usuario;
    const proyectos  =  await Proyectos.findAll();
    const {nombre }= req.body;

    let errores=[];

    if(!nombre){
        errores.push({'texto':'Agrega un nombre al proyecto'});
    }


    if(errores.length>0){
        res.render('nuevoProyecto',{
            nombrePagina:'Nuevo Proyecto',
            errores,
            proyectos,
            email
        })
    }else{
        const usuarioId = res.locals.usuario.id;
       
        const proyecto = await Proyectos.create({nombre, usuarioId});
        res.redirect('/');
            
    }
}

exports.proyectosPorUrl =  async (req, res, next)=>{
    const {email} = res.locals.usuario;
    const proyectos  =  await Proyectos.findAll();
    const proyecto  = await Proyectos.findOne({
        where:{
            url:req.params.url
        }
   });
   
   const tareas = await Tareas.findAll(
       {
           where:{
               proyectoId:proyecto.id
           }
       }
   )

   if(!proyecto) return next();
   res.render('tareas',{
       nombrePagina:'Tareas del Proyecto',
       proyecto,
       proyectos,
       tareas,
       email
   });
}

exports.formularioEditar = async(req, res, next)=>{
    const {email} = res.locals.usuario;
    const proyectosPromise  =  Proyectos.findAll();


    const proyectoPromise  = Proyectos.findOne({
        where:{
            id:req.params.id
        }
    })

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    res.render('nuevoProyecto',{
        nombrePagina:'Editar Proyecto',
        proyectos,
        proyecto,
        email
    })
}

exports.actualizarProyecto = async (req, res)=>{
    const {email} = res.locals.usuario;
    const proyectos  =  await Proyectos.findAll();
    const {nombre }= req.body;

    let errores=[];

    if(!nombre){
        errores.push({'texto':'Agrega un nombre al proyecto'});
    }


    if(errores.length>0){
        res.render('nuevoProyecto',{
            nombrePagina:'Nuevo Proyecto',
            errores,
            proyectos,
            email
        })
    }else{
       
        const proyecto = await Proyectos.update(
            {nombre},
            {where:{
                id:req.params.id
                }
            }
        );
        res.redirect('/');
            
    }
}

exports.eliminarProyecto = async (req, res, next)=>{
    const {email} = res.locals.usuario;
    const {urlProyecto} = req.query;

    if(email==='advinjosuev899@gmail.com'){
        const resultado = await Proyectos.destroy(
            {
                where:{
                    url:urlProyecto
                }
            }
        );
        if(!resultado){
            return next();
        }
        res.status(200).send('Proyecto eliminado correctamente');
    }
   
    res.redirect('/proyectos');
}