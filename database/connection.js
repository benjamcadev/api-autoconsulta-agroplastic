const { Client } = require('pg')
require('dotenv').config();
 
const conexion = async() => {
    try {

        const client = new Client({
            user: 'readonly',
            host: 'agroplastic.erp.master.innlab.cl',
            database: 'erp_db',
            password: 'emezvYN87ySZKW',
            port: process.env.PORT_BD,
          })

          await client.connect()

          return client
    
      } catch (error) {
        console.log(error);
        throw new Error("No se ha podido conectar a la base de datos " + error);
      }
}
 



  module.exports = {
    conexion
}


