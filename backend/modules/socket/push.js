// src/sockets/push.js
const { getIO } = require("./index.js");

// Envoi d’un événement global (tous connectés)
exports.pushToAll = (event, payload) => {
  getIO().emit(event, payload);
}

// Envoi ciblé à un socket
exports.pushToSocket = (socketId, event, payload) => {
  getIO().to(socketId).emit(event, payload);
}

// Envoi à tous les admins
exports.pushToAdmins = (event, payload) => {
  getIO().to("admin").emit(event, payload);
}

// Envoi à tous les étudiants
exports.pushToStudents = (event, payload) => {
  getIO().to("student").emit(event, payload);
}
