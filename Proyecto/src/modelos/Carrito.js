module.exports = class Carrito {
    constructor() {
      this.nombre = "";
      this.precio = 0;
      this.id = 0;
    }

    crearCarrito(listaCarrito){
        listaCarrito[0] = [];
        return listaCarrito.length
    }
  }