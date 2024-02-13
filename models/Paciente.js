import mongoose from 'mongoose';

const pacientesSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
    },
    propietario:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    fecha:{
        type: Date,
        required: true,
        default: Date.now(),
    },
    sintomas:{
        type: String,
        required: true,
    },
    //Referencia de quien es el veterinario
    veterinario:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Veterinario", //en caso de querer traernos todo el modelo de Veterinario
    },
}, {
    timestamps: true,
})

const Paciente = mongoose.model('Paciente', pacientesSchema);

export default Paciente;