const fs = require('fs');

class Contenedor {
    constructor (archivo) {
        this.archivo = archivo;
        this.maxID = 0;
    }

    save(producto){
        let p = {Titulo: producto.titulo, Precio: producto.precio, ID: this.maxID};
        this.maxID++;
        fs.appendFileSync(this.archivo,JSON.stringify(p));
    }

    getAll(){
        let productos = []
        productos.push(fs.readFileSync(this.archivo, 'utf-8'))
        console.log(productos)
    }

    deleteAll(){
        fs.unlinkSync(this.archivo);
    }

    //getByID(id)

    //deleteById(id)
}

const P = new Contenedor('productos.txt');
P.save({titulo: "Televisor", precio: "USD 450"});
P.save({titulo: "Telefono", precio: "USD 600"});
P.save({titulo: "PS5", precio: "USD 499"});
P.getAll();