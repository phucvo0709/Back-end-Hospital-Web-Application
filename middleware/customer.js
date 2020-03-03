const { check } = require("express-validator");

exports.postCustomer = [
  check("name", "Name is required")
    .not()
    .isEmpty()
];

exports.putCustomer = [
  check("name", "Name is required")
    .not()
    .isEmpty()
];
