//Variables
const formulario = document.querySelector('#agregar-gasto');
const listaGastos = document.querySelector('#gastos ul');


//EventListeners
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    formulario.addEventListener('submit', agregarGasto);
}

//Clases
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(objGasto) {
        this.gastos = [...this.gastos, objGasto];
        this.calcularRestante()
    }

    calcularRestante() {
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id );
        this.calcularRestante();
    }


}

class Interfaz {
    insertarPresupuesto(dinero) {
        const { presupuesto, restante } = dinero;
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    mostrarAlerta(texto, alerta) {
        const divAlerta = document.createElement('div');
        divAlerta.classList.add('text-center', 'alert');

        if (alerta === 'error') {
            divAlerta.classList.add('alert-danger');
        } else {
            divAlerta.classList.add('alert-success');
        }
        divAlerta.textContent = texto;
        document.querySelector('.primario').insertBefore(divAlerta, formulario);
        setTimeout(() => {
            divAlerta.remove();
        }, 3000);
    }
    mostrarListaGastos(gastos) {
        //Limpiar el HTML previo
        this.limpiarHtml();

        //Iterar
        gastos.forEach(gasto => {
            const { cantidad, nombreGasto, id } = gasto;
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;
            nuevoGasto.innerHTML = `${nombreGasto} <span class="badge badge-primary badge-pill">$ ${cantidad}</span>`

            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.textContent = 'X';
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }

            nuevoGasto.appendChild(btnBorrar);
            listaGastos.appendChild(nuevoGasto);
        });
    }

    limpiarHtml(){
        while(listaGastos.firstChild){
            listaGastos.removeChild(listaGastos.firstChild);
        }
    }

    mostrarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }

    validarPresupuesto(presupuestoObj){
        const { presupuesto, restante} = presupuestoObj;
        const divRestante = document.querySelector('.restante');

        if((presupuesto/4) > restante){
            divRestante.classList.remove('alert-succes', 'alert-warning');
            divRestante.classList.add('alert-danger');
        }else if((presupuesto/2) > restante){
            divRestante.classList.remove('alert-succes');
            divRestante.classList.add('alert-warning');
        }else{
            divRestante.classList.remove('alert-danger', 'alert-warning');
            divRestante.classList.add('alert-success');
        }

        if(restante <= 0){
            ui.mostrarAlerta('El presupuesto se ha agotado', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }else{
            formulario.querySelector('button[type="submit"]').disabled = false;
        }
    }
}

//Instanciar
const ui = new Interfaz();
let presupuesto;


//Funciones
function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('¿Cual es su presupuesto?');
    if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload();
    }

    presupuesto = new Presupuesto(presupuestoUsuario);

    ui.insertarPresupuesto(presupuesto);

}

function agregarGasto(e) {
    e.preventDefault();
    const nombreGasto = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    if (nombreGasto === '' || cantidad === '') {
        ui.mostrarAlerta('Ambos campos son obligatorios', 'error');
        return;
    } else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.mostrarAlerta('Cantidad no válida', 'error');
        return;
    }
    //Mensaje Exitoso
    ui.mostrarAlerta('Gasto agregado correctamente');

    //Generar un objeto del gasto
    const objGasto = { nombreGasto, cantidad, id: Date.now() }

    //Enviar el objeto del gasto a una función     
    presupuesto.nuevoGasto(objGasto);

    //Mostrar el gasto en el HTML
    const { gastos, restante } = presupuesto;
    ui.mostrarListaGastos(gastos);
    ui.mostrarRestante(restante);
    ui.validarPresupuesto(presupuesto);

    formulario.reset();
}

function eliminarGasto(id){
    presupuesto.eliminarGasto(id);

    const {gastos, restante} = presupuesto;

    ui.mostrarListaGastos(gastos);
    ui.mostrarRestante(restante);
    ui.validarPresupuesto(presupuesto);
}