class Usuario {
    constructor(nombre,apellido){
        this.nombre = String(nombre)
        this.apellido = String(apellido)
        this.mascotas = []
        this.libros = []
    }

    getFullName(){
        return this.nombre + " " + this.apellido
    }

    addMascota(nombreMascota){
        this.mascotas.push(String(nombreMascota))
    }

    countMascotas(){
        return this.mascotas.length
    }
    
    addBook(nombre,autor){
        this.libros.push({nombreLibro : String(nombre), nombreAutor: String(autor)})
    }

    getBookNames(){
        let a = []
        for (let i = 0; i < this.libros.length; i++) {
            a.push((this.libros[i].nombreLibro));
        }
        return a
   }

}

const u = new Usuario("Juan","Sosa")
u.addMascota("Milo")
u.addMascota("Roco")
u.addMascota("Max")
u.addBook("Odisea","Homero")
u.addBook("El quijote de la Mancha","Cervantes")

console.log(`El usuario ${u.getFullName()} tiene ${u.countMascotas()} mascotas.
En sus tiempos le gusta leer libros, los libros que tiene son los siguientes:`)
console.log(u.getBookNames())