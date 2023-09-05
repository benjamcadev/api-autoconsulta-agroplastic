// Conexion a la BD de postgres
const { conexion, conexionMariadb } = require("../database/connection")
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
    ' AND wh_product.flag_delete = false' +
    ' OR wh_product_upc_code.upc_code = $1'+
    ' AND wh_product_upc_code.flag_delete = false' +
    ' AND sl_detail_list_price.sl_list_price_id = 1' 
    

    const values = [codigo]

    console.log(codigo);
    
    // Realizamos la query
    const cliente =  await conexion()
    const response = await cliente.query(text, values)

   
    

    noExiste()

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

    // // Guardar un registro de la consulta del producto
    // let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    // let fecha_actual = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);

    // const cliente_mariadb =  await conexionMariadb()
    // const response_mariadb = await cliente_mariadb.query("INSERT INTO registros_consultas (codigo_producto, nombre_producto, precio_producto, fecha_consulta) value (?,?,?,?)", [codigo, name, sale_price, fecha_actual])
    // cliente_mariadb.end()

    // if (!response_mariadb.affectedRows) {
    //     console.log('Problema en registrar consulta en maria db producto '+ codigo);
    // }

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
    imagen_url = false
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