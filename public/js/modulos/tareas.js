import Swal from 'sweetalert2';
import axios from 'axios';
import {actualizarAvance} from '../funciones/avance';
const tareas  = document.querySelector('.listado-pendientes');


if(tareas){
    tareas.addEventListener('click',(e)=>{
        e.preventDefault();
        if(e.target.classList.contains('fa-check-circle')){
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;

            const url =`${location.origin}/tareas/${idTarea}`;

            axios.patch(url, {idTarea})
                .then(function(respuesta){
                    if(respuesta.status ===200){
                        icono.classList.toggle('completo');
                        actualizarAvance();
                    }
                })
        }
        if(e.target.classList.contains('fa-trash')){
            const tareaHTML = e.target.parentElement.parentElement;
            const idTarea = tareaHTML.dataset.tarea;

            Swal.fire({
                title: 'Deseas eliminar la tarea?',
                text: "La tarea eliminada no se podra recuperar",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, borrar!',
                cancelButtonText:'No, Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    //enviar peticion con axios
    
                    const url = `${location.origin}/tareas/${idTarea}`;
                    axios.delete(url,{params:{idTarea}})
                        .then(function(respuesta){
                            if(respuesta.status===200){
                                tareaHTML.parentElement.removeChild(tareaHTML);
                                Swal.fire(
                                    'Tarea eliminada!',
                                    respuesta.data,
                                    'success'
                                );
                                actualizarAvance();
                            }
                            
                        })
                        .catch(()=>{
                            Swal.fire({
                                type:'error',
                                title:'Hubo un error',
                                text:'No se puedo eliminar la tarea'
                            })
                        })
                }
            })

        }
       
    });

   
}

export default tareas;