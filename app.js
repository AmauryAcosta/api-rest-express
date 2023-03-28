const inicioDebug = require('debug')('app:inicio')//Importar el pauete debug
                                    //el parámetro indica el archivo y el entorno
                                    //de depuración
const dbDebug = require('debug')('app:db')
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

const usuarios = [
    {id:1, nombre:'Juan'},
    {id:2, nombre:'Karen'},
    {id:3, nombre:'Ana'},
    {id:4, nombre:'José'}
]

function existeUsuario(id){
    return (usuarios.find(u => u.id ===parseInt(id)))
}

function validarUsuario(nom){
    const schema = Joi.object({
        NOMBRE: Joi.string().min(3).required()
    })
    return (schema.validate({nombre: nom}))
}
//Consulta en la ruta raíz del sitio
//Toda petición siempre va a recibir dos parámetros
//req: la información que recibe el servidor desde el cliente
//res: respuesta del servidor al cliente
//Vamos a utilizar el método send() del onjeto res
app.get('/', (req, res) => {
    res.send('Hola mundo desde express! ')
})

app.get('/api/usuarios', (req, res) => {
    res.send(['Jorge', 'Ana', 'Karen', 'Luis'])
}) 

//Con los : delante del id, express sabe que es un parámetro para recibir en la ruta
app.get('/api/usuairos/:id', (req, res) => {
    //En el cuerpo del objeto req está la propiedad
    //params, que guarda los parámetos enviados
    //Los parámetros en req.params se reciben como Strings
    //parseInt, se hace como casteo a valores enteros directamente
    /* const id = parseInt(req.params.id)
    //Find devuelve el primer usuario que cumpla con el predicado
    const usuario = usuarios.find( u => u.id === id) */
    const id = req.params.id
    let usuario = existeUsuario(req.params.id)
     if(!usuario){
        res.status(404).send(`El usuario ${id} no se encontró`)//Devuelve el estado HTTp 404
        return;
    }
    res.send(usuario) 
    return;
   
})

//Recibir varios parámetros
//Se pasan dos parámetros year y month
//Query String
//localhost:5000/api/usuarios/1990/2/?nombre=xxxx&single=y
/* 
app.get('/api/usuarios/:year/:month', (req, res) => {
    //En el cuerpo de req está en la propiedad
    //query, que guarda los parámetros Query String
    res.send(req.query)

})
 */

//La ruta tiene el mismo nombre que la petición get
//Express hace la diferencias dependiendo del tipo
//de petición 
//La petiicón post la vamos a utilizar para insertar
//un nuevo usuario
//Creació del schema joi


app.post('/api/usuarios', (req, res) => {
    //El objeto request tiene la propiedad body
    //que va a venir en formato JSON
    //Creación del schema joi
    const schema = Joi.object({
        nombre: Joi.string().min(3).require()
    })
    const {error, value} = schema.validate({nombre: req.body.nombre})
    if(!error){
        const usuario = {
            id: usuarios.length + 1,
            nombre: req.body.nombre
        } 
    } else {
        const mensaje = error.details[0].message;
        res.status(400).send()
    }
    return;
        //Codigo 400 es bad request
   /*  if(!req.body.nombre || req.body.length <= 2)
    {
        res.status(400).send('Debe ingresar un nombre que tenga al menos 3 letras')
        return; //Es necesario para que no continue con el método 
    } 
    const usuario = {
        id: usuarios.length + 1,
        nombre: req.body.nombre
    }
    usuario.push(usuario);
    res.send(usuario); */
})

//Recibe como parámetro el id del usuario que se va a eliminar
app.delete('./api/usuarios/:id', (req, res) => {
    const usuario = existeUsuario(req.params.id)
    if(!usuario){
        res.status(404).send('El usuario no se encuntra')//Deuelve el estado HTTP
    }
    //Encontrar el índice del usuario dentro del arreglo
    const index = usuarios.indexOf(usuario)
    usuarios.splice(index, 1) //Elimina el usuario en el índice
    res.send(usuario) //Se responde el usuario eliminado
})

//petición para modificar datos existentes
//Este método recibe un parámetro 
//id para saber qué usuario modificar
app.put('./api/usuarios/:id', (req, res) => {
    //Encontrsr si existe el usuario a modificar 
    let usuario = existeUsuario(req.params.id)
    if(!usuario){
        res.statur(404).send('El usuario no se encuentra')//Devuelve el estado HTTP
        return;
    }
        //Validar si el estado recibido es correcto
    const {error, value} = validarUsuario(req.body.nombre)
    if(!error){
        //Actualiza el nombre
        usuario.nombre = value.nombre;
        res.send(usuario)
    }
    else {
        const mensaje = error.details[0].message
        res.status(400).send(mensaje)
    }
    return;

})

app.get('/api/productos', (req, res) => {
    res.send(['Manzana', 'Durazno', 'ETC'])
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
