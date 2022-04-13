const Cart = require('./modelos/Carrito.js');
const fs = require('fs');
const express = require("express");
const http = require("http");
const { engine } = require('express-handlebars');


const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const mostrarTablaDeProductos = (res) => {
    let customerFile;
    try {
        customerFile = JSON.parse(fs.readFileSync("./public/productos.txt", "utf-8"));
        if(customerFile[1]){
            res.status(200).render('tabla', { customerFile });
        } else {
            a = customerFile;
            customerFile = [];
            customerFile.push(a);
            res.status(200).render('tabla', { customerFile });
        }
        
    }
    catch {
        res.status(200).send("No hay productos para mostrar")}
}

const messages = [];
let listaCarrito = new Object();
let isAdmin = true;

io.on("connection", (socket) => {
    console.log("💻 Nuevo usuario conectado!");
    let usuario = socket.id;
    socket.emit("mensajeConexion", usuario);

    socket.on("messageFront", (data) => {
        data.author = socket.id;
        var today = new Date();
        var date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;
        data.date = dateTime;
        console.log(data);
        messages.push(data);
        fs.writeFileSync("./public/mensajes.txt", JSON.stringify(messages));
        // io.sockets.emit("message", data);
        io.sockets.emit("messageBack", messages);
      });


    
})

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('./public'));
const router = express.Router();
const cart = express.Router();
app.use('/productos', router);
app.use('/carrito', cart);

app.set('views', './src/views');
app.set('view engine', 'hbs');

app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'index.hbs',
  layoutsDir: __dirname + '/views/layout',
  partialsDir: __dirname + '/views/partials',
}))

app.get("/", (req,res) => {
    res.status(200).render('main', {});
})

router.get("/", (req,res)=>{
    mostrarTablaDeProductos(res);
})

//Ver lista de productos en carrito
cart.get("/:id/productos", (req,res)=>{
    let id = req.params['id'];
    let array = listaCarrito[id]
    if(array != null){
        if (array.length != 0){
            res.status(200).render('carrito', { array });
        } else {
            let mensaje = 'Debe crear un carrito y agregar productos al mismo para poder visualizarlo';
            res.status(200).render('cargaProductoCarrito', { mensaje });
        }
    }
    else {
        let mensaje = 'Debe crear un carrito y agregar productos al mismo para poder visualizarlo';
        res.status(200).render('cargaProductoCarrito', { mensaje });
    }
    
})

//Agregar producto a carrito
cart.post("/productos/:idCarrito/:idProducto", (req,res)=>{
    let idCarrito = req.params['idCarrito'];
    let idProducto = req.params['idProducto'];
    if (listaCarrito[idCarrito]){
        console.log(`el id del producto es ${idProducto}`)
        let customerFile = JSON.parse(fs.readFileSync("./public/productos.txt", "utf-8"));
        if (customerFile[1]){
            listaCarrito[idCarrito].push({"Nombre":customerFile[idProducto].Nombre, "Precio":customerFile[idProducto].Precio, "id":customerFile[idProducto].id})
        } else{
            listaCarrito[idCarrito].push({"Nombre":customerFile.Nombre, "Precio":customerFile.Precio, "id":customerFile[idProducto].id})
        }
        console.log(JSON.stringify(listaCarrito[idCarrito]));
        let mensaje = 'Producto agregado con exito';
        res.status(200).render('cargaProductoCarrito', { mensaje });
    }
        else {
            let mensaje = 'Debe crear un carrito primero';
            res.status(200).render('cargaProductoCarrito', { mensaje });
        }
})

//Eliminar producto de carrito
cart.post("/productos/eliminar/:idCarrito/:idProducto", (req,res)=>{
    let idCarrito = req.params['idCarrito'];
    let idProducto = req.params['idProducto'];
    if (listaCarrito[idCarrito]){
        let array = listaCarrito[idCarrito];
        for (let i = 0; i < array.length; i++) {
            if (array[i].id == idProducto){
                array.splice(i, 1);
                listaCarrito[idCarrito] = array;
                let mensaje = 'Producto eliminado del carrito con exito';
                res.status(200).render('cargaProductoCarrito', { mensaje });
                return
            }
        }
        let mensaje = 'No se encontró producto con ese id';
        res.status(200).render('cargaProductoCarrito', { mensaje });
    }
    else {
            let mensaje = 'Debe crear un carrito primero';
            res.status(200).render('cargaProductoCarrito', { mensaje });
        }
})


