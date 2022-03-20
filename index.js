const fs = require('fs');
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('./public'));
const router = express.Router();
app.use('/api/productos', router);


router.get("/", (req,res)=>{
    let customerFile;
    try {
        customerFile = JSON.parse(fs.readFileSync("./public/productos.txt", "utf-8"));
        res.status(200).send(customerFile);}
    catch {
        res.status(200).send("No hay productos para mostrar")}
})

router.get("/:id", (req,res)=>{
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
    try{
        let customerFile = JSON.parse(fs.readFileSync("./public/productos.txt", "utf-8"));
        if (customerFile[1]){
            let a = customerFile.length-1;
            let b = customerFile[a].id +1;
            req.body.id = b;
            customerFile.push(req.body);
            fs.writeFileSync("./public/productos.txt", JSON.stringify(customerFile));
            res.status(200).send("Se cargó producto con éxito");
        } else{
            let arr = [];
            arr.push(customerFile);
            let c = arr[0].id +1;
            req.body.id = c;
            arr.push(req.body);
            fs.writeFileSync("./public/productos.txt", JSON.stringify(arr));
            res.status(200).send("Se cargó segundo producto con éxito");
        }
    } catch (error){
        req.body.id = 0;
        fs.writeFileSync("./public/productos.txt", JSON.stringify(req.body));
        res.status(200).send("Se cargó primer producto con éxito");
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



const PORT = 8080;

const server = app.listen(PORT, () => {
    console.log("Servidor escuchando en puerto 8080")
});

server.on("error", (error) => console.log(error));