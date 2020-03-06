exports = module.exports = function(io) {
  io.sockets.on("connection", function(socket) {
    socket.on("newCustomers", function() {
      console.log("newCustomers");
    });
  });
};
