const express = require('express');
const joi = require('joi')
const ruta = express.Router();

const usuarios = [
    {id:1, nombre:'Juan'},
    {id:2, nombre:'Karen'},
    {id:3, nombre:'Ana'},
    {id:4, nombre:'José'}
]

ruta.get('/', (req, res) => {
    res.send(['Jorge', 'Ana', 'Karen', 'Luis'])
}) 

//Con los : delante del id, express sabe que es un parámetro para recibir en la ruta
ruta.get('/:id', (req, res) => {
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


ruta.post('/', (req, res) => {
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
ruta.delete('/:id', (req, res) => {
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
ruta.put('/:id', (req, res) => {
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

function existeUsuario(id){
    return (usuarios.find(u => u.id ===parseInt(id)))
}

function validarUsuario(nom){
    const schema = Joi.object({
        NOMBRE: Joi.string().min(3).required()
    })
    return (schema.validate({nombre: nom}))
}


/* app.get('/api/productos', (req, res) => {
    res.send(['Manzana', 'Durazno', 'ETC'])
}) */

module.exports = ruta; //Exporta el objeto ruta
