import Paciente from "../models/Paciente.js";

const agregarPaciente = async (req, res) =>{
    // console.log(req.body);
    const paciente = new Paciente(req.body)
    console.log(req.veterinario._id);
    console.log(req.veterinario.id);
    paciente.veterinario = req.veterinario._id //creamos una propiedad nueva en nuestro objeto para saber que veterinario es
    console.log(paciente);
    try {
        const pacienteAlmacenado = await paciente.save();
        res.json(pacienteAlmacenado);
    } catch (error) {
        console.log(error);
    }
}

const obtenerPacientes = async (req, res) =>{
    const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario._id) //al parecer tambien funciona con req.veterinario asi solo, pero es mas visual usar con el ._id

    res.json(pacientes);
}

const obtenerPaciente = async (req, res) => {
    console.log(req.params.id);
    const {id} = req.params;
    const paciente = await Paciente.findById(id);
    console.log(paciente);
    if(!paciente){
        return res.status(404).json({msg: 'No Encontrado'})
    }
    //Como acceder a los id's
    console.log(paciente.veterinario);
    console.log(paciente.veterinario._id);
    console.log(paciente.veterinario.id);
    console.log(req.veterinario._id);
    console.log(req.veterinario.id);

    //Metodo del profe Juan
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){ //AQUI BUSCA ENTRE LOS IDS DE LOS DISTINTOS VETERINARIOS
        //AL INSERTAR TOKENS DISTINTOS NOS DICE SI LA ACCION NO ES VALIDA O SI SI
        return res.json({msg: "Accion no valida"})
    }

    //Metodo mio
    //Esto de abajo tambien jala, es mas visual y tiene mas logica, lo de arriba lo hizo el profe
    // if(paciente.veterinario.toString() !== req.veterinario._id.toString()){ //AQUI BUSCA ENTRE LOS IDS DE LOS DISTINTOS VETERINARIOS
    //     //AL INSERTAR TOKENS DISTINTOS NOS DICE SI LA ACCION NO ES VALIDA O SI SI
    //     return res.json({msg: "Accion no valida"})
    // }

    res.json(paciente);
}

const actualizarPaciente = async (req, res) => {
    //El codigo de aqui HASTA
    console.log(req.params.id);
    const {id} = req.params;
    const paciente = await Paciente.findById(id);
    console.log(paciente);
    if(!paciente){
        return res.status(404).json({msg: 'No Encontrado'})
    }

    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){ //AQUI BUSCA ENTRE LOS IDS DE LOS DISTINTOS VETERINARIOS
        //AL INSERTAR TOKENS DISTINTOS NOS DICE SI LA ACCION NO ES VALIDA O SI SI
        return res.json({msg: "Accion no valida"})
    }
    //ACA, QUE QUIEN ESTA INTENTANDO ACTUALIZAR UN REGISTRO SEA QUIEN LO CREO

    //Actualizar Paciente
    //Los || significan que en caso de que esten no presentes algunoa datos de nuestro body en lo que estamos modificando, agregale de lo que ya esta en el objeto, ejemplo si en el body solo modificamos el nombre, todo lo demas que tengamos agregaselo como ya estaba
    paciente.nombre = req.body.nombre || paciente.nombre
    paciente.propietario = req.body.propietario || paciente.propietario
    paciente.email = req.body.email || paciente.email
    paciente.fecha = req.body.fecha || paciente.fecha
    paciente.sintomas = req.body.sintomas || paciente.sintomas
    try {
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado)
    } catch (error) {
        console.log(error);
    }
}

const eliminarPaciente = async (req, res) => {
    //El codigo de aqui HASTA
    console.log(req.params.id);
    const {id} = req.params;
    const paciente = await Paciente.findById(id);
    console.log(paciente);
    if(!paciente){
        return res.status(404).json({msg: 'No Encontrado'})
    }

    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){ //AQUI BUSCA ENTRE LOS IDS DE LOS DISTINTOS VETERINARIOS
        //AL INSERTAR TOKENS DISTINTOS NOS DICE SI LA ACCION NO ES VALIDA O SI SI
        return res.json({msg: "Accion no valida"})
    }
    //ACA, QUE QUIEN ESTA INTENTANDO ELIMINAR UN REGISTRO SEA QUIEN LO CREO

    try {
        await paciente.deleteOne();
        res.json({msg: 'Paciente Eliminado'})
    } catch (error) {
        console.log(error);
    }
}

export {
    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
}