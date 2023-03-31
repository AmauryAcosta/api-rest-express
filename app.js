const inicioDebug = require('debug')('app:inicio')//Importar el pauete debug
                                    //el parámetro indica el archivo y el entorno
                                    //de depuración
const dbDebug = require('debug')('app:db')
const usuarios = require('./routes/usuarios');
const productos = require('./routes/productos');
const express = require('express') //Importa el paquete express
const config = require('config')
const app = express() //Crea una instancia de express
const Joi = require('joi')
const logger = require('./logger')
const morgan = require('morgan')


//Cuáles son los métodos a implementar
//Con su ruta
/* app.get() //consulta
app.post() //Envío de datos al servidor (insertar datos en la base)
app.put() //Actualizacion
app.delete() // Eliminación */

app.use(express.json());//Le decimos a express que use este 
                    //middleware

app.use(express.urlencoded({extended:true})); //Nuevo Middelware
                                        //Define el uso de la libreria qs para separar
                                        //la información codificada en el url

app.use(express.static('public')); //Nombre de la carpeta que tendrá los archivos 
                                //Recursos estáticos

app.use('/api/usuarios', usuarios) //middelware que importamos
//El primer parámetro es la ruta raíz asociada con las peticiones a los datos de usuarios
//con las peticiones a los datos de usuarios
//

app.use('api/productos', productos);
            
console.log(`Aplicación: ${config.get('nombre')}`)
console.log(`DB server: ${config.get('configDB.host')}`)

if(app.get('env') === 'development'){
app.use(morgan('tiny'));
//console.log('Morgan habilitado...');
//muestra el ,emsaje de depuración
inicioDebug('Morgan está habilitado...')
}

dbDebug('Conectando con la base de datos...');

/* app.use(logger) //Logger ya hace referencia a la de función logger.js debido al exports

app.use(function(req, res, next){
    console.log('Autenticando...')
    next();
}) */

//Los tres appp.use() son middelware y se llaman antes de las funciones de ruta GET, POST, PUT, DELETE
//Para que estaspuedan trabajar 


//Consulta en la ruta raíz del sitio
//Toda petición siempre va a recibir dos parámetros
//req: la información que recibe el servidor desde el cliente
//res: respuesta del servidor al cliente
//Vamos a utilizar el método send() del onjeto res
app.get('/', (req, res) => {
    res.send('Hola mundo desde express! ')
})



//El módulo process contiene información del sistema
//El objeto env contiene información de las variables de entorno 
//Si la variable PORT no existe, que tome un valor
//dijo definido por nosostros (3000)
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}...`)
})


//---------------- Funciones middleware---------------------
//El middleware es un bloue de código que se ejecuta entre las peticiones del usuario (request)
//y la petición que llega el servidor. Es un enlace entre la petición del usuario
//y el servidor, antes de que éste pueda dar una repuesta

//Las funciones de middleware son funciones que tienen acceso 
//al objeto de solicitud (req), al objeto de repuesta (res) y a la siguiente función de middleware en el ciclo de 
//solicitud/respuestas de la aplicación. La siguiente función de middleware se denota normalmente con una variable denominada 
//next.

//Las funciones de middleware pueden realizar las siguientes tareas:

//  -Ejecutar cualquier código.
//  -Realizar cambios en la solicitud y los objetos de respuesta
//  -Finaliar el código de solicitud/respuestas
//  -Invoca la siguiente función de middleware en la pila

//Express es un framework de direccionamiento y uso de middleware
//que permite que la aplicación tenga funcionalidad mínima propia.

//Ya hemos utilizado algunos middleware como express.json()
//que transforma el body del req a formato JSON

//----------------------------------------------------
//  request --|--> json() --> route() --|--> response
//----------------------------------------------------

//route() --> Función GET, POST, PUT, DELETE

//Una aplicación Express puede utilizar los siguientes tipos de middleware
//  -Middelware de nivel de aplicación
//  -Midddelware de nivel de direccionador
//  -Middelware de manejo de errores
//  -Middelware incorporado
//  -Middelware de terceros

//-------------------------- Recursos Estáticos-----------------------------
//Hacen refeencia a archivos, imágenes, documentos que se ubican en el servidor
//Vamos a usar un middelware para acceder a estos recursos
