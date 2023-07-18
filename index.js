// Conexion a la BD de postgres
const { conexion } = require("./database/connection")
const express = require("express")
const cors = require("cors")

// Crear Servidor de Node
const app = express()
const puerto = 3900

//Configurar Cors
app.use(cors())

// Convertir body a objeto js
app.use(express.json())

// RUTAS


//Poner servidor a escuchar peticiones
app.listen(puerto,() =>{
    console.log("Servidor de node corriendo en el puerto: ", puerto)
})


///// CONSULTANDO A LA BASE DE DATOS //////
const text = 'select nombre, precio from productos where nombre = $1'
const values = ['toner']

const response = async() => {
    const cliente =  await conexion()
    const res = await cliente.query(text, values)
    console.log(res.rows)
    cliente.end()
}

response()

////////////////////////////////////////////////


