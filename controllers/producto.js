// Conexion a la BD de postgres
const { conexion } = require("./database/connection")

const getProducto = (req,res) => {

    ///// CONSULTANDO A LA BASE DE DATOS //////
const text = 'SELECT wh_product.id,wh_product.name, sl_detail_list_price.sale_price FROM wh_product '+
'INNER JOIN sl_detail_list_price '+
'ON wh_product.id = sl_detail_list_price.wh_product_id '+
'WHERE alias_name = $1'+
' AND sl_list_price_id = 1'
const values = ['BP1']

const response = async() => {
    const cliente =  await conexion()
    const res = await cliente.query(text, values)
    const {id, name, sale_price} = res.rows[0]
    console.log(res.rows)
    console.log(Number(sale_price))

    const dataProducto = {
        id,
        name,
        precio: Number(sale_price)
    }
    console.log(dataProducto);
    cliente.end()
}
response()

////////////////////////////////////////////////


    return res.status(200).json({
        id: 23377,
        name: 'BOLSA PAPEL 1KL.X 100UND (PQXC10) SQK0100',
        precio: 1380
    })

}

module.exports = {
    getProducto
}