function    log(req, res, next){
    console.log('Logging...');
    next(); //Le indica a express que llame la siguiente funciín middelware
            //O la petición correspondiente
            //si no lo indicamos, Express se queda dentro de esta función
}

module.exports = log;