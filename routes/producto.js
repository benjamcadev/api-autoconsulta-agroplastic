const express = require("express")
const router = express.Router()
const ProductoController = require("../controllers/producto")
// Rutas

router.post("/get-producto",ProductoController.getProducto)

module.exports = router