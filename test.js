const Contenedor = require('./clase2.js');

function Proceso(){
    const P = new Contenedor("prueba.txt");
    //P.createFile();
    P.save({titulo: "Televisor", precio: 599, thumbnail: "https://i.blogs.es/fc07f2/samsungoled/450_1000.jpeg"})
    P.save({titulo: "Celular", precio: 699, thumbnail: "https://i.blogs.es/fc07f2/samsungoled/450_1000.jpeg"})
    P.save({titulo: "PS5", precio: 799, thumbnail: "https://i.blogs.es/8fdd98/ps51/450_1000.jpeg"})
    //console.log(P.getById(2));
    P.deleteById(0);
    P.getAll()
}

Proceso()
