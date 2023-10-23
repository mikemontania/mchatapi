import express from 'express';
import http from 'http';
import { initSocketServer } from './utils/index.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import {authRoutes} from "./routes/index.js";
const app = express();
// createServer(app) =>Este método crea un servidor HTTP y toma como argumento una instancia
// de Express, que representa tu aplicación web. Al pasar app como 
//argumento, estás configurando el servidor para que maneje las solicitudes
// HTTP de acuerdo con las rutas y controladores definidos en tu aplicación Express
const server = http.createServer(app);

// Inicia el servidor de Socket.IO y lo adjunta al servidor HTTP
initSocketServer(server);

//Configuracion bodyparser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//configuracion de carpeta estatica
app.use(express.static("uploads"))

//configuracion de cors
app.use(cors());

//configuracion logger hhtp request
app.use(morgan("dev"));


//routes

app.use("/api",authRoutes);

// Exporta el servidor HTTP para que pueda ser utilizado en otros archivos
export { server };