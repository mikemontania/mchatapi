import mongoose from "mongoose";
import { server } from "./app.js";
import { io } from "./utils/index.js";
import 'dotenv/config';

const mongoDbUrl = process.env.DB_CNN;
console.log(mongoDbUrl)
const mongoDbLocal = "mongodb://localhost/mchat";

mongoose.connect(mongoDbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  server.listen(process.env.PORT, () => {
    console.log("######################");
    console.log("###### API REST ######");
    console.log("######################");
    console.log(`http://${process.env.IP_SERVER}:${process.env.PORT}/api`);

    io.sockets.on("connection", (socket) => {
      console.log("NUEVO USUARIO CONECTADO");

      socket.on("disconnect", () => {
        console.log("USUARIO DESCONECTADO");
      });

      socket.on("subscribe", (room) => {
        socket.join(room);
      });

      socket.on("unsubscribe", (room) => {
        socket.leave(room);
      });
    });
  });
}).catch((error) => {
  console.error("Error en la conexión de MongoDB:", error);
});