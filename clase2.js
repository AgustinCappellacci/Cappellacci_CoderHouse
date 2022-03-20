const fs = require('fs');

module.exports = class Contenedor {
    constructor(archivo){
        this.archivo = archivo
        this.nextID = 0
    }

    save(producto){
        let s = {titulo: producto.titulo, precio: producto.precio, thumbnail: producto.thumbnail, id: this.nextID};
        if (this.nextID == 0){
            fs.writeFileSync(this.archivo, JSON.stringify(s))
        } else if (this.nextID == 1) {
            let customerFile = fs.readFileSync(this.archivo, "utf-8");
            let customerArr = [];
            customerArr.push(JSON.parse(customerFile))
            customerArr.push(s)
            fs.writeFileSync(this.archivo, JSON.stringify(customerArr))
        } else {
            let customerFile = fs.readFileSync(this.archivo, "utf-8");
            let customerArr =  JSON.parse(customerFile);
            customerArr.push(s)
            fs.writeFileSync(this.archivo, JSON.stringify(customerArr))
        }
        this.nextID++;
        
    }

    getAll(){
        //fs.appendFileSync(this.archivo, `]`)
        let customerFile = fs.readFileSync(this.archivo, "utf-8");
        let customerArr = JSON.parse(customerFile)
        console.log(customerArr);
    }

    getById(id){
        let customerFile = fs.readFileSync(this.archivo, "utf-8");
        let customerArr = JSON.parse(customerFile)
        if(id<this.nextID){
            return customerArr[id];
        } else {
            console.log("No existe producto con ese ID");
        }  
    }

    deleteById(id){
        let customerFile = fs.readFileSync(this.archivo, "utf-8");
        let customerArr = JSON.parse(customerFile)
        if(id<this.nextID){
            customerArr.splice(id,1)
            fs.writeFileSync(this.archivo, JSON.stringify(customerArr))
            return
        } else {
            console.log("No existe producto con ese ID");
        }  
    }

    deleteAll(){
        fs.unlinkSync(this.archivo);
        console.log("Se eliminó archivo")
    }
}

//const P = new Contenedor("prueba.txt");
//P.createFile();
//P.save({titulo: "Televisor", precio: 599, thumbnail: "https://i.blogs.es/fc07f2/samsungoled/450_1000.jpeg"})
//P.save({titulo: "Celular", precio: 699, thumbnail: "https://i.blogs.es/fc07f2/samsungoled/450_1000.jpeg"})
//P.save({titulo: "PS5", precio: 799, thumbnail: "https://i.blogs.es/8fdd98/ps51/450_1000.jpeg"})
//console.log(P.getById(0));
//P.deleteById(1);
//console.log(P.getById(1));
//P.deleteAll();