exports = module.exports = function(io) {
  io.sockets.on("connection", function(socket) {
    socket.on("newRooms", function() {
      console.log("new rooms");
    });
  });
};
