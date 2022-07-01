//Variables Globales
const contenedorProductos = document.getElementById('contenedor-productos')

const contenedorCarrito = document.getElementById('carrito-contenedor')

const botonVaciar = document.getElementById('vaciar-carrito')

const contadorCarrito = document.getElementById('contadorCarrito')

const precioTotal = document.getElementById("precioTotal")

const cantidad = document.getElementById('cantidad')

const cantidadTotal = document.getElementById('cantidadTotal')

const comprarBoton = document.getElementById('comprar-boton')

//Clase constructora

class Product{
    constructor(nombre,precio,id,img,cantidad){
        this.nombre = nombre;
        this.precio = precio;
        this.id = id;
        this.img = img;
        this.cantidad= cantidad;
    }
    
}

//Bienvenida del sitio
Swal.fire({
    title: 'Bienvenido a "Manijita Bebidas" presiona OK para acceder a las mejores ofertas'
})


//Array de productos del carrito vacio
// Aplicando operador logico OR ||
const carrito = JSON.parse(localStorage.getItem('carrito')) || []

const stockProductos = []


//Parseo mis objetos con json desde el localStorage
document.addEventListener('DOMContentLoaded', async () => {
    {
        await pushJson()
        actualizarCarrito()
    }
})

//Traigo los productos desde el JSON mediante asincronismo
async function pushJson(){
    const res = await fetch("./mistock.json")
    const data = await res.json()
    await data.forEach(e => stockProductos.push(new Product(e.nombre,e.precio,e.id,e.img,e.cantidad)));
    pintarProd()
}

// INYECTO EL HTML

function pintarProd(){
    for (const element of stockProductos) {
        const div = document.createElement('div')
        div.classList.add('producto')
        div.innerHTML = `
        <img src=${element.img} alt ="">
        <h3>${element.nombre}</h3>
        <p class="precioProducto">Precio:$ ${element.precio}</p>
        <button id="agregar${element.id}" class="boton-agregar">Agregar <i class="fas fa-shopping-cart"></i></button>
        `
        contenedorProductos.appendChild(div)
    
        const boton = document.getElementById(`agregar${element.id}`) 
            //Por cada elemento de mi array, creo un div, lo cuelgo, le pongo un id particular, una vez colgado
        //le hago un get element by id (el de agregar) Obtengo el elemento y a dicho elemento le agrego
        //el add event listener
    
        boton.addEventListener('click', () => {
            //esta funcion ejecuta el agregar el carrito con la id del producto
            agregarAlCarrito(element.id);
            //Alerta de que se agrego un producto al carrito
            Toastify({
                text: "Agregaste una bebida al carrito",
                duration: 1500,
                close: true,
                gravity: "top", 
                position: "center", 
                stopOnFocus: true, 
                style: {
                background: "linear-gradient(to right, #1a6600, #061a00)",
                },
                onClick: function(){
                
                } // Callback after click
            }).showToast();
        })
    
    }

}


//AGREGAR AL CARRITO
const agregarAlCarrito = (prodId) => {

    //PARA AUMENTAR LA CANTIDAD Y QUE NO SE REPITA
    const existe = carrito.some (prod => prod.id === prodId) //comprobar si el elemento ya existe en el carro

    if (existe){ //SI YA ESTÁ EN EL CARRITO, ACTUALIZAMOS LA CANTIDAD
        const prod = carrito.map (prod => { //creo un nuevo arreglo e itero sobre cada curso y cuando
            // map encuentre cual es el igual al que está agregado, le suma la cantidad
            if (prod.id === prodId){
                prod.cantidad++
            }
        })
    } else { //EN CASO DE QUE NO ESTÉ, AGREGAMOS EL CURSO AL CARRITO
        const item = stockProductos.find((prod) => prod.id === prodId)
        //Una vez obtenida la ID, lo que hago es hacerle un push para agregarlo al carrito
        carrito.push(item)
    }
    //Va a buscar el item, agregarlo al carrito y llama a la funcion actualizarCarrito, que recorre
    //el carrito y se ve.
    actualizarCarrito() //LLAMAMOS A LA FUNCION QUE CREAMOS CADA VEZ QUE SE 
    //MODIFICA EL CARRITO
}

