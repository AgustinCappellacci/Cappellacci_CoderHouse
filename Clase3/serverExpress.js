const express = require("express");
const fs = require("fs");

const app = express();

app.get("/productos",(req, res) => {
    let a = JSON.parse(fs.readFileSync("productos.txt", "utf-8"))
    res.send(JSON.stringify(a));
});

app.get("/productoRandom",(req, res) => {
    let a = JSON.parse(fs.readFileSync("productos.txt", "utf-8"))
    let numRandom = Math.floor(Math.random()*3);
    let b;
    for (let i = 0; i < a.length; i++) {
        if (a[i].id == numRandom){
            b = a[i]
        }
    }
    res.send(JSON.stringify(b));
});

const PORT = 8080;

const server = app.listen(PORT, () => {
    console.log("Servidor escuchando en puerto 8080")
});

server.on("error", (error) => console.log(error));