//Crear Carrito
cart.post("/", (req, res) => {
    listaCarrito[0] = [];
    res.status(200).render('carritoCreado', {});
})

//Eliminar Carrito
cart.post('/:id', (req, res) => {
    let id = req.params['id'];
    if(listaCarrito[id]){
        delete listaCarrito[id];
        let text = 'Carrito eliminado con exito';
        res.status(200).render('carritoEliminado', { text });
    } else {
        let text = 'No existe carrito para eliminar';
        res.status(200).render('carritoEliminado', { text });
    }
    
})

router.get('/:id', (req,res)=>{
    try{
    let customerFile = JSON.parse(fs.readFileSync("./public/productos.txt", "utf-8"));
    if (customerFile[0]){
        for (let i = 0; i < customerFile.length; i++) {
            if(customerFile[i].id == req.params.id){
                res.status(200).send(customerFile[i]);
                return;
            }      
        }
        res.status(200).send("No existe producto con ese id");

    } else if(customerFile.id == req.params.id){
        res.status(200).send(customerFile);
    } else{
        res.status(200).send("No existe producto con ese id");
    }}
    catch (error){
        res.status(200).send("No existe producto con ese id");
    }
})

router.post("/", (req,res)=>{
if (isAdmin === true){
    try{
        let customerFile = JSON.parse(fs.readFileSync("./public/productos.txt", "utf-8"));
        if (customerFile[1]){
            let a = customerFile.length-1;
            let b = customerFile[a].id +1;
            req.body.id = b;
            customerFile.push(req.body);
            fs.writeFileSync("./public/productos.txt", JSON.stringify(customerFile));
            res.render('cargaexitosa', {});
        } else{
            let arr = [];
            arr.push(customerFile);
            let c = arr[0].id +1;
            req.body.id = c;
            arr.push(req.body);
            fs.writeFileSync("./public/productos.txt", JSON.stringify(arr));
            res.render('cargaexitosa', {});
        }
    } catch (error){
        req.body.id = 0;
        fs.writeFileSync("./public/productos.txt", JSON.stringify(req.body));
        res.render('cargaexitosa', {});
    }}
    else{
        res.render('main', {})
    }
})

router.put("/:id", (req,res)=>{
    let a = req.params.id;
    req.body.id = a;
    try{
        let customerFile = JSON.parse(fs.readFileSync("./public/productos.txt", "utf-8"));
        if (customerFile[0]){
            if(customerFile[a]){
                customerFile[a] = req.body;
                fs.writeFileSync("./public/productos.txt", JSON.stringify(customerFile));
                res.status(200).send("Se actualizó producto con éxito");
            }else{
                res.status(200).send("No hay producto con ese id")
            }
        }else{
            if (customerFile.id == a){
                customerFile = req.body;
                fs.writeFileSync("./public/productos.txt", JSON.stringify(customerFile));
                res.status(200).send("Se actualizó producto con éxito");
            }else{
                res.status(200).send("No hay producto con ese id")
            }
        }
    }
    catch (error){
        res.status(200).send("No hay producto con ese id")
    }
})

router.delete("/:id", (req,res)=>{
    try {
        let customerFile = JSON.parse(fs.readFileSync("./public/productos.txt", "utf-8"));
        if (customerFile[1]){
            for (let i = 0; i < customerFile.length; i++) {
                if(customerFile[i].id == req.params.id){
                    customerFile.splice(i,1);
                    fs.writeFileSync("./public/productos.txt", JSON.stringify(customerFile));
                    res.status(200).send("Se elimino producto con exito");
                    return;
            }}      
            res.status(200).send("No se encontró producto con ese id")
            return;
        }else if (customerFile[0] && customerFile[0].id == req.params.id){
            fs.writeFileSync("./public/productos.txt", "");
            res.status(200).send("Se elimino producto con exito")
            return;
        } else if(customerFile.id == req.params.id){
            fs.writeFileSync("./public/productos.txt", "");
            res.status(200).send("Se elimino producto con exito")
            return;
        }else {
            res.status(200).send("No se encontró producto con ese id")
        }
    } catch (error) {
        console.log(error)
        res.status(200).send("No se encontró producto con ese id")
    }
})



const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en puerto ${PORT}`)
});

server.on("error", (error) => console.log(error));
