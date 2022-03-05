const Contenedor = require('./Clase2.js');

function Proceso(){
    const P = new Contenedor('productos.json');
    P.save({titulo: "Televisor", precio: 599, thumbnail: "https://i.blogs.es/fc07f2/samsungoled/450_1000.jpeg"})
    //P.save({titulo: "Celular", precio: 699, thumbnail: "https://i.blogs.es/fc07f2/samsungoled/450_1000.jpeg"})
    P.getAll()
    console.log(P.getByID(0))
    P.deleteById(0)
    P.deleteAll()
}

Proceso()