//Eliminar producto del carrito
const eliminarDelCarrito = (prodId) => {
    const item = carrito.find((prod) => prod.id === prodId)

    const indice = carrito.indexOf(item) //Busca el elemento q yo le pase y nos devuelve su indice.

    carrito.splice(indice,1) //Le pasamos el indice de mi elemento ITEM y borramos 
    // un elemento 

    //Alerta de que se quito un producto del carrito
    Toastify({
        text: "Eliminaste bebida del carrito",
        duration: 1500,
        close: true,
        gravity: "top", 
        position: "center", 
        stopOnFocus: true, 
        style: {
        background: "linear-gradient(to right, #ff8080, #ff1a1a)",
        },
        onClick: function(){

        } // Callback after click
    }).showToast();
    console.log(carrito);

    actualizarCarrito() //LLAMAMOS A LA FUNCION QUE CREAMOS CADA VEZ QUE SE 
    //MODIFICA EL CARRITO
}

const actualizarCarrito = () => {
    //LOS APPENDS SE VAN ACUMULANDO CON LO QUE HABIA ANTES
    contenedorCarrito.innerHTML = "" //Cada vez que yo llame a actualizarCarrito, lo primero q hago
    //es borrar el nodo. Y despues recorro el array lo actualizo de nuevo y lo rellena con la info
    //actualizado

    //AGREGAR AL MODAL. Recorremos sobre el array de carrito.

    //Por cada producto creamos un div con esta estructura y le hacemos un append al contenedorCarrito (el modal)
    carrito.forEach((prod) => {
        const div = document.createElement('div')
        div.className = ('productoEnCarrito')
        div.innerHTML = `
        <p>${prod.nombre}</p>
        <p>Precio:$${prod.precio}</p>
        <p>Cantidad: <span id="cantidad">${prod.cantidad}</span></p>
        <button onclick="eliminarDelCarrito(${prod.id})" class="boton-eliminar"><i class="fas fa-trash-alt"></i>
        </button>
        `
        
        contenedorCarrito.appendChild(div)
        

    })

  // Correccion para retornar carrito vacio
    localStorage.setItem('carrito', JSON.stringify(carrito))

    contadorCarrito.innerText = carrito.length // actualizamos con la longitud del carrito.

    precioTotal.innerText = carrito.reduce((acc, prod) => acc + prod.cantidad * prod.precio, 0)
    //Por cada producto que recorro en mi carrito, al acumulador le suma la propiedad precio, con el acumulador
    //empezando en 0.
}

//Funcionalidad boton vaciar carrito
botonVaciar.addEventListener('click', () => {
    if (carrito.length === 0) { 
        Swal.fire({
            icon: 'warning',
            title: 'El carrito ya esta vacio',
            text: 'Para continuar con la compra presiona continuar',
            confirmButtonText: 'Continuar'
        })
    } else {
        carrito.length = 0
        Swal.fire({
            title: 'Has vaciado el carrito buena suerte tomando agua!!',
            text: 'Si cambias de opinion pulsa continuar..',
            icon: 'error',
            confirmButtonText: 'Continuar'
        })
    }

    actualizarCarrito()
})

//Funcionalidad del boton Comprar
comprarBoton.addEventListener('click',()=>{
    if (carrito.length===0) {
        Swal.fire({
            icon: 'warning',
            title: 'No tienes nada en tu carrito',
            text: 'Para continuar con la compra debes tener algo en el',
            confirmButtonText: 'Ir a comprar algo'
        })
    } else {
        carrito.length = 0
        Swal.fire({
            title: 'Has finalizado la compra!!',
            text: 'En breve se te redireccionara a los metodos de pago.... Upss! aun estamos trabajando en ello',
            icon: 'success',
            confirmButtonText: 'Volver'
    })
    }
    actualizarCarrito()
    })
