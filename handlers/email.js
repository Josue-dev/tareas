const nodemailer =  require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const util = require('util');
const htmlToText = require('html-to-text');



let mail = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'alejandroavila123sss@gmail.com',
        pass:'41607612'
    }
});

const generarHtml = (archivo,opciones ={})=>{
    const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones);
     return juice(html);
}

exports.enviar = async(opciones)=>{
    const html = generarHtml(opciones.archivo, opciones);
    const texto = htmlToText.fromString(html);
    let mailOption = {
        from:'Tareas<no-reply@tareas.com>',
        to:opciones.usuario.email,
        subject:opciones.subject,
        text:texto,
        html
    }

    const enviarEmail = util.promisify(mail.sendMail, mail);
    return enviarEmail.call(mail, mailOption);
   
}



