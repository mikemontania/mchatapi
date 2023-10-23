import { Server as SocketServer } from 'socket.io';

export let io = null;

// Inicia el servidor de Socket.IO y configura CORS para permitir cualquier origen
export function initSocketServer(server) {
    io = new SocketServer(server, {
        cors: {
            origin: '*'
        }
    });
}