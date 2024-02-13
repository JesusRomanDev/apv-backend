//Habilitando express
import express from "express";
import conectarDB from "./config/db.js"; //agregar js al final, si no, no funciona
import dotenv from 'dotenv'
//Importando Cors para que al hacer el registro de veterinario no nos de error
import cors from 'cors'
import veterinarioRoutes from './routes/veterinarioRoutes.js'
import pacienteRoutes from './routes/pacienteRoutes.js'


const app = express();
app.use(express.json()); //asi le decimos que vamos a enviar datos tipo JSON
dotenv.config();
conectarDB();

// const dominiosPermitios = ["http://127.0.0.1:5173"]
const dominiosPermitios = [process.env.FRONTEND_URL] //http://localhost:5173
// const corsOptions = {
//     origin: function(origin, callback){
//         if(dominiosPermitios.indexOf(origin) !== -1){
//             //El Origen del Request esta permitido
//             callback(null, true)
//         }else{
//             callback(new Error('No permitido por CORS'))
//         }
//     }
// }
const corsOptions = {
    origin: function(origin, callback){
        if(!origin){
            return callback(null,true)
        }

        if(dominiosPermitios.indexOf(origin) !== -1){
            //El Origen del Request esta permitido
            callback(null, true)
        }else{
            callback(new Error('No permitido por CORS'))
        }
    }
}

app.use(cors(corsOptions))

// app.use(cors({origin: '*'})); //antes dentro del cors() estaba cors(corsOptions)

app.use('/api/veterinarios', veterinarioRoutes);
app.use('/api/pacientes', pacienteRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, ()=>{
    console.log(`Servidor funcionando en el puerto ${PORT}`);
})