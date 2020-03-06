exports = module.exports = function(io) {
  require("./rooms")(io);
  require("./customers")(io);
};
