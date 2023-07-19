
const express = require("express")
const cors = require("cors")

// Crear Servidor de Node
const app = express()
const puerto = 3900

//Configurar Cors
app.use(cors())

// Convertir body a objeto js
app.use(express.json()) // recibir datos con content-type/json
app.use(express.urlencoded({extended:true})) // recibir datos form-urlencoded
// RUTAS
const rutas_producto = require("./routes/producto")

app.use("/api", rutas_producto)


app.get("/",(req,res) => {
    
    return res.status(200).send(
        "<h1>Api autoconsulta</h1>"
    )
})

//Poner servidor a escuchar peticiones
app.listen(puerto,() =>{
    console.log("Servidor de node corriendo en el puerto: ", puerto)
})




