import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res)=>{
    console.log(req.body); //cuando llenamos un formulario usamos req.body

    const {email, password, nombre} = req.body;

    //Prevenir usuarios duplicados
    const existeUsuario = await Veterinario.findOne({email}); //Buscandolo en la DB por propiedad, findOne buscara por propiedad,
    //asi como tambien se usa la sintaxis de corchetes para buscar por email ya que es JSON y no con ${}

    if(existeUsuario){
        const error = new Error('Usuario ya registrado') //Creando instancia de error
        return res.status(400).json({msg: error.message});
        //Resultado: enviandolo de nuevo por thunder client, si en nuestra DB ya teniamos un correo igual, nos detendra la ejecucion
        //(dejara de pensar) y nos arrojara el mensaje de error (usuario ya registrado)
    }

    //Error prueba
    // if(nombre.length > 4){
    //     const error = new Error('Probando error')
    //     return res.status(400).json({msg: error.message})
    // }


    try {
        //Guardar un nuevo veterinario
        const veterinario = new Veterinario(req.body); //Creando una instancia de un nuevo Objeto de Veterinario
        const veterinarioGuardado = await veterinario.save(); //Guardandolo en la base de datos
        // res.json({msg: "Registrando usuario..."}) 

        //Enviar el email
        emailRegistro({
            email, 
            nombre,
            token: veterinarioGuardado.token
        })

        res.json(veterinarioGuardado);
    } catch (error) {
        console.log(error);
    }
    
    // console.log(nombre);
    // console.log(email);
    // console.log(password);
}

const perfil = (req, res)=>{
    console.log(req.veterinario);
    const {veterinario} = req;
    // res.json({msg: "Mostrando perfil..."});
    res.json(veterinario);
}

const confirmar = async (req, res) => {
    console.log(req.params.token); //cuando leemos datos de una url utilizamos req.params, ahora bien .token es a como lo nombramos en 
    //nuestras rutas(en veterinarioRoutes.js), ese nombre es el que queramos
    const {token} = req.params;

    const usuarioConfirmar = await Veterinario.findOne({token}); //consulto mi base de datos
    console.log(usuarioConfirmar);

    if(!usuarioConfirmar){ //reviso que el token sea real
        const error = new Error("Token no valido");
        return res.status(404).json({msg: error.message})
    }
    console.log(usuarioConfirmar);

    try {
        usuarioConfirmar.token = null; //modificamos de caracteres a null
        usuarioConfirmar.confirmado = true; //modificamos propiedad a true
        // console.log(usuarioConfirmar);
        await usuarioConfirmar.save();

        res.json({ msg: "Usuario confirmado correctamente"})
    } catch (error) {
        console.log(error);
    }
}


const autenticar = async (req, res) => {
    console.log(req.body);
    const {email, password} = req.body;

    //Comprobar si el usuario existe
    const usuario = await Veterinario.findOne({email});
    if(!usuario){
        // console.log('existe...');
        // res.json({ mgs: "Autenticando"})
        const error = new Error("El Usuario no Existe")
        return res.status(404).json({ msg: error.message})
    }

    //Comprobar si el usuario esta confirmado
    if(!usuario.confirmado){ //si no esta confirmado
        const error = new Error("Tu cuenta no ha sido confirmada")
        return res.status(403).json({ msg: error.message})
    }

    //Autenticar al usuario/Revisar el password
    if(await usuario.comprobarPassword(password)){
        console.log("Password Correcto");
        console.log(usuario);
        console.log(usuario._id);
        // usuario.token = generarJWT(usuario.id)
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id)
        })
    }else{
        const error = new Error("El Password es incorrecto")
        return res.status(403).json({ msg: error.message})
    }
}

const olvidePassword = async (req, res) => {
    const {email} = req.body;
    console.log(email);
    const existeVeterinario = await Veterinario.findOne({email});
    if(!existeVeterinario){
        const error = new Error('El usuario no existe');
        return res.status(400).json({msg: error.message})
    }

    try {
        existeVeterinario.token = generarId();
        await existeVeterinario.save();

        //Enviar email con instrucciones
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        })
        res.json({msg: 'Hemos enviado un email con las instrucciones'})
    } catch (error) {
        console.log(error);
    }
}

const comprobarToken = async (req, res) => {
    const {token} = req.params;
    console.log(token);

    const tokenValido = await Veterinario.findOne({token}); //que nuestro token exista en nuestra base de datos

    //Nota: no ponemos try catch porque no vamos a modificar nada en la base de datos, solo estamos validando
    if(tokenValido){
        //El Token es valido, el usuario existe
        res.json({msg: "Token Valido y el usuario existe"})
    }else{
        const error = new Error('Token no valido')
        return res.status(400).json({ msg: error.message})
    }
}

const nuevoPassword = async (req, res) => {
    const {token} = req.params; //lo que aparezca en la url

    const {password} = req.body; //lo que el usuario escriba en los inputs/formularios

    const veterinario = await Veterinario.findOne({token})
    if(!veterinario){
        const error = new Error('Hubo un error')
        return res.status(400).json({msg: error.message})
    }

    try {
        veterinario.token = null;
        veterinario.password = password;
        console.log(veterinario);
        await veterinario.save();
        res.json({msg: 'Password modificado correctamente'})
    } catch (error) {
        console.log(error);
    }
}

const actualizarPerfil = async (req, res) => {
    console.log(req.params.id); //El registro que vamos a editar
    console.log(req.body); //La Info que va a editar ese registro
    const veterinario = await Veterinario.findById(req.params.id);
    if(!veterinario){
        const error = new Error('Hubo un error')
        return res.status(400).json({msg: error.message})
    }

    const {email} = req.body
    if(veterinario.email !== req.body.email){
        const existeEmail = await Veterinario.findOne({email})
        if(email){
            const error = new Error('Ese Email ya esta en uso')
            return res.status(400).json({msg: error.message})
        }
    }

    try {
        veterinario.nombre = req.body.nombre || veterinario.nombre;
        veterinario.email = req.body.email || veterinario.email;
        veterinario.web = req.body.web || veterinario.web;
        veterinario.telefono = req.body.telefono || veterinario.telefono;

        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado);
    } catch (error) {
        console.log(error);
    }
}

const actualizarPassword = async (req, res) => {
    console.log(req.veterinario);
    console.log(req.body);
    //Leer los datos
    const {id} = req.veterinario
    const {pwd_actual, pwd_nuevo} = req.body;
    //Comprobar que el veterinario exista
    const veterinario = await Veterinario.findById(id);
    if(!veterinario){
        const error = new Error('Hubo un error')
        return res.status(400).json({msg: error.message})
    }
    //Comprobar su password
    if(await veterinario.comprobarPassword(pwd_actual)){
        //Almacenar el nuevo password
        veterinario.password = pwd_nuevo;
        await veterinario.save();
        res.json({msg: 'Password Almacenado correctamente'})

    }else{
        const error = new Error('El Password Actual no coincide')
        return res.status(400).json({msg: error.message})
    }
}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}