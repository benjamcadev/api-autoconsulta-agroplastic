// Conexion a la BD de postgres
const { conexion } = require("../database/connection")
const validator = require("validator")

const getProducto = async(req,res) => {

    //Recoger parametros del body
    let { codigo } = req.body

    // validar datos
    try {
        let validar_codigo = validator.isEmpty(codigo)

        if (validar_codigo) {
            throw new Error('No se ha validado la informacion')
        }
        
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            mensaje: 'Faltan datos por enviar'
        })
    }


    ///// CONSULTANDO A LA BASE DE DATOS //////
    const text = 'SELECT wh_product.id,wh_product.name, sl_detail_list_price.sale_price FROM wh_product '+
    'INNER JOIN sl_detail_list_price '+
    'ON wh_product.id = sl_detail_list_price.wh_product_id '+
    'INNER JOIN wh_product_upc_code '+
    'ON wh_product_upc_code.wh_product_id = wh_product.id '+
    'WHERE wh_product.alias_name = $1'+
    ' OR wh_product_upc_code.upc_code = $1'+
    ' AND sl_detail_list_price.sl_list_price_id = 1'

    const values = [codigo]

    // Realizamos la query
    const cliente =  await conexion()
    const response = await cliente.query(text, values)

    // Validar si array esta vacio
    if (response.rowCount == 0) {

        return res.status(400).json({
            status: 'error',
            mensaje: 'No existe el producto'
        })
    }

    // si existe devolvemos resultado
    const {id, name, sale_price} = response.rows[0]

    const dataProducto = {
        id,
        name,
        precio: Number(sale_price)
    }

    // rescatar si tiene descuentos por tramos
    const text_tramos = 'SELECT wh_product_id,quantity_discount,unit_price_discount,percentage_discount FROM sl_wholesale_discount WHERE wh_product_id = $1 AND g_branch_office_id = 1'
    const values_tramos = [dataProducto.id]
    const response_tramos = await cliente.query(text_tramos, values_tramos)
     // Validar si array esta vacio

     const dataDescuentos = {}

     if (response_tramos.rowCount == 0) {
        // No tiene descuento por tramos
    }else{
        Object.assign(dataDescuentos, {descuentos: response_tramos.rows});

    }
    cliente.end()


////////////////////////////////////////////////



//////////// TRAER IMAGEN DESDE LA WEB AGROPLASTIC CON API WORDPRESS //////////////

const imagen_obj = await fetch('https://agroplastic.cl/wp-json/wp/v2/media?' + new URLSearchParams({
                                slug: codigo
                                }))
  .then(response => response.json())
  .then(data => {
   
    return data
  })

  // Validando si existe la imagen
  let imagen_url = ''
//console.log(imagen_obj);
  if (imagen_obj.length === 0) {
    // No existe imagen en la pagina web 
    imagen_url = '../public/images/producto_no_disponible.webp'
  }else{
    imagen_url = imagen_obj[0].media_details.sizes.medium.source_url

  }

/////////////////////////////////////////////////


    return res.status(200).json(
        {
            ...dataProducto,
            img_url: imagen_url,
            status: 'success',
            ...dataDescuentos
        }
    )

}

module.exports = {
    getProducto
}