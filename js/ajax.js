const d = document,
 $table =d.querySelector(".crud-table"),
 $form = d.querySelector(".crud-form"),
 $title = d.querySelector(".crud-title"),
 $template = d.getElementById("crud-template").content,
 $fragment = d.createDocumentFragment();
/**
 * Funcion que encapsula y pide los parametros necesarios, prepara el error
 * y prepara por default el metodo get 
 * @param {} options 
 */
const ajax = (options) => {
    let {url,method,success,error,data} = options;
    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", e => {
        if(xhr.readyState !==4){
            return;
        }
        if(xhr.status>=200 && xhr.status<300){
            let json =  JSON.parse(xhr.responseText);
            success(json);
        }else{
            let message = xhr.statusText || "Ocurrio un error";
            error(`Error ${xhr.status}:${message}`)
        }
    });
    xhr.open(method || "GET",url);
    xhr.setRequestHeader("Content-type","application/json; charset=utf-8");
    xhr.send(JSON.stringify(data));
}
/**
 * Funcion obtener todos los datos de la Api Falsa y mostrarlos a la vista
 */
const getAll =()=>{
    ajax({
        method:"GET",
        url:"http://localhost:5555/santos",
        success:(res)=>{
            console.log(res);
            res.forEach(el => {
                $template.querySelector(".name").textContent=el.nombre;
                $template.querySelector(".constellation").textContent=el.constelacion;
                $template.querySelector(".edit").dataset.id =el.id;
                $template.querySelector(".edit").dataset.name =el.nombre;
                $template.querySelector(".edit").dataset.constellation =el.constelacion;
                $template.querySelector(".delete").dataset.id =el.id;
                
                let $clone = d.importNode($template,true);
                $fragment.appendChild($clone);
            });
            $table.querySelector("tbody").appendChild($fragment);
        },
        error:(err)=>{
            console.log(err);
            $table.insertAdjacentHTML("afterend",`<p><b>${err}</b></p>`);
        },  
       
    })
}
d.addEventListener("DOMContentLoaded",getAll)
/**
 * Implementacion de la funcion agregar un santo y editarlo
 */
d.addEventListener("submit", e => {
    if(e.target === $form){
        e.preventDefault();
        /**
         * si el id viene vacio realice los metodos post ,caso contrario put
         */
        if (!e.target.id.value) {
            //create - post
            ajax({
                url:"http://localhost:5555/santos",
                method:"POST",
                success:(res) => location.reload(),
                erro:()=> $form.insertAdjacentHTML("afterend",`<p><b>${err}</b></p>`),
                data:{
                    nombre:e.target.nombre.value,
                    constelacion:e.target.constelacion.value
                }
            });
        }else{
            //update -PUT
            ajax({
                url:`http://localhost:5555/santos/${e.target.id.value}`,
                method:"PUT",
                success:(res) => location.reload(),
                erro:()=> $form.insertAdjacentHTML("afterend",`<p><b>${err}</b></p>`),
                data:{
                    nombre:e.target.nombre.value,
                    constelacion:e.target.constelacion.value
                }
            });
        }
    }
})
/**
 * funciones eliminar y editar
 */
d.addEventListener('click', e =>{
    if(e.target.matches(".edit")){
        $title.textContent="Editar Santo";
        $form.nombre.value = e.target.dataset.name;
        $form.constelacion.value = e.target.dataset.constellation;
        $form.id.value = e.target.dataset.id;
    }
    if(e.target.matches(".delete")){
        let isDelete= confirm(`¿estas seguro de eliminar el id ${e.target.dataset.id}?`);
    if(isDelete){
        //delete-Delete
        ajax({
            url:`http://localhost:5555/santos/${e.target.dataset.id}`,
            method:"DELETE",
            success:(res) => location.reload(),
            erro:()=> alert(err),
        });
    }
    }
})

