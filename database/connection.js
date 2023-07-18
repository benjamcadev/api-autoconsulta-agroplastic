const { Client } = require('pg')
 
const conexion = async() => {
    try {

        const client = new Client({
            user: 'postgres',
            host: 'localhost',
            database: 'prueba',
            password: 'agro1113$',
            port: 5432,
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


