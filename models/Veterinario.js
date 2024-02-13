import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt';
import generarId from "../helpers/generarId.js";

const veterinarioSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono: {
        type: String,
        default: null, //default null hace QUE EL CAMPO NO SEA OBLIGATORIOW
        trim: true,
    },
    web: {
        type: String,
        default: null,
    },
    token: {
        type: String,
        default: generarId,
    },
    confirmado: {
        type: Boolean,
        default: false
    }

});

//Para hashear nuestro password antes de que se almacene
veterinarioSchema.pre('save', async function (next){
    console.log('Antes de almacenar');
    //Esto es para que si un password ya esta hasheado (cuando editamos nuestro nombre o algo) no lo vuelva a hashear
    //Si no es la primera vez Brincate este IF
    if(!this.isModified('password')){
        next(); //next() significa que ya acabo aqui, vete hacia el siguiente Middleware, osease las 2 lineas de abajo no se ejecuten
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

//Comprobar el Password de Usuario
veterinarioSchema.methods.comprobarPassword = async function (passwordFormulario) {
    return await bcrypt.compare(passwordFormulario, this.password); //este compare nos retorna un true o false
}

//Esto para que interactue con la base de datos y poder registrarlo en nuestra BD este Schema
const Veterinario = mongoose.model('Veterinario', veterinarioSchema); //se recomienda que el nombre sea el mismo que la constante y como segundo argumento va nuestro Schema

//Ahora lo exportamos para tenerlo en varios lugares
export default Veterinario;