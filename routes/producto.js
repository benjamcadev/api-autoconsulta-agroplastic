const express = require("express")
const router = express.Router()
const ProductoController = require("../controllers/producto")
// Rutas

router.get("/get-producto",ProductoController.getProducto)

module.exports = router