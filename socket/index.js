exports = module.exports = function(io) {
  io.sockets.on("connection", function(socket) {
    console.log(`a device ${socket.id} connected`);
    socket.on("newRooms", function() {
      socket.broadcast.emit("haveNewRooms", socket.id);
    });
    socket.on("newCustomers", function() {
      socket.broadcast.emit("haveNewCustomers", socket.id);
    });
    socket.on("disconnect", function() {
      console.log(`device ${socket.id} disconnected`);
    });
  });
};
