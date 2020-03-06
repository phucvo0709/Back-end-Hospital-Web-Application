exports = module.exports = function(io) {
  io.sockets.on("connection", function(socket) {
    console.log("a user connected");
    socket.on("newRooms", function() {
      console.log("new rooms");
      io.emit("haveNewRooms");
    });
    socket.on("newCustomers", function() {
      console.log("new customers");
      io.emit("haveNewCustomers");
    });
    socket.on("disconnect", function() {
      console.log("user disconnected");
    });
  });
};
