// src/sockets/index.js
const { Server } = require("socket.io");
const { registerSubscriptions } = require("./subscriptions.js");
const jwt = require('jsonwebtoken');

let ioInstance = null;

exports.initSocket = (server) => {
    ioInstance = new Server(server, {
        path: "/socket.io",
        cors: {
            origin: "https://ihackathon.info", // à restreindre plus tard
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    // Log des connexions globales
    ioInstance.on("connection", (socket) => {
        try {
            const token = socket.handshake.auth?.token;
            const payload = jwt.verify(token, process.env.JWT_SECRET);

            socket.user = payload;
            socket.join(payload.role);

            console.log(`🟢 ${payload.role} connecté via socket : ${socket.id}`);
            registerSubscriptions(socket, payload.role); // abonne les événements

            socket.on("disconnect", () => {
                console.log(`🔴 ${payload.role} déconnecté : ${socket.id}`);
            });
            socket.emit("connected", {
                message: "Connexion socket réussie à la room " + payload.role,
                timestamp: new Date(),
            });


        } catch (err) {
            console.log("❌ Connexion socket refusée :", err.message);
            socket.disconnect();
        }
        return ioInstance;
    });
}

// Permet de récupérer l'instance dans d'autres modules (ex: contrôleurs)
exports.getIO = () => {
    if (!ioInstance) {
        throw new Error("❌ Socket.IO n’a pas encore été initialisé !");
    }
    return ioInstance;
}
