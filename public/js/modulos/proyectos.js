import Swal from 'sweetalert2';
import axios from 'axios';



const btnEliminar = document.querySelector('#eliminar-proyecto');
if(btnEliminar){
    btnEliminar.addEventListener('click',(e)=>{
        e.preventDefault();

        const urlProyecto = e.target.dataset.proyectoUrl;

       
        Swal.fire({
            title: 'Deseas eliminar el proyecto?',
            text: "Un proyecto eliminado no se podra recuperar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar!',
            cancelButtonText:'No, Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                //enviar peticion con axios

                const url = `${location.origin}/proyectos/${urlProyecto}`;
                axios.delete(url,{params:{urlProyecto}})
                    .then(function(respuesta){
                        Swal.fire(
                            'Proyecto eliminado!',
                            respuesta.data,
                            'success'
                        );
        
                        setTimeout(()=>{
                            window.location.href = '/';
                            
                        },2000)
                    })
                    .catch(()=>{
                        Swal.fire({
                            type:'error',
                            title:'Hubo un error',
                            text:'No se puedo eliminar el proyecto'
                        })
                    })
            }
        })
    });
}

export default btnEliminar;