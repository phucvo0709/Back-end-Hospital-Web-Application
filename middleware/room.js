const { check } = require("express-validator");

exports.postRoom = [
  check("name", "Name is required")
    .not()
    .isEmpty()
];

exports.putRoom = [
  check("name", "Name is required")
    .not()
    .isEmpty()
];
