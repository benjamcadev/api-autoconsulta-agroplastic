const { Client } = require('pg')
require('dotenv').config();
 
const conexion = async() => {
    try {

        const client = new Client({
            user: process.env.USER_BD,
            host: process.env.HOST_BD,
            database: process.env.NAME_BD,
            password: process.env.PASS_BD,
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


