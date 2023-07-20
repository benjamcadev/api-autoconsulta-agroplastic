const { Client } = require('pg')
const mariadb = require('mariadb');
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
        throw new Error("No se ha podido conectar a la base de datos postgres" + error);
      }
}

const conexionMariadb = async() => {

  try {
      const pool = mariadb.createPool({
        host: '192.168.1.4', 
        user:'remoto', 
        password: 'agro1113$',
        database: 'Autoconsulta',
        connectionLimit: 5
  })


      let conn = await pool.getConnection();
      return conn
    
  } catch (error) {
    console.log(error)
    throw new Error("No se ha podido conectar a la base de datos mariadb " + error)
  }
}
 



  module.exports = {
    conexion,
    conexionMariadb
}


