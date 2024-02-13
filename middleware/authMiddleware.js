import jwt from 'jsonwebtoken';
import Veterinario from '../models/Veterinario.js';

const checkAuth = async (req, res, next) => {
    let token;
    console.log('Desde MW');
    console.log(req.headers.authorization);
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        console.log('Si, tiene el token con bearer');
        try {
            //split lo que hace es separar el parametro que le indicamos y convertir en un array lo restante separador por ese parametro 
            token = req.headers.authorization.split(' ')[1] //traeme la posicion 1 (Bearer fjdsniovnedimnokn), Bearer es 0 el 1 es el token

            //Firmando nuestro token con la palabra del ENV, esto es para realizar el desencriptado del token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded);
            console.log('despues del decoded');

            //Aqui creamos la propiedad veterinario dentro del objeto request, ya que si recordamos request es un objeto
            req.veterinario = await Veterinario.findById(decoded.id).select( "-password -token -confirmado")
            console.log(req.veterinario);
            // console.log(veterinario);
            return next(); //se va hacia el siguiente middleware que es perfil y no executa las lineas de abajo
        } catch (error) {
            const e = new Error('Token no valido')
            return res.status(403).json({msg: e.message})       
        }
    }
        
    if(!token){
            const error = new Error('Token no valido o inexistente')
            return res.status(403).json({msg: error.message})    
    }
    next();
}

export default checkAuth;