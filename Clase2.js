const fs = require('fs');

module.exports = class Contenedor {
    constructor (archivo) {
        this.archivo = archivo;
        this.maxID = 0;
    }

    save(producto){

            let p = {Titulo: producto.titulo, Precio: producto.precio, Thumbnail: producto.thumbnail, ID: this.maxID};
            this.maxID++;
            fs.appendFileSync(this.archivo, `${JSON.stringify(p)}`)
        }
        
        /*try{
            let contenido = fs.readFileSync(this.archivo, "utf-8")
            console.log(contenido)
            let productos = JSON.parse(contenido)
            productos.push(p)
            fs.appendFileSync(this.archivo,JSON.stringify(productos))
         } catch(err){
            fs.appendFileSync(this.archivo,JSON.stringify(p))
        }*/
    


    getAll(){
        //let productos = []
        //productos.push({nombre: "Agustin", apellido: "Cappellacci"})
        //fs.writeFileSync(this.archivo, JSON.stringify(productos))
        const contenido = fs.readFileSync(this.archivo, "utf-8")
        const resultado = JSON.parse(contenido.split("\r\n"))
        console.log(resultado)
    }

    deleteAll(){
        fs.unlinkSync(this.archivo);
        console.log("Se eliminó archivo")
    }

    getByID(id){
        let productos = []
        const contenido = fs.readFileSync(this.archivo, "utf-8")
        productos = JSON.parse(contenido)
        for (let i = 0; i <= productos.length; i++) {
            if(productos[i].ID == id){
                console.log(i)
                return productos[i]
            }
        }
        console.log("no se encontró el id indicado")
    }

    deleteById(id){
        let productos = []
        const contenido = fs.readFileSync(this.archivo, "utf-8")
        productos = JSON.parse(contenido)
        for (let i = 0; i <= productos.length; i++) {
            if(productos[i].ID == id){
                productos.splice(id,1)
                fs.writeFileSync(this.archivo,JSON.stringify(productos))
                console.log("Se eliminó producto eitosamente")
            }
        }
        console.log("no se encontró el id indicado")
    }
}
