const express = require("express");
const router = express.Router();
const controllerCustomer = require("../../controllers/customer");
const middlewareCustomer = require("../../middleware/customer");

// @route  GET api/customers
// @desc   Get All Customers
// @access Public
router.get("/", controllerCustomer.getCustomers);

// @route  POST api/customers/:id
// @desc   Get Customer By id
// @access Public
router.get("/:id", controllerCustomer.getCustomer);

// @route  POST api/customers/
// @desc   Create Customers
// @access Public
router.post(
  "/",
  [middlewareCustomer.postCustomer],
  controllerCustomer.postCustomer
);

// @route    PUT api/customers/:id
// @desc     Put Customer By id
// @access   Public
router.put(
  "/:id",
  [[middlewareCustomer.putCustomer]],
  controllerCustomer.putCustomer
);

// @route    DELETE api/customers/:id
// @desc     Delete a customer
// @access   Private
router.delete("/:id", controllerCustomer.deleteCustomer);

module.exports = router;
