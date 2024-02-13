import express from 'express';
import { perfil, registrar, confirmar, autenticar, olvidePassword, comprobarToken, nuevoPassword, actualizarPerfil, actualizarPassword } from '../controllers/veterinarioController.js';
import checkAuth from '../middleware/authMiddleware.js';


const router = express.Router();
//Area Publica
router.post('/', registrar);

router.get('/confirmar/:token', confirmar); //despues de los ":" esto lo convierte en un parametro dinamico

router.post('/login', autenticar); //Para nuestro Login/Iniciar sesion

router.post('/olvide-password', olvidePassword); //validar email de usuario

router.get('/olvide-password/:token', comprobarToken); //leer el token

router.post('/olvide-password/:token', nuevoPassword); //almacenar el nuevo password

//Los 2 de arriba pueden simplificarse asi, ya que estos cuentan con la misma URL
// router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword) este es el metodo chaining

//Area Privada
router.get('/perfil', checkAuth, perfil);
router.put('/perfil/:id', checkAuth, actualizarPerfil);
router.put('/actualizar-password', checkAuth, actualizarPassword);



export default router;