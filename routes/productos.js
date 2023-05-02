const express = require('express');
const Joi = require('joi');
const ruta = express.Router();

const productos = [
    {id:1, nombre:'Teclado'},
    {id:2, nombre:'Mouse'},
    {id:3, nombre:'Monitor'},
    {id:4, nombre:'Audífonos'}
]

ruta.get('/', (req, res) => {
    res.send(['Teclado', 'Mouse', 'Monitor', 'Audifonos'])
}) 

ruta.get('/:id', (req, res) => {
    //En el cuerpo del objeto req está la propiedad
    //params, que guarda los parámetos enviados
    //Los parámetros en req.params se reciben como Strings
    //parseInt, se hace como casteo a valores enteros directamente
    /* const id = parseInt(req.params.id)
    //Find devuelve el primer usuario que cumpla con el predicado
    const usuario = usuarios.find( u => u.id === id) */
    const id = req.params.id
    let producto = existeProducto(req.params.id)
     if(!producto){
        res.status(404).send(`El producto ${id} no se encontró`)//Devuelve el estado HTTp 404
        return;
    }
    res.send(producto) 
    return;
   
})

ruta.post('/', (req, res) => {
    //El objeto request tiene la propiedad body
    //que va a venir en formato JSON
    //Creación del schema joi
    const schema = Joi.object({
        nombre: Joi.string().min(3).require()
    })
    const {error, value} = schema.validate({nombre: req.body.nombre})
    if(!error){
        const producto = {
            id: productos.length + 1,
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
    const producto = existeProducto(req.params.id)
    if(!producto){
        res.status(404).send('El usuario no se encuntra')//Deuelve el estado HTTP
    }
    //Encontrar el índice del usuario dentro del arreglo
    const index = productos.indexOf(producto)
    productos.splice(index, 1) //Elimina el usuario en el índice
    res.send(producto) //Se responde el usuario eliminado
})

//petición para modificar datos existentes
//Este método recibe un parámetro 
//id para saber qué usuario modificar
ruta.put('/:id', (req, res) => {
    //Encontrsr si existe el usuario a modificar 
    let producto = existeProducto(req.params.id)
    if(!producto){
        res.status(404).send('El usuario no se encuentra')//Devuelve el estado HTTP
        return;
    }
        //Validar si el estado recibido es correcto
    const {error, value} = validarProducto(req.body.nombre)
    if(!error){
        //Actualiza el nombre
        producto.nombre = value.nombre;
        res.send(producto)
    }
    else {
        const mensaje = error.details[0].message
        res.status(400).send(mensaje)
    }
    return;

})


function existeProducto(id){
    return (productos.find(p => p.id ===parseInt(id)))
}

function validarProducto(nom){
    const schema = Joi.object({
        NOMBRE: Joi.string().min(3).required()
    })
    return (schema.validate({nombre: nom}))
}

module.exports = ruta;