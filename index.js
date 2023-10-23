import { server } from './app.js';
import { PUERTO, IP_SERVER, DB_HOST, DB_USER, DB_PASS } from './constants.js';
import { io } from "./utils/index.js";
import mongoose from 'mongoose';

const URL_DB = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/`;

mongoose.connect(URL_DB)
    .then(() => {
        console.log('Conexión a la base de datos exitosa');
        // Inicia el servidor API REST
        server.listen(PUERTO, () => {
            console.log('#############################');
            console.log('########## API REST #########');
            console.log('#############################');
            console.log(`http://${IP_SERVER}:${PUERTO}/api`);
            //ya io deberia esta iniciado
            io.sockets.on("connection", (socket) => {
                console.log("Nuevo usuario en app")


                socket.on("disconnect", () => {
                    console.log("usuario desconectado")
                })

                socket.on("subscribe", (room) => {
                    socket.join(room);
                    console.log("usuario se ha unido al chat")
                })
                socket.io("unsubscribe", (room) => {
                    socket.leave(room);
                    console.log("usuario ha sido expulsado")
                })

            })
        });


    })
    .catch((error) => {
        console.error('Error de conexión a la base de datos:', error);
    });
