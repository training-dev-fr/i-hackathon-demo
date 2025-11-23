exports.registerSubscriptions = (socket) => {
  // Exemple : écoute d’un ping envoyé par le client
  socket.on("ping", (data) => {
    console.log(`📩 Ping reçu de ${socket.id}:`, data);
    socket.emit("pong", { message: "Pong reçu 👋" });
  });

  socket.on("disconnect", () => {
    console.log(`🔴 Socket déconnecté : ${socket.id}`);
  });
}
