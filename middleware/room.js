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

exports.addCustomerToRoom = [
  check("id", "id Room is required")
    .not()
    .isEmpty(),
  check("idCustomer", "id Customer is required")
    .not()
    .isEmpty()
];

exports.addCustomerToCurrentProcessing = [
  check("id", "id Room is required")
    .not()
    .isEmpty(),
  check("idCustomer", "id Customer is required")
    .not()
    .isEmpty()
];